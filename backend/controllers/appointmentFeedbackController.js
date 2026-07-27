// const { supabase } = require('../config/supabase');

// const T = 'feedbacks';

// const submitFeedback = async (req, res) => {
//   const { hospitalId, rating, message } = req.body;
//   if (!hospitalId || !rating || !message) return res.status(400).json({ message: 'hospitalId, rating and message are required' });
//   const row = { id: Date.now().toString(), userId: req.user.id, userName: req.user.name || 'User', hospitalId, rating: Number(rating), message, status: 'Published' };
//   const { data, error } = await supabase.from(T).insert(row).select().single();
//   if (error) return res.status(500).json({ message: 'Could not submit feedback' });
//   return res.status(201).json({ message: 'Feedback submitted successfully', feedback: data });
// };

// const getFeedbacks = async (req, res) => {
//   let q = supabase.from(T).select('*').order('createdAt', { ascending: false });
//   if (req.user.role === 'admin') q = q.eq('hospitalId', req.user.hospitalId);
//   else if (req.user.role !== 'superadmin') q = q.eq('userId', req.user.id);
//   const { data, error } = await q;
//   if (error) return res.status(500).json({ message: 'Could not load feedback' });
//   return res.json(data || []);
// };

// const createFeedbackByAdmin = async (req, res) => {
//   const { customerName, rating, message } = req.body || {};
//   if (!rating || !message) return res.status(400).json({ message: 'Rating and message are required' });
//   const row = { id: Date.now().toString(), userId: null, userName: customerName || 'Customer', hospitalId: req.user.hospitalId, rating: Number(rating), message, status: 'Published' };
//   const { data, error } = await supabase.from(T).insert(row).select().single();
//   if (error) return res.status(500).json({ message: 'Could not add feedback' });
//   return res.status(201).json({ message: 'Feedback added', feedback: data });
// };

// const updateFeedback = async (req, res) => {
//   const { id } = req.params;
//   const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
//   const f = arr && arr[0];
//   if (!f) return res.status(404).json({ message: 'Feedback not found' });
//   if (req.user.role === 'admin' && String(f.hospitalId) !== String(req.user.hospitalId)) return res.status(403).json({ message: 'Forbidden' });

//   const { customerName, rating, message, status } = req.body || {};
//   const patch = { updatedAt: new Date().toISOString() };
//   if (customerName !== undefined) patch.userName = customerName;
//   if (rating !== undefined) patch.rating = Number(rating);
//   if (message !== undefined) patch.message = message;
//   if (status !== undefined) patch.status = status;
//   const { data } = await supabase.from(T).update(patch).eq('id', id).select().single();
//   return res.json({ message: 'Feedback updated', feedback: data });
// };

// const deleteFeedback = async (req, res) => {
//   const { id } = req.params;
//   const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
//   const f = arr && arr[0];
//   if (!f) return res.status(404).json({ message: 'Feedback not found' });
//   if (req.user.role === 'admin' && String(f.hospitalId) !== String(req.user.hospitalId)) return res.status(403).json({ message: 'Forbidden' });
//   await supabase.from(T).delete().eq('id', id);
//   return res.json({ message: 'Feedback deleted' });
// };

// module.exports = { submitFeedback, getFeedbacks, createFeedbackByAdmin, updateFeedback, deleteFeedback };


const { supabase } = require('../config/supabase');

const TABLE = 'appointment_feedbacks';

const submitFeedback = async (req, res) => {
  const {
    hospitalId, rating, message,
    patientName, appointmentDate, petName   // new optional fields
  } = req.body;

  if (!hospitalId || !rating || !message) {
    return res.status(400).json({ message: 'hospitalId, rating and message are required' });
  }

  const row = {
    id: Date.now().toString(),
    userId: req.user?.id || null,
    userName: patientName || req.user?.name || 'Anonymous',   // use provided name or fallback
    hospitalId,
    rating: Number(rating),
    message,
    status: 'Published',
    // store extra fields in a details column (JSON) or separate columns – here we use a details object
    details: {
      appointmentDate: appointmentDate || null,
      petName: petName || null
    }
  };

  const { data, error } = await supabase.from('feedbacks').insert(row).select().single();
  if (error) {
    console.error('[feedback] submit error:', error);
    return res.status(500).json({ message: 'Could not submit feedback' });
  }
  return res.status(201).json({ message: 'Feedback submitted successfully', feedback: data });
};

// GET all (admin sees own hospital, superadmin sees all)
const getFeedbacks = async (req, res) => {
  try {
    let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false });
    if (req.user.role === 'admin') {
      query = query.eq('hospitalId', req.user.hospitalId);
    }
    const { data, error } = await query;
    if (error) {
      console.error('[appt feedback] list error:', error);
      return res.status(500).json({ message: 'Could not load feedbacks' });
    }
    return res.json(data || []);
  } catch (err) {
    console.error('[appt feedback] unexpected error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST (admin only)
const createFeedback = async (req, res) => {
  try {
    const {
      patientName, petName, appointmentType, date, time,
      feedbackStatus, feedbackGiven, callAttempted, callPicked, feedbackText
    } = req.body;

    if (!patientName || !date) {
      return res.status(400).json({ message: 'Patient name and date are required' });
    }

    const row = {
      patientName,
      petName: petName || '',
      appointmentType: appointmentType || 'Consult',
      date,
      time: time || '',
      feedbackStatus: feedbackStatus || 'Pending',
      feedbackGiven: feedbackGiven || false,
      callAttempted: callAttempted || false,
      callPicked: callPicked || false,
      feedbackText: feedbackText || '',
      hospitalId: req.user.hospitalId || null,
      createdBy: req.user.id
    };

    const { data, error } = await supabase.from(TABLE).insert(row).select().single();
    if (error) {
      console.error('[appt feedback] create error:', error);
      return res.status(500).json({ message: 'Could not create feedback' });
    }
    return res.status(201).json(data);
  } catch (err) {
    console.error('[appt feedback] create unexpected error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT (admin can edit own, superadmin can edit any)
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      'patientName', 'petName', 'appointmentType', 'date', 'time',
      'feedbackStatus', 'feedbackGiven', 'callAttempted', 'callPicked', 'feedbackText'
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Ownership check for admin
    if (req.user.role === 'admin') {
      const { data: existing } = await supabase.from(TABLE).select('hospitalId').eq('id', id).single();
      if (existing && String(existing.hospitalId) !== String(req.user.hospitalId)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
    if (error) {
      console.error('[appt feedback] update error:', error);
      return res.status(500).json({ message: 'Update failed' });
    }
    return res.json(data);
  } catch (err) {
    console.error('[appt feedback] update unexpected error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE (superadmin only)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can delete' });
    }
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) {
      console.error('[appt feedback] delete error:', error);
      return res.status(500).json({ message: 'Delete failed' });
    }
    return res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error('[appt feedback] delete unexpected error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFeedbacks, createFeedback, updateFeedback, deleteFeedback };