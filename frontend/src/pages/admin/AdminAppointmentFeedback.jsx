// import { useEffect, useMemo, useState } from 'react';
// import {
//   ClipboardList,
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   CheckCircle2,
//   RefreshCw
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import API_URL from '../../config/api';

// const ITEMS_PER_PAGE = 4;
// const appointmentStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

// export default function AdminAppointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hospitalLoading, setHospitalLoading] = useState(false);
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);

//   const [editModal, setEditModal] = useState(false);
//   const [bookModal, setBookModal] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);

//   const [formData, setFormData] = useState({
//     patientName: '',
//     patientPhone: '',
//     date: '',
//     time: '',
//     reason: '',
//     status: 'Pending',
//     hospitalId: '',
//     doctorName: 'Any Available Doctor'
//   });

//   const [bookForm, setBookForm] = useState({
//     hospitalId: '',
//     doctorName: 'Any Available Doctor',
//     date: '',
//     time: '',
//     patientName: '',
//     patientPhone: '',
//     reason: ''
//   });

//   useEffect(() => {
//     fetchAppointments();
//     fetchHospitals();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const res = await fetch(`${API_URL}/api/appointments`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setAppointments(Array.isArray(data) ? data : []);
//       } else {
//         toast.error(data.message || 'Failed to fetch appointments');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchHospitals = async () => {
//     try {
//       setHospitalLoading(true);

//       const res = await fetch(`${API_URL}/api/hospitals`);
//       const data = await res.json();

//       if (res.ok) {
//         const hospitalList = Array.isArray(data) ? data : [];
//         setHospitals(hospitalList);
//       } else {
//         toast.error(data.message || 'Failed to fetch hospitals');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to load hospitals');
//     } finally {
//       setHospitalLoading(false);
//     }
//   };

//   const handleBookAppointment = async (e) => {
//     e.preventDefault();

//     if (
//       !bookForm.hospitalId ||
//       !bookForm.date ||
//       !bookForm.time ||
//       !bookForm.patientName ||
//       !bookForm.patientPhone
//     ) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');

//       const res = await fetch(`${API_URL}/api/appointments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(bookForm)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         const selectedHospital = hospitals.find((h) => h.id === bookForm.hospitalId);

//         toast.success(data.message || 'Appointment booked successfully');
//         setAppointments((prev) => [
//           {
//             ...data.appointment,
//             hospitalName: selectedHospital?.name || data.appointment?.hospitalId || '-'
//           },
//           ...prev
//         ]);
//         setBookModal(false);
//         setBookForm({
//           hospitalId: '',
//           doctorName: 'Any Available Doctor',
//           date: '',
//           time: '',
//           patientName: '',
//           patientPhone: '',
//           reason: ''
//         });
//       } else {
//         toast.error(data.message || 'Failed to book appointment');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Error booking appointment');
//     }
//   };

//   const updateAppointmentStatus = async (appointmentId, status) => {
//     try {
//       const token = localStorage.getItem('token');

//       const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ status })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || 'Appointment status updated');
//         setAppointments((prev) =>
//           prev.map((item) =>
//             item.id === appointmentId
//               ? { ...item, status: data.appointment?.status || status }
//               : item
//           )
//         );
//       } else {
//         toast.error(data.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Error updating appointment status');
//     }
//   };

//   const handleDeleteAppointment = async (appointmentId) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem('token');

//       const res = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || 'Appointment deleted successfully');
//         setAppointments((prev) => prev.filter((item) => item.id !== appointmentId));
//       } else {
//         toast.error(data.message || 'Failed to delete appointment');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Error deleting appointment');
//     }
//   };

//   const handleEditClick = (appointment) => {
//     setSelectedAppointment(appointment);
//     setFormData({
//       patientName: appointment.patientName || '',
//       patientPhone: appointment.patientPhone || '',
//       date: appointment.date || '',
//       time: appointment.time || '',
//       reason: appointment.reason || '',
//       status: appointment.status || 'Pending',
//       hospitalId: appointment.hospitalId || '',
//       doctorName: appointment.doctorName || 'Any Available Doctor'
//     });
//     setEditModal(true);
//   };

//   const handleUpdateAppointment = async (e) => {
//     e.preventDefault();

//     if (!selectedAppointment) return;

//     try {
//       const token = localStorage.getItem('token');

//       const res = await fetch(`${API_URL}/api/appointments/${selectedAppointment.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         const selectedHospital = hospitals.find((h) => h.id === formData.hospitalId);

//         toast.success(data.message || 'Appointment updated successfully');
//         setAppointments((prev) =>
//           prev.map((item) =>
//             item.id === selectedAppointment.id
//               ? {
//                   ...item,
//                   ...data.appointment,
//                   hospitalName: selectedHospital?.name || item.hospitalName || data.appointment?.hospitalId
//                 }
//               : item
//           )
//         );
//         setEditModal(false);
//         setSelectedAppointment(null);
//       } else {
//         toast.error(data.message || 'Failed to update appointment');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Error updating appointment');
//     }
//   };

//   const normalizedStatus = (status) => {
//     if (status === 'Confirmed' || status === 'Pending' || status === 'In Progress') return 'Scheduled';
//     if (status === 'Completed') return 'Completed';
//     if (status === 'Cancelled') return 'Cancelled';
//     return 'Scheduled';
//   };

//   const filteredAppointments = useMemo(() => {
//     if (activeFilter === 'All') return appointments;
//     return appointments.filter((item) => normalizedStatus(item.status) === activeFilter);
//   }, [appointments, activeFilter]);

//   const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

//   const paginatedAppointments = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
//   }, [filteredAppointments, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeFilter, appointments.length]);

//   const getStatusPillClass = (status) => {
//     const normalized = normalizedStatus(status);

//     if (normalized === 'Completed') return 'bg-green-100 text-green-700';
//     if (normalized === 'Cancelled') return 'bg-red-100 text-red-700';
//     return 'bg-orange-100 text-orange-700';
//   };

//   const getExactStatusClass = (status) => {
//     if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
//     if (status === 'Confirmed') return 'bg-blue-100 text-blue-800';
//     if (status === 'In Progress') return 'bg-purple-100 text-purple-800';
//     if (status === 'Completed') return 'bg-green-100 text-green-800';
//     return 'bg-red-100 text-red-800';
//   };

//   const filterBtnClass = (label) =>
//     `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
//       activeFilter === label
//         ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-sm'
//         : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
//     }`;

//   return (
//     <div className="min-h-screen bg-[#f4f5fb] p-3 sm:p-4 lg:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
//               <ClipboardList className="h-5 w-5" />
//             </div>
//             <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
//               Booked Appointment Details
//             </h1>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button
//               type="button"
//               onClick={fetchAppointments}
//               className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh
//             </button>

//             <button
//               type="button"
//               onClick={() => setBookModal(true)}
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
//             >
//               <Plus className="h-4 w-4" />
//               New Appointment
//             </button>
//           </div>
//         </div>

//         <div className="mb-6 flex flex-wrap gap-3">
//           <button className={filterBtnClass('All')} onClick={() => setActiveFilter('All')}>
//             <span>📋</span> All
//           </button>
//           <button className={filterBtnClass('Scheduled')} onClick={() => setActiveFilter('Scheduled')}>
//             <span>✅</span> Scheduled
//           </button>
//           <button className={filterBtnClass('Completed')} onClick={() => setActiveFilter('Completed')}>
//             <span>✔</span> Completed
//           </button>
//           <button className={filterBtnClass('Cancelled')} onClick={() => setActiveFilter('Cancelled')}>
//             <span>❌</span> Cancelled
//           </button>
//         </div>

//         <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//                 <tr className="text-left">
//                   <th className="px-4 py-4 text-sm font-semibold">Date</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Time</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Patient Name</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Phone</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Hospital</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Appointment Type</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Status</th>
//                   <th className="px-4 py-4 text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
//                       Loading appointments...
//                     </td>
//                   </tr>
//                 ) : paginatedAppointments.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
//                       No appointments found.
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedAppointments.map((app, index) => (
//                     <tr
//                       key={app.id}
//                       className={`border-b border-slate-100 ${
//                         index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
//                       }`}
//                     >
//                       <td className="px-4 py-4 text-sm text-slate-700">{app.date || '-'}</td>
//                       <td className="px-4 py-4 text-sm text-slate-700">{app.time || '-'}</td>
//                       <td className="px-4 py-4 text-sm font-medium text-slate-700">
//                         {app.patientName || '-'}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-slate-700">{app.patientPhone || '-'}</td>
//                       <td className="px-4 py-4 text-sm text-slate-700">
//                         {app.hospitalName || app.hospitalId || '-'}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-slate-700">
//                         <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
//                           Consult
//                         </span>
//                       </td>
//                       <td className="px-4 py-4">
//                         <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusPillClass(app.status)}`}>
//                           {normalizedStatus(app.status)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-2">
//                           <select
//                             value={app.status}
//                             onChange={(e) => updateAppointmentStatus(app.id, e.target.value)}
//                             className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
//                           >
//                             {appointmentStatusOptions.map((status) => (
//                               <option key={status} value={status}>
//                                 {status}
//                               </option>
//                             ))}
//                           </select>

//                           <button
//                             onClick={() => handleEditClick(app)}
//                             className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </button>

//                           <button
//                             onClick={() => handleDeleteAppointment(app.id)}
//                             className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
//           {loading ? (
//             <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-gray-500 shadow-sm">
//               Loading appointments...
//             </div>
//           ) : paginatedAppointments.length === 0 ? (
//             <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-gray-500 shadow-sm">
//               No appointments found.
//             </div>
//           ) : (
//             paginatedAppointments.map((app) => (
//               <div
//                 key={app.id}
//                 className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
//               >
//                 <div className="mb-4 flex items-start justify-between gap-3">
//                   <div>
//                     <h3 className="text-lg font-bold text-slate-800">{app.patientName || '-'}</h3>
//                     <p className="text-sm text-slate-500">
//                       {app.date || '-'} at {app.time || '-'}
//                     </p>
//                   </div>
//                   <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusPillClass(app.status)}`}>
//                     {normalizedStatus(app.status)}
//                   </span>
//                 </div>

//                 <div className="space-y-1.5 text-sm text-slate-600">
//                   <p><span className="font-medium">Phone:</span> {app.patientPhone || '-'}</p>
//                   <p><span className="font-medium">Hospital:</span> {app.hospitalName || app.hospitalId || '-'}</p>
//                   <p><span className="font-medium">Doctor:</span> {app.doctorName || 'Any Available Doctor'}</p>
//                   {app.reason ? <p className="italic text-slate-500">"{app.reason}"</p> : null}
//                 </div>

//                 <div className="mt-4 space-y-3">
//                   <select
//                     value={app.status}
//                     onChange={(e) => updateAppointmentStatus(app.id, e.target.value)}
//                     className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
//                   >
//                     {appointmentStatusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>

//                   <span className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${getExactStatusClass(app.status)}`}>
//                     {app.status}
//                   </span>

//                   <div className="grid grid-cols-2 gap-3">
//                     <button
//                       onClick={() => handleEditClick(app)}
//                       className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
//                     >
//                       <Pencil className="h-4 w-4" />
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDeleteAppointment(app.id)}
//                       className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-medium text-pink-600 hover:bg-pink-100"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {!loading && filteredAppointments.length > ITEMS_PER_PAGE && (
//           <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
//             <button
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               disabled={currentPage === 1}
//               className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
//             >
//               Prev
//             </button>

//             {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`rounded-lg px-4 py-2 text-sm font-medium ${
//                   currentPage === page
//                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
//                     : 'border border-slate-200 bg-white text-slate-600'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               disabled={currentPage === totalPages}
//               className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {bookModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
//             <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-white">
//               <h2 className="text-lg font-bold sm:text-xl">Book New Appointment</h2>
//               <button
//                 type="button"
//                 onClick={() => setBookModal(false)}
//                 className="rounded-lg p-2 hover:bg-white/10"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//            <form onSubmit={handleBookAppointment} className="flex-1 overflow-y-auto p-5">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Appointment Date *
//                   </label>
//                   <input
//                     type="date"
//                     value={bookForm.date}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, date: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Appointment Time *
//                   </label>
//                   <input
//                     type="time"
//                     value={bookForm.time}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, time: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Hospital *
//                   </label>
//                   <select
//                     value={bookForm.hospitalId}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, hospitalId: e.target.value }))}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   >
//                     <option value="">
//                       {hospitalLoading ? 'Loading hospitals...' : 'Select hospital'}
//                     </option>
//                     {hospitals.map((hospital) => (
//                       <option key={hospital.id} value={hospital.id}>
//                         {hospital.name} {hospital.location ? `- ${hospital.location}` : ''}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Doctor Name
//                   </label>
//                   <input
//                     type="text"
//                     value={bookForm.doctorName}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, doctorName: e.target.value }))}
//                     placeholder="Any Available Doctor"
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                   />
//                 </div>

//                 <div className="sm:col-span-2 pt-2">
//                   <h3 className="text-base font-semibold text-slate-800">Patient Information</h3>
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Patient Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={bookForm.patientName}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, patientName: e.target.value }))}
//                     placeholder="Full name"
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="text"
//                     value={bookForm.patientPhone}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, patientPhone: e.target.value }))}
//                     placeholder="+91XXXXXXXXXX"
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Status
//                   </label>
//                   <input
//                     type="text"
//                     value="Pending"
//                     disabled
//                     className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Reason
//                   </label>
//                   <textarea
//                     rows="4"
//                     value={bookForm.reason}
//                     onChange={(e) => setBookForm((prev) => ({ ...prev, reason: e.target.value }))}
//                     placeholder="Write appointment reason"
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setBookModal(false)}
//                   className="rounded-xl bg-slate-500 px-5 py-3 text-sm font-medium text-white hover:bg-slate-600"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//                 >
//                   <CheckCircle2 className="h-4 w-4" />
//                   Book Appointment
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {editModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//          <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//               <h2 className="text-xl font-bold text-slate-800">Edit Appointment</h2>
//               <button
//                 onClick={() => {
//                   setEditModal(false);
//                   setSelectedAppointment(null);
//                 }}
//                 className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//            <form onSubmit={handleUpdateAppointment} className="flex-1 overflow-y-auto p-5">

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Patient Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.patientName}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, patientName: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Phone
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.patientPhone}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, patientPhone: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.date}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, date: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Time
//                   </label>
//                   <input
//                     type="time"
//                     value={formData.time}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, time: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Hospital
//                   </label>
//                   <select
//                     value={formData.hospitalId}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, hospitalId: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                     required
//                   >
//                     <option value="">
//                       {hospitalLoading ? 'Loading hospitals...' : 'Select hospital'}
//                     </option>
//                     {hospitals.map((hospital) => (
//                       <option key={hospital.id} value={hospital.id}>
//                         {hospital.name} {hospital.location ? `- ${hospital.location}` : ''}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Status
//                   </label>
//                   <select
//                     value={formData.status}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, status: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                   >
//                     {appointmentStatusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Doctor Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.doctorName}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, doctorName: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1 block text-sm font-medium text-slate-700">
//                     Reason
//                   </label>
//                   <textarea
//                     rows="4"
//                     value={formData.reason}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, reason: e.target.value }))
//                     }
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditModal(false);
//                     setSelectedAppointment(null);
//                   }}
//                   className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
//                 >
//                   <CheckCircle2 className="h-4 w-4" />
//                   Update Appointment
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Search, RefreshCw, Edit3, X, CheckCircle2, Loader2,
//   Phone, PhoneOff, MessageSquare
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import API_URL from '../../config/api';
// import DashboardLayout from '../../components/DashboardLayout';
// import Pagination from '../../components/Pagination';

// const PER_PAGE = 6;
// const STATUSES = ['Pending', 'Completed'];

// export default function AdminAppointmentFeedback() {
//   const [user, setUser] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [page, setPage] = useState(1);

//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({
//     patientName: '', petName: '', appointmentType: 'Consult',
//     date: '', time: '', feedbackStatus: 'Pending',
//     feedbackGiven: false, callAttempted: false, callPicked: false, feedbackText: ''
//   });
//   const [saving, setSaving] = useState(false);

//   const authHeaders = () => ({
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('token')}`
//   });

//   useEffect(() => {
//     const u = localStorage.getItem('user');
//     if (!u) return;
//     const parsed = JSON.parse(u);
//     if (parsed.role !== 'admin' && parsed.role !== 'superadmin') return;
//     setUser(parsed);
//     fetchRows();
//   }, []);

//   const fetchRows = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/appointment-feedbacks`, { headers: authHeaders() });
//       const data = await res.json();
//       if (!res.ok) return toast.error(data.message || 'Failed to load');
//       setRows(Array.isArray(data) ? data : []);
//     } catch { toast.error('Network error'); } finally { setLoading(false); }
//   };

//   const openCreate = () => { setEditing(null); setForm(emptyForm()); setShowModal(true); };
//   const openEdit = (fb) => { setEditing(fb); setForm(fb); setShowModal(true); };

//   function emptyForm() {
//     return {
//       patientName: '', petName: '', appointmentType: 'Consult',
//       date: '', time: '', feedbackStatus: 'Pending',
//       feedbackGiven: false, callAttempted: false, callPicked: false, feedbackText: ''
//     };
//   }

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!form.patientName || !form.date) return toast.error('Patient name and date required');
//     setSaving(true);
//     try {
//       const method = editing ? 'PUT' : 'POST';
//       const url = editing
//         ? `${API_URL}/api/appointment-feedbacks/${editing.id}`
//         : `${API_URL}/api/appointment-feedbacks`;
//       const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
//       const data = await res.json();
//       if (!res.ok) return toast.error(data.message || 'Save failed');
//       toast.success(editing ? 'Updated' : 'Created');
//       setShowModal(false); fetchRows();
//     } catch { toast.error('Save error'); } finally { setSaving(false); }
//   };

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return rows.filter(r => {
//       const matchStatus = statusFilter === 'all' || r.feedbackStatus === statusFilter;
//       const matchSearch = !q || [r.patientName, r.petName, r.appointmentType].join(' ').toLowerCase().includes(q);
//       return matchStatus && matchSearch;
//     });
//   }, [rows, search, statusFilter]);

//   const paginated = useMemo(() => filtered.slice((page-1)*PER_PAGE, page*PER_PAGE), [filtered, page]);
//   useEffect(() => setPage(1), [search, statusFilter]);

//   return (
//     <DashboardLayout title="Patient Feedback" subtitle="Manage appointment feedback, call attempts, and notes." user={user}>
//       <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-xl font-bold text-medical-dark">All Feedback</h2>
//             <p className="text-sm text-gray-500">{filtered.length} of {rows.length} records</p>
//           </div>
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, pet…"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:border-medical-blue" />
//             </div>
//             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-full bg-white outline-none focus:border-medical-blue">
//               <option value="all">All Status</option>
//               {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//             <button onClick={fetchRows} className="bg-white border px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-gray-50"><RefreshCw size={16}/> Refresh</button>
//             <button onClick={openCreate} className="bg-medical-blue text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2"><MessageSquare size={16}/> Add Feedback</button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="py-16 text-center text-gray-500">Loading…</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse min-w-[900px]">
//               <thead>
//                 <tr className="bg-medical-blue/10 text-medical-dark text-sm">
//                   <th className="py-3 px-4 font-semibold">ID</th>
//                   <th className="py-3 px-4 font-semibold">Patient</th>
//                   <th className="py-3 px-4 font-semibold">Pet</th>
//                   <th className="py-3 px-4 font-semibold">Appt Type</th>
//                   <th className="py-3 px-4 font-semibold">Date</th>
//                   <th className="py-3 px-4 font-semibold">Time</th>
//                   <th className="py-3 px-4 font-semibold">Status</th>
//                   <th className="py-3 px-4 font-semibold">Feedback Given</th>
//                   <th className="py-3 px-4 font-semibold">Call</th>
//                   <th className="py-3 px-4 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map(r => (
//                   <motion.tr key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-b hover:bg-gray-50 text-sm">
//                     <td className="py-4 px-4 text-gray-500 font-mono">{r.id}</td>
//                     <td className="py-4 px-4 font-medium">{r.patientName}</td>
//                     <td className="py-4 px-4">{r.petName || '—'}</td>
//                     <td className="py-4 px-4"><span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-xs">{r.appointmentType}</span></td>
//                     <td className="py-4 px-4">{r.date}</td>
//                     <td className="py-4 px-4">{r.time || '—'}</td>
//                     <td className="py-4 px-4">
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.feedbackStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.feedbackStatus}</span>
//                     </td>
//                     <td className="py-4 px-4">{r.feedbackGiven ? '✔ Yes' : '✘ No'}</td>
//                     <td className="py-4 px-4">
//                       {r.callAttempted ? <span className="flex items-center gap-1 text-blue-600"><Phone size={14}/> Yes</span> : <span className="flex items-center gap-1 text-gray-400"><PhoneOff size={14}/> No</span>}
//                     </td>
//                     <td className="py-4 px-4 text-right">
//                       <button onClick={() => openEdit(r)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit3 size={14}/></button>
//                     </td>
//                   </motion.tr>
//                 ))}
//                 {filtered.length === 0 && <tr><td colSpan={10} className="py-12 text-center text-gray-500 italic">No feedback records</td></tr>}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
//       </div>

//       <AnimatePresence>
//         {showModal && (
//           <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
//             initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowModal(false)}>
//             <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }}
//               onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-xl font-bold">{editing ? 'Edit Feedback' : 'New Feedback'}</h3>
//                 <button onClick={() => setShowModal(false)}><X size={20}/></button>
//               </div>
//               <form onSubmit={submit} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Patient Name *</label>
//                     <input type="text" value={form.patientName} onChange={e => setForm(f => ({...f, patientName: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Pet Name</label>
//                     <input type="text" value={form.petName} onChange={e => setForm(f => ({...f, petName: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Appointment Type</label>
//                     <input type="text" value={form.appointmentType} onChange={e => setForm(f => ({...f, appointmentType: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Date *</label>
//                     <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Time</label>
//                     <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Feedback Status</label>
//                     <select value={form.feedbackStatus} onChange={e => setForm(f => ({...f, feedbackStatus: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-300">
//                       {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <Toggle label="Feedback Given" checked={form.feedbackGiven} onChange={v => setForm(f => ({...f, feedbackGiven: v}))} />
//                   <Toggle label="Call Attempted" checked={form.callAttempted} onChange={v => setForm(f => ({...f, callAttempted: v}))} />
//                   <Toggle label="Call Picked" checked={form.callPicked} onChange={v => setForm(f => ({...f, callPicked: v}))} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Feedback Notes</label>
//                   <textarea rows={3} value={form.feedbackText} onChange={e => setForm(f => ({...f, feedbackText: e.target.value}))}
//                     placeholder="Any additional comments…" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                 </div>
//                 <div className="flex justify-end gap-3 pt-2">
//                   <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-300 rounded-full font-semibold text-gray-600">Cancel</button>
//                   <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-medical-blue text-white rounded-full font-semibold disabled:opacity-60">
//                     {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
//                     {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </DashboardLayout>
//   );
// }

// function Toggle({ label, checked, onChange }) {
//   return (
//     <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
//       <span className="text-sm font-medium">{label}</span>
//       <label className="relative inline-flex items-center cursor-pointer">
//         <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
//         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-blue"></div>
//       </label>
//     </div>
//   );
// }



// import { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Search, RefreshCw, Edit3, X, CheckCircle2, Loader2,
//   Phone, PhoneOff, MessageSquare, Plus
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import API_URL from '../../config/api';
// import DashboardLayout from '../../components/DashboardLayout';
// import Pagination from '../../components/Pagination';

// const PER_PAGE = 6;
// const STATUSES = ['Pending', 'Completed'];

// export default function AdminAppointmentFeedback() {
//   const [user, setUser] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [appointments, setAppointments] = useState([]);   // for prefill
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [page, setPage] = useState(1);

//   // Modal
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({
//     patientName: '', petName: '', appointmentType: 'Consult',
//     date: '', time: '', feedbackStatus: 'Pending',
//     feedbackGiven: false, callAttempted: false, callPicked: false, feedbackText: ''
//   });
//   const [saving, setSaving] = useState(false);

//   const authHeaders = () => ({
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('token')}`
//   });

//   useEffect(() => {
//     const u = localStorage.getItem('user');
//     if (!u) return;
//     const parsed = JSON.parse(u);
//     if (parsed.role !== 'admin' && parsed.role !== 'superadmin') return;
//     setUser(parsed);
//     fetchRows();
//     fetchAppointments();
//   }, []);

//   const fetchRows = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/appointment-feedbacks`, { headers: authHeaders() });
//       const data = await res.json();
//       if (!res.ok) return toast.error(data.message || 'Failed to load');
//       setRows(Array.isArray(data) ? data : []);
//     } catch { toast.error('Network error'); } finally { setLoading(false); }
//   };

//   const fetchAppointments = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/appointments`, { headers: authHeaders() });
//       const data = await res.json();
//       if (res.ok) setAppointments(Array.isArray(data) ? data : []);
//     } catch { /* non-blocking */ }
//   };

//   const openCreate = () => {
//     setEditing(null);
//     setForm({
//       patientName: '', petName: '', appointmentType: 'Consult',
//       date: '', time: '', feedbackStatus: 'Pending',
//       feedbackGiven: false, callAttempted: false, callPicked: false, feedbackText: ''
//     });
//     setShowModal(true);
//   };

//   const openEdit = (fb) => {
//     setEditing(fb);
//     setForm({
//       patientName: fb.patientName || '',
//       petName: fb.petName || '',
//       appointmentType: fb.appointmentType || 'Consult',
//       date: fb.date || '',
//       time: fb.time || '',
//       feedbackStatus: fb.feedbackStatus || 'Pending',
//       feedbackGiven: fb.feedbackGiven || false,
//       callAttempted: fb.callAttempted || false,
//       callPicked: fb.callPicked || false,
//       feedbackText: fb.feedbackText || ''
//     });
//     setShowModal(true);
//   };

//   // Prefill from selected appointment
//   const handlePrefill = (appointmentId) => {
//     const app = appointments.find(a => a.id === appointmentId);
//     if (!app) return;
//     setForm({
//       patientName: app.patientName || '',
//       petName: app.petName || '',
//       appointmentType: app.appointmentType || 'Consult',
//       date: app.date || '',
//       time: app.time || '',
//       feedbackStatus: 'Pending',
//       feedbackGiven: false,
//       callAttempted: false,
//       callPicked: false,
//       feedbackText: ''
//     });
//     toast.success('Form prefilled from appointment');
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!form.patientName || !form.date) return toast.error('Patient name and date required');
//     setSaving(true);
//     try {
//       const method = editing ? 'PUT' : 'POST';
//       const url = editing
//         ? `${API_URL}/api/appointment-feedbacks/${editing.id}`
//         : `${API_URL}/api/appointment-feedbacks`;
//       const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
//       const data = await res.json();
//       if (!res.ok) return toast.error(data.message || 'Save failed');
//       toast.success(editing ? 'Updated' : 'Created');
//       setShowModal(false); fetchRows();
//     } catch { toast.error('Save error'); } finally { setSaving(false); }
//   };

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return rows.filter(r => {
//       const matchStatus = statusFilter === 'all' || r.feedbackStatus === statusFilter;
//       const matchSearch = !q || [r.patientName, r.petName, r.appointmentType].join(' ').toLowerCase().includes(q);
//       return matchStatus && matchSearch;
//     });
//   }, [rows, search, statusFilter]);

//   const paginated = useMemo(() => filtered.slice((page-1)*PER_PAGE, page*PER_PAGE), [filtered, page]);
//   useEffect(() => setPage(1), [search, statusFilter]);

//   return (
//     <DashboardLayout title="Patient Feedback" subtitle="Manage appointment feedback, call attempts, and notes." user={user}>
//       <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-xl font-bold text-medical-dark">Appointment Feedback</h2>
//             <p className="text-sm text-gray-500">{filtered.length} of {rows.length} records</p>
//           </div>
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, pet…"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:border-medical-blue" />
//             </div>
//             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-full bg-white outline-none focus:border-medical-blue">
//               <option value="all">All Status</option>
//               {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//             <button onClick={fetchRows} className="bg-white border px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-gray-50"><RefreshCw size={16}/> Refresh</button>
//             <button onClick={openCreate} className="bg-medical-blue text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2"><Plus size={16}/> Add Feedback</button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="py-16 text-center text-gray-500">Loading…</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse min-w-[900px]">
//               <thead>
//                 <tr className="bg-medical-blue/10 text-medical-dark text-sm">
//                   <th className="py-3 px-4 font-semibold">ID</th>
//                   <th className="py-3 px-4 font-semibold">Patient</th>
//                   <th className="py-3 px-4 font-semibold">Pet</th>
//                   <th className="py-3 px-4 font-semibold">Appt Type</th>
//                   <th className="py-3 px-4 font-semibold">Date</th>
//                   <th className="py-3 px-4 font-semibold">Time</th>
//                   <th className="py-3 px-4 font-semibold">Status</th>
//                   <th className="py-3 px-4 font-semibold">Feedback Given</th>
//                   <th className="py-3 px-4 font-semibold">Call</th>
//                   <th className="py-3 px-4 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map(r => (
//                   <motion.tr key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="border-b hover:bg-gray-50 text-sm">
//                     <td className="py-4 px-4 text-gray-500 font-mono">{r.id}</td>
//                     <td className="py-4 px-4 font-medium">{r.patientName}</td>
//                     <td className="py-4 px-4">{r.petName || '—'}</td>
//                     <td className="py-4 px-4"><span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-xs">{r.appointmentType}</span></td>
//                     <td className="py-4 px-4">{r.date}</td>
//                     <td className="py-4 px-4">{r.time || '—'}</td>
//                     <td className="py-4 px-4">
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.feedbackStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.feedbackStatus}</span>
//                     </td>
//                     <td className="py-4 px-4">{r.feedbackGiven ? '✔ Yes' : '✘ No'}</td>
//                     <td className="py-4 px-4">
//                       {r.callAttempted ? <span className="flex items-center gap-1 text-blue-600"><Phone size={14}/> Yes</span> : <span className="flex items-center gap-1 text-gray-400"><PhoneOff size={14}/> No</span>}
//                     </td>
//                     <td className="py-4 px-4 text-right">
//                       <button onClick={() => openEdit(r)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><Edit3 size={14}/></button>
//                     </td>
//                   </motion.tr>
//                 ))}
//                 {filtered.length === 0 && <tr><td colSpan={10} className="py-12 text-center text-gray-500 italic">No feedback records</td></tr>}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
//       </div>

//       {/* Add / Edit Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
//             initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowModal(false)}>
//             <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }}
//               onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-xl font-bold">{editing ? 'Edit Feedback' : 'New Feedback'}</h3>
//                 <button onClick={() => setShowModal(false)}><X size={20}/></button>
//               </div>

//               {/* Prefill from appointment (only when creating new) */}
//               {!editing && (
//                 <div className="mb-5">
//                   <label className="block text-sm font-medium mb-1">Prefill from existing appointment</label>
//                   <select
//                     onChange={e => handlePrefill(e.target.value)}
//                     defaultValue=""
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-300"
//                   >
//                     <option value="">Select an appointment…</option>
//                     {appointments.map(app => (
//                       <option key={app.id} value={app.id}>
//                         {app.patientName} – {app.date} {app.time}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <form onSubmit={submit} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Patient Name *</label>
//                     <input type="text" value={form.patientName} onChange={e => setForm(f => ({...f, patientName: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Pet Name</label>
//                     <input type="text" value={form.petName} onChange={e => setForm(f => ({...f, petName: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Appointment Type</label>
//                     <input type="text" value={form.appointmentType} onChange={e => setForm(f => ({...f, appointmentType: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Date *</label>
//                     <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Time</label>
//                     <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Feedback Status</label>
//                     <select value={form.feedbackStatus} onChange={e => setForm(f => ({...f, feedbackStatus: e.target.value}))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-300">
//                       {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <Toggle label="Feedback Given" checked={form.feedbackGiven} onChange={v => setForm(f => ({...f, feedbackGiven: v}))} />
//                   <Toggle label="Call Attempted" checked={form.callAttempted} onChange={v => setForm(f => ({...f, callAttempted: v}))} />
//                   <Toggle label="Call Picked" checked={form.callPicked} onChange={v => setForm(f => ({...f, callPicked: v}))} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Feedback Notes</label>
//                   <textarea rows={3} value={form.feedbackText} onChange={e => setForm(f => ({...f, feedbackText: e.target.value}))}
//                     placeholder="Any additional comments…" className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300" />
//                 </div>
//                 <div className="flex justify-end gap-3 pt-2">
//                   <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-300 rounded-full font-semibold text-gray-600">Cancel</button>
//                   <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-medical-blue text-white rounded-full font-semibold disabled:opacity-60">
//                     {saving ? <Loader2 className="animate-spin w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
//                     {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </DashboardLayout>
//   );
// }

// // Toggle switch
// function Toggle({ label, checked, onChange }) {
//   return (
//     <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
//       <span className="text-sm font-medium">{label}</span>
//       <label className="relative inline-flex items-center cursor-pointer">
//         <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
//         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-blue"></div>
//       </label>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, RefreshCw, Edit3, X, CheckCircle2, Loader2,
  Phone, PhoneOff, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config/api';
import DashboardLayout from '../../components/DashboardLayout';
import Pagination from '../../components/Pagination';

const PER_PAGE = 6;
const STATUSES = ['Pending', 'Completed'];

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut', staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28 } }
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } }
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.18 } }
};

export default function AdminAppointmentFeedback() {
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    patientName: '', petName: '', appointmentType: 'Consult',
    date: '', time: '', feedbackStatus: 'Pending',
    feedbackGiven: false, callAttempted: false, callPicked: false, feedbackText: ''
  });
  const [saving, setSaving] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) return;
    const parsed = JSON.parse(u);
    if (parsed.role !== 'admin' && parsed.role !== 'superadmin') return;
    setUser(parsed);
    fetchRows();
    fetchAppointments();
  }, []);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/appointment-feedbacks`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Failed to load');
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/appointments`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setAppointments(Array.isArray(data) ? data : []);
    } catch {
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      patientName: '', petName: '', appointmentType: 'Consult',
      date: '', time: '', feedbackStatus: 'Pending',
      feedbackGiven: false, callAttempted: false, callPicked: false, feedbackText: ''
    });
    setShowModal(true);
  };

  const openEdit = (fb) => {
    setEditing(fb);
    setForm({
      patientName: fb.patientName || '',
      petName: fb.petName || '',
      appointmentType: fb.appointmentType || 'Consult',
      date: fb.date || '',
      time: fb.time || '',
      feedbackStatus: fb.feedbackStatus || 'Pending',
      feedbackGiven: fb.feedbackGiven || false,
      callAttempted: fb.callAttempted || false,
      callPicked: fb.callPicked || false,
      feedbackText: fb.feedbackText || ''
    });
    setShowModal(true);
  };

  const handlePrefill = (appointmentId) => {
    const app = appointments.find(a => a.id === appointmentId);
    if (!app) return;
    setForm({
      patientName: app.patientName || '',
      petName: app.petName || '',
      appointmentType: app.appointmentType || 'Consult',
      date: app.date || '',
      time: app.time || '',
      feedbackStatus: 'Pending',
      feedbackGiven: false,
      callAttempted: false,
      callPicked: false,
      feedbackText: ''
    });
    toast.success('Form prefilled from appointment');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.date) return toast.error('Patient name and date required');
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `${API_URL}/api/appointment-feedbacks/${editing.id}`
        : `${API_URL}/api/appointment-feedbacks`;
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Save failed');
      toast.success(editing ? 'Updated' : 'Created');
      setShowModal(false);
      fetchRows();
    } catch {
      toast.error('Save error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      const matchStatus = statusFilter === 'all' || r.feedbackStatus === statusFilter;
      const matchSearch = !q || [r.patientName, r.petName, r.appointmentType].join(' ').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [rows, search, statusFilter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);
  useEffect(() => setPage(1), [search, statusFilter]);

  return (
    <DashboardLayout title="Patient Feedback" subtitle="Manage appointment feedback, call attempts, and notes." user={user}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 sm:p-6"
      >
        <motion.div
          variants={cardVariants}
          className="bg-white/95 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] border border-white/70 ring-1 ring-slate-100"
        >
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Appointment Feedback</h2>
              <p className="text-sm text-slate-500 mt-1">{filtered.length} of {rows.length} records</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search patient, pet…"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full bg-slate-50 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-full bg-slate-50 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
              >
                <option value="all">All Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button
                onClick={fetchRows}
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:shadow-sm transition"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                onClick={openCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <Plus size={16} />
                Add Feedback
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-500" />
              Loading…
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50 text-slate-700 text-sm">
                    <th className="py-4 px-4 font-semibold">ID</th>
                    <th className="py-4 px-4 font-semibold">Patient</th>
                    <th className="py-4 px-4 font-semibold">Pet</th>
                    <th className="py-4 px-4 font-semibold">Appt Type</th>
                    <th className="py-4 px-4 font-semibold">Date</th>
                    <th className="py-4 px-4 font-semibold">Time</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold">Feedback Given</th>
                    <th className="py-4 px-4 font-semibold">Call</th>
                    <th className="py-4 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, idx) => (
                    <motion.tr
                      key={r.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-sm"
                    >
                      <td className="py-4 px-4 text-slate-500 font-mono">{r.id}</td>
                      <td className="py-4 px-4 font-medium text-slate-900">{r.patientName}</td>
                      <td className="py-4 px-4 text-slate-700">{r.petName || '—'}</td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                          {r.appointmentType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700">{r.date}</td>
                      <td className="py-4 px-4 text-slate-700">{r.time || '—'}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            r.feedbackStatus === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}
                        >
                          {r.feedbackStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700">{r.feedbackGiven ? '✔ Yes' : '✘ No'}</td>
                      <td className="py-4 px-4">
                        {r.callAttempted ? (
                          <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                            <Phone size={14} />
                            Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                            <PhoneOff size={14} />
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => openEdit(r)}
                          className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-xl transition"
                        >
                          <Edit3 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-14 text-center text-slate-500 italic">
                        No feedback records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5">
            <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-white/70"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {editing ? 'Edit Feedback' : 'New Feedback'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Update appointment feedback details smoothly.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
                >
                  <X size={20} />
                </button>
              </div>

              {!editing && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2 text-slate-700">Prefill from existing appointment</label>
                  <select
                    onChange={e => handlePrefill(e.target.value)}
                    defaultValue=""
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                  >
                    <option value="">Select an appointment…</option>
                    {appointments.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.patientName} – {app.date} {app.time}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Patient Name *</label>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Pet Name</label>
                    <input
                      type="text"
                      value={form.petName}
                      onChange={e => setForm(f => ({ ...f, petName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Appointment Type</label>
                    <input
                      type="text"
                      value={form.appointmentType}
                      onChange={e => setForm(f => ({ ...f, appointmentType: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Feedback Status</label>
                    <select
                      value={form.feedbackStatus}
                      onChange={e => setForm(f => ({ ...f, feedbackStatus: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Toggle label="Feedback Given" checked={form.feedbackGiven} onChange={v => setForm(f => ({ ...f, feedbackGiven: v }))} />
                  <Toggle label="Call Attempted" checked={form.callAttempted} onChange={v => setForm(f => ({ ...f, callAttempted: v }))} />
                  <Toggle label="Call Picked" checked={form.callPicked} onChange={v => setForm(f => ({ ...f, callPicked: v }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-slate-700">Feedback Notes</label>
                  <textarea
                    rows={3}
                    value={form.feedbackText}
                    onChange={e => setForm(f => ({ ...f, feedbackText: e.target.value }))}
                    placeholder="Any additional comments…"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-slate-200 rounded-full font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60 hover:shadow-blue-500/30 transition"
                  >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-2xl">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
      </label>
    </div>
  );
}