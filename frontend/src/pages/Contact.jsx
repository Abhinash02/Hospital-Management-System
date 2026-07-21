import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const galleryImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80'
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % galleryImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const validation = {};
    if (!form.name.trim()) validation.name = 'Name is required';
    if (!form.email.trim()) validation.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) validation.email = 'Enter a valid email address';
    if (!form.message.trim()) validation.message = 'Message is required';
    if (form.phone && form.phone.trim().length < 7) validation.phone = 'Enter a valid phone number';
    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit contact form');
      }

      toast.success(data.message || 'Message sent successfully');
      setForm({ name: '', email: '', subject: '', phone: '', message: '' });
      setErrors({});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.35em] text-medical-blue font-semibold mb-3">Contact Us</p>
        <h1 className="text-3xl md:text-3xl font-extrabold text-medical-dark">Need help? Get in touch with our team.</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Share your appointment request, feedback, or support question and we’ll respond quickly.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid gap-8 lg:grid-cols-2 items-stretch"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-medical-blue via-sky-500 to-indigo-600 shadow-2xl"
        >
          <motion.img
            key={currentImage}
            src={galleryImages[currentImage]}
            alt="Medical team"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-full w-full object-cover"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/10 to-transparent"
          />

          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: [ -60, 0, -30, 0 ], opacity: [0, 1, 0.9, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 left-8 flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur"
          >
            <div className="w-20 h-20 rounded-3xl overflow-hidden border border-white/25">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0qZ5SBNme-CEXa98sRkMA4NSTfjAxJNIV1ioipmjx9w&s=10"
                alt="Doctor review"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">Dedicated to care</p>
              <p className="text-sm font-semibold leading-snug">Saving lives with every patient.</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute right-6 bottom-10 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-xl"
          >
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
            Live support available
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 px-8 pb-8 text-white">
            {/* <div className="w-full overflow-hidden rounded-3xl border border-white/20 bg-black/30 backdrop-blur-md">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-56 object-cover"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
              />
            </div> */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-center shadow-2xl backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-100 font-semibold">Patient stories</p>
              <p className="text-base font-semibold leading-snug">See our team in action, ensuring every patient gets fast and compassionate care.</p>
            </div>
          </div>

          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 py-10 text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200 font-semibold mb-4">Contact Support</p>
            <h2 className="text-3xl font-bold leading-tight mb-4">Fast support for every patient.</h2>
            <p className="max-w-md text-gray-100/90 leading-relaxed">Our team is ready to assist with appointments, hospital questions, and medical guidance. Send a message and we will connect with you quickly.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-3xl border px-4 py-3 text-gray-700 outline-none transition ${errors.name ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20'}`}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-3 w-full rounded-3xl border px-4 py-3 text-gray-700 outline-none transition ${errors.email ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20'}`}
                  placeholder="Your email"
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20"
                placeholder="Subject"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`mt-3 w-full rounded-3xl border px-4 py-3 text-gray-700 outline-none transition ${errors.phone ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20'}`}
                placeholder="Phone number"
              />
              {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                className={`mt-3 w-full rounded-3xl border px-4 py-3 text-gray-700 outline-none transition ${errors.message ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20'}`}
                placeholder="Tell us how we can assist you"
              />
              {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-3xl bg-medical-dark px-8 py-3 text-sm font-semibold text-white transition hover:bg-medical-blue disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
