// import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { Menu, X } from 'lucide-react';
// import toast from 'react-hot-toast';
// import medicalLogo from '../assets/sign.png';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const checkAuth = () => {
//       const userData = localStorage.getItem('user');
//       if (userData) {
//         setUser(JSON.parse(userData));
//       } else {
//         setUser(null);
//       }
//     };
//     checkAuth();
//     window.addEventListener('storage', checkAuth);
//     return () => window.removeEventListener('storage', checkAuth);
//   }, []);

//   useEffect(() => {
//     if (isOpen) setIsOpen(false);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.success('Logged out successfully');
//     navigate('/');
//   };

//   const getDashboardLink = () => {
//     if (!user) return '/login';
//     if (user.role === 'superadmin') return '/superadmin';
//     if (user.role === 'admin') return '/admin';
//     return '/dashboard';
//   };

//   const isDashboardRoute = () => {
//     if (!user) return false;
//     if (user.role === 'superadmin') return location.pathname.startsWith('/superadmin');
//     if (user.role === 'admin') return location.pathname.startsWith('/admin');
//     return location.pathname.startsWith('/dashboard');
//   };

//   const getRoleLinks = () => {
//     if (!user) return [];
//     if (user.role === 'superadmin') {
//       return [
//         { name: 'Dashboard', to: '/superadmin' },
//         { name: 'Manage Admin', to: '/superadmin/manage-admin' },
//         { name: 'Manage Hospitals', to: '/superadmin/manage-hospitals' },
//         { name: 'Appointments', to: '/superadmin/appointments' }
//       ];
//     }
//     if (user.role === 'admin') {
//       return [
//         { name: 'Dashboard', to: '/admin' },
//         { name: 'Manage Hospitals', to: '/admin/manage-hospitals' },
//         { name: 'Appointments', to: '/admin/appointments' }
//       ];
//     }
//     return [
//       { name: 'Dashboard', to: '/dashboard' },
//       { name: 'Book Appointment', to: '/dashboard/book-appointment' },
//       { name: 'My Appointments', to: '/dashboard/my-appointments' }
//     ];
//   };

//   const dashboardLinks = getRoleLinks();
//   const showDashboardNav = user && isDashboardRoute();

//   return (
//     <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo Section */}
//          <div className="flex-shrink-0 flex items-center gap-2">
//   <Link to="/" className="flex items-center gap-3">
//     <img
//       src={medicalLogo}
//       alt="Medpark logo"
//       className="h-11 w-auto object-contain"
//     />
//     <span className="font-bold text-2xl tracking-tight text-medical-dark">
//       MEDPARK <span className="text-red-500 text-sm align-top ml-1">✚</span>
//     </span>
//   </Link>
// </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-6 items-center font-medium text-sm text-gray-700">
//             {!showDashboardNav && (
//               <>
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
//                 >
//                   Home
//                 </NavLink>
//                 <NavLink
//                   to="/excellence"
//                   className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
//                 >
//                   Centre of Excellence
//                 </NavLink>
//                 <NavLink
//                   to="/doctors"
//                   className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
//                 >
//                   Doctors
//                 </NavLink>
//                 <NavLink
//                   to="/hospitals"
//                   className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
//                 >
//                   Hospitals
//                 </NavLink>
//                 <NavLink
//                   to="/contact"
//                   className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
//                 >
//                   Contact
//                 </NavLink>
//               </>
//             )}

//             {showDashboardNav ? (
//               <>
//                 {dashboardLinks.map((link) => (
//                   <NavLink
//                     key={link.name}
//                     to={link.to}
//                     className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
//                   >
//                     {link.name}
//                   </NavLink>
//                 ))}
//                 <div className="flex items-center gap-3 ml-4">
//                   <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-medical-blue text-white font-semibold uppercase">
//                     {user.name?.charAt(0)}
//                   </div>
//                   <div className="hidden lg:flex flex-col text-sm text-gray-700">
//                     <span className="font-semibold">{user.name}</span>
//                     <span className="text-gray-500 capitalize">{user.role}</span>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="inline-flex items-center justify-center px-4 py-2 border border-medical-dark rounded-md shadow-sm text-sm font-medium text-medical-dark hover:bg-medical-dark hover:text-white transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </>
//             ) : user ? (
//               <div className="flex items-center gap-3 ml-4">
//                 <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-medical-blue text-white font-semibold uppercase">
//                   {user.name?.charAt(0)}
//                 </div>
//                 <div className="hidden lg:flex flex-col text-sm text-gray-700">
//                   <span className="font-semibold">{user.name}</span>
//                   <span className="text-gray-500 capitalize">{user.role}</span>
//                 </div>
//                 <Link to={getDashboardLink()} className="text-medical-blue hover:text-medical-dark transition-colors font-semibold">
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="inline-flex items-center justify-center px-4 py-2 border border-medical-dark rounded-md shadow-sm text-sm font-medium text-medical-dark hover:bg-medical-dark hover:text-white transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="ml-4 inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-dark hover:bg-medical-blue transition-colors"
//               >
//                 Login / Register →
//               </Link>
//             )}
//           </nav>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               aria-label="Toggle navigation"
//               className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-medical-light text-medical-dark shadow-sm hover:border-medical-blue hover:text-medical-blue transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
//           >
//             <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
//               <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Home</Link>
//               <Link to="/excellence" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Centre of Excellence</Link>
//               <Link to="/doctors" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Doctors</Link>
//               <Link to="/hospitals" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Hospitals</Link>
//               <NavLink
//                 to="/contact"
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition ${isActive ? 'text-medical-blue bg-gray-100' : 'text-gray-700 hover:text-medical-blue hover:bg-gray-50'}`}
//               >
//                 Contact
//               </NavLink>

//               {user && isDashboardRoute() ? (
//                 <>
//                   {dashboardLinks.map((link) => (
//                     <Link
//                       key={link.name}
//                       to={link.to}
//                       onClick={() => setIsOpen(false)}
//                       className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50"
//                     >
//                       {link.name}
//                     </Link>
//                   ))}
//                   <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
//                 </>
//               ) : user ? (
//                 <>
//                   <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-medical-blue hover:bg-gray-50">Dashboard</Link>
//                   <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
//                 </>
//               ) : (
//                 <Link
//                   to="/login"
//                   onClick={() => setIsOpen(false)}
//                   className="mt-4 block w-full text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-medical-dark hover:bg-medical-blue"
//                 >
//                   Login / Register
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }


import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import medicalLogo from '../assets/sign.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'superadmin') return '/superadmin';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  const isDashboardRoute = () => {
    if (!user) return false;
    if (user.role === 'superadmin') return location.pathname.startsWith('/superadmin');
    if (user.role === 'admin') return location.pathname.startsWith('/admin');
    return location.pathname.startsWith('/dashboard');
  };

  const getRoleLinks = () => {
    if (!user) return [];

    if (user.role === 'superadmin') {
      return [
        { name: 'Overview', to: '/superadmin' },
        { name: 'Demo Bookings', to: '/superadmin/demos' },
        { name: 'Manage Admin', to: '/superadmin/manage-admin' },
        { name: 'Manage Hospitals', to: '/superadmin/manage-hospitals' },
        { name: 'Appointments', to: '/superadmin/appointments' }
      ];
    }

   if (user.role === 'admin') {
  return [
    { name: 'Overview', to: '/admin' },
    { name: 'Appointments', to: '/admin/appointments' },
    { name: 'Timings', to: '/admin/timings' },
    { name: 'Feedback', to: '/admin/feedback' },
    { name: 'Transcriptions', to: '/admin/transcriptions' }
  ];
}

    return [
      { name: 'Overview', to: '/dashboard' },
      { name: 'Book Appointment', to: '/dashboard/book-appointment' },
      { name: 'My Appointments', to: '/dashboard/my-appointments' }
    ];
  };

  const dashboardLinks = getRoleLinks();
  const showDashboardNav = !!user && isDashboardRoute();
  const logoRedirect = user ? getDashboardLink() : '/';

  // Single-page portal: every public link scrolls to a section on the home page.
  const publicLinks = [
    { name: 'Features', id: 'features' },
    { name: 'Specialties', id: 'specialties' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'About', id: 'about' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Book Appointment', route: '/appointment' },
    { name: 'Book a Demo', id: 'book-demo', cta: true }
  ];

  const handleNav = (link) => {
    setIsOpen(false);
    if (link.route) { navigate(link.route); return; }
    if (location.pathname === '/') {
      const el = document.getElementById(link.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `/#${link.id}`);
      }
    } else {
      navigate(`/#${link.id}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-3">
          <div className="flex-shrink-0 flex items-center min-w-0">
            <Link to={logoRedirect} className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                src={medicalLogo}
                alt="Medpark logo"
                className="h-9 sm:h-11 w-auto object-contain shrink-0"
              />
              <span className="font-bold text-lg sm:text-2xl tracking-tight text-medical-dark truncate">
                MEDPARK
                <span className="text-red-500 text-xs sm:text-sm align-top ml-1">✚</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-5 lg:gap-6 font-medium text-sm text-gray-700">
            {!showDashboardNav &&
              publicLinks.map((link) =>
                link.cta ? (
                  <button
                    key={link.name}
                    onClick={() => handleNav(link)}
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-medical-blue hover:bg-medical-dark transition-colors whitespace-nowrap"
                  >
                    {link.name}
                  </button>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNav(link)}
                    className="transition-colors hover:text-medical-blue cursor-pointer"
                  >
                    {link.name}
                  </button>
                )
              )}

            {showDashboardNav ? (
              <>
                <div className="flex items-center gap-4 lg:gap-5">
                  {dashboardLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.to}
                      className={({ isActive }) =>
                        `transition-colors whitespace-nowrap ${
                          isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center gap-3 ml-2 lg:ml-4 pl-3 lg:pl-4 border-l border-gray-200">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-medical-blue text-white font-semibold uppercase shrink-0">
                    {user?.name?.charAt(0) || 'U'}
                  </div>

                  <div className="hidden xl:flex flex-col text-sm text-gray-700 leading-tight">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-gray-500 capitalize">{user?.role}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center px-4 py-2 border border-medical-dark rounded-md shadow-sm text-sm font-medium text-medical-dark hover:bg-medical-dark hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : user ? (
              <div className="flex items-center gap-3 ml-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-medical-blue text-white font-semibold uppercase shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>

                <div className="hidden lg:flex flex-col text-sm text-gray-700 leading-tight">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-gray-500 capitalize">{user?.role}</span>
                </div>

                <Link
                  to={getDashboardLink()}
                  className="text-medical-blue hover:text-medical-dark transition-colors font-semibold whitespace-nowrap"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-medical-dark rounded-md shadow-sm text-sm font-medium text-medical-dark hover:bg-medical-dark hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 inline-flex items-center justify-center px-5 lg:px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-dark hover:bg-medical-blue transition-colors whitespace-nowrap"
              >
                Login →
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-gray-200 bg-medical-light text-medical-dark shadow-sm hover:border-medical-blue hover:text-medical-blue transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2 flex flex-col">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 mb-2">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-medical-blue text-white font-semibold uppercase shrink-0">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-medical-dark truncate">{user?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>

                  {showDashboardNav ? (
                    <>
                      {dashboardLinks.map((link) => (
                        <NavLink
                          key={link.name}
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-3 rounded-md text-base font-medium transition ${
                              isActive
                                ? 'text-medical-blue bg-blue-50'
                                : 'text-gray-700 hover:text-medical-blue hover:bg-gray-50'
                            }`
                          }
                        >
                          {link.name}
                        </NavLink>
                      ))}

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to={getDashboardLink()}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-3 py-3 rounded-md text-base font-medium transition ${
                            isActive
                              ? 'text-medical-blue bg-blue-50'
                              : 'text-medical-blue hover:bg-gray-50'
                          }`
                        }
                      >
                        Dashboard
                      </NavLink>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {publicLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNav(link)}
                      className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition ${
                        link.cta
                          ? 'text-white bg-medical-blue hover:bg-medical-dark'
                          : 'text-gray-700 hover:text-medical-blue hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}

                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 block w-full text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-medical-dark hover:bg-medical-blue transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}