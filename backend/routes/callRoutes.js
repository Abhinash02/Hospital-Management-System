const express = require('express');
const {
  createCallLog,
  getCallLogs,
  getTranscriptions
} = require('../controllers/callController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['user']), createCallLog);
router.get('/', authMiddleware, roleMiddleware(['user', 'admin', 'superadmin']), getCallLogs);
router.get('/transcriptions', authMiddleware, roleMiddleware(['user', 'admin', 'superadmin']), getTranscriptions);

module.exports = router;