const { supabase, isConfigured } = require('../config/supabase');
const stripeSvc = require('../services/stripeService');

const TABLE = 'demo_bookings';

const notConfigured = (res) =>
  res.status(503).json({ message: 'Feedback storage is not configured (Supabase).' });

const findByFeedbackToken = (feedback_token) =>
  supabase.from(TABLE).select('*').eq('feedback_token', feedback_token).single();

// GET /api/feedback/:token  (public) — booking summary for the feedback page
const getFeedbackInfo = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);
  const { token } = req.params;

  const { data: booking, error } = await findByFeedbackToken(token);
  if (error || !booking) return res.status(404).json({ message: 'Invalid or expired feedback link' });

  const { data: existing } = await supabase
    .from('demo_feedback')
    .select('id, rating, interested')
    .eq('booking_id', booking.id)
    .maybeSingle();

  return res.json({
    booking: { hospitalName: booking.hospital_name, contactName: booking.contact_name },
    alreadySubmitted: !!existing,
    stripeEnabled: stripeSvc.isConfigured(),
    price: { amount: stripeSvc.AMOUNT, currency: stripeSvc.CURRENCY }
  });
};

// POST /api/feedback/:token  (public) — submit rating/interest; if interested → Stripe checkout
const submitFeedback = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);
  const { token } = req.params;
  const { rating, interested, comment } = req.body || {};

  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ message: 'Rating must be an integer from 1 to 5' });
  }

  const { data: booking, error } = await findByFeedbackToken(token);
  if (error || !booking) return res.status(404).json({ message: 'Invalid or expired feedback link' });

  const { error: insErr } = await supabase.from('demo_feedback').insert({
    booking_id: booking.id,
    rating: r,
    interested: !!interested,
    comment: comment ? String(comment).trim() : null
  });
  if (insErr) {
    console.error('[feedback] insert error:', insErr);
    return res.status(500).json({ message: 'Could not save feedback' });
  }

  // Not interested → thank-you, no payment.
  if (!interested) {
    return res.json({ message: 'Thanks for your feedback!', interested: false });
  }

  // Interested → start payment. Real Stripe if configured; dev fallback goes straight to register.
  if (!stripeSvc.isConfigured()) {
    return res.json({
      message: 'Thanks! Continue to registration.',
      interested: true,
      checkoutUrl: null,
      registerUrl: `/register/${token}`
    });
  }

  try {
    const session = await stripeSvc.createCheckoutSession({ booking, feedbackToken: token });
    await supabase.from('payments').insert({
      booking_id: booking.id,
      email: booking.email,
      stripe_session_id: session.id,
      amount: stripeSvc.AMOUNT,
      currency: stripeSvc.CURRENCY,
      status: 'pending'
    });
    return res.json({ message: 'Redirecting to payment', interested: true, checkoutUrl: session.url });
  } catch (e) {
    console.error('[feedback] stripe session error:', e);
    return res.status(500).json({ message: 'Could not start payment' });
  }
};

module.exports = { getFeedbackInfo, submitFeedback };
