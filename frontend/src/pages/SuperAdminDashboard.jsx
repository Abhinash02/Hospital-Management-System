import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_URL from '../config/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Search, RefreshCw, Edit3, Trash2, Plus, Bell, ShieldCheck, Server, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

// Dummy Data for Graphs
const systemGrowthData = [
  { name: 'Jan', patients: 4000, hospitals: 2, admins: 2 },
  { name: 'Feb', patients: 4500, hospitals: 3, admins: 3 },
  { name: 'Mar', patients: 5200, hospitals: 4, admins: 4 },
  { name: 'Apr', patients: 6100, hospitals: 5, admins: 5 },
  { name: 'May', patients: 7500, hospitals: 8, admins: 8 },
  { name: 'Jun', patients: 8900, hospitals: 10, admins: 10 },
  { name: 'Jul', patients: 11000, hospitals: 12, admins: 14 },
];

const resourceData = [
  { name: 'Hospitals', value: 12 },
  { name: 'Admins', value: 14 },
  { name: 'Doctors', value: 145 },
  { name: 'Staff', value: 530 },
];

const systemLogs = [
  { time: '10 mins ago', event: 'SuperAdmin updated system-wide HL7 endpoints', status: 'Success' },
  { time: '30 mins ago', event: 'New Admin "Dr. Rajesh Sharma" onboarded to Mohali West', status: 'Success' },
  { time: '2 hours ago', event: 'Automated Database Backup completed successfully', status: 'Success' },
  { time: '5 hours ago', event: 'Security Audit: All 12 Hospital Nodes HIPAA Compliant', status: 'Verified' },
];

const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'];
const appointmentStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', hospital: '' });
  
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(data);
        setFilteredAdmins(data);
      } else {
        toast.error(data.message || 'Failed to load admins');
      }
    } catch (err) {
      toast.error('Unable to load admins.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', hospital: '' });
    setEditingAdmin(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const query = value.toLowerCase();
    setFilteredAdmins(admins.filter((admin) =>
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      (admin.hospital || '').toLowerCase().includes(query)
    ));
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        navigate('/');
      } else {
        setUser(parsedUser);
        fetchAdmins();
        loadAppointments();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      }
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

  const handleDeleteConfirm = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/admins/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || 'Unable to delete admin');
      }

      const updatedAdmins = admins.filter(a => a.id !== id);
      setAdmins(updatedAdmins);
      setFilteredAdmins(updatedAdmins.filter((admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (admin.hospital || '').toLowerCase().includes(searchTerm.toLowerCase())
      ));
      toast.success('Admin deleted successfully');
    } catch (err) {
      toast.error('Unable to delete admin. Please try again.');
    }
  };

  const handleDelete = (admin) => {
    toast((t) => (
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 max-w-sm mx-auto text-sm">
        <p className="text-gray-900 mb-4">Are you sure you want to delete <span className="font-bold">{admin.name}</span>?</p>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 font-bold"
            onClick={() => {
              handleDeleteConfirm(admin.id);
              toast.dismiss(t.id);
            }}
          >
            Yes, delete
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-4 py-2 font-bold"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, hospital: admin.hospital || '' });
    setShowAddForm(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email) return toast.error('Please fill required fields');

    try {
      const token = localStorage.getItem('token');
      let res;
      let data;

      if (editingAdmin) {
        res = await fetch(`${API_URL}/api/auth/admins/${editingAdmin.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            hospital: formData.hospital
          })
        });
        data = await res.json();

        if (!res.ok) {
          return toast.error(data.message || 'Unable to update admin');
        }

        const updatedAdmins = admins.map(a => a.id === editingAdmin.id ? data : a);
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins.filter((admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.hospital || '').toLowerCase().includes(searchTerm.toLowerCase())
        ));
        toast.success('Admin updated successfully');
      } else {
        res = await fetch(`${API_URL}/api/auth/admins`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            hospital: formData.hospital
          })
        });
        data = await res.json();

        if (!res.ok) {
          return toast.error(data.message || 'Unable to add admin');
        }

        const updatedAdmins = [...admins, data];
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins.filter((admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (admin.hospital || '').toLowerCase().includes(searchTerm.toLowerCase())
        ));
        toast.success('New Admin added successfully');
      }

      resetForm();
      setShowAddForm(false);
    } catch (err) {
      toast.error(editingAdmin ? 'Unable to update admin. Please try again.' : 'Unable to add admin. Please try again.');
    }
  };

  const broadcastAlert = () => {
    toast.success("Broadcast alert sent to all active hospital administrators!");
  };

  return (
    <DashboardLayout
      title="Super Admin Master Control Center"
      subtitle="System-wide management, global hospital statistics, and admin access control."
      user={user}
    >
      {/* SuperAdmin Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/30">
            <ShieldCheck size={14} /> Master Privileges Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Global Hospital System Overview</h1>
          <p className="text-gray-300 text-sm mt-1">Manage global admins, monitor database uptime, and issue system alerts.</p>
        </div>
        <button
          onClick={broadcastAlert}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-md transition"
        >
          <Bell size={16} /> Broadcast System Notice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Hospitals', value: '12', trend: '+2 this month', color: 'text-medical-blue', icon: Server },
          { title: 'Active Admins', value: admins.length.toString(), trend: 'Updated live', color: 'text-emerald-600', icon: ShieldCheck },
          { title: 'Total Patients', value: '11,000+', trend: '+15% growth', color: 'text-purple-600', icon: Server },
          { title: 'System Uptime', value: '99.99%', trend: 'HL7 Network Healthy', color: 'text-blue-600', icon: Server }
        ].map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{kpi.title}</h3>
                <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                <span className="text-xs font-bold text-gray-400 mt-1 block">{kpi.trend}</span>
              </div>
              <div className="p-3 bg-slate-50 text-gray-700 rounded-2xl">
                <IconComp size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* System Audit Log Activity Feed */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-4 border-b pb-3">
          <AlertCircle className="text-medical-blue" size={20} />
          <h3 className="font-bold text-gray-900 text-base">System Audit Trail & Live Activity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemLogs.map((log, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-gray-200/80 flex items-center justify-between text-sm">
              <div>
                <p className="font-bold text-gray-800">{log.event}</p>
                <span className="text-xs text-gray-400">{log.time}</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-bold text-medical-dark mb-6">Patient Growth Over Time</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={systemGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="patients" name="Total Patients" stroke="#1E40AF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-medical-dark mb-6">System Resource Allocations</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resourceData.map((entry, index) => (
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

      {/* Admin Management Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-medical-dark">Manage Hospital Admins</h2>
            <p className="text-sm text-gray-500">Onboard new hospital administrators and modify privileges.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search admins..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-medical-blue outline-none text-sm"
              />
            </div>
            <button
              type="button"
              onClick={fetchAdmins}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-xs transition text-sm"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button 
              onClick={() => {
                if (showAddForm) resetForm();
                setShowAddForm(!showAddForm);
              }}
              className="inline-flex items-center justify-center gap-2 bg-medical-dark hover:bg-medical-blue text-white font-bold py-2 px-5 rounded-full transition-colors shadow-xs text-sm"
            >
              <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Admin'}
            </button>
          </div>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="bg-slate-50 p-6 rounded-2xl border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-sm">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue" placeholder="Dr. Jane Doe" />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue" placeholder="jane@hospital.com" />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Assigned Hospital</label>
              <input type="text" name="hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-medical-blue" placeholder="Medpark West Branch" />
            </div>
            <div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                {editingAdmin ? 'Update Admin' : 'Save New Admin'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark text-sm">
                <th className="py-3.5 px-4 font-semibold rounded-tl-lg">Admin Name</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Hospital</th>
                <th className="py-3.5 px-4 font-semibold text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm">
                  <td className="py-4 px-4 font-bold text-medical-dark">{admin.name}</td>
                  <td className="py-4 px-4 text-gray-600">{admin.email}</td>
                  <td className="py-4 px-4 text-gray-600">{admin.hospital || 'Unassigned'}</td>
                  <td className="py-4 px-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(admin)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold">
                      <Edit3 size={15} /> Edit
                    </button>
                    <button onClick={() => handleDelete(admin)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold">
                      <Trash2 size={15} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 italic">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Appointments Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-medical-dark">Global System Appointments</h2>
            <p className="text-sm text-gray-500">Master view of all patient bookings across hospitals.</p>
          </div>
          <button
            type="button"
            onClick={loadAppointments}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-xs transition text-sm"
          >
            <RefreshCw size={16} /> Refresh Appointments
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark">
                <th className="py-3.5 px-4 font-semibold rounded-tl-lg">Patient Name</th>
                <th className="py-3.5 px-4 font-semibold">Hospital ID</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Time</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right rounded-tr-lg">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                  <td colSpan="6" className="py-8 text-center text-gray-500 italic">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
