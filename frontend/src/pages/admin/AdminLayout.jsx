import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminLayout() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <DashboardLayout
      title={
        user?.role === 'admin'
          ? `Welcome ${user?.hospital || user?.name || ''} Admin`
          : 'Admin Dashboard'
      }
      subtitle="Manage appointments, timings, calls, transcriptions, and patient feedback."
      user={user}
    >
      <Outlet />
    </DashboardLayout>
  );
}