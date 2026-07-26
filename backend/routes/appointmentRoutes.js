// const express = require('express');
// const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
// const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

// const router = express.Router();

// router.post('/', authMiddleware, bookAppointment);
// router.get('/', authMiddleware, getAppointments);
// router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateAppointmentStatus);

// module.exports = router;


// const express = require('express');
// const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
// const {
//   bookAppointment,
//   getAppointments,
//   updateAppointmentStatus,
//   updateAppointment,
//   deleteAppointment
// } = require('../controllers/appointmentController');

// const router = express.Router();

// router.post('/', authMiddleware, bookAppointment);
// router.get('/', authMiddleware, getAppointments);
// router.put('/:id/status', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateAppointmentStatus);
// router.put('/:id', authMiddleware, updateAppointment);
// router.delete('/:id', authMiddleware, deleteAppointment);

// module.exports = router;



const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const {
  bookAppointment,
  bookPublicAppointment,
  getAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

// Public — book an appointment from the marketing site (no login)
router.post('/public', bookPublicAppointment);

router.post('/', authMiddleware, bookAppointment);
router.get('/', authMiddleware, getAppointments);
router.put('/:id/status', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateAppointmentStatus);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateAppointment);
router.delete('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), deleteAppointment);

module.exports = router;