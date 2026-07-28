// const express = require('express');
// const { verifySession } = require('../controllers/paymentController');

// const router = express.Router();

// // Public — the registration page verifies the Stripe session before showing the form
// router.get('/verify', verifySession);

// module.exports = router;
const express = require('express');
const router = express.Router();

const { verifySession, webhook } = require('../controllers/paymentController');
const stripeSvc = require('../services/stripeService');

// Public verify route
router.get('/verify', verifySession);

// Stripe webhook must be mounted with express.raw in app.js on this exact path
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripeSvc.isConfigured()) {
      return res.status(503).json({ message: 'Stripe not configured' });
    }

    const { booking, feedbackToken, planKey } = req.body;

    if (!booking?.email) {
      return res.status(400).json({ message: 'booking.email is required' });
    }

    const session = await stripeSvc.createCheckoutSession({
      booking,
      feedbackToken,
      planKey
    });

    return res.json({
      id: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('[payments] create checkout error:', error);
    return res.status(500).json({ message: error.message || 'Failed to create checkout session' });
  }
});

module.exports = router;