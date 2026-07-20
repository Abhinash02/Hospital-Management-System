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
  const db = readDB();
  const newHospital = {
    id: Date.now().toString(),
    ...req.body
  };
  db.hospitals.push(newHospital);
  writeDB(db);
  res.status(201).json(newHospital);
};

const updateHospital = (req, res) => {
  const db = readDB();
  const index = db.hospitals.findIndex(h => h.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Hospital not found' });
  
  db.hospitals[index] = { ...db.hospitals[index], ...req.body };
  writeDB(db);
  res.json(db.hospitals[index]);
};

module.exports = { getHospitals, getHospitalById, createHospital, updateHospital };
