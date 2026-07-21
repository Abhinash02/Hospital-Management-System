const { readDB, writeDB } = require('../models');

const bookAppointment = (req, res) => {
  const { hospitalId, doctorName, date, time, patientName, patientPhone, reason } = req.body;
  const db = readDB();

  // Basic validation
  if (!hospitalId || !date || !time || !patientName || !patientPhone) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  const newAppointment = {
    id: Date.now().toString(),
    userId: req.user.id,
    hospitalId,
    doctorName: doctorName || 'Any Available Doctor',
    date,
    time,
    patientName,
    patientPhone,
    reason: reason || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);
  writeDB(db);

  res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
};

const getAppointments = (req, res) => {
  const db = readDB();

  if (req.user.role === 'superadmin' || req.user.role === 'admin') {
    return res.json(db.appointments);
  }

  const userAppointments = db.appointments.filter(a => a.userId === req.user.id);
  res.json(userAppointments);
};

const updateAppointmentStatus = (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const appointmentIndex = db.appointments.findIndex(a => a.id === req.params.id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
  }

  db.appointments[appointmentIndex].status = status;
  writeDB(db);

  res.json({ message: 'Appointment status updated', appointment: db.appointments[appointmentIndex] });
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
