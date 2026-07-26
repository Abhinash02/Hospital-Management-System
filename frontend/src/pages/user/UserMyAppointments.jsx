import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardTabs from '../../components/DashboardTabs';

export default function UserMyAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchAppointments(localStorage.getItem('token'));
    } else {
      navigate('/login');
    }
  }, [navigate]);

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

  return (
    <DashboardLayout title="User Dashboard" subtitle="Book appointments, view your schedule, and stay connected with care." user={user} showHeader={false}>
      <DashboardTabs role="user" />
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
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
                <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Hospital:</span> {app.hospitalName}</p>
                {app.reason && <p className="text-gray-500 text-sm mt-2 italic">"{app.reason}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
