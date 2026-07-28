// // Email templates. Each builder returns { subject, html }; emailService.js sends them.
// const { shell, button, detailRows, fmtWhen } = require('./layout');

// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// // 1. Right after the demo form is submitted.
// const demoReceived = ({ contactName, hospitalName }) => ({
//   subject: '🐾 We received your demo request',
//   html: shell({
//     heading: 'Your demo request is in! 🎉',
//     intro: `Hi ${contactName || 'there'}, thanks for your interest in the Pet Hospital Portal.`,
//     bodyHtml: `
//       <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
//         We've received your request for <strong>${hospitalName || 'your hospital'}</strong>.
//         Our team will review it and email you a link to pick a date & time for your live demo shortly.
//       </p>
//       ${detailRows([['Hospital', hospitalName], ['Contact', contactName], ['Status', 'Awaiting scheduling']])}
//       <p style="margin:0;color:#475569;font-size:15px;">We can't wait to show you around! 🐶🐱</p>`,
//     footNote: 'You requested a demo of the Pet Hospital Portal.'
//   })
// });

// // 2. Superadmin invites the prospect to choose a slot.
// const scheduleInvite = ({ contactName, hospitalName, token }) => ({
//   subject: '📅 Pick a time for your Pet Hospital Portal demo',
//   html: shell({
//     heading: 'Choose your demo time',
//     intro: `Hi ${contactName || 'there'}, we're ready for your demo of ${hospitalName || 'your hospital'}!`,
//     bodyHtml: `
//       <p style="margin:0 0 4px;color:#475569;font-size:15px;line-height:1.6;">
//         Click below to see available slots and pick the one that works best for you.
//       </p>
//       ${button(`${FRONTEND_URL}/schedule/${token}`, 'Select a date & time')}
//       <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">This link is unique to you — please don't share it.</p>`,
//     footNote: 'You requested a demo of the Pet Hospital Portal.'
//   })
// });

// // 3. After the prospect books a slot.
// const demoConfirmation = ({ contactName, hospitalName, scheduledAt, meetingLink }) => {
//   const when = fmtWhen(scheduledAt);
//   return {
//     subject: '✅ Your demo is confirmed',
//     html: shell({
//       heading: 'Demo confirmed! 🎉',
//       intro: `Hi ${contactName || 'there'}, your demo for ${hospitalName || 'your hospital'} is locked in.`,
//       bodyHtml: `
//         ${detailRows([['When', when || 'To be confirmed'], ['Hospital', hospitalName]])}
//         ${meetingLink ? `<p style="margin:0 0 2px;color:#475569;font-size:15px;">Join the meeting at the scheduled time:</p>${button(meetingLink, 'Join the demo')}` : ''}
//         <p style="margin:16px 0 0;color:#475569;font-size:15px;">See you soon! 🐾</p>`,
//       footNote: 'You scheduled a demo of the Pet Hospital Portal.'
//     })
//   };
// };

// // 3b. Superadmin adds/updates the meeting link (e.g. a Google Meet URL).
// const meetingLinkReady = ({ contactName, hospitalName, scheduledAt, meetingLink }) => {
//   const when = fmtWhen(scheduledAt);
//   return {
//     subject: '🔗 Your demo meeting link is ready',
//     html: shell({
//       heading: 'Your meeting link is ready',
//       intro: `Hi ${contactName || 'there'}, here's the link to join your demo for ${hospitalName || 'your hospital'}.`,
//       bodyHtml: `
//         ${detailRows([['When', when || 'Scheduled']])}
//         ${button(meetingLink, 'Join the meeting')}
//         <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">Save this email — click the button above at your scheduled time.</p>`,
//       footNote: 'You scheduled a demo of the Pet Hospital Portal.'
//     })
//   };
// };

// // 4. Right after the superadmin marks the demo completed.
// const feedbackRequest = ({ contactName, token }) => ({
//   subject: '⭐ How was your demo? Share your feedback',
//   html: shell({
//     heading: 'Tell us how it went',
//     intro: `Hi ${contactName || 'there'}, thanks for attending your demo!`,
//     bodyHtml: `
//       <p style="margin:0 0 4px;color:#475569;font-size:15px;line-height:1.6;">
//         We'd love your quick feedback — it takes under a minute, and if you're ready,
//         you can start onboarding right from the form.
//       </p>
//       ${button(`${FRONTEND_URL}/feedback/${token}`, 'Share your feedback')}
//       <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">This link is unique to you — please don't share it.</p>`,
//     footNote: 'You attended a demo of the Pet Hospital Portal.'
//   })
// });

// // 5. After a registration is submitted (post-payment).
// const registrationReceived = ({ contactName, hospitalName }) => ({
//   subject: '📝 Registration received — pending approval',
//   html: shell({
//     heading: 'Registration received',
//     intro: `Hi ${contactName || 'there'}, thanks for registering ${hospitalName || 'your hospital'}!`,
//     bodyHtml: `
//       <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
//         Your details are now with our team for approval. We'll email you as soon as your
//         account is activated.
//       </p>
//       ${detailRows([['Hospital', hospitalName], ['Contact', contactName], ['Status', 'Pending approval']])}`,
//     footNote: 'You registered for the Pet Hospital Portal.'
//   })
// });

// // 6. Superadmin approves → admin account created.
// const registrationApproved = ({ contactName, hospitalName, loginEmail, tempPassword }) => ({
//   subject: '🎉 Your Pet Hospital Portal account is ready',
//   html: shell({
//     heading: 'You’re approved! 🎉',
//     intro: `Hi ${contactName || 'there'}, ${hospitalName || 'your hospital'} is approved and ready to go.`,
//     bodyHtml: `
//       <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
//         Use the credentials below to log in and finish setting up your hospital.
//       </p>
//       ${detailRows([['Login email', loginEmail], ['Password', tempPassword]])}
//       ${button(`${FRONTEND_URL}/login`, 'Log in to your portal')}
//       <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">Please change your password after your first login.</p>`,
//     footNote: 'Your Pet Hospital Portal registration was approved.'
//   })
// });

// // Public appointment booking confirmation.
// const appointmentConfirmation = ({ patientName, hospitalName, date, time }) => ({
//   subject: '🐾 Your appointment request is received',
//   html: shell({
//     heading: 'Appointment request received',
//     intro: `Hi ${patientName || 'there'}, thanks for booking with ${hospitalName || 'us'}!`,
//     bodyHtml: `
//       <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
//         We've received your appointment request. The hospital will review and confirm it shortly.
//       </p>
//       ${detailRows([
//         ['Hospital', hospitalName],
//         ['Date', date || 'To be confirmed'],
//         ['Time', time || 'To be confirmed'],
//         ['Patient', patientName],
//         ['Status', 'Pending confirmation']
//       ])}
//       <p style="margin:0;color:#475569;font-size:15px;">See you soon! 🐶🐱</p>`,
//     footNote: 'You booked an appointment via the Pet Hospital Portal.'
//   })
// });

// // Password reset — 4-digit OTP.
// const passwordResetOtp = ({ contactName, otp }) => ({
//   subject: '🔐 Your password reset code',
//   html: shell({
//     heading: 'Reset your password',
//     intro: `Hi ${contactName || 'there'}, use the code below to reset your password.`,
//     bodyHtml: `
//       <div style="margin:18px 0;text-align:center;">
//         <div style="display:inline-block;background:#f1f5f9;border:2px dashed #0f4c81;border-radius:14px;padding:16px 34px;font-size:34px;font-weight:800;letter-spacing:10px;color:#0f172a;">${otp}</div>
//       </div>
//       <p style="margin:0;color:#475569;font-size:14px;">This code expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>`,
//     footNote: 'Password reset requested for your Pet Hospital Portal account.'
//   })
// });

// // 7. Superadmin denies the registration.
// const registrationDenied = ({ contactName, hospitalName }) => ({
//   subject: 'Update on your Pet Hospital Portal registration',
//   html: shell({
//     heading: 'Registration update',
//     intro: `Hi ${contactName || 'there'},`,
//     bodyHtml: `<p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
//       After review, we're unable to approve the registration for
//       <strong>${hospitalName || 'your hospital'}</strong> at this time.
//       If you think this was a mistake, just reply to this email and we'll take another look.</p>`,
//     footNote: 'You registered for the Pet Hospital Portal.'
//   })
// });

// module.exports = {
//   demoReceived,
//   scheduleInvite,
//   demoConfirmation,
//   meetingLinkReady,
//   feedbackRequest,
//   registrationReceived,
//   registrationApproved,
//   registrationDenied,
//   passwordResetOtp,
//   appointmentConfirmation
// };




// Email templates. Each builder returns { subject, html }; emailService.js sends them.
const { shell, button, detailRows, fmtWhen } = require('./layout');

// ✅ Use FRONTEND_REDIRECT_URL (single URL) instead of FRONTEND_URL (comma-separated)
const FRONTEND_REDIRECT_URL =
  process.env.FRONTEND_REDIRECT_URL ||
  process.env.FRONTEND_URL?.split(',')[0]?.trim() ||
  'https://hospital-management-sigma-six.vercel.app';

// 1. Right after the demo form is submitted.
const demoReceived = ({ contactName, hospitalName }) => ({
  subject: '🐾 We received your demo request',
  html: shell({
    heading: 'Your demo request is in! 🎉',
    intro: `Hi ${contactName || 'there'}, thanks for your interest in the Pet Hospital Portal.`,
    bodyHtml: `
      <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
        We've received your request for <strong>${hospitalName || 'your hospital'}</strong>.
        Our team will review it and email you a link to pick a date & time for your live demo shortly.
      </p>
      ${detailRows([['Hospital', hospitalName], ['Contact', contactName], ['Status', 'Awaiting scheduling']])}
      <p style="margin:0;color:#475569;font-size:15px;">We can't wait to show you around! 🐶🐱</p>`,
    footNote: 'You requested a demo of the Pet Hospital Portal.'
  })
});

// 2. Superadmin invites the prospect to choose a slot.
const scheduleInvite = ({ contactName, hospitalName, token }) => ({
  subject: '📅 Pick a time for your Pet Hospital Portal demo',
  html: shell({
    heading: 'Choose your demo time',
    intro: `Hi ${contactName || 'there'}, we're ready for your demo of ${hospitalName || 'your hospital'}!`,
    bodyHtml: `
      <p style="margin:0 0 4px;color:#475569;font-size:15px;line-height:1.6;">
        Click below to see available slots and pick the one that works best for you.
      </p>
      ${button(`${FRONTEND_REDIRECT_URL}/schedule/${token}`, 'Select a date & time')}
      <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">This link is unique to you — please don't share it.</p>`,
    footNote: 'You requested a demo of the Pet Hospital Portal.'
  })
});

// 3. After the prospect books a slot.
const demoConfirmation = ({ contactName, hospitalName, scheduledAt, meetingLink }) => {
  const when = fmtWhen(scheduledAt);
  return {
    subject: '✅ Your demo is confirmed',
    html: shell({
      heading: 'Demo confirmed! 🎉',
      intro: `Hi ${contactName || 'there'}, your demo for ${hospitalName || 'your hospital'} is locked in.`,
      bodyHtml: `
        ${detailRows([['When', when || 'To be confirmed'], ['Hospital', hospitalName]])}
        ${meetingLink ? `<p style="margin:0 0 2px;color:#475569;font-size:15px;">Join the meeting at the scheduled time:</p>${button(meetingLink, 'Join the demo')}` : ''}
        <p style="margin:16px 0 0;color:#475569;font-size:15px;">See you soon! 🐾</p>`,
      footNote: 'You scheduled a demo of the Pet Hospital Portal.'
    })
  };
};

// 3b. Superadmin adds/updates the meeting link (e.g. a Google Meet URL).
const meetingLinkReady = ({ contactName, hospitalName, scheduledAt, meetingLink }) => {
  const when = fmtWhen(scheduledAt);
  return {
    subject: '🔗 Your demo meeting link is ready',
    html: shell({
      heading: 'Your meeting link is ready',
      intro: `Hi ${contactName || 'there'}, here's the link to join your demo for ${hospitalName || 'your hospital'}.`,
      bodyHtml: `
        ${detailRows([['When', when || 'Scheduled']])}
        ${button(meetingLink, 'Join the meeting')}
        <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">Save this email — click the button above at your scheduled time.</p>`,
      footNote: 'You scheduled a demo of the Pet Hospital Portal.'
    })
  };
};

// 4. Right after the superadmin marks the demo completed.
const feedbackRequest = ({ contactName, token }) => ({
  subject: '⭐ How was your demo? Share your feedback',
  html: shell({
    heading: 'Tell us how it went',
    intro: `Hi ${contactName || 'there'}, thanks for attending your demo!`,
    bodyHtml: `
      <p style="margin:0 0 4px;color:#475569;font-size:15px;line-height:1.6;">
        We'd love your quick feedback — it takes under a minute, and if you're ready,
        you can start onboarding right from the form.
      </p>
      ${button(`${FRONTEND_REDIRECT_URL}/feedback/${token}`, 'Share your feedback')}
      <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">This link is unique to you — please don't share it.</p>`,
    footNote: 'You attended a demo of the Pet Hospital Portal.'
  })
});

// 5. After a registration is submitted (post-payment).
const registrationReceived = ({ contactName, hospitalName }) => ({
  subject: '📝 Registration received — pending approval',
  html: shell({
    heading: 'Registration received',
    intro: `Hi ${contactName || 'there'}, thanks for registering ${hospitalName || 'your hospital'}!`,
    bodyHtml: `
      <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
        Your details are now with our team for approval. We'll email you as soon as your
        account is activated.
      </p>
      ${detailRows([['Hospital', hospitalName], ['Contact', contactName], ['Status', 'Pending approval']])}`,
    footNote: 'You registered for the Pet Hospital Portal.'
  })
});

// 6. Superadmin approves → admin account created.
const registrationApproved = ({ contactName, hospitalName, loginEmail, tempPassword }) => ({
  subject: '🎉 Your Pet Hospital Portal account is ready',
  html: shell({
    heading: 'You’re approved! 🎉',
    intro: `Hi ${contactName || 'there'}, ${hospitalName || 'your hospital'} is approved and ready to go.`,
    bodyHtml: `
      <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
        Use the credentials below to log in and finish setting up your hospital.
      </p>
      ${detailRows([['Login email', loginEmail], ['Password', tempPassword]])}
      ${button(`${FRONTEND_REDIRECT_URL}/login`, 'Log in to your portal')}
      <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">Please change your password after your first login.</p>`,
    footNote: 'Your Pet Hospital Portal registration was approved.'
  })
});

// Public appointment booking confirmation.
const appointmentConfirmation = ({ patientName, hospitalName, date, time }) => ({
  subject: '🐾 Your appointment request is received',
  html: shell({
    heading: 'Appointment request received',
    intro: `Hi ${patientName || 'there'}, thanks for booking with ${hospitalName || 'us'}!`,
    bodyHtml: `
      <p style="margin:0 0 6px;color:#475569;font-size:15px;line-height:1.6;">
        We've received your appointment request. The hospital will review and confirm it shortly.
      </p>
      ${detailRows([
        ['Hospital', hospitalName],
        ['Date', date || 'To be confirmed'],
        ['Time', time || 'To be confirmed'],
        ['Patient', patientName],
        ['Status', 'Pending confirmation']
      ])}
      <p style="margin:0;color:#475569;font-size:15px;">See you soon! 🐶🐱</p>`,
    footNote: 'You booked an appointment via the Pet Hospital Portal.'
  })
});

// Password reset — 4-digit OTP.
const passwordResetOtp = ({ contactName, otp }) => ({
  subject: '🔐 Your password reset code',
  html: shell({
    heading: 'Reset your password',
    intro: `Hi ${contactName || 'there'}, use the code below to reset your password.`,
    bodyHtml: `
      <div style="margin:18px 0;text-align:center;">
        <div style="display:inline-block;background:#f1f5f9;border:2px dashed #0f4c81;border-radius:14px;padding:16px 34px;font-size:34px;font-weight:800;letter-spacing:10px;color:#0f172a;">${otp}</div>
      </div>
      <p style="margin:0;color:#475569;font-size:14px;">This code expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>`,
    footNote: 'Password reset requested for your Pet Hospital Portal account.'
  })
});

// 7. Superadmin denies the registration.
const registrationDenied = ({ contactName, hospitalName }) => ({
  subject: 'Update on your Pet Hospital Portal registration',
  html: shell({
    heading: 'Registration update',
    intro: `Hi ${contactName || 'there'},`,
    bodyHtml: `<p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
      After review, we're unable to approve the registration for
      <strong>${hospitalName || 'your hospital'}</strong> at this time.
      If you think this was a mistake, just reply to this email and we'll take another look.</p>`,
    footNote: 'You registered for the Pet Hospital Portal.'
  })
});

module.exports = {
  demoReceived,
  scheduleInvite,
  demoConfirmation,
  meetingLinkReady,
  feedbackRequest,
  registrationReceived,
  registrationApproved,
  registrationDenied,
  passwordResetOtp,
  appointmentConfirmation
};