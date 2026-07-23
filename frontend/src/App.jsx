import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading route components for optimal speed and bundle splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminManageHospitals = lazy(() => import('./pages/admin/AdminManageHospitals'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminTimings = lazy(() => import('./pages/admin/AdminTimings'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
const AdminCalls = lazy(() => import('./pages/admin/AdminCalls'));
const AdminTranscriptions = lazy(() => import('./pages/admin/AdminTranscriptions'));
const SuperAdminManageAdmin = lazy(() => import('./pages/SuperAdminManageAdmin'));
const SuperAdminManageHospitals = lazy(() => import('./pages/SuperAdminManageHospitals'));
const SuperAdminAppointments = lazy(() => import('./pages/SuperAdminAppointments'));
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
      <Toaster 
        position="top-right" 
        containerStyle={{ marginTop: '3rem' }}
        toastOptions={{
          duration: 2000,
          style: {
            padding: '10px 10px',
            borderRadius: '12px',
            fontSize: '14px',
            maxWidth: '260px',
            width: 'auto',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }
        }}
      >
        {(t) => (
          <div
            className={`inline-flex items-center justify-between gap-3 max-w-[260px] bg-white text-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.icon}
              <span className="text-sm font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-5 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer shrink-0"
              title="Close notification"
            >
              ✕
            </button>
          </div>
        )}
      </Toaster>
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
              <Route path="/superadmin/manage-hospitals" element={<SuperAdminManageHospitals />} />
              <Route path="/superadmin/appointments" element={<SuperAdminAppointments />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="manage-hospitals" element={<AdminManageHospitals />} />
                <Route path="timings" element={<AdminTimings />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="calls" element={<AdminCalls />} />
                <Route path="transcriptions" element={<AdminTranscriptions />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
