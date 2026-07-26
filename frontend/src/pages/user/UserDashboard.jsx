// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import API_URL from '../../config/api';
// import { 
//   Calendar, 
//   Clock, 
//   Heart, 
//   Activity, 
//   FileText, 
//   PhoneCall, 
//   Plus, 
//   Search, 
//   CheckCircle, 
//   AlertCircle,
//   Download
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import DashboardLayout from '../../components/DashboardLayout';

// export default function UserDashboard() {
//   const [user, setUser] = useState(null);
//   const [hospitals, setHospitals] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [showRxModal, setShowRxModal] = useState(false);
//   const [selectedApp, setSelectedApp] = useState(null);

//   const [formData, setFormData] = useState({
//     hospitalId: '',
//     date: '',
//     time: '',
//     patientName: '',
//     patientPhone: '',
//     reason: ''
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//       fetchHospitals();
//       fetchAppointments(localStorage.getItem('token'));
//     } else {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const fetchHospitals = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/hospitals`);
//       const data = await res.json();
//       setHospitals(data);
//     } catch (err) {
//       toast.error("Failed to load hospitals.");
//     }
//   };

//   const fetchAppointments = async (token) => {
//     try {
//       const res = await fetch(`${API_URL}/api/appointments`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setAppointments(data);
//         setFilteredAppointments(data);
//       }
//     } catch (err) {
//       toast.error("Failed to load appointments.");
//     }
//   };

//   const handleSearchAndFilter = (term, filterStatus) => {
//     setSearchTerm(term);
//     setActiveFilter(filterStatus);

//     let result = appointments;
//     if (filterStatus !== 'All') {
//       result = result.filter(a => a.status === filterStatus);
//     }
//     if (term) {
//       const q = term.toLowerCase();
//       result = result.filter(a => 
//         (a.patientName || '').toLowerCase().includes(q) ||
//         (a.doctorName || '').toLowerCase().includes(q) ||
//         (a.reason || '').toLowerCase().includes(q)
//       );
//     }
//     setFilteredAppointments(result);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.hospitalId || !formData.date || !formData.time || !formData.patientName || !formData.patientPhone) {
//       return toast.error("Please fill all required fields");
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${API_URL}/api/appointments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });
//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || 'Appointment booked successfully');
//         const updated = [...appointments, data.appointment];
//         setAppointments(updated);
//         setFilteredAppointments(updated);
//         setFormData({ hospitalId: '', date: '', time: '', patientName: '', patientPhone: '', reason: '' });
//       } else {
//         toast.error(data.message || "Failed to book appointment");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     }
//   };

//   const handleDownloadRx = (app) => {
//     setSelectedApp(app);
//     setShowRxModal(true);
//   };

//   return (
//     <DashboardLayout
//       title="Patient Healthcare Dashboard"
//       subtitle="Book appointments, monitor health vitals, and access medical records."
//       user={user}
//     >
//       {/* Patient Welcome Header & Quick Action Buttons */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-medical-blue to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
//         <div>
//           <span className="text-xs uppercase font-bold tracking-widest text-blue-200">Personal Health Portal</span>
//           <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name || 'Patient'}!</h1>
//           <p className="text-blue-100 text-sm mt-1">Your next routine checkup is scheduled. Stay updated on your health vitals.</p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <button 
//             onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
//             className="inline-flex items-center gap-2 bg-white text-medical-blue hover:bg-blue-50 font-bold px-5 py-2.5 rounded-full text-sm shadow-md transition"
//           >
//             <Plus size={16} /> Book Appointment
//           </button>
//           <a
//             href="tel:108"
//             className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-md transition"
//           >
//             <PhoneCall size={16} /> Emergency 108
//           </a>
//         </div>
//       </div>

//       {/* Patient Vitals Tracker Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {[
//           { title: "Heart Rate", value: "72 bpm", status: "Normal", color: "text-red-500", bg: "bg-red-50", icon: Heart },
//           { title: "Blood Pressure", value: "120/80 mmHg", status: "Optimal", color: "text-blue-600", bg: "bg-blue-50", icon: Activity },
//           { title: "Blood Oxygen (SpO2)", value: "98%", status: "Healthy", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
//           { title: "Upcoming Visit", value: appointments.length ? `${appointments.length} Active` : "None", status: "Scheduled", color: "text-purple-600", bg: "bg-purple-50", icon: Calendar },
//         ].map((vital, idx) => {
//           const IconComp = vital.icon;
//           return (
//             <motion.div 
//               key={idx}
//               initial={{ opacity: 0, y: 15 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
//             >
//               <div>
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{vital.title}</p>
//                 <p className={`text-2xl font-extrabold mt-1 ${vital.color}`}>{vital.value}</p>
//                 <span className="text-xs text-gray-400 font-medium">{vital.status}</span>
//               </div>
//               <div className={`p-3 rounded-2xl ${vital.bg} ${vital.color}`}>
//                 <IconComp size={24} />
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Main Grid: Form & Appointment List */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* Book Appointment Form */}
//         <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
//           <div className="flex items-center gap-2 mb-6 border-b pb-4">
//             <Calendar className="text-medical-blue w-6 h-6" />
//             <h2 className="text-2xl font-bold text-medical-dark">Book an Appointment</h2>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 font-semibold text-sm mb-1">Select Hospital <span className="text-red-500">*</span></label>
//               <select 
//                 name="hospitalId" 
//                 value={formData.hospitalId} 
//                 onChange={handleChange} 
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm"
//                 required
//               >
//                 <option value="">-- Choose Hospital --</option>
//                 {hospitals.map(h => (
//                   <option key={h.id} value={h.id}>{h.name} - {h.location}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-gray-700 font-semibold text-sm mb-1">Date <span className="text-red-500">*</span></label>
//                 <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm"/>
//               </div>
//               <div>
//                 <label className="block text-gray-700 font-semibold text-sm mb-1">Time Slot <span className="text-red-500">*</span></label>
//                 <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm"/>
//               </div>
//             </div>

//             <div>
//               <label className="block text-gray-700 font-semibold text-sm mb-1">Patient Name <span className="text-red-500">*</span></label>
//               <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required placeholder="e.g. John Doe" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm"/>
//             </div>

//             <div>
//               <label className="block text-gray-700 font-semibold text-sm mb-1">Phone Number <span className="text-red-500">*</span></label>
//               <input type="tel" name="patientPhone" value={formData.patientPhone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm"/>
//             </div>

//             <div>
//               <label className="block text-gray-700 font-semibold text-sm mb-1">Reason for Visit / Symptoms</label>
//               <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" placeholder="Describe symptoms or routine checkup requirement..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm"></textarea>
//             </div>

//             <button type="submit" className="w-full bg-medical-blue text-white font-bold py-3.5 rounded-xl hover:bg-medical-dark transition-colors mt-4 shadow-md text-base">
//               Confirm Appointment Booking
//             </button>
//           </form>
//         </div>

//         {/* My Appointments List */}
//         <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
//             <h2 className="text-2xl font-bold text-medical-dark">My Appointments</h2>
            
//             {/* Filter Tabs */}
//             <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
//               {['All', 'Pending', 'Confirmed', 'Completed'].map(status => (
//                 <button
//                   key={status}
//                   onClick={() => handleSearchAndFilter(searchTerm, status)}
//                   className={`px-3 py-1.5 rounded-lg transition-colors ${activeFilter === status ? 'bg-white text-medical-blue shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'}`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Search Input */}
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => handleSearchAndFilter(e.target.value, activeFilter)}
//               placeholder="Search by patient, doctor, or symptom..."
//               className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue"
//             />
//           </div>

//           {filteredAppointments.length === 0 ? (
//             <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
//               <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//               <p className="text-gray-500 font-medium text-sm">No appointments found matching your search.</p>
//             </div>
//           ) : (
//             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
//               {filteredAppointments.map(app => (
//                 <motion.div 
//                   key={app.id} 
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-5 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-bold text-lg text-medical-dark">{app.patientName}</h3>
//                       <p className="text-xs text-gray-500">Phone: {app.patientPhone || 'N/A'}</p>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                       app.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
//                       app.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
//                       app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {app.status}
//                     </span>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200/60">
//                     <span className="inline-flex items-center gap-1 font-medium"><Calendar size={14} className="text-medical-blue" /> {app.date}</span>
//                     <span className="inline-flex items-center gap-1 font-medium"><Clock size={14} className="text-medical-blue" /> {app.time}</span>
//                     {app.doctorName && <span className="font-medium text-gray-700">Dr. {app.doctorName}</span>}
//                   </div>

//                   {app.reason && (
//                     <p className="text-gray-500 text-xs mt-2 italic bg-white p-2 rounded-lg border border-gray-100">
//                       "{app.reason}"
//                     </p>
//                   )}

//                   <div className="mt-3 flex justify-end">
//                     <button
//                       onClick={() => handleDownloadRx(app)}
//                       className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-blue hover:text-medical-dark bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       <FileText size={14} /> E-Prescription / Slip
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>

//       {/* E-Prescription Slip Modal */}
//       {showRxModal && selectedApp && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200"
//           >
//             <div className="flex justify-between items-center border-b pb-4 mb-4">
//               <div className="flex items-center gap-2">
//                 <FileText className="text-medical-blue" />
//                 <h3 className="font-bold text-lg text-medical-dark">Official Appointment & Prescription Slip</h3>
//               </div>
//               <button onClick={() => setShowRxModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
//             </div>

//             <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 text-sm space-y-2 mb-6">
//               <p><span className="font-bold text-gray-700">Patient:</span> {selectedApp.patientName}</p>
//               <p><span className="font-bold text-gray-700">Date & Time:</span> {selectedApp.date} at {selectedApp.time}</p>
//               <p><span className="font-bold text-gray-700">Status:</span> {selectedApp.status}</p>
//               <p><span className="font-bold text-gray-700">Reason:</span> {selectedApp.reason || 'Routine Checkup'}</p>
//               <div className="pt-2 border-t border-gray-300">
//                 <p className="font-bold text-medical-blue">Rx Instructions:</p>
//                 <p className="text-xs text-gray-600 mt-1">• Take prescribed vitals check at reception upon arrival.</p>
//                 <p className="text-xs text-gray-600">• Bring prior diagnostic reports if available.</p>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button 
//                 onClick={() => {
//                   toast.success("Downloading Prescription PDF...");
//                   setShowRxModal(false);
//                 }}
//                 className="flex-1 inline-flex items-center justify-center gap-2 bg-medical-blue hover:bg-medical-dark text-white font-bold py-2.5 rounded-full text-sm transition"
//               >
//                 <Download size={16} /> Download PDF
//               </button>
//               <button 
//                 onClick={() => setShowRxModal(false)}
//                 className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }





import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API_URL from '../../config/api';
import {
  Calendar,
  PhoneCall,
  FileText,
  MessageSquare,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [formData, setFormData] = useState({
    hospitalId: '',
    date: '',
    time: '',
    patientName: '',
    patientPhone: '',
    reason: ''
  });

  const [feedbackData, setFeedbackData] = useState({
    hospitalId: '',
    rating: 5,
    message: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      setUser(JSON.parse(userData));
      fetchHospitals();
      fetchAppointments(token);
      fetchTranscriptions(token);
    }
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hospitals`);
      const data = await res.json();
      setHospitals(data || []);
    } catch {
      toast.error('Failed to load hospitals');
    }
  };

  const fetchAppointments = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data || []);
    } catch {
      toast.error('Failed to load appointments');
    }
  };

  const fetchTranscriptions = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/calls/transcriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTranscriptions(data || []);
    } catch {
      toast.error('Failed to load transcriptions');
    }
  };

  const handleAppointmentChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeedbackChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchAppointments(token);
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setFeedbackData({ hospitalId: '', rating: 5, message: '' });
      } else {
        toast.error(data.message || 'Failed to submit feedback');
      }
    } catch {
      toast.error('Failed to submit feedback');
    }
  };

  const handleCallHospital = async () => {
    if (!formData.hospitalId || !formData.patientName || !formData.patientPhone) {
      return toast.error('Select hospital and enter patient details first');
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          hospitalId: formData.hospitalId,
          patientName: formData.patientName,
          patientPhone: formData.patientPhone,
          notes: formData.reason || 'Patient requested a hospital callback'
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchTranscriptions(token);
      } else {
        toast.error(data.message || 'Failed to log call');
      }
    } catch {
      toast.error('Failed to create call');
    }
  };

  return (
    <DashboardLayout
      title="Patient Healthcare Dashboard"
      subtitle="Appointments, feedback, call support and transcriptions."
      user={user}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-medical-blue w-6 h-6" />
            <h2 className="text-2xl font-bold">Book Appointment</h2>
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-4">
            <select
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleAppointmentChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} - {h.location}
                </option>
              ))}
            </select>

            <input name="date" type="date" value={formData.date} onChange={handleAppointmentChange} className="w-full px-4 py-3 border rounded-xl" required />
            <input name="time" type="time" value={formData.time} onChange={handleAppointmentChange} className="w-full px-4 py-3 border rounded-xl" required />
            <input name="patientName" type="text" placeholder="Patient Name" value={formData.patientName} onChange={handleAppointmentChange} className="w-full px-4 py-3 border rounded-xl" required />
            <input name="patientPhone" type="text" placeholder="Phone Number" value={formData.patientPhone} onChange={handleAppointmentChange} className="w-full px-4 py-3 border rounded-xl" required />
            <textarea name="reason" placeholder="Reason" value={formData.reason} onChange={handleAppointmentChange} className="w-full px-4 py-3 border rounded-xl" rows="3" />

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-medical-blue text-white font-bold py-3 rounded-xl">
                Confirm Appointment
              </button>
              <button type="button" onClick={handleCallHospital} className="px-4 bg-green-600 text-white font-bold rounded-xl inline-flex items-center gap-2">
                <PhoneCall size={16} /> Call
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="text-medical-blue w-6 h-6" />
            <h2 className="text-2xl font-bold">Post Feedback</h2>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <select
              name="hospitalId"
              value={feedbackData.hospitalId}
              onChange={handleFeedbackChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>

            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={feedbackData.rating}
              onChange={handleFeedbackChange}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Write your feedback"
              value={feedbackData.message}
              onChange={handleFeedbackChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />

            <button type="submit" className="w-full bg-medical-blue text-white font-bold py-3 rounded-xl inline-flex justify-center items-center gap-2">
              <Send size={16} /> Submit Feedback
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
          <div className="space-y-3">
            {appointments.map((app) => (
              <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border rounded-2xl p-4">
                <h3 className="font-bold">{app.patientName}</h3>
                <p className="text-sm text-gray-600">{app.date} at {app.time}</p>
                <p className="text-sm text-gray-600">Status: {app.status}</p>
                {app.reason && <p className="text-sm italic text-gray-500 mt-1">{app.reason}</p>}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-medical-blue w-6 h-6" />
            <h2 className="text-2xl font-bold">My Transcriptions</h2>
          </div>
          <div className="space-y-3">
            {transcriptions.map((t) => (
              <div key={t.id} className="border rounded-2xl p-4">
                <p className="text-sm text-gray-700">{t.transcript}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}