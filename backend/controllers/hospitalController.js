const { readDB, writeDB } = require('../models');

const getHospitals = (req, res) => {
  const db = readDB();
  res.json(db.hospitals);
};

const getHospitalById = (req, res) => {
  const db = readDB();
  const hospital = db.hospitals.find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
  res.json(hospital);
};

const createHospital = (req, res) => {
  const { name, location, icu, careType, specialty, beds, contact, videoUrl, adminName, adminEmail, adminPassword } = req.body;
  if (!name || !location) {
    return res.status(400).json({ message: 'Hospital name and location are required' });
  }

  if (!adminEmail || !adminPassword) {
    return res.status(400).json({ message: 'Hospital Admin Email and Password are required for login credentials' });
  }

  const db = readDB();

  if (db.users.find(u => u.email === adminEmail)) {
    return res.status(400).json({ message: 'An account already exists with this Admin Email' });
  }

  const hospitalId = Date.now().toString();

  const newHospital = {
    id: hospitalId,
    name,
    location,
    icu: icu || '24/7 ICU',
    careType: careType || 'Advanced Care',
    specialty: specialty || 'Super Specialty',
    beds: beds || '300+',
    contact: contact || '+91 91225-56789',
    videoUrl: videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    email: adminEmail,
    createdAt: new Date().toISOString()
  };

  db.hospitals.push(newHospital);

  // Create dedicated Hospital Admin login credentials using hospital email as ID
  const createdAdmin = {
    id: (Date.now() + 1).toString(),
    name: adminName || `${name} Admin`,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    hospital: name,
    hospitalId: hospitalId
  };
  db.users.push(createdAdmin);

  writeDB(db);
  res.status(201).json({ hospital: newHospital, admin: createdAdmin });
};

const updateHospital = (req, res) => {
  const db = readDB();
  const index = db.hospitals.findIndex(h => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Hospital not found' });
  
  db.hospitals[index] = { ...db.hospitals[index], ...req.body };
  writeDB(db);
  res.json(db.hospitals[index]);
};

const deleteHospital = (req, res) => {
  const db = readDB();
  const index = db.hospitals.findIndex(h => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Hospital not found' });

  const removedHospital = db.hospitals.splice(index, 1)[0];
  writeDB(db);
  res.json({ message: 'Hospital deleted', hospital: removedHospital });
};

module.exports = { getHospitals, getHospitalById, createHospital, updateHospital, deleteHospital };
