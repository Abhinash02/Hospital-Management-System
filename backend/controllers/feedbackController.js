const { readDB, writeDB } = require('../models');

const submitFeedback = (req, res) => {
  const { hospitalId, rating, message } = req.body;
  const db = readDB();

  if (!hospitalId || !rating || !message) {
    return res.status(400).json({ message: 'hospitalId, rating and message are required' });
  }

  const newFeedback = {
    id: Date.now().toString(),
    userId: req.user.id,
    userName: req.user.name || 'User',
    hospitalId,
    rating: Number(rating),
    message,
    status: 'Published',
    createdAt: new Date().toISOString()
  };

  db.feedbacks.push(newFeedback);
  writeDB(db);

  return res.status(201).json({
    message: 'Feedback submitted successfully',
    feedback: newFeedback
  });
};

const getFeedbacks = (req, res) => {
  const db = readDB();

  if (req.user.role === 'superadmin') {
    return res.json(db.feedbacks);
  }

  if (req.user.role === 'admin') {
    const adminHospitalId = req.user.hospitalId;
    return res.json(db.feedbacks.filter(f => f.hospitalId === adminHospitalId));
  }

  return res.json(db.feedbacks.filter(f => f.userId === req.user.id));
};

module.exports = {
  submitFeedback,
  getFeedbacks
};