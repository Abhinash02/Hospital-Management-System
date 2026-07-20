const express = require('express');
const { bookAppointment, getUserAppointments } = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, bookAppointment);
router.get('/', authMiddleware, getUserAppointments);

module.exports = router;
