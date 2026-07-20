const express = require('express');
const { getHospitals, getHospitalById, createHospital, updateHospital } = require('../controllers/hospitalController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.post('/', authMiddleware, roleMiddleware(['superadmin']), createHospital);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateHospital);

module.exports = router;
