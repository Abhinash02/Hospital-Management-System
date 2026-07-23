// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Info, X, CalendarCheck } from 'lucide-react';
// import toast from 'react-hot-toast';
// import API_URL from '../config/api';

// export default function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showNoticeModal, setShowNoticeModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     password: ''
//   });
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'mobile') {
//       // Allow only numbers and limit max length to 10 digits
//       const cleaned = value.replace(/\D/g, '').slice(0, 10);
//       setFormData({ ...formData, mobile: cleaned });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password || (!isLogin && (!formData.name || !formData.mobile))) {
//       return toast.error('Please fill in all required fields');
//     }

//     if (!isLogin) {
//       // Mobile validation: exactly 10 digits
//       if (!/^\d{10}$/.test(formData.mobile)) {
//         return toast.error('Mobile number must be exactly 10 digits');
//       }
//     }

//     const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

//     try {
//       const res = await fetch(`${API_URL}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await res.json();
      
//       if (res.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         toast.success(isLogin ? 'Successfully logged in!' : 'Successfully registered!');
//         window.dispatchEvent(new Event('storage')); // Trigger Navbar update
        
//         if (data.user.role === 'superadmin') navigate('/superadmin');
//         else if (data.user.role === 'admin') navigate('/admin');
//         else navigate('/dashboard');
//       } else {
//         toast.error(data.message || 'Authentication failed');
//       }
//     } catch (err) {
//       toast.error('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="flex min-h-[calc(100vh-80px)] bg-white">
//       {/* Left Side - Image */}
//       <div className="hidden lg:flex w-1/2 bg-medical-dark relative overflow-hidden">
//         <div className="absolute inset-0 bg-medical-blue/40 mix-blend-multiply z-10"></div>
//         <img 
//           src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80" 
//           alt="Hospital hallway" 
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 z-20 flex flex-col justify-center px-16 text-white">
//           <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-md">
//             Welcome to <br/>Medpark Hospital
//           </h1>
//           <p className="text-xl max-w-md font-medium drop-shadow-md text-gray-100">
//             Providing world-class healthcare, advanced medical facilities, and compassionate care to our community.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
//         <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-extrabold text-medical-dark mb-2">
//               {isLogin ? 'Login to MediCare' : 'Create an Account'}
//             </h2>
//             <p className="text-gray-500 text-sm">
//               {isLogin ? 'Welcome back! Please enter your details.' : 'Join our healthcare portal today.'}
//             </p>
//           </div>
//           {/* Subtle Notice Trigger Pill */}
//           <div className="mb-6 flex justify-center">
//             <button
//               type="button"
//               onClick={() => setShowNoticeModal(true)}
//               className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-medical-blue text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
//             >
//               <Info className="w-3.5 h-3.5" />
//               <span>How booking works? Click for notice</span>
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
//                   <input 
//                     type="text" 
//                     name="name"
//                     value={formData.name} 
//                     onChange={handleChange} 
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
//                     placeholder="John Doe"
//                   />
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center mb-1">
//                     <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
//                     <span className="text-xs text-gray-400 font-medium">{formData.mobile.length}/10 digits</span>
//                   </div>
//                   <input 
//                     type="tel" 
//                     name="mobile"
//                     maxLength={10}
//                     value={formData.mobile} 
//                     onChange={handleChange} 
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
//                     placeholder="10-digit mobile number (e.g. 9876543210)"
//                   />
//                 </div>
//               </>
//             )}
            
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
//               <input 
//                 type="email" 
//                 name="email"
//                 value={formData.email} 
//                 onChange={handleChange} 
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
//                 placeholder="you@example.com"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
//               <input 
//                 type="password" 
//                 name="password"
//                 value={formData.password} 
//                 onChange={handleChange} 
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
//                 placeholder="••••••••"
//               />
//             </div>
            
//             <button 
//               type="submit" 
//               className="w-full bg-medical-blue hover:bg-medical-dark text-white font-bold py-3.5 rounded-lg shadow-md transition-colors mt-2 cursor-pointer"
//             >
//               {isLogin ? 'Sign In' : 'Register'}
//             </button>
//           </form>

//           <div className="mt-8 text-center text-sm text-gray-600 border-t pt-6">
//             {isLogin ? "Don't have an account? " : "Already have an account? "}
//             <button 
//               type="button"
//               onClick={() => setIsLogin(!isLogin)} 
//               className="font-bold text-medical-blue hover:text-medical-dark transition-colors focus:outline-none cursor-pointer"
//             >
//               {isLogin ? 'Register here' : 'Login here'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Patient Notice Modal Popup */}
//       <AnimatePresence>
//         {showNoticeModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//             onClick={() => setShowNoticeModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 10 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 10 }}
//               onClick={(e) => e.stopPropagation()}
//               className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
//             >
//               <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
//                 <div className="flex items-center gap-2.5">
//                   <div className="w-9 h-9 rounded-xl bg-blue-50 text-medical-blue flex items-center justify-center">
//                     <CalendarCheck className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg text-medical-dark">Appointment Booking Notice</h3>
//                     <p className="text-[11px] text-gray-500">Important guidelines for patients</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowNoticeModal(false)}
//                   className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="space-y-3.5 text-sm text-gray-600">
//                 <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
//                   <span className="w-6 h-6 rounded-full bg-blue-100 text-medical-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
//                   <div>
//                     <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Already Registered?</p>
//                     <p className="text-xs text-gray-600 mt-0.5">Please <span className="font-semibold text-medical-blue">Sign In</span> with your registered email and password to book your appointment instantly.</p>
//                   </div>
//                 </div>

//                 <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
//                   <span className="w-6 h-6 rounded-full bg-blue-100 text-medical-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
//                   <div>
//                     <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Not Registered Yet?</p>
//                     <p className="text-xs text-gray-600 mt-0.5">Click <span className="font-semibold text-medical-blue">Register here</span>, fill in your name, 10-digit mobile number, email, and password. Once created, sign in to book an appointment.</p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowNoticeModal(false)}
//                 className="mt-6 w-full py-3 rounded-xl bg-medical-blue hover:bg-medical-dark text-white font-bold text-sm transition shadow-md shadow-medical-blue/20 cursor-pointer"
//               >
//                 Got it, Continue
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobile') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, mobile: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && (!formData.name || !formData.mobile))) {
      return toast.error('Please fill in all required fields');
    }

    if (!isLogin && !/^\d{10}$/.test(formData.mobile)) {
      return toast.error('Mobile number must be exactly 10 digits');
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const rawText = await res.text();
      console.log('LOGIN STATUS:', res.status);
      console.log('LOGIN RAW RESPONSE:', rawText);

      let data = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseError) {
        throw new Error(`Server returned non-JSON response: ${rawText.slice(0, 200)}`);
      }

      if (!res.ok) {
        return toast.error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(isLogin ? 'Successfully logged in!' : 'Successfully registered!');
      window.dispatchEvent(new Event('storage'));

      if (data.user.role === 'superadmin') navigate('/superadmin');
      else if (data.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      toast.error(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-white">
      <div className="hidden lg:flex w-1/2 bg-medical-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-medical-blue/40 mix-blend-multiply z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80"
          alt="Hospital hallway"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-md">
            Welcome to <br />Medpark Hospital
          </h1>
          <p className="text-xl max-w-md font-medium drop-shadow-md text-gray-100">
            Providing world-class healthcare, advanced medical facilities, and compassionate care to our community.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-medical-dark mb-2">
              {isLogin ? 'Login to MediCare' : 'Create an Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Join our healthcare portal today.'}
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-medical-blue text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
            >
              <Info className="w-3.5 h-3.5" />
              <span>How booking works? Click for notice</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
                    <span className="text-xs text-gray-400 font-medium">{formData.mobile.length}/10 digits</span>
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-medical-blue hover:bg-medical-dark text-white font-bold py-3.5 rounded-lg shadow-md transition-colors mt-2 cursor-pointer"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 border-t pt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-medical-blue hover:text-medical-dark transition-colors focus:outline-none cursor-pointer"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNoticeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNoticeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-medical-blue flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-medical-dark">Appointment Booking Notice</h3>
                    <p className="text-[11px] text-gray-500">Important guidelines for patients</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-sm text-gray-600">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-medical-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Already Registered?</p>
                    <p className="text-xs text-gray-600 mt-0.5">Please <span className="font-semibold text-medical-blue">Sign In</span> with your registered email and password to book your appointment instantly.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-medical-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Not Registered Yet?</p>
                    <p className="text-xs text-gray-600 mt-0.5">Click <span className="font-semibold text-medical-blue">Register here</span>, fill in your name, 10-digit mobile number, email, and password. Once created, sign in to book an appointment.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowNoticeModal(false)}
                className="mt-6 w-full py-3 rounded-xl bg-medical-blue hover:bg-medical-dark text-white font-bold text-sm transition shadow-md shadow-medical-blue/20 cursor-pointer"
              >
                Got it, Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}