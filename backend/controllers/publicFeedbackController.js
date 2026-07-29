// backend/controllers/publicFeedbackController.js
const { supabase } = require('../config/supabase');

const submitPublicFeedback = async (req, res) => {
  const { hospitalId, rating, message, patientName, appointmentDate, petName } = req.body;

  if (!hospitalId || !rating || !message) {
    return res.status(400).json({ message: 'hospitalId, rating and message are required' });
  }

  try {
    const row = {
      id: Date.now().toString(),
      hospital_id: hospitalId,
      rating: Number(rating),
      message: message.trim(),
      patient_name: patientName || 'Anonymous',
      appointment_date: appointmentDate || null,
      pet_name: petName || null,
      created_at: new Date().toISOString()
    };

    // Use a separate table for public feedback
    const { data, error } = await supabase.from('public_feedbacks').insert(row).select().single();
    if (error) throw error;

    return res.status(201).json({
      message: 'Feedback submitted successfully!',
      feedback: data
    });
  } catch (error) {
    console.error('[public feedback] error:', error);
    return res.status(500).json({ message: 'Could not submit feedback' });
  }
};

module.exports = { submitPublicFeedback };