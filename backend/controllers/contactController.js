const { readDB, writeDB } = require('../models');

const submitContact = (req, res) => {
  const { name, email, subject, phone, message } = req.body;
  const db = readDB();

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }

  const newContact = {
    id: Date.now().toString(),
    name,
    email,
    subject: subject || 'General Inquiry',
    phone: phone || '',
    message,
    submittedAt: new Date().toISOString()
  };

  db.contacts = db.contacts || [];
  db.contacts.push(newContact);
  writeDB(db);

  res.status(201).json({ message: 'Contact request submitted successfully', contact: newContact });
};

module.exports = { submitContact };