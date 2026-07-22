import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardTabs from '../components/DashboardTabs';

export default function UserBookAppointment() {
  const [user, setUser] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ hospitalId: '', date: '', time: '', patientName: '', patientPhone: '', reason: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchHospitals();
      fetchAppointments(localStorage.getItem('token'));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hospitals`);
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      toast.error('Failed to load hospitals.');
    }
  };

  const fetchAppointments = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      toast.error('Failed to load appointments.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hospitalId || !formData.date || !formData.time || !formData.patientName || !formData.patientPhone) {
      return toast.error('Please fill all required fields');
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setAppointments([...appointments, data.appointment]);
        setFormData({ hospitalId: '', date: '', time: '', patientName: '', patientPhone: '', reason: '' });
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <DashboardLayout title="User Dashboard" subtitle="Book appointments, view your schedule, and stay connected with care." user={user} showHeader={false}>
      <DashboardTabs role="user" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Select Hospital <span className="text-red-500">*</span></label>
              <select
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
              >
                <option value="">-- Choose Hospital --</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>{h.name} - {h.location}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Date <span className="text-red-500">*</span></label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Time <span className="text-red-500">*</span></label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Patient Name <span className="text-red-500">*</span></label>
              <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="patientPhone" value={formData.patientPhone} onChange={handleChange} required placeholder="123-456-7890" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Reason for Visit</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Briefly describe your symptoms..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"></textarea>
            </div>

            <button type="submit" className="w-full bg-medical-blue text-white font-bold py-3 rounded-lg hover:bg-medical-dark transition-colors mt-4 shadow-md">
              Confirm Booking
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold text-medical-dark mb-6 border-b pb-2">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 italic text-center py-10">No appointments booked yet.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-medical-dark">{app.patientName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Date:</span> {app.date} at {app.time}</p>
                  <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Doctor:</span> {app.doctorName}</p>
                  {app.reason && <p className="text-gray-500 text-sm mt-2 italic">"{app.reason}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
