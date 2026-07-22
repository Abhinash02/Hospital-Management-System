import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading route components for optimal speed and bundle splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SuperAdminManageAdmin = lazy(() => import('./pages/SuperAdminManageAdmin'));
const SuperAdminAppointments = lazy(() => import('./pages/SuperAdminAppointments'));
const AdminManageHospitals = lazy(() => import('./pages/AdminManageHospitals'));
const AdminAppointments = lazy(() => import('./pages/AdminAppointments'));
const UserBookAppointment = lazy(() => import('./pages/UserBookAppointment'));
const UserMyAppointments = lazy(() => import('./pages/UserMyAppointments'));
const CentreOfExcellence = lazy(() => import('./pages/CentreOfExcellence'));
const Contact = lazy(() => import('./pages/Contact'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Hospitals = lazy(() => import('./pages/Hospitals'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-4 border-medical-blue border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Loading Medpark Care...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/excellence" element={<CentreOfExcellence />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/book-appointment" element={<UserBookAppointment />} />
              <Route path="/dashboard/book-appointment" element={<UserBookAppointment />} />
              <Route path="/dashboard/my-appointments" element={<UserMyAppointments />} />
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/manage-admin" element={<SuperAdminManageAdmin />} />
              <Route path="/superadmin/appointments" element={<SuperAdminAppointments />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/manage-hospitals" element={<AdminManageHospitals />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
