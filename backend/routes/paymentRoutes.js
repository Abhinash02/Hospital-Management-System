const express = require('express');
const { verifySession } = require('../controllers/paymentController');

const router = express.Router();

// Public — the registration page verifies the Stripe session before showing the form
router.get('/verify', verifySession);

module.exports = router;
