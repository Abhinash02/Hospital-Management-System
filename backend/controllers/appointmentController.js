// const { readDB, writeDB } = require('../models');

// const bookAppointment = (req, res) => {
//   const { hospitalId, doctorName, date, time, patientName, patientPhone, reason } = req.body;
//   const db = readDB();

//   // Basic validation
//   if (!hospitalId || !date || !time || !patientName || !patientPhone) {
//     return res.status(400).json({ message: 'All required fields must be provided' });
//   }

//   const newAppointment = {
//     id: Date.now().toString(),
//     userId: req.user.id,
//     hospitalId,
//     doctorName: doctorName || 'Any Available Doctor',
//     date,
//     time,
//     patientName,
//     patientPhone,
//     reason: reason || '',
//     status: 'Pending',
//     createdAt: new Date().toISOString()
//   };

//   db.appointments.push(newAppointment);
//   writeDB(db);

//   res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
// };

// const getAppointments = (req, res) => {
//   const db = readDB();

//   if (req.user.role === 'superadmin' || req.user.role === 'admin') {
//     return res.json(db.appointments);
//   }

//   const userAppointments = db.appointments.filter(a => a.userId === req.user.id);
//   res.json(userAppointments);
// };

// const updateAppointmentStatus = (req, res) => {
//   const { status } = req.body;
//   const db = readDB();
//   const appointmentIndex = db.appointments.findIndex(a => a.id === req.params.id);

//   if (appointmentIndex === -1) {
//     return res.status(404).json({ message: 'Appointment not found' });
//   }

//   const allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
//   if (!status || !allowedStatuses.includes(status)) {
//     return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
//   }

//   db.appointments[appointmentIndex].status = status;
//   writeDB(db);

//   res.json({ message: 'Appointment status updated', appointment: db.appointments[appointmentIndex] });
// };

// module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };






const { readDB, writeDB } = require('../models');

const bookAppointment = (req, res) => {
  const {
    hospitalId,
    doctorName,
    date,
    time,
    patientName,
    patientPhone,
    reason,
    petName,
    species,
    appointmentType
  } = req.body;

  const db = readDB();

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
    petName: petName || '',
    species: species || '',
    appointmentType: appointmentType || 'Consult',
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
    return res.json(db.appointments || []);
  }

  const userAppointments = (db.appointments || []).filter(a => a.userId === req.user.id);
  res.json(userAppointments);
};

const updateAppointmentStatus = (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const appointmentIndex = (db.appointments || []).findIndex(a => a.id === req.params.id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
  }

  db.appointments[appointmentIndex].status = status;
  db.appointments[appointmentIndex].updatedAt = new Date().toISOString();
  writeDB(db);

  res.json({
    message: 'Appointment status updated',
    appointment: db.appointments[appointmentIndex]
  });
};

const updateAppointment = (req, res) => {
  const db = readDB();
  const appointmentIndex = (db.appointments || []).findIndex(a => a.id === req.params.id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const appointment = db.appointments[appointmentIndex];

  if (req.user.role === 'user' && appointment.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const allowedFields = [
    'date',
    'time',
    'patientName',
    'patientPhone',
    'reason',
    'petName',
    'species',
    'appointmentType',
    'status',
    'doctorName'
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      db.appointments[appointmentIndex][field] = req.body[field];
    }
  });

  db.appointments[appointmentIndex].updatedAt = new Date().toISOString();
  writeDB(db);

  res.json({
    message: 'Appointment updated successfully',
    appointment: db.appointments[appointmentIndex]
  });
};

const deleteAppointment = (req, res) => {
  const db = readDB();
  const appointmentIndex = (db.appointments || []).findIndex(a => a.id === req.params.id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const appointment = db.appointments[appointmentIndex];

  if (req.user.role === 'user' && appointment.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const deleted = db.appointments.splice(appointmentIndex, 1)[0];
  writeDB(db);

  res.json({
    message: 'Appointment deleted successfully',
    appointment: deleted
  });
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
};