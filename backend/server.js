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



const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const callRoutes = require('./routes/callRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/calls', callRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});