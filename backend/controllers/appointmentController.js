const { supabase } = require('../config/supabase');
const { sendAppointmentConfirmation } = require('../services/emailService');

const T = 'appointments';
const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const hospitalName = async (hospitalId) => {
  const { data } = await supabase.from('hospitals').select('name').eq('id', hospitalId).limit(1);
  return data && data[0] ? data[0].name : '';
};

// POST /api/appointments  (authed) — user books, or admin adds for their hospital
const bookAppointment = async (req, res) => {
  const { doctorName, date, time, patientName, patientPhone, reason, petName, species, appointmentType } = req.body;
  const hospitalId = req.body.hospitalId || (req.user.role === 'admin' ? req.user.hospitalId : undefined);
  if (!hospitalId || !patientName || !patientPhone) {
    return res.status(400).json({ message: 'Hospital, patient name and mobile number are required' });
  }

  const row = {
    id: Date.now().toString(), userId: req.user.id, hospitalId, hospital: await hospitalName(hospitalId),
    doctorName: doctorName || 'Any Available Doctor', date: date || '', time: time || '',
    patientName, patientPhone, reason: reason || '', petName: petName || '', species: species || '',
    appointmentType: appointmentType || 'Consult', status: 'Pending'
  };
  const { data, error } = await supabase.from(T).insert(row).select().single();
  if (error) { console.error('[appointments] book:', error); return res.status(500).json({ message: 'Could not book appointment' }); }
  return res.status(201).json({ message: 'Appointment booked successfully', appointment: data });
};

// POST /api/appointments/public  (public)
const bookPublicAppointment = async (req, res) => {
  const { hospitalId, patientName, patientPhone, email, date, time, description, petName, species } = req.body || {};
  if (!hospitalId || !patientName || !patientPhone) return res.status(400).json({ message: 'Hospital, patient name and mobile number are required' });
  if (!/^\d{10}$/.test(String(patientPhone).trim())) return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });

  const name = await hospitalName(hospitalId);
  if (!name) return res.status(404).json({ message: 'Selected hospital not found' });

  const row = {
    id: Date.now().toString(), userId: null, hospitalId: String(hospitalId), hospital: name,
    patientName: String(patientName).trim(), patientPhone: String(patientPhone).trim(), email: email ? String(email).trim() : '',
    date: date || '', time: time || '', reason: description ? String(description).trim() : '',
    petName: petName || '', species: species || '', appointmentType: 'Consult', status: 'Pending', source: 'public'
  };
  const { data, error } = await supabase.from(T).insert(row).select().single();
  if (error) { console.error('[appointments] public book:', error); return res.status(500).json({ message: 'Could not book appointment' }); }

  if (data.email) {
    sendAppointmentConfirmation({ to: data.email, patientName: data.patientName, hospitalName: data.hospital, date: data.date, time: data.time })
      .catch((e) => console.error('[appointments] confirmation email failed:', e));
  }
  return res.status(201).json({ message: 'Appointment booked successfully', appointment: data });
};

// GET /api/appointments — role-scoped
const getAppointments = async (req, res) => {
  let q = supabase.from(T).select('*').order('createdAt', { ascending: false });
  if (req.user.role === 'admin') q = q.eq('hospitalId', req.user.hospitalId);
  else if (req.user.role !== 'superadmin') q = q.eq('userId', req.user.id);
  const { data, error } = await q;
  if (error) { console.error('[appointments] list:', error); return res.status(500).json({ message: 'Could not load appointments' }); }
  return res.json(data || []);
};

// PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  if (!status || !STATUSES.includes(status)) return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(', ')}` });
  const { data, error } = await supabase.from(T).update({ status, updatedAt: new Date().toISOString() }).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ message: 'Failed to update status' });
  if (!data || !data.length) return res.status(404).json({ message: 'Appointment not found' });
  return res.json({ message: 'Appointment status updated', appointment: data[0] });
};

// PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
  const appt = arr && arr[0];
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  if (req.user.role === 'user' && appt.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const fields = ['date', 'time', 'patientName', 'patientPhone', 'reason', 'petName', 'species', 'appointmentType', 'status', 'doctorName'];
  const patch = { updatedAt: new Date().toISOString() };
  fields.forEach((f) => { if (req.body[f] !== undefined) patch[f] = req.body[f]; });

  const { data, error } = await supabase.from(T).update(patch).eq('id', id).select().single();
  if (error) return res.status(500).json({ message: 'Could not update appointment' });
  return res.json({ message: 'Appointment updated successfully', appointment: data });
};

// DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const { data: arr } = await supabase.from(T).select('id').eq('id', id).limit(1);
  if (!arr || !arr.length) return res.status(404).json({ message: 'Appointment not found' });
  await supabase.from(T).delete().eq('id', id);
  return res.json({ message: 'Appointment deleted successfully' });
};

module.exports = { bookAppointment, bookPublicAppointment, getAppointments, updateAppointmentStatus, updateAppointment, deleteAppointment };
