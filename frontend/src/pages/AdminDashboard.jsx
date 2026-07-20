import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Dummy Data
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

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/');
      } else {
        setUser(parsedUser);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-medical-dark">Hospital Admin Dashboard</h1>
        {user && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-medical-blue flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="font-semibold text-gray-700">{user.name}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Appointments', value: '1,284', trend: '+12%', color: 'text-medical-blue' },
          { title: 'New Patients', value: '342', trend: '+5%', color: 'text-green-600' },
          { title: 'Surgeries', value: '56', trend: '-2%', color: 'text-purple-600' },
          { title: 'Revenue (Weekly)', value: '$45,231', trend: '+8%', color: 'text-yellow-600' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{kpi.title}</h3>
            <div className="flex items-end justify-between">
              <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
              <span className={`text-sm font-bold ${kpi.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Trend Bar Chart */}
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

        {/* Department Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-medical-dark mb-6">Patient by Department</h2>
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

        {/* Patient Recovery Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-3 mb-8">
          <h2 className="text-xl font-bold text-medical-dark mb-6">Weekly Admittance vs Discharge Trend</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyAppointmentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="appointments" name="Admitted" stroke="#1E40AF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="completed" name="Discharged" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
