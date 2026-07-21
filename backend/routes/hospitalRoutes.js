const express = require('express');
const { getHospitals, getHospitalById, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitalController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.post('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), createHospital);
router.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), updateHospital);
router.delete('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), deleteHospital);

module.exports = router;
