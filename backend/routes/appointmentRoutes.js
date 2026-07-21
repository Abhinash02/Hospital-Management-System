const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', authMiddleware, bookAppointment);
router.get('/', authMiddleware, getAppointments);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateAppointmentStatus);

module.exports = router;
