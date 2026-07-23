const { readDB, writeDB } = require('../models');

const createCallLog = (req, res) => {
  const { hospitalId, patientName, patientPhone, notes } = req.body;
  const db = readDB();

  if (!hospitalId || !patientName || !patientPhone) {
    return res.status(400).json({ message: 'hospitalId, patientName and patientPhone are required' });
  }

  const newCall = {
    id: Date.now().toString(),
    userId: req.user.id,
    hospitalId,
    patientName,
    patientPhone,
    notes: notes || '',
    status: 'Completed',
    createdAt: new Date().toISOString()
  };

  db.calls.push(newCall);

  const newTranscription = {
    id: (Date.now() + 1).toString(),
    callId: newCall.id,
    hospitalId,
    userId: req.user.id,
    transcript: notes || `Call recorded for ${patientName}`,
    createdAt: new Date().toISOString()
  };

  db.transcriptions.push(newTranscription);
  writeDB(db);

  return res.status(201).json({
    message: 'Call logged successfully',
    call: newCall,
    transcription: newTranscription
  });
};

const getCallLogs = (req, res) => {
  const db = readDB();

  if (req.user.role === 'superadmin') {
    return res.json(db.calls);
  }

  if (req.user.role === 'admin') {
    return res.json(db.calls.filter(c => c.hospitalId === req.user.hospitalId));
  }

  return res.json(db.calls.filter(c => c.userId === req.user.id));
};

const getTranscriptions = (req, res) => {
  const db = readDB();

  if (req.user.role === 'superadmin') {
    return res.json(db.transcriptions);
  }

  if (req.user.role === 'admin') {
    return res.json(db.transcriptions.filter(t => t.hospitalId === req.user.hospitalId));
  }

  return res.json(db.transcriptions.filter(t => t.userId === req.user.id));
};

module.exports = {
  createCallLog,
  getCallLogs,
  getTranscriptions
};