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

const getUserAppointments = (req, res) => {
  const db = readDB();
  const userAppointments = db.appointments.filter(a => a.userId === req.user.id);
  res.json(userAppointments);
};

module.exports = { bookAppointment, getUserAppointments };
