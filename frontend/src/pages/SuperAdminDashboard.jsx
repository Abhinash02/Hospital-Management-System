import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';

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

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Hospital Admin 1', email: 'admin1@hospital.com', hospital: 'Medpark City Center' },
    { id: 2, name: 'Hospital Admin 2', email: 'admin2@hospital.com', hospital: 'Medpark South Clinic' },
    { id: 3, name: 'John Admin', email: 'john@hospital.com', hospital: 'Medpark North' },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', hospital: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'superadmin') {
        navigate('/');
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(a => a.id !== id));
      toast.success('Admin deleted successfully');
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email) return toast.error('Please fill required fields');
    
    const newAdmin = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      hospital: formData.hospital || 'Unassigned'
    };
    
    setAdmins([...admins, newAdmin]);
    setFormData({ name: '', email: '', hospital: '' });
    setShowAddForm(false);
    toast.success('New Admin added successfully');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-medical-dark">Manage Admins</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-medical-dark hover:bg-medical-blue text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
          >
            {showAddForm ? 'Cancel' : '+ Add New Admin'}
          </button>
        </div>

        {/* Add Admin Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-medical-blue" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-medical-blue" placeholder="jane@hospital.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Hospital</label>
              <input type="text" name="hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-medical-blue" placeholder="Medpark West" />
            </div>
            <div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                Save Admin
              </button>
            </div>
          </form>
        )}

        {/* Admins Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Hospital</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-medical-dark">{admin.name}</td>
                  <td className="py-4 px-4 text-gray-600">{admin.email}</td>
                  <td className="py-4 px-4 text-gray-600">{admin.hospital}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-4">Edit</button>
                    <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 italic">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
