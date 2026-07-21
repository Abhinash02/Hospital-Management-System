import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
    if (!user) return '/login';
    if (user.role === 'superadmin') return '/superadmin';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-medical-blue rounded flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="font-bold text-2xl tracking-tight text-medical-dark">
                MEDPARK <span className="text-red-500 text-sm align-top ml-1">✚</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center font-medium text-sm text-gray-700">
            <NavLink
              to="/"
              className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/excellence"
              className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
            >
              Centre of Excellence
            </NavLink>
            <NavLink
              to="/doctors"
              className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
            >
              Doctors
            </NavLink>
            <NavLink
              to="/hospitals"
              className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
            >
              Hospitals
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `transition-colors ${isActive ? 'text-medical-blue font-semibold' : 'hover:text-medical-blue'}`}
            >
              Contact
            </NavLink>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <span className="text-gray-700 font-semibold hidden lg:inline-block">
                  Hello, {user.name}
                </span>
                <Link to={getDashboardLink()} className="text-medical-blue hover:text-medical-dark transition-colors font-semibold">
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
                className="ml-4 inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-dark hover:bg-medical-blue transition-colors"
              >
                Login / Register →
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-medical-light text-medical-dark shadow-sm hover:border-medical-blue hover:text-medical-blue transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Home</Link>
              <Link to="/excellence" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Centre of Excellence</Link>
              <Link to="/doctors" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Doctors</Link>
              <Link to="/hospitals" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-medical-blue hover:bg-gray-50">Hospitals</Link>
              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition ${isActive ? 'text-medical-blue bg-gray-100' : 'text-gray-700 hover:text-medical-blue hover:bg-gray-50'}`}
              >
                Contact
              </NavLink>
              
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-medical-blue hover:bg-gray-50">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-medical-dark hover:bg-medical-blue"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
