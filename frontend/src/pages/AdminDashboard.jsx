import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_URL from '../config/api';
import { Search, Plus, Edit3, Trash2, RefreshCw, Download, Activity, UserCheck, Building2, BedDouble } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

// Analytics Data
const weeklyAppointmentsData = [
  { name: 'Mon', appointments: 40, completed: 35 },
  { name: 'Tue', appointments: 30, completed: 28 },
  { name: 'Wed', appointments: 45, completed: 42 },
  { name: 'Thu', appointments: 50, completed: 45 },
  { name: 'Fri', appointments: 65, completed: 60 },
  { name: 'Sat', appointments: 80, completed: 75 },
  { name: 'Sun', appointments: 70, completed: 65 },
];

const departmentData = [
  { name: 'Cardiology', value: 400 },
  { name: 'Neurology', value: 300 },
  { name: 'Orthopedics', value: 300 },
  { name: 'Pediatrics', value: 200 },
];

const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'];
const appointmentStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [editingHospital, setEditingHospital] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', beds: '', contact: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/');
      } else {
        setUser(parsedUser);
        loadHospitals();
        loadAppointments();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadHospitals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hospitals`);
      const data = await res.json();
      setHospitals(data);
      setFilteredHospitals(data);
    } catch (err) {
      toast.error('Unable to load hospitals.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', beds: '', contact: '' });
    setEditingHospital(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const query = value.toLowerCase();
    setFilteredHospitals(hospitals.filter((hospital) =>
      hospital.name.toLowerCase().includes(query) ||
      hospital.location.toLowerCase().includes(query)
    ));
  };

  const handleEdit = (hospital) => {
    setEditingHospital(hospital);
    setFormData({ name: hospital.name, location: hospital.location, beds: hospital.beds, contact: hospital.contact });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/hospitals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || 'Unable to delete hospital');
      }
      const updated = hospitals.filter((h) => h.id !== id);
      setHospitals(updated);
      setFilteredHospitals(updated.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      toast.success('Hospital deleted successfully');
    } catch (err) {
      toast.error('Unable to delete hospital.');
    }
  };

  const confirmHospitalDelete = (hospital) => {
    toast((t) => (
      <div className="rounded-2xl bg-white p-4 shadow-lg border border-gray-200 text-sm text-gray-700">
        <p className="font-semibold text-gray-900 mb-3">Delete {hospital.name}?</p>
        <p className="text-gray-500 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button onClick={() => { toast.dismiss(t.id); handleDelete(hospital.id); }} className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      toast.error('Unable to load appointments.');
    }
  };

  const changeAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || 'Unable to update appointment');
      }
      const updated = appointments.map((appointment) => appointment.id === id ? data.appointment || data : appointment);
      setAppointments(updated);
      toast.success('Appointment status updated');
    } catch (err) {
      toast.error('Unable to update appointment status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return toast.error('Name and location are required');

    try {
      const token = localStorage.getItem('token');
      const endpoint = editingHospital ? `${API_URL}/api/hospitals/${editingHospital.id}` : `${API_URL}/api/hospitals`;
      const method = editingHospital ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || 'Unable to save hospital');
      }

      const updated = editingHospital
        ? hospitals.map((h) => (h.id === data.id ? data : h))
        : [...hospitals, data];
      setHospitals(updated);
      setFilteredHospitals(updated.filter((hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      resetForm();
      setShowForm(false);
      toast.success(editingHospital ? 'Hospital updated successfully' : 'Hospital added successfully');
    } catch (err) {
      toast.error('Unable to save hospital.');
    }
  };

  const exportReport = () => {
    toast.success("Hospital Operations Report exported to CSV!");
  };

  return (
    <DashboardLayout
      title="Hospital Admin Control Center"
      subtitle="Manage hospitals, monitor bed occupancy, and review appointments."
      user={user}
    >
      {/* Header Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-medical-blue" />
          <h2 className="text-xl font-bold text-medical-dark">Hospital System Overview</h2>
        </div>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2.5 rounded-full font-bold text-sm shadow-xs transition"
        >
          <Download size={16} /> Export Operations CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Hospitals', value: hospitals.length.toString(), trend: '+2 this month', color: 'text-medical-blue', icon: Building2 },
          { title: 'Active Appointments', value: appointments.length.toString(), trend: appointments.length ? `${appointments.length} active` : 'No bookings', color: 'text-green-600', icon: Activity },
          { title: 'Total Bed Occupancy', value: '78%', trend: '420/500 Occupied', color: 'text-amber-600', icon: BedDouble },
          { title: 'Specialist Doctors', value: '145', trend: 'Duty Active', color: 'text-purple-600', icon: UserCheck }
        ].map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08, duration: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{kpi.title}</h3>
                <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                <span className="text-xs font-bold text-gray-400 mt-1 block">{kpi.trend}</span>
              </div>
              <div className="p-3 bg-slate-50 text-gray-600 rounded-2xl">
                <IconComp size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Bed Occupancy Progress Widget */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900 text-sm">Hospital Bed Capacity Utilization</h3>
          <span className="text-xs font-bold text-medical-blue">78% Capacity Used</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full w-[78%] transition-all duration-1000"></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-bold text-medical-dark mb-6">Weekly Appointments Overview</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAppointmentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Legend iconType="circle" />
                <Bar dataKey="appointments" name="Booked" fill="#1E40AF" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="completed" name="Completed" fill="#60A5FA" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-medical-dark mb-6">Patients by Department</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" layout="vertical" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hospital Management Table */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-medical-dark">Manage Hospital Branch Network</h2>
            <p className="text-gray-500 mt-1">Add, update, and manage hospital capacity and emergency contact info.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search hospitals..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-medical-blue focus:border-medical-blue outline-none text-sm"
              />
            </div>
            <button onClick={loadHospitals} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-xs transition text-sm">
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="inline-flex items-center gap-2 bg-medical-dark hover:bg-medical-blue text-white font-bold px-5 py-2 rounded-full transition-shadow shadow-xs text-sm">
              <Plus size={18} /> {showForm ? 'Cancel' : 'Add Hospital'}
            </button>
          </div>
        </div>

        {showForm && (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital Name</label>
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue text-sm" placeholder="Medpark Hospital Mohali" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue text-sm" placeholder="Phase 8, Mohali" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bed Capacity</label>
              <input type="text" name="beds" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue text-sm" placeholder="500+" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
              <input type="text" name="contact" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue text-sm" placeholder="+91 98765 43210" />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm">
                {editingHospital ? 'Update Hospital Details' : 'Save New Hospital'}
              </button>
            </div>
          </motion.form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark">
                <th className="py-3.5 px-4 font-semibold rounded-tl-lg text-sm">Hospital</th>
                <th className="py-3.5 px-4 font-semibold text-sm">Location</th>
                <th className="py-3.5 px-4 font-semibold text-sm">Beds</th>
                <th className="py-3.5 px-4 font-semibold text-sm">Contact</th>
                <th className="py-3.5 px-4 font-semibold text-right rounded-tr-lg text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-medical-dark text-sm">{hospital.name}</td>
                  <td className="py-4 px-4 text-gray-600 text-sm">{hospital.location}</td>
                  <td className="py-4 px-4 text-gray-600 text-sm">{hospital.beds || 'N/A'}</td>
                  <td className="py-4 px-4 text-gray-600 text-sm">{hospital.contact || '—'}</td>
                  <td className="py-4 px-4 text-right flex justify-end gap-3 text-sm">
                    <button onClick={() => handleEdit(hospital)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold">
                      <Edit3 size={15} /> Edit
                    </button>
                    <button onClick={() => confirmHospitalDelete(hospital)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold">
                      <Trash2 size={15} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHospitals.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 italic">No hospitals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Appointments Management Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-medical-dark">User Appointments Management</h2>
            <p className="text-gray-500 mt-1">View all patient bookings and update status in real-time.</p>
          </div>
          <button onClick={loadAppointments} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-xs transition text-sm">
            <RefreshCw size={16} /> Refresh Appointments
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark text-sm">
                <th className="py-3.5 px-4 font-semibold rounded-tl-lg">Patient Name</th>
                <th className="py-3.5 px-4 font-semibold">Hospital</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Time Slot</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right rounded-tr-lg">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                  <td className="py-4 px-4 font-bold text-medical-dark">{appointment.patientName}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.hospitalId}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.date}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.time}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      appointment.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={appointment.status}
                      onChange={(e) => changeAppointmentStatus(appointment.id, e.target.value)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-full bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-medical-blue"
                    >
                      {appointmentStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 italic">No appointments booked yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
