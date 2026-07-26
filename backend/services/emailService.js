const nodemailer = require('nodemailer');
const templates = require('../email_template');

// Transactional email via Nodemailer + Gmail (App Password SMTP). Degrades gracefully:
// if GMAIL_USER / GMAIL_APP_PASSWORD are missing, sends are logged and skipped so the
// funnel still works end-to-end in local dev.
// All HTML lives in ../email_template — this file only handles sending.

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const MAIL_FROM =
  process.env.MAIL_FROM ||
  (GMAIL_USER ? `Pet Hospital Portal <${GMAIL_USER}>` : 'Pet Hospital Portal <no-reply@example.com>');

let transporter = null;
if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
  });
} else {
  console.warn('[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — emails will be logged and skipped.');
}

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

// Each wrapper builds its template from ../email_template and sends it.
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
  sendAppointmentConfirmation
};
