import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Building2, Mail, Calendar, Clock, MessageSquare, PawPrint,
  ArrowRight, Loader2, CheckCircle2, Stethoscope
} from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config/api';
import PortalCardPage from '../../components/portal/PortalCardPage';

const initial = { patientName: '', patientPhone: '', hospitalId: '', email: '', date: '', time: '', petName: '', description: '' };

export default function BookAppointmentPage() {
  const [form, setForm] = useState(initial);
  const [hospitals, setHospitals] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/hospitals`);
        const data = await res.json();
        setHospitals(Array.isArray(data) ? data : data.hospitals || []);
      } catch { /* ignore */ }
    })();
  }, []);

  const update = (k) => (e) => {
    const v = k === 'patientPhone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name is required';
    if (!form.patientPhone.trim()) e.patientPhone = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.patientPhone.trim())) e.patientPhone = 'Enter a valid 10-digit mobile number';
    if (!form.hospitalId) e.hospitalId = 'Please select a hospital';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error('Please fix the highlighted fields');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/appointments/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Could not book appointment');
      setDone(true);
      toast.success('Appointment booked! 🐾');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    const hospitalName = hospitals.find((h) => String(h.id) === String(form.hospitalId))?.name;
    return (
      <PortalCardPage>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h1 className="text-2xl font-extrabold text-medical-dark">Appointment booked! 🎉</h1>
          <p className="text-gray-600 mt-3">
            Thanks, {form.patientName}! Your request for <strong>{hospitalName}</strong> has been sent.
            The hospital will confirm your appointment shortly.
          </p>
          <button onClick={() => { setForm(initial); setDone(false); }} className="btn btn-primary btn-md mt-8">
            Book another appointment
          </button>
        </motion.div>
      </PortalCardPage>
    );
  }

  return (
    <PortalCardPage
      icon={Stethoscope}
      title="Book an Appointment"
      subtitle="Fill in the details and the hospital you choose will confirm your visit."
      wide
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field icon={User} label="Patient / Pet owner name *" error={errors.patientName}>
            <input value={form.patientName} onChange={update('patientName')} className="portal-input" placeholder="John Doe" />
          </Field>
          <Field icon={Phone} label="Mobile number (10-digit) *" error={errors.patientPhone}>
            <input value={form.patientPhone} onChange={update('patientPhone')} inputMode="numeric" maxLength={10} className="portal-input" placeholder="9876543210" />
          </Field>

          <Field icon={Building2} label="Select hospital *" error={errors.hospitalId}>
            <select value={form.hospitalId} onChange={update('hospitalId')} className="portal-input">
              <option value="">— Choose a hospital —</option>
              {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}{h.location ? ` — ${h.location}` : ''}</option>)}
            </select>
          </Field>
          <Field icon={PawPrint} label="Pet name">
            <input value={form.petName} onChange={update('petName')} className="portal-input" placeholder="Bruno" />
          </Field>

          <Field icon={Mail} label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={update('email')} className="portal-input" placeholder="you@example.com" />
          </Field>
          <Field icon={Calendar} label="Preferred date">
            <input type="date" value={form.date} onChange={update('date')} className="portal-input" />
          </Field>
          <Field icon={Clock} label="Preferred time">
            <input type="time" value={form.time} onChange={update('time')} className="portal-input" />
          </Field>
        </div>

        <Field icon={MessageSquare} label="Reason / description">
          <textarea value={form.description} onChange={update('description')} rows={3} className="portal-input resize-none" placeholder="Describe the reason for the visit…" />
        </Field>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
          {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Booking…</>) : (<>Book appointment <ArrowRight className="w-4 h-4" /></>)}
        </button>
        <p className="text-center text-xs text-gray-400">Only the hospital you select will see this appointment.</p>
      </form>
    </PortalCardPage>
  );
}

function Field({ icon: Icon, label, error, children }) {
  return (
    <label className="block">
      <span className="portal-label"><Icon className="w-4 h-4 text-medical-blue" /> {label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
