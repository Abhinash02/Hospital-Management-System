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
    { id: user.id, role: user.role, name: user.name, hospitalId: user.hospitalId },
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
      role: user.role,
      hospitalId: user.hospitalId
    }
  });
};

const register = (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, 
    role: 'user'
  };

  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign(
    { id: newUser.id, role: newUser.role, name: newUser.name },
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
      role: newUser.role
    }
  });
};

module.exports = { login, register };
