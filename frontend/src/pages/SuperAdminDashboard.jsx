import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        navigate('/');
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-medical-dark mb-4">Super Admin Dashboard</h1>
      {user && <p className="text-xl text-gray-700">Welcome back, {user.name}!</p>}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-medical-blue mb-4">System Overview</h2>
        <p className="text-gray-600 mb-4">From here you can manage hospitals, admins, and system settings.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
           <div className="bg-medical-light p-6 rounded-lg text-center border border-blue-100">
             <h3 className="font-bold text-xl text-medical-dark mb-2">Total Hospitals</h3>
             <p className="text-3xl font-extrabold text-medical-blue">12</p>
           </div>
           <div className="bg-medical-light p-6 rounded-lg text-center border border-blue-100">
             <h3 className="font-bold text-xl text-medical-dark mb-2">Total Admins</h3>
             <p className="text-3xl font-extrabold text-medical-blue">8</p>
           </div>
           <div className="bg-medical-light p-6 rounded-lg text-center border border-blue-100">
             <h3 className="font-bold text-xl text-medical-dark mb-2">Total Patients</h3>
             <p className="text-3xl font-extrabold text-medical-blue">1,204</p>
           </div>
        </div>
      </div>
    </div>
  );
}
