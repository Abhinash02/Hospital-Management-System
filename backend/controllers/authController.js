const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../models');

const login = (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, mobile: user.mobile, hospitalId: user.hospitalId },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '1d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      role: user.role,
      hospitalId: user.hospitalId
    }
  });
};

const register = (req, res) => {
  const { name, email, mobile, password } = req.body;
  const db = readDB();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Server-side mobile number validation (exactly 10 digits)
  if (!mobile || !/^\d{10}$/.test(mobile.toString().trim())) {
    return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    mobile: mobile.toString().trim(),
    password, 
    role: 'user'
  };

  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign(
    { id: newUser.id, role: newUser.role, name: newUser.name, mobile: newUser.mobile },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '1d' }
  );

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role
    }
  });
};

const getAdmins = (req, res) => {
  const db = readDB();
  const admins = db.users.filter(u => u.role === 'admin');
  res.json(admins);
};

const createAdmin = (req, res) => {
  const { name, email, mobile, hospital } = req.body;
  const db = readDB();

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newAdmin = {
    id: Date.now().toString(),
    name,
    email,
    mobile: mobile || '',
    password: '123',
    role: 'admin',
    hospital: hospital || 'Unassigned',
    hospitalId: ''
  };

  db.users.push(newAdmin);
  writeDB(db);

  res.status(201).json(newAdmin);
};

const updateAdmin = (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, hospital } = req.body;
  const db = readDB();

  const adminIndex = db.users.findIndex(u => u.id === id && u.role === 'admin');
  if (adminIndex === -1) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const existingEmailUser = db.users.find(u => u.email === email && u.id !== id);
  if (existingEmailUser) {
    return res.status(400).json({ message: 'Another user already uses this email' });
  }

  db.users[adminIndex] = {
    ...db.users[adminIndex],
    name,
    email,
    mobile: mobile !== undefined ? mobile : db.users[adminIndex].mobile || '',
    hospital: hospital || db.users[adminIndex].hospital || 'Unassigned'
  };

  writeDB(db);
  res.json(db.users[adminIndex]);
};

const deleteAdmin = (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const adminIndex = db.users.findIndex(u => u.id === id && u.role === 'admin');
  if (adminIndex === -1) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  const removedAdmin = db.users.splice(adminIndex, 1)[0];
  writeDB(db);
  res.json({ message: 'Admin deleted', admin: removedAdmin });
};

module.exports = { login, register, getAdmins, createAdmin, updateAdmin, deleteAdmin };
