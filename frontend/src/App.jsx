// import { lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster, toast } from 'react-hot-toast';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // Lazy loading route components for optimal speed and bundle splitting
// const Home = lazy(() => import('./pages/Home'));
// const PortalHome = lazy(() => import('./pages/portal/PortalHome'));
// const SchedulePage = lazy(() => import('./pages/portal/SchedulePage'));
// const FeedbackPage = lazy(() => import('./pages/portal/FeedbackPage'));
// const RegisterPage = lazy(() => import('./pages/portal/RegisterPage'));
// const BookAppointmentPage = lazy(() => import('./pages/portal/BookAppointmentPage'));
// const SuperAdminDemos = lazy(() => import('./pages/superadmin/SuperAdminDemos'));
// const SuperAdminRegistrations = lazy(() => import('./pages/superadmin/SuperAdminRegistrations'));
// const SuperAdminUsers = lazy(() => import('./pages/superadmin/SuperAdminUsers'));
// const Login = lazy(() => import('./pages/Login'));
// const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
// const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
// const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
// const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
// const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
// const AdminTimings = lazy(() => import('./pages/admin/AdminTimings'));
// const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
// const AdminTranscriptions = lazy(() => import('./pages/admin/AdminTranscriptions'));
// const SuperAdminManageAdmin = lazy(() => import('./pages/superadmin/SuperAdminManageAdmin'));
// const SuperAdminManageHospitals = lazy(() => import('./pages/superadmin/SuperAdminManageHospitals'));
// const SuperAdminAppointments = lazy(() => import('./pages/superadmin/SuperAdminAppointments'));
// const UserBookAppointment = lazy(() => import('./pages/user/UserBookAppointment'));
// const UserMyAppointments = lazy(() => import('./pages/user/UserMyAppointments'));
// const CentreOfExcellence = lazy(() => import('./pages/CentreOfExcellence'));
// const Contact = lazy(() => import('./pages/Contact'));
// const Doctors = lazy(() => import('./pages/Doctors'));
// const Hospitals = lazy(() => import('./pages/Hospitals'));

// const PageLoader = () => (
//   <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
//     <div className="flex flex-col items-center space-y-4">
//       <div className="w-10 h-10 border-4 border-medical-blue border-t-transparent rounded-full animate-spin"></div>
//       <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Loading Medpark Care...</p>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <Toaster 
//         position="top-right" 
//         containerStyle={{ marginTop: '3rem' }}
//         toastOptions={{
//           duration: 2000,
//           style: {
//             padding: '10px 10px',
//             borderRadius: '12px',
//             fontSize: '14px',
//             maxWidth: '260px',
//             width: 'auto',
//             whiteSpace: 'normal',
//             wordBreak: 'break-word'
//           }
//         }}
//       >
//         {(t) => (
//           <div
//             className={`inline-flex items-center justify-between gap-3 max-w-[260px] bg-white text-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 ${
//               t.visible ? 'animate-enter' : 'animate-leave'
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               {t.icon}
//               <span className="text-sm font-medium">{t.message}</span>
//             </div>
//             <button
//               onClick={() => toast.dismiss(t.id)}
//               className="w-5 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer shrink-0"
//               title="Close notification"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </Toaster>
//       <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
//         <Navbar />
//         <main className="flex-grow">
//           <Suspense fallback={<PageLoader />}>
//             <Routes>
//               {/* Pet Hospital Portal — single-page marketing + demo funnel.
//                   Every public section lives on the home page; old paths redirect to its hash. */}
//               <Route path="/" element={<PortalHome />} />
//               <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
//               <Route path="/about" element={<Navigate to="/#about" replace />} />
//               <Route path="/book-demo" element={<Navigate to="/#book-demo" replace />} />
//               {/* Public funnel: emailed links */}
//               <Route path="/appointment" element={<BookAppointmentPage />} />
//               <Route path="/schedule/:token" element={<SchedulePage />} />
//               <Route path="/feedback/:token" element={<FeedbackPage />} />
//               <Route path="/register/:token" element={<RegisterPage />} />
//               {/* Existing Medpark HMS home preserved */}
//               <Route path="/medpark" element={<Home />} />
//               <Route path="/excellence" element={<CentreOfExcellence />} />
//               <Route path="/doctors" element={<Doctors />} />
//               <Route path="/hospitals" element={<Hospitals />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/dashboard" element={<UserDashboard />} />
//               <Route path="/book-appointment" element={<UserBookAppointment />} />
//               <Route path="/dashboard/book-appointment" element={<UserBookAppointment />} />
//               <Route path="/dashboard/my-appointments" element={<UserMyAppointments />} />
//               <Route path="/superadmin" element={<SuperAdminDashboard />} />
//               <Route path="/superadmin/manage-admin" element={<SuperAdminManageAdmin />} />
//               <Route path="/superadmin/manage-hospitals" element={<SuperAdminManageHospitals />} />
//               <Route path="/superadmin/appointments" element={<SuperAdminAppointments />} />
//               <Route path="/superadmin/demos" element={<SuperAdminDemos />} />
//               <Route path="/superadmin/registrations" element={<SuperAdminRegistrations />} />
//               <Route path="/superadmin/users" element={<SuperAdminUsers />} />
//               <Route path="/admin" element={<AdminLayout />}>
//                 <Route index element={<AdminOverview />} />
//                 <Route path="appointments" element={<AdminAppointments />} />
//                 <Route path="timings" element={<AdminTimings />} />
//                  <Route path="appointment-feedback" element={<AdminAppointmentFeedback />} />

//                 <Route path="transcriptions" element={<AdminTranscriptions />} />
//               </Route>
//             </Routes>
//           </Suspense>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;




// import { lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster, toast } from 'react-hot-toast';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // Lazy loading route components
// const Home = lazy(() => import('./pages/Home'));
// const PortalHome = lazy(() => import('./pages/portal/PortalHome'));
// const SchedulePage = lazy(() => import('./pages/portal/SchedulePage'));
// const FeedbackPage = lazy(() => import('./pages/portal/FeedbackPage'));
// const RegisterPage = lazy(() => import('./pages/portal/RegisterPage'));
// const BookAppointmentPage = lazy(() => import('./pages/portal/BookAppointmentPage'));
// const SuperAdminDemos = lazy(() => import('./pages/superadmin/SuperAdminDemos'));
// const SuperAdminRegistrations = lazy(() => import('./pages/superadmin/SuperAdminRegistrations'));
// const SuperAdminUsers = lazy(() => import('./pages/superadmin/SuperAdminUsers'));
// const Login = lazy(() => import('./pages/Login'));
// const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
// const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
// const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
// const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
// const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointmentFeedback'));
// const AdminTimings = lazy(() => import('./pages/admin/AdminTimings'));
// const AdminTranscriptions = lazy(() => import('./pages/admin/AdminTranscriptions'));
// const SuperAdminManageAdmin = lazy(() => import('./pages/superadmin/SuperAdminManageAdmin'));
// const SuperAdminManageHospitals = lazy(() => import('./pages/superadmin/SuperAdminManageHospitals'));
// const SuperAdminAppointments = lazy(() => import('./pages/superadmin/SuperAdminAppointments'));
// const UserBookAppointment = lazy(() => import('./pages/user/UserBookAppointment'));
// const UserMyAppointments = lazy(() => import('./pages/user/UserMyAppointments'));
// const CentreOfExcellence = lazy(() => import('./pages/CentreOfExcellence'));
// const Contact = lazy(() => import('./pages/Contact'));
// const Doctors = lazy(() => import('./pages/Doctors'));
// const Hospitals = lazy(() => import('./pages/Hospitals'));

// // ✅ Import for the new appointment feedback page
// const AdminAppointmentFeedback = lazy(() => import('./pages/admin/AdminAppointmentFeedback'));

// const PageLoader = () => (
//   <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
//     <div className="flex flex-col items-center space-y-4">
//       <div className="w-10 h-10 border-4 border-medical-blue border-t-transparent rounded-full animate-spin"></div>
//       <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Loading Medpark Care...</p>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <Toaster
//         position="top-right"
//         containerStyle={{ marginTop: '3rem' }}
//         toastOptions={{
//           duration: 2000,
//           style: {
//             padding: '10px 10px',
//             borderRadius: '12px',
//             fontSize: '14px',
//             maxWidth: '260px',
//             width: 'auto',
//             whiteSpace: 'normal',
//             wordBreak: 'break-word'
//           }
//         }}
//       >
//         {(t) => (
//           <div
//             className={`inline-flex items-center justify-between gap-3 max-w-[260px] bg-white text-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 ${
//               t.visible ? 'animate-enter' : 'animate-leave'
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               {t.icon}
//               <span className="text-sm font-medium">{t.message}</span>
//             </div>
//             <button
//               onClick={() => toast.dismiss(t.id)}
//               className="w-5 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer shrink-0"
//               title="Close notification"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </Toaster>
//       <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
//         <Navbar />
//         <main className="flex-grow">
//           <Suspense fallback={<PageLoader />}>
//             <Routes>
//               {/* Public / marketing routes */}
//               <Route path="/" element={<PortalHome />} />
//               <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
//               <Route path="/about" element={<Navigate to="/#about" replace />} />
//               <Route path="/book-demo" element={<Navigate to="/#book-demo" replace />} />
//               <Route path="/appointment" element={<BookAppointmentPage />} />
//               <Route path="/schedule/:token" element={<SchedulePage />} />
//               <Route path="/feedback/:token" element={<FeedbackPage />} />
//               <Route path="/register/:token" element={<RegisterPage />} />
//               <Route path="/medpark" element={<Home />} />
//               <Route path="/excellence" element={<CentreOfExcellence />} />
//               <Route path="/doctors" element={<Doctors />} />
//               <Route path="/hospitals" element={<Hospitals />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/login" element={<Login />} />

//               {/* User dashboard */}
//               <Route path="/dashboard" element={<UserDashboard />} />
//               <Route path="/book-appointment" element={<UserBookAppointment />} />
//               <Route path="/dashboard/book-appointment" element={<UserBookAppointment />} />
//               <Route path="/dashboard/my-appointments" element={<UserMyAppointments />} />

//               {/* Superadmin routes */}
//               <Route path="/superadmin" element={<SuperAdminDashboard />} />
//               <Route path="/superadmin/manage-admin" element={<SuperAdminManageAdmin />} />
//               <Route path="/superadmin/manage-hospitals" element={<SuperAdminManageHospitals />} />
//               <Route path="/superadmin/appointments" element={<SuperAdminAppointments />} />
//               <Route path="/superadmin/demos" element={<SuperAdminDemos />} />
//               <Route path="/superadmin/registrations" element={<SuperAdminRegistrations />} />
//               <Route path="/superadmin/users" element={<SuperAdminUsers />} />

//               {/* Admin routes (nested layout) */}
//               <Route path="/admin" element={<AdminLayout />}>
//                 <Route index element={<AdminOverview />} />
//                 <Route path="appointments" element={<AdminAppointments />} />
//                 <Route path="timings" element={<AdminTimings />} />
//                 {/* New appointment feedback page */}
//               <Route path="appointment-feedback" element={<AdminAppointmentFeedback />} /> 
//                 <Route path="transcriptions" element={<AdminTranscriptions />} />
//               </Route>
//             </Routes>
//           </Suspense>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;


import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const PortalHome = lazy(() => import('./pages/portal/PortalHome'));
const SchedulePage = lazy(() => import('./pages/portal/SchedulePage'));
const FeedbackPage = lazy(() => import('./pages/portal/FeedbackPage'));
const RegisterPage = lazy(() => import('./pages/portal/RegisterPage'));
const BookAppointmentPage = lazy(() => import('./pages/portal/BookAppointmentPage'));
const SuperAdminDemos = lazy(() => import('./pages/superadmin/SuperAdminDemos'));
const SuperAdminRegistrations = lazy(() => import('./pages/superadmin/SuperAdminRegistrations'));
const SuperAdminUsers = lazy(() => import('./pages/superadmin/SuperAdminUsers'));
const Login = lazy(() => import('./pages/Login'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointmentFeedback'));
const AdminTimings = lazy(() => import('./pages/admin/AdminTimings'));
const AdminTranscriptions = lazy(() => import('./pages/admin/AdminTranscriptions'));
const SuperAdminManageAdmin = lazy(() => import('./pages/superadmin/SuperAdminManageAdmin'));
const SuperAdminManageHospitals = lazy(() => import('./pages/superadmin/SuperAdminManageHospitals'));
const SuperAdminAppointments = lazy(() => import('./pages/superadmin/SuperAdminAppointments'));
const UserBookAppointment = lazy(() => import('./pages/user/UserBookAppointment'));
const UserMyAppointments = lazy(() => import('./pages/user/UserMyAppointments'));
const CentreOfExcellence = lazy(() => import('./pages/CentreOfExcellence'));
const Contact = lazy(() => import('./pages/Contact'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Hospitals = lazy(() => import('./pages/Hospitals'));
const AdminAppointmentFeedback = lazy(() => import('./pages/admin/AdminAppointmentFeedback'));
const PricingPage = lazy(() => import('./pages/stripe/PricingPage'));

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
              <Route path="/" element={<PortalHome />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route path="/book-demo" element={<Navigate to="/#book-demo" replace />} />
              <Route path="/appointment" element={<BookAppointmentPage />} />
              <Route path="/schedule/:token" element={<SchedulePage />} />
              <Route path="/feedback/:token" element={<FeedbackPage />} />
              <Route path="/register/:token" element={<RegisterPage />} />
              <Route path="/medpark" element={<Home />} />
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
              <Route path="/superadmin/demos" element={<SuperAdminDemos />} />
              <Route path="/superadmin/registrations" element={<SuperAdminRegistrations />} />
              <Route path="/superadmin/users" element={<SuperAdminUsers />} />
              <Route path="/pricing" element={<PricingPage />} />


              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="timings" element={<AdminTimings />} />
                <Route path="appointment-feedback" element={<AdminAppointmentFeedback />} />
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