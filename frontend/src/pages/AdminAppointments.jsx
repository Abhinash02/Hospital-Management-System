import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardTabs from '../components/DashboardTabs';

const appointmentStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/');
      } else {
        setUser(parsedUser);
        loadAppointments();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      } else {
        toast.error(data.message || 'Unable to load appointments');
      }
    } catch (err) {
      toast.error('Unable to load appointments.');
    }
  };

  const changeAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || 'Unable to update appointment');
      }
      setAppointments((prev) => prev.map((appointment) => appointment.id === id ? data.appointment || data : appointment));
      toast.success('Appointment status updated');
    } catch (err) {
      toast.error('Unable to update appointment status.');
    }
  };

  return (
    <DashboardLayout title="Hospital Admin Dashboard" subtitle="Manage hospitals and appointments in one place." user={user} showHeader={false}>
      <DashboardTabs role="admin" />
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4 mb-6">
          <button
            type="button"
            onClick={loadAppointments}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-sm transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Patient</th>
                <th className="py-3 px-4 font-semibold">Hospital</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Update</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-medical-dark">{appointment.patientName}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.hospitalId}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.date}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.time}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                      appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={appointment.status}
                      onChange={(e) => changeAppointmentStatus(appointment.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-full bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-medical-blue"
                    >
                      {appointmentStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 italic">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
