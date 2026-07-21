import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Search, RefreshCw, Edit3, Trash2, Plus } from 'lucide-react';
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

const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'];
const appointmentStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', hospital: '' });
  
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/admins', {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    } finally {
      setIsLoading(false);
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
    setAppointmentsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || 'Unable to load appointments');
      }
      setAppointments(data);
    } catch (err) {
      toast.error('Unable to load appointments.');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const changeAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/auth/admins/${id}`, {
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
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 max-w-sm mx-auto">
        <p className="text-sm text-gray-900 mb-4">Are you sure you want to delete <span className="font-semibold">{admin.name}</span>?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-semibold"
            onClick={() => {
              handleDeleteConfirm(admin.id);
              toast.dismiss(t.id);
            }}
          >
            Yes, delete
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-4 py-2 font-semibold"
            onClick={() => toast.dismiss(t.id)}
          >
            No, keep
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
        res = await fetch(`http://localhost:5000/api/auth/admins/${editingAdmin.id}`, {
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
        res = await fetch('http://localhost:5000/api/auth/admins', {
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

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      subtitle="System-wide overview and management."
      user={user}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-medical-dark">Super Admin Dashboard</h1>
          <p className="text-gray-500">System-wide overview and management.</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="font-semibold text-gray-700">{user.name}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Hospitals', value: '12', trend: '+2 this month', color: 'text-medical-blue' },
          { title: 'Active Admins', value: admins.length.toString(), trend: 'Updated just now', color: 'text-green-600' },
          { title: 'Total Patients', value: '11,000+', trend: '+15% growth', color: 'text-purple-600' },
          { title: 'System Uptime', value: '99.9%', trend: 'Healthy', color: 'text-medical-dark' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{kpi.title}</h3>
            <div className="flex items-end justify-between">
              <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
              <span className={`text-xs font-bold text-gray-400`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* System Growth Line Chart */}
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

        {/* Resource Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-medical-dark mb-6">System Resources</h2>
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
            <h2 className="text-2xl font-bold text-medical-dark">Manage Admins</h2>
            <p className="text-sm text-gray-500">Add, edit, and remove hospital admins quickly.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search admins..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-medical-blue focus:border-medical-blue outline-none"
              />
            </div>
            <button
              type="button"
              onClick={fetchAdmins}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-sm transition"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button 
              onClick={() => {
                if (showAddForm) resetForm();
                setShowAddForm(!showAddForm);
              }}
              className="inline-flex items-center justify-center gap-2 bg-medical-dark hover:bg-medical-blue text-white font-bold py-2 px-5 rounded-full transition-colors shadow-sm"
            >
              <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Admin'}
            </button>
          </div>
        </div>

        {/* Add Admin Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1 lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-medical-blue" placeholder="Jane Doe" />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-medical-blue" placeholder="jane@hospital.com" />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Hospital</label>
              <input type="text" name="hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-medical-blue" placeholder="Medpark West" />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                {editingAdmin ? 'Update Admin' : 'Save Admin'}
              </button>
            </div>
          </form>
        )}

        {/* Admins Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Hospital</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <motion.tr
                  key={admin.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <td className="py-4 px-4 font-medium text-medical-dark">{admin.name}</td>
                  <td className="py-4 px-4 text-gray-600">{admin.email}</td>
                  <td className="py-4 px-4 text-gray-600">{admin.hospital || 'Unassigned'}</td>
                  <td className="py-4 px-4 text-right flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4">
                    <button onClick={() => handleEdit(admin)} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                      <Edit3 size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(admin)} className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-medium">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </motion.tr>
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

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-medical-dark">All Appointments</h2>
            <p className="text-sm text-gray-500">Review user bookings and update status across the system.</p>
          </div>
          <button
            type="button"
            onClick={loadAppointments}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-sm transition"
          >
            <RefreshCw size={16} /> Refresh Appointments
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-medical-blue/10 text-medical-dark">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Patient</th>
                <th className="py-3 px-4 font-semibold">Hospital</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Update</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <motion.tr
                  key={appointment.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <td className="py-4 px-4 font-medium text-medical-dark">{appointment.patientName}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.hospitalId}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.date}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.time}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                      appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={appointment.status}
                      onChange={(e) => changeAppointmentStatus(appointment.id, e.target.value)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-full bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-medical-blue"
                    >
                      {appointmentStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </motion.tr>
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
