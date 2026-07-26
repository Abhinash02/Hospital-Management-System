import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminLayout() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const hospitalName = user?.hospital || user?.name || 'Your Hospital';

  return (
    <DashboardLayout
      title={user?.role === 'admin' ? `Welcome, ${hospitalName}` : 'Admin Dashboard'}
      subtitle="Manage appointments, timings, calls, transcriptions, and patient feedback."
      user={user}
    >
      {user?.role === 'admin' && (
        <div className="mb-6 flex items-center gap-3 bg-gradient-to-r from-medical-dark to-medical-blue text-white rounded-2xl px-5 sm:px-6 py-4 shadow-lg">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-blue-100 font-semibold">Hospital</p>
            <p className="text-lg sm:text-xl font-extrabold truncate">{hospitalName}</p>
          </div>
        </div>
      )}
      <Outlet />
    </DashboardLayout>
  );
}
