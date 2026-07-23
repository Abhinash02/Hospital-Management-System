const express = require('express');
const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['user']), submitFeedback);
router.get('/', authMiddleware, roleMiddleware(['user', 'admin', 'superadmin']), getFeedbacks);

module.exports = router;