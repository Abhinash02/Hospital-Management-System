// // Stripe (test mode) for the "I'm interested → pay → register" step.
// // Degrades gracefully: if STRIPE_SECRET_KEY is missing, isConfigured() is false and
// // callers return a clear 503 instead of crashing.

// const secret = process.env.STRIPE_SECRET_KEY;
// const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// const AMOUNT = Number(process.env.DEMO_PRICE_AMOUNT || 4900); // cents
// const CURRENCY = process.env.DEMO_PRICE_CURRENCY || 'usd';

// // Treat obvious placeholders (e.g. "sk_test_...") as "not configured" so the dev
// // fallback (register without payment) keeps working until a real key is set.
// const looksReal = (k) => typeof k === 'string' && k.startsWith('sk_') && !k.includes('...');

// let stripe = null;
// if (secret && looksReal(secret)) {
//   stripe = require('stripe')(secret);
// } else if (secret) {
//   console.warn('[stripe] STRIPE_SECRET_KEY looks like a placeholder — payments disabled until a real key is set.');
// } else {
//   console.warn('[stripe] STRIPE_SECRET_KEY not set — payment endpoints will return 503 until configured.');
// }

// const isConfigured = () => stripe !== null;

// // Create a Checkout Session tied to a demo booking. On success Stripe redirects to the
// // registration page carrying the session id, which the backend verifies before registering.
// const createCheckoutSession = async ({ booking, feedbackToken }) => {
//   const session = await stripe.checkout.sessions.create({
//     mode: 'payment',
//     payment_method_types: ['card'],
//     customer_email: booking.email,
//     line_items: [
//       {
//         price_data: {
//           currency: CURRENCY,
//           product_data: {
//             name: 'Pet Hospital Portal — Onboarding',
//             description: `Onboarding for ${booking.hospital_name}`
//           },
//           unit_amount: AMOUNT
//         },
//         quantity: 1
//       }
//     ],
//     metadata: { booking_id: booking.id, feedback_token: feedbackToken || '' },
//     success_url: `${FRONTEND_URL}/register/${feedbackToken}?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${FRONTEND_URL}/feedback/${feedbackToken}?payment=cancelled`
//   });
//   return session;
// };

// const retrieveSession = (id) => stripe.checkout.sessions.retrieve(id);

// // ── Webhook helpers ──
// const looksRealWebhook = (k) => typeof k === 'string' && k.startsWith('whsec_') && !k.includes('...');
// const webhookConfigured = () => !!(stripe && looksRealWebhook(WEBHOOK_SECRET));

// // Verify the Stripe signature against the RAW request body. Throws if invalid.
// const constructWebhookEvent = (rawBody, signature) =>
//   stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);

// module.exports = {
//   isConfigured,
//   createCheckoutSession,
//   retrieveSession,
//   webhookConfigured,
//   constructWebhookEvent,
//   AMOUNT,
//   CURRENCY
// };








const secret = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const { PLANS } = require('../config/stripePlans');

const looksReal = (k) => typeof k === 'string' && k.startsWith('sk_') && !k.includes('...');

let stripe = null;

if (secret && looksReal(secret)) {
  stripe = require('stripe')(secret);
} else if (secret) {
  console.warn('[stripe] STRIPE_SECRET_KEY looks like a placeholder — payments disabled until a real key is set.');
} else {
  console.warn('[stripe] STRIPE_SECRET_KEY not set — payment endpoints will return 503 until configured.');
}

const isConfigured = () => stripe !== null;

const createCheckoutSession = async ({ booking, feedbackToken, planKey = 'basic' }) => {
  if (!stripe) throw new Error('Stripe not configured');

  const plan = PLANS[planKey];
  if (!plan) throw new Error('Invalid plan');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: booking.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Pet Hospital Portal — ${plan.name}`,
            description: `Onboarding for ${booking.hospital_name || booking.hospital || 'Hospital'}`
          },
          unit_amount: plan.amount
        },
        quantity: 1
      }
    ],
    metadata: {
      booking_id: booking.id,
      feedback_token: feedbackToken || '',
      plan_key: planKey
    },
    success_url: `${FRONTEND_URL}/register/${feedbackToken}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/feedback/${feedbackToken}?payment=cancelled`
  });

  return session;
};

const retrieveSession = (id) => stripe.checkout.sessions.retrieve(id);

const looksRealWebhook = (k) => typeof k === 'string' && k.startsWith('whsec_') && !k.includes('...');
const webhookConfigured = () => !!(stripe && looksRealWebhook(WEBHOOK_SECRET));

const constructWebhookEvent = (rawBody, signature) =>
  stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);

module.exports = {
  isConfigured,
  createCheckoutSession,
  retrieveSession,
  webhookConfigured,
  constructWebhookEvent
};