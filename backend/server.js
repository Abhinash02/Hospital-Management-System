// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const hospitalRoutes = require('./routes/hospitalRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const contactRoutes = require('./routes/contactRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/hospitals', hospitalRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/contacts', contactRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const callRoutes = require('./routes/callRoutes');
const demoRoutes = require('./routes/demoRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const demoFeedbackRoutes = require('./routes/demoFeedbackRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// FRONTEND_URL may be a comma-separated list (e.g. local + deployed). Requests with no
// Origin header (curl, server-to-server, some mobile webviews) are allowed too.
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));

// Stripe webhook needs the RAW body for signature verification, so it must be
// registered BEFORE express.json() (which would otherwise consume the body).
const { webhook: stripeWebhook } = require('./controllers/paymentController');
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/demos', demoRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/feedback', demoFeedbackRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});