const crypto = require('crypto');
const { supabase, isConfigured } = require('../config/supabase');
const {
  sendDemoReceived,
  sendScheduleInvite,
  sendMeetingLink,
  sendFeedbackRequest
} = require('../services/emailService');

const TABLE = 'demo_bookings';
const VALID_STATUS = ['requested', 'invited', 'scheduled', 'completed', 'cancelled'];

const token = () => crypto.randomBytes(24).toString('hex');

const notConfigured = (res) =>
  res.status(503).json({
    message: 'Demo storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  });

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

// POST /api/demos  (public) — create a demo booking from the marketing-site form
const createBooking = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);

  const { hospitalName, contactName, email, phone, city, message } = req.body || {};

  if (!hospitalName || !contactName || !email) {
    return res.status(400).json({ message: 'hospitalName, contactName and email are required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }
  if (phone && !/^\d{10}$/.test(String(phone).trim())) {
    return res.status(400).json({ message: 'Phone must be a valid 10-digit mobile number' });
  }

  const row = {
    hospital_name: String(hospitalName).trim(),
    contact_name: String(contactName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    city: city ? String(city).trim() : null,
    message: message ? String(message).trim() : null,
    status: 'requested'
  };

  const { data, error } = await supabase.from(TABLE).insert(row).select().single();
  if (error) {
    console.error('[demos] create error:', error);
    return res.status(500).json({ message: 'Could not create booking' });
  }

  // "We received your request" email (fire-and-forget).
  sendDemoReceived({ to: data.email, contactName: data.contact_name, hospitalName: data.hospital_name })
    .catch((e) => console.error('[demos] received email failed:', e));

  return res.status(201).json({ message: 'Demo requested', booking: data });
};

// GET /api/demos  (superadmin) — list bookings + summary counts
const listBookings = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);

  const { status } = req.query;
  let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (status && VALID_STATUS.includes(status)) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) {
    console.error('[demos] list error:', error);
    return res.status(500).json({ message: 'Could not load bookings' });
  }

  const counts = data.reduce(
    (acc, b) => {
      acc.total += 1;
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { total: 0, requested: 0, invited: 0, scheduled: 0, completed: 0, cancelled: 0 }
  );

  return res.json({ bookings: data, counts });
};

// POST /api/demos/:id/invite  (superadmin) — email the prospect a link to pick a time
const inviteToSchedule = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);
  const { id } = req.params;

  const { data: booking, error: findErr } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (findErr || !booking) return res.status(404).json({ message: 'Booking not found' });

  const schedule_token = booking.schedule_token || token();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ schedule_token, status: booking.status === 'completed' ? booking.status : 'invited', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[demos] invite error:', error);
    return res.status(500).json({ message: 'Could not send scheduling invite' });
  }

  sendScheduleInvite({ to: data.email, contactName: data.contact_name, hospitalName: data.hospital_name, token: schedule_token })
    .catch((e) => console.error('[demos] invite email failed:', e));

  return res.json({ message: 'Scheduling invite sent', booking: data });
};

// PATCH /api/demos/:id  (superadmin) — reschedule / edit meeting link / change status
const updateBooking = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);

  const { id } = req.params;
  const { status, scheduledAt, meetingLink } = req.body || {};

  const update = { updated_at: new Date().toISOString() };
  if (status !== undefined) {
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: `status must be one of ${VALID_STATUS.join(', ')}` });
    }
    update.status = status;
  }
  if (scheduledAt !== undefined) update.scheduled_at = scheduledAt || null;
  if (meetingLink !== undefined) update.meeting_link = meetingLink || null;

  const { data, error } = await supabase.from(TABLE).update(update).eq('id', id).select().single();

  if (error) {
    // 23505 = unique_violation (double-booked slot)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'That time is already booked. Choose another slot.' });
    }
    console.error('[demos] update error:', error);
    return res.status(500).json({ message: 'Could not update booking' });
  }
  if (!data) return res.status(404).json({ message: 'Booking not found' });

  // If a meeting link was just set on a scheduled booking, email the prospect the join link.
  if (meetingLink && String(meetingLink).trim() && data.status === 'scheduled') {
    sendMeetingLink({
      to: data.email,
      contactName: data.contact_name,
      hospitalName: data.hospital_name,
      scheduledAt: data.scheduled_at,
      meetingLink: data.meeting_link
    }).catch((e) => console.error('[demos] meeting-link email failed:', e));
  }

  return res.json({ message: 'Booking updated', booking: data });
};

// POST /api/demos/:id/complete  (superadmin) — mark completed + send feedback email
const completeBooking = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);
  const { id } = req.params;

  const { data: booking, error: findErr } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (findErr || !booking) return res.status(404).json({ message: 'Booking not found' });

  const feedback_token = booking.feedback_token || token();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status: 'completed', feedback_token, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[demos] complete error:', error);
    return res.status(500).json({ message: 'Could not complete booking' });
  }

  // Immediately request feedback.
  sendFeedbackRequest({ to: data.email, contactName: data.contact_name, token: feedback_token })
    .catch((e) => console.error('[demos] feedback email failed:', e));

  return res.json({ message: 'Booking marked completed — feedback email sent', booking: data });
};

// DELETE /api/demos/:id  (superadmin)
const deleteBooking = async (req, res) => {
  if (!isConfigured()) return notConfigured(res);
  const { id } = req.params;
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    console.error('[demos] delete error:', error);
    return res.status(500).json({ message: 'Could not delete booking' });
  }
  return res.json({ message: 'Booking deleted' });
};

module.exports = {
  createBooking,
  listBookings,
  inviteToSchedule,
  updateBooking,
  completeBooking,
  deleteBooking
};
