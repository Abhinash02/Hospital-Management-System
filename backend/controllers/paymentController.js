const { supabase, isConfigured } = require('../config/supabase');
const stripeSvc = require('../services/stripeService');

// GET /api/payments/verify?session_id=...  (public) — confirm a Checkout session is paid.
// Used by the registration page before showing the form.
const verifySession = async (req, res) => {
  const sessionId = req.query.session_id;

  if (!stripeSvc.isConfigured()) {
    // Dev mode: no Stripe — treat as an allowed pass-through.
    return res.json({ configured: false, paid: false });
  }
  if (!sessionId) return res.status(400).json({ message: 'session_id is required' });

  try {
    const session = await stripeSvc.retrieveSession(sessionId);
    const paid = session.payment_status === 'paid';

    if (paid && isConfigured()) {
      await supabase
        .from('payments')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('stripe_session_id', sessionId);
    }

    return res.json({
      configured: true,
      paid,
      email: session.customer_email,
      bookingId: session.metadata?.booking_id || null,
      feedbackToken: session.metadata?.feedback_token || null
    });
  } catch (e) {
    console.error('[payments] verify error:', e);
    return res.status(500).json({ message: 'Could not verify payment' });
  }
};

// POST /api/payments/webhook  (Stripe) — signature-verified payment confirmation.
// Mounted with express.raw() so req.body is the raw Buffer Stripe signed.
const webhook = async (req, res) => {
  if (!stripeSvc.webhookConfigured()) {
    // No/placeholder webhook secret — acknowledge so Stripe/CLI doesn't retry.
    return res.status(200).json({ received: true, skipped: 'webhook not configured' });
  }

  let event;
  try {
    event = stripeSvc.constructWebhookEvent(req.body, req.headers['stripe-signature']);
  } catch (e) {
    console.error('[webhook] signature verification failed:', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (isConfigured()) {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('stripe_session_id', session.id);
      if (error) console.error('[webhook] could not mark payment paid:', error);
      else console.log(`[webhook] payment marked paid for session ${session.id}`);
    }
  }

  return res.json({ received: true });
};

module.exports = { verifySession, webhook };
