// const nodemailer = require('nodemailer');
// const templates = require('../email_template');

// // Transactional email via Nodemailer + Gmail (App Password SMTP). Degrades gracefully:
// // if GMAIL_USER / GMAIL_APP_PASSWORD are missing, sends are logged and skipped so the
// // funnel still works end-to-end in local dev.
// // All HTML lives in ../email_template — this file only handles sending.

// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
// const MAIL_FROM =
//   process.env.MAIL_FROM ||
//   (GMAIL_USER ? `Pet Hospital Portal <${GMAIL_USER}>` : 'Pet Hospital Portal <no-reply@example.com>');

// let transporter = null;
// if (GMAIL_USER && GMAIL_APP_PASSWORD) {
//   transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
//   });
// } else {
//   console.warn('[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — emails will be logged and skipped.');
// }

// const send = async ({ to, subject, html }) => {
//   if (!transporter) {
//     console.log(`[email] (skipped) To: ${to} | Subject: ${subject}`);
//     return { skipped: true };
//   }
//   try {
//     const info = await transporter.sendMail({ from: MAIL_FROM, to, subject, html });
//     return { id: info.messageId };
//   } catch (err) {
//     console.error('[email] send threw:', err);
//     return { error: err };
//   }
// };

// // Each wrapper builds its template from ../email_template and sends it.
// const sendDemoReceived = ({ to, ...vars }) => send({ to, ...templates.demoReceived(vars) });
// const sendScheduleInvite = ({ to, ...vars }) => send({ to, ...templates.scheduleInvite(vars) });
// const sendDemoConfirmation = ({ to, ...vars }) => send({ to, ...templates.demoConfirmation(vars) });
// const sendMeetingLink = ({ to, ...vars }) => send({ to, ...templates.meetingLinkReady(vars) });
// const sendFeedbackRequest = ({ to, ...vars }) => send({ to, ...templates.feedbackRequest(vars) });
// const sendRegistrationReceived = ({ to, ...vars }) => send({ to, ...templates.registrationReceived(vars) });
// const sendRegistrationApproved = ({ to, ...vars }) => send({ to, ...templates.registrationApproved(vars) });
// const sendRegistrationDenied = ({ to, ...vars }) => send({ to, ...templates.registrationDenied(vars) });
// const sendPasswordResetOtp = ({ to, ...vars }) => send({ to, ...templates.passwordResetOtp(vars) });
// const sendAppointmentConfirmation = ({ to, ...vars }) => send({ to, ...templates.appointmentConfirmation(vars) });

// module.exports = {
//   send,
//   sendDemoReceived,
//   sendScheduleInvite,
//   sendDemoConfirmation,
//   sendMeetingLink,
//   sendFeedbackRequest,
//   sendRegistrationReceived,
//   sendRegistrationApproved,
//   sendRegistrationDenied,
//   sendPasswordResetOtp,
//   sendAppointmentConfirmation
// };






// const nodemailer = require('nodemailer');
// const templates = require('../email_template');

// // ─── Environment variables ───────────────────────────────
// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// // OAuth2 credentials (preferred)
// const GOOGLE_USER = process.env.GOOGLE_USER;
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// // Sender address
// const MAIL_FROM =
//   process.env.MAIL_FROM ||
//   (GOOGLE_USER || GMAIL_USER
//     ? `Pet Hospital Portal <${GOOGLE_USER || GMAIL_USER}>`
//     : 'Pet Hospital Portal <no-reply@example.com>');

// // ─── Transporter creation ────────────────────────────────
// let transporter = null;
// let authMethod = 'none';

// if (GOOGLE_USER && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
//   // Use OAuth2
//   transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: GOOGLE_USER,
//       clientId: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       refreshToken: GOOGLE_REFRESH_TOKEN,
//     },
//   });
//   authMethod = 'OAuth2';
//   console.log('✅ Email transporter: OAuth2 (refresh token)');
// } else if (GMAIL_USER && GMAIL_APP_PASSWORD) {
//   // Fallback to App Password
//   transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
//   });
//   authMethod = 'App Password';
//   console.log('✅ Email transporter: App Password');
// } else {
//   console.warn(
//     '[email] No valid credentials found – emails will be logged and skipped.\n' +
//     '   Set either:\n' +
//     '   - GOOGLE_USER + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN (OAuth2), or\n' +
//     '   - GMAIL_USER + GMAIL_APP_PASSWORD (App Password)'
//   );
// }

// // Optional: verify connection once (catches invalid credentials early)
// if (transporter) {
//   transporter.verify((error) => {
//     if (error) {
//       console.error('❌ Email transporter verification failed:', error.message);
//     } else {
//       console.log(`✅ Email transporter ready (${authMethod})`);
//     }
//   });
// }

// // ─── Send function ────────────────────────────────────────
// const send = async ({ to, subject, html }) => {
//   if (!transporter) {
//     console.log(`[email] (skipped) To: ${to} | Subject: ${subject}`);
//     return { skipped: true };
//   }
//   try {
//     const info = await transporter.sendMail({ from: MAIL_FROM, to, subject, html });
//     return { id: info.messageId };
//   } catch (err) {
//     console.error('[email] send threw:', err);
//     return { error: err };
//   }
// };

// // ─── Template wrappers ────────────────────────────────────
// const sendDemoReceived = ({ to, ...vars }) => send({ to, ...templates.demoReceived(vars) });
// const sendScheduleInvite = ({ to, ...vars }) => send({ to, ...templates.scheduleInvite(vars) });
// const sendDemoConfirmation = ({ to, ...vars }) => send({ to, ...templates.demoConfirmation(vars) });
// const sendMeetingLink = ({ to, ...vars }) => send({ to, ...templates.meetingLinkReady(vars) });
// const sendFeedbackRequest = ({ to, ...vars }) => send({ to, ...templates.feedbackRequest(vars) });
// const sendRegistrationReceived = ({ to, ...vars }) => send({ to, ...templates.registrationReceived(vars) });
// const sendRegistrationApproved = ({ to, ...vars }) => send({ to, ...templates.registrationApproved(vars) });
// const sendRegistrationDenied = ({ to, ...vars }) => send({ to, ...templates.registrationDenied(vars) });
// const sendPasswordResetOtp = ({ to, ...vars }) => send({ to, ...templates.passwordResetOtp(vars) });
// const sendAppointmentConfirmation = ({ to, ...vars }) => send({ to, ...templates.appointmentConfirmation(vars) });

// module.exports = {
//   send,
//   sendDemoReceived,
//   sendScheduleInvite,
//   sendDemoConfirmation,
//   sendMeetingLink,
//   sendFeedbackRequest,
//   sendRegistrationReceived,
//   sendRegistrationApproved,
//   sendRegistrationDenied,
//   sendPasswordResetOtp,
//   sendAppointmentConfirmation,
// };


// const nodemailer = require('nodemailer');
// const templates = require('../email_template');

// // ─── Environment variables ───────────────────────────────
// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// // OAuth2 credentials (preferred)
// const GOOGLE_USER = process.env.GOOGLE_USER;
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// // Sender address
// const MAIL_FROM =
//   process.env.MAIL_FROM ||
//   (GOOGLE_USER || GMAIL_USER
//     ? `Pet Hospital Portal <${GOOGLE_USER || GMAIL_USER}>`
//     : 'Pet Hospital Portal <no-reply@example.com>');

// // ─── Transporter creation ────────────────────────────────
// let transporter = null;
// let authMethod = 'none';

// if (GOOGLE_USER && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
//   transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: GOOGLE_USER,
//       clientId: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       refreshToken: GOOGLE_REFRESH_TOKEN,
//     },
//   });
//   authMethod = 'OAuth2';
//   console.log('✅ Email transporter: OAuth2 (refresh token)');
// } else if (GMAIL_USER && GMAIL_APP_PASSWORD) {
//   transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
//   });
//   authMethod = 'App Password';
//   console.log('✅ Email transporter: App Password');
// } else {
//   console.warn(
//     '[email] No valid credentials found – emails will be logged and skipped.\n' +
//     '   Set either:\n' +
//     '   - GOOGLE_USER + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN (OAuth2), or\n' +
//     '   - GMAIL_USER + GMAIL_APP_PASSWORD (App Password)'
//   );
// }

// // Optional: verify connection once (catches invalid credentials early)
// if (transporter) {
//   transporter.verify((error) => {
//     if (error) {
//       console.error('❌ Email transporter verification failed:', error.message);
//     } else {
//       console.log(`✅ Email transporter ready (${authMethod})`);
//     }
//   });
// }

// // ─── Send function ────────────────────────────────────────
// const send = async ({ to, subject, html }) => {
//   if (!transporter) {
//     console.log(`[email] (skipped) To: ${to} | Subject: ${subject}`);
//     return { skipped: true };
//   }
//   try {
//     const info = await transporter.sendMail({ from: MAIL_FROM, to, subject, html });
//     return { id: info.messageId };
//   } catch (err) {
//     console.error('[email] send threw:', err);
//     return { error: err };
//   }
// };

// // ─── Template wrappers ────────────────────────────────────
// const sendDemoReceived = ({ to, ...vars }) => send({ to, ...templates.demoReceived(vars) });
// const sendScheduleInvite = ({ to, ...vars }) => send({ to, ...templates.scheduleInvite(vars) });
// const sendDemoConfirmation = ({ to, ...vars }) => send({ to, ...templates.demoConfirmation(vars) });
// const sendMeetingLink = ({ to, ...vars }) => send({ to, ...templates.meetingLinkReady(vars) });
// const sendFeedbackRequest = ({ to, ...vars }) => send({ to, ...templates.feedbackRequest(vars) });
// const sendRegistrationReceived = ({ to, ...vars }) => send({ to, ...templates.registrationReceived(vars) });
// const sendRegistrationApproved = ({ to, ...vars }) => send({ to, ...templates.registrationApproved(vars) });
// const sendRegistrationDenied = ({ to, ...vars }) => send({ to, ...templates.registrationDenied(vars) });
// const sendPasswordResetOtp = ({ to, ...vars }) => send({ to, ...templates.passwordResetOtp(vars) });
// const sendAppointmentConfirmation = ({ to, ...vars }) => send({ to, ...templates.appointmentConfirmation(vars) });

// // ─── Exports ──────────────────────────────────────────────
// module.exports = {
//   send,
//   sendDemoReceived,
//   sendScheduleInvite,
//   sendDemoConfirmation,
//   sendMeetingLink,
//   sendFeedbackRequest,
//   sendRegistrationReceived,
//   sendRegistrationApproved,
//   sendRegistrationDenied,
//   sendPasswordResetOtp,
//   sendAppointmentConfirmation,
// };


// const nodemailer = require('nodemailer');
// const dns = require('dns');

// // ─── Force IPv4 for all DNS lookups (fixes ENETUNREACH on Render) ──
// dns.setDefaultResultOrder('ipv4first');

// const templates = require('../email_template');

// // ─── Environment variables ───────────────────────────────
// const GMAIL_USER = process.env.GMAIL_USER;
// const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// // OAuth2 credentials (preferred)
// const GOOGLE_USER = process.env.GOOGLE_USER;
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// // Sender address
// const MAIL_FROM =
//   process.env.MAIL_FROM ||
//   (GOOGLE_USER || GMAIL_USER
//     ? `Pet Hospital Portal <${GOOGLE_USER || GMAIL_USER}>`
//     : 'Pet Hospital Portal <no-reply@example.com>');

// // ─── Transporter creation ────────────────────────────────
// let transporter = null;
// let authMethod = 'none';

// if (GOOGLE_USER && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
//   // Use OAuth2 with explicit IPv4-friendly settings
//   transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // SSL
//     auth: {
//       type: 'OAuth2',
//       user: GOOGLE_USER,
//       clientId: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       refreshToken: GOOGLE_REFRESH_TOKEN,
//     },
//   });
//   authMethod = 'OAuth2';
//   console.log('✅ Email transporter: OAuth2 (refresh token)');
// } else if (GMAIL_USER && GMAIL_APP_PASSWORD) {
//   // Fallback to App Password (also using explicit host/port)
//   transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // SSL
//     auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
//   });
//   authMethod = 'App Password';
//   console.log('✅ Email transporter: App Password');
// } else {
//   console.warn(
//     '[email] No valid credentials found – emails will be logged and skipped.\n' +
//     '   Set either:\n' +
//     '   - GOOGLE_USER + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN (OAuth2), or\n' +
//     '   - GMAIL_USER + GMAIL_APP_PASSWORD (App Password)'
//   );
// }

// // Optional: verify connection once (catches invalid credentials early)
// if (transporter) {
//   transporter.verify((error) => {
//     if (error) {
//       console.error('❌ Email transporter verification failed:', error.message);
//     } else {
//       console.log(`✅ Email transporter ready (${authMethod})`);
//     }
//   });
// }

// // ─── Send function ────────────────────────────────────────
// const send = async ({ to, subject, html }) => {
//   if (!transporter) {
//     console.log(`[email] (skipped) To: ${to} | Subject: ${subject}`);
//     return { skipped: true };
//   }
//   try {
//     const info = await transporter.sendMail({ from: MAIL_FROM, to, subject, html });
//     return { id: info.messageId };
//   } catch (err) {
//     console.error('[email] send threw:', err);
//     return { error: err };
//   }
// };

// // ─── Template wrappers ────────────────────────────────────
// const sendDemoReceived = ({ to, ...vars }) => send({ to, ...templates.demoReceived(vars) });
// const sendScheduleInvite = ({ to, ...vars }) => send({ to, ...templates.scheduleInvite(vars) });
// const sendDemoConfirmation = ({ to, ...vars }) => send({ to, ...templates.demoConfirmation(vars) });
// const sendMeetingLink = ({ to, ...vars }) => send({ to, ...templates.meetingLinkReady(vars) });
// const sendFeedbackRequest = ({ to, ...vars }) => send({ to, ...templates.feedbackRequest(vars) });
// const sendRegistrationReceived = ({ to, ...vars }) => send({ to, ...templates.registrationReceived(vars) });
// const sendRegistrationApproved = ({ to, ...vars }) => send({ to, ...templates.registrationApproved(vars) });
// const sendRegistrationDenied = ({ to, ...vars }) => send({ to, ...templates.registrationDenied(vars) });
// const sendPasswordResetOtp = ({ to, ...vars }) => send({ to, ...templates.passwordResetOtp(vars) });
// const sendAppointmentConfirmation = ({ to, ...vars }) => send({ to, ...templates.appointmentConfirmation(vars) });

// module.exports = {
//   send,
//   sendDemoReceived,
//   sendScheduleInvite,
//   sendDemoConfirmation,
//   sendMeetingLink,
//   sendFeedbackRequest,
//   sendRegistrationReceived,
//   sendRegistrationApproved,
//   sendRegistrationDenied,
//   sendPasswordResetOtp,
//   sendAppointmentConfirmation,
// };


const nodemailer = require('nodemailer');
const dns = require('dns');

// ─── Force IPv4 for all DNS lookups (fixes ENETUNREACH on Render) ──
dns.setDefaultResultOrder('ipv4first');

const templates = require('../email_template');

// ─── Environment variables ───────────────────────────────
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// OAuth2 credentials (preferred)
const GOOGLE_USER = process.env.GOOGLE_USER;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// Sender address
const MAIL_FROM =
  process.env.MAIL_FROM ||
  (GOOGLE_USER || GMAIL_USER
    ? `Pet Hospital Portal <${GOOGLE_USER || GMAIL_USER}>`
    : 'Pet Hospital Portal <no-reply@example.com>');

// ─── Transporter creation ────────────────────────────────
let transporter = null;
let authMethod = 'none';

if (GOOGLE_USER && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN) {
  // Use OAuth2 with explicit IPv4-friendly settings AND family:4
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    family: 4,    // ✅ Force IPv4 (fixes ENETUNREACH)
    auth: {
      type: 'OAuth2',
      user: GOOGLE_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
    },
  });
  authMethod = 'OAuth2';
  console.log('✅ Email transporter: OAuth2 (refresh token)');
} else if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  // Fallback to App Password (also using explicit host/port + family:4)
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    family: 4,    // ✅ Force IPv4
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  authMethod = 'App Password';
  console.log('✅ Email transporter: App Password');
} else {
  console.warn(
    '[email] No valid credentials found – emails will be logged and skipped.\n' +
    '   Set either:\n' +
    '   - GOOGLE_USER + GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN (OAuth2), or\n' +
    '   - GMAIL_USER + GMAIL_APP_PASSWORD (App Password)'
  );
}

// Optional: verify connection once (catches invalid credentials early)
if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email transporter verification failed:', error.message);
    } else {
      console.log(`✅ Email transporter ready (${authMethod})`);
    }
  });
}

// ─── Send function ────────────────────────────────────────
const send = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`[email] (skipped) To: ${to} | Subject: ${subject}`);
    return { skipped: true };
  }
  try {
    const info = await transporter.sendMail({ from: MAIL_FROM, to, subject, html });
    return { id: info.messageId };
  } catch (err) {
    console.error('[email] send threw:', err);
    return { error: err };
  }
};

// ─── Template wrappers ────────────────────────────────────
const sendDemoReceived = ({ to, ...vars }) => send({ to, ...templates.demoReceived(vars) });
const sendScheduleInvite = ({ to, ...vars }) => send({ to, ...templates.scheduleInvite(vars) });
const sendDemoConfirmation = ({ to, ...vars }) => send({ to, ...templates.demoConfirmation(vars) });
const sendMeetingLink = ({ to, ...vars }) => send({ to, ...templates.meetingLinkReady(vars) });
const sendFeedbackRequest = ({ to, ...vars }) => send({ to, ...templates.feedbackRequest(vars) });
const sendRegistrationReceived = ({ to, ...vars }) => send({ to, ...templates.registrationReceived(vars) });
const sendRegistrationApproved = ({ to, ...vars }) => send({ to, ...templates.registrationApproved(vars) });
const sendRegistrationDenied = ({ to, ...vars }) => send({ to, ...templates.registrationDenied(vars) });
const sendPasswordResetOtp = ({ to, ...vars }) => send({ to, ...templates.passwordResetOtp(vars) });
const sendAppointmentConfirmation = ({ to, ...vars }) => send({ to, ...templates.appointmentConfirmation(vars) });

module.exports = {
  send,
  sendDemoReceived,
  sendScheduleInvite,
  sendDemoConfirmation,
  sendMeetingLink,
  sendFeedbackRequest,
  sendRegistrationReceived,
  sendRegistrationApproved,
  sendRegistrationDenied,
  sendPasswordResetOtp,
  sendAppointmentConfirmation,
};