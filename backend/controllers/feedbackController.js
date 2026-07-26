const { supabase } = require('../config/supabase');

const T = 'feedbacks';

const submitFeedback = async (req, res) => {
  const { hospitalId, rating, message } = req.body;
  if (!hospitalId || !rating || !message) return res.status(400).json({ message: 'hospitalId, rating and message are required' });
  const row = { id: Date.now().toString(), userId: req.user.id, userName: req.user.name || 'User', hospitalId, rating: Number(rating), message, status: 'Published' };
  const { data, error } = await supabase.from(T).insert(row).select().single();
  if (error) return res.status(500).json({ message: 'Could not submit feedback' });
  return res.status(201).json({ message: 'Feedback submitted successfully', feedback: data });
};

const getFeedbacks = async (req, res) => {
  let q = supabase.from(T).select('*').order('createdAt', { ascending: false });
  if (req.user.role === 'admin') q = q.eq('hospitalId', req.user.hospitalId);
  else if (req.user.role !== 'superadmin') q = q.eq('userId', req.user.id);
  const { data, error } = await q;
  if (error) return res.status(500).json({ message: 'Could not load feedback' });
  return res.json(data || []);
};

const createFeedbackByAdmin = async (req, res) => {
  const { customerName, rating, message } = req.body || {};
  if (!rating || !message) return res.status(400).json({ message: 'Rating and message are required' });
  const row = { id: Date.now().toString(), userId: null, userName: customerName || 'Customer', hospitalId: req.user.hospitalId, rating: Number(rating), message, status: 'Published' };
  const { data, error } = await supabase.from(T).insert(row).select().single();
  if (error) return res.status(500).json({ message: 'Could not add feedback' });
  return res.status(201).json({ message: 'Feedback added', feedback: data });
};

const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
  const f = arr && arr[0];
  if (!f) return res.status(404).json({ message: 'Feedback not found' });
  if (req.user.role === 'admin' && String(f.hospitalId) !== String(req.user.hospitalId)) return res.status(403).json({ message: 'Forbidden' });

  const { customerName, rating, message, status } = req.body || {};
  const patch = { updatedAt: new Date().toISOString() };
  if (customerName !== undefined) patch.userName = customerName;
  if (rating !== undefined) patch.rating = Number(rating);
  if (message !== undefined) patch.message = message;
  if (status !== undefined) patch.status = status;
  const { data } = await supabase.from(T).update(patch).eq('id', id).select().single();
  return res.json({ message: 'Feedback updated', feedback: data });
};

const deleteFeedback = async (req, res) => {
  const { id } = req.params;
  const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
  const f = arr && arr[0];
  if (!f) return res.status(404).json({ message: 'Feedback not found' });
  if (req.user.role === 'admin' && String(f.hospitalId) !== String(req.user.hospitalId)) return res.status(403).json({ message: 'Forbidden' });
  await supabase.from(T).delete().eq('id', id);
  return res.json({ message: 'Feedback deleted' });
};

module.exports = { submitFeedback, getFeedbacks, createFeedbackByAdmin, updateFeedback, deleteFeedback };
