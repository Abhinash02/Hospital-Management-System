// const { readDB, writeDB } = require('../models');

// const getHospitals = (req, res) => {
//   const db = readDB();
//   res.json(db.hospitals);
// };

// const getHospitalById = (req, res) => {
//   const db = readDB();
//   const hospital = db.hospitals.find(h => h.id === req.params.id);
//   if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
//   res.json(hospital);
// };

// const createHospital = (req, res) => {
//   const { name, location, icu, careType, specialty, beds, contact, videoUrl, adminName, adminEmail, adminPassword } = req.body;
//   if (!name || !location) {
//     return res.status(400).json({ message: 'Hospital name and location are required' });
//   }

//   if (!adminEmail || !adminPassword) {
//     return res.status(400).json({ message: 'Hospital Admin Email and Password are required for login credentials' });
//   }

//   const db = readDB();

//   if (db.users.find(u => u.email === adminEmail)) {
//     return res.status(400).json({ message: 'An account already exists with this Admin Email' });
//   }

//   const hospitalId = Date.now().toString();

//   const newHospital = {
//     id: hospitalId,
//     name,
//     location,
//     icu: icu || '24/7 ICU',
//     careType: careType || 'Advanced Care',
//     specialty: specialty || 'Super Specialty',
//     beds: beds || '300+',
//     contact: contact || '+91 91225-56789',
//     videoUrl: videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//     email: adminEmail,
//     createdAt: new Date().toISOString()
//   };

//   db.hospitals.push(newHospital);

//   // Create dedicated Hospital Admin login credentials using hospital email as ID
//   const createdAdmin = {
//     id: (Date.now() + 1).toString(),
//     name: adminName || `${name} Admin`,
//     email: adminEmail,
//     password: adminPassword,
//     role: 'admin',
//     hospital: name,
//     hospitalId: hospitalId
//   };
//   db.users.push(createdAdmin);

//   writeDB(db);
//   res.status(201).json({ hospital: newHospital, admin: createdAdmin });
// };

// const updateHospital = (req, res) => {
//   const db = readDB();
//   const index = db.hospitals.findIndex(h => h.id === req.params.id);
//   if (index === -1) return res.status(404).json({ message: 'Hospital not found' });

//   const existingHospital = db.hospitals[index];
//   const { adminName, adminEmail, adminPassword, ...hospitalUpdates } = req.body;

//   if (adminEmail) {
//     const duplicate = db.users.find(u => u.email === adminEmail && u.role === 'admin' && u.hospitalId !== existingHospital.id);
//     if (duplicate) {
//       return res.status(400).json({ message: 'Another admin account already uses this email' });
//     }
//   }

//   const updatedHospital = {
//     ...existingHospital,
//     ...hospitalUpdates,
//     ...(adminEmail ? { email: adminEmail } : {})
//   };
//   db.hospitals[index] = updatedHospital;

//   let adminUser = db.users.find(u => u.role === 'admin' && u.hospitalId === existingHospital.id);
//   if (adminEmail || adminPassword || adminName) {
//     if (!adminUser && adminEmail) {
//       adminUser = {
//         id: (Date.now() + 1).toString(),
//         name: adminName || `${updatedHospital.name} Admin`,
//         email: adminEmail,
//         password: adminPassword || '123',
//         role: 'admin',
//         hospital: updatedHospital.name,
//         hospitalId: updatedHospital.id
//       };
//       db.users.push(adminUser);
//     } else if (adminUser) {
//       if (adminName) adminUser.name = adminName;
//       if (adminEmail) adminUser.email = adminEmail;
//       if (adminPassword) adminUser.password = adminPassword;
//       adminUser.hospital = updatedHospital.name;
//       adminUser.hospitalId = updatedHospital.id;
//     }
//   }

//   writeDB(db);
//   res.json(updatedHospital);
// };

// const deleteHospital = (req, res) => {
//   const db = readDB();
//   const index = db.hospitals.findIndex(h => h.id === req.params.id);
//   if (index === -1) return res.status(404).json({ message: 'Hospital not found' });

//   const removedHospital = db.hospitals.splice(index, 1)[0];
//   const adminIndex = db.users.findIndex(u => u.role === 'admin' && u.hospitalId === removedHospital.id);
//   if (adminIndex !== -1) {
//     db.users.splice(adminIndex, 1);
//   }

//   writeDB(db);
//   res.json({ message: 'Hospital deleted', hospital: removedHospital });
// };

// module.exports = { getHospitals, getHospitalById, createHospital, updateHospital, deleteHospital };

const { readDB, writeDB } = require('../models');

const getHospitals = (req, res) => {
  const db = readDB();
  return res.json(db.hospitals || []);
};

const getHospitalById = (req, res) => {
  const db = readDB();
  const hospital = (db.hospitals || []).find(h => h.id === req.params.id);

  if (!hospital) {
    return res.status(404).json({ message: 'Hospital not found' });
  }

  return res.json(hospital);
};

const createHospital = (req, res) => {
  const {
    name,
    location,
    icu,
    careType,
    specialty,
    beds,
    contact,
    videoUrl,
    adminName,
    adminEmail,
    adminPassword,
    timings,
    emergency
  } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Hospital name and location are required' });
  }

  if (!adminEmail || !adminPassword) {
    return res.status(400).json({ message: 'Hospital Admin Email and Password are required' });
  }

  const db = readDB();
  db.hospitals = db.hospitals || [];
  db.users = db.users || [];

  const existingAdmin = db.users.find(
    u => u.role === 'admin' && (u.email || '').toLowerCase() === adminEmail.toLowerCase()
  );

  if (existingAdmin) {
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
    videoUrl: videoUrl || '',
    email: adminEmail,
    timings: timings || 'Mon - Sat • 8:00 AM - 8:00 PM',
    emergency: emergency || '24/7 Emergency Available',
    createdAt: new Date().toISOString()
  };

  const createdAdmin = {
    id: (Date.now() + 1).toString(),
    name: adminName || `${name} Admin`,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    hospital: name,
    hospitalId
  };

  db.hospitals.push(newHospital);
  db.users.push(createdAdmin);
  writeDB(db);

  return res.status(201).json({
    success: true,
    message: 'Hospital created successfully',
    hospital: newHospital,
    admin: createdAdmin
  });
};

const updateHospital = (req, res) => {
  const db = readDB();
  db.hospitals = db.hospitals || [];
  db.users = db.users || [];

  const index = db.hospitals.findIndex(h => h.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Hospital not found' });
  }

  const existingHospital = db.hospitals[index];
  const { adminName, adminEmail, adminPassword, ...hospitalUpdates } = req.body;

  db.hospitals[index] = {
    ...existingHospital,
    ...hospitalUpdates,
    ...(adminEmail ? { email: adminEmail } : {})
  };

  const adminIndex = db.users.findIndex(
    u => u.role === 'admin' && u.hospitalId === existingHospital.id
  );

  if (adminIndex !== -1) {
    if (adminName) db.users[adminIndex].name = adminName;
    if (adminEmail) db.users[adminIndex].email = adminEmail;
    if (adminPassword) db.users[adminIndex].password = adminPassword;
    db.users[adminIndex].hospital = db.hospitals[index].name;
    db.users[adminIndex].hospitalId = db.hospitals[index].id;
  }

  writeDB(db);
  return res.json(db.hospitals[index]);
};

const updateOwnHospitalTimings = (req, res) => {
  const { timings, emergency } = req.body;
  const db = readDB();

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only hospital admin can update timings' });
  }

  const hospitalIndex = (db.hospitals || []).findIndex(h => h.id === req.user.hospitalId);

  if (hospitalIndex === -1) {
    return res.status(404).json({ message: 'Hospital not found for this admin' });
  }

  db.hospitals[hospitalIndex] = {
    ...db.hospitals[hospitalIndex],
    timings: timings || db.hospitals[hospitalIndex].timings || 'Mon - Sat • 8:00 AM - 8:00 PM',
    emergency: emergency || db.hospitals[hospitalIndex].emergency || '24/7 Emergency Available',
    updatedAt: new Date().toISOString()
  };

  writeDB(db);

  return res.json({
    message: 'Hospital timings updated successfully',
    hospital: db.hospitals[hospitalIndex]
  });
};

const deleteHospital = (req, res) => {
  const db = readDB();
  db.hospitals = db.hospitals || [];
  db.users = db.users || [];

  const index = db.hospitals.findIndex(h => h.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Hospital not found' });
  }

  const removedHospital = db.hospitals.splice(index, 1)[0];

  const adminIndex = db.users.findIndex(
    u => u.role === 'admin' && u.hospitalId === removedHospital.id
  );

  if (adminIndex !== -1) {
    db.users.splice(adminIndex, 1);
  }

  writeDB(db);

  return res.json({
    message: 'Hospital deleted',
    hospital: removedHospital
  });
};

module.exports = {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  updateOwnHospitalTimings,
  deleteHospital
};