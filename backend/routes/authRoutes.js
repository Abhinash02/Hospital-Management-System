// const express = require('express');
// const { login, register, getAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/authController');
// const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/login', login);
// router.post('/register', register);
// router.get('/admins', authMiddleware, roleMiddleware(['superadmin']), getAdmins);
// router.post('/admins', authMiddleware, roleMiddleware(['superadmin']), createAdmin);
// router.put('/admins/:id', authMiddleware, roleMiddleware(['superadmin']), updateAdmin);
// router.delete('/admins/:id', authMiddleware, roleMiddleware(['superadmin']), deleteAdmin);

// module.exports = router;

const express = require('express');
const {
  login,
  register,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/admins', authMiddleware, roleMiddleware(['superadmin']), getAdmins);
router.post('/admins', authMiddleware, roleMiddleware(['superadmin']), createAdmin);
router.put('/admins/:id', authMiddleware, roleMiddleware(['superadmin']), updateAdmin);
router.delete('/admins/:id', authMiddleware, roleMiddleware(['superadmin']), deleteAdmin);

module.exports = router;