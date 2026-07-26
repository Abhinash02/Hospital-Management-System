import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  CalendarClock,
  CheckCircle2,
  Trash2,
  Link2,
  Video,
  Search,
  CalendarDays,
  Clock,
  XCircle,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config/api';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardTabs from '../../components/DashboardTabs';
import Pagination from '../../components/Pagination';

const PER_PAGE = 10;

const STATUS_STYLES = {
  requested: 'bg-amber-100 text-amber-700',
  invited: 'bg-purple-100 text-purple-700',
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

const emptyCounts = { total: 0, requested: 0, invited: 0, scheduled: 0, completed: 0, cancelled: 0 };

export default function SuperAdminDemos() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [counts, setCounts] = useState(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return navigate('/login');
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'superadmin') return navigate('/');
    setUser(parsed);
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/demos`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to load demo bookings');
        setBookings([]);
        setCounts(emptyCounts);
        return;
      }
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      setCounts(data.counts || emptyCounts);
    } catch (err) {
      toast.error('Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  const patchBooking = async (id, body, successMsg) => {
    try {
      const res = await fetch(`${API_URL}/api/demos/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Update failed');
      toast.success(successMsg || 'Updated');
      fetchBookings();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleInvite = async (b) => {
    try {
      const res = await fetch(`${API_URL}/api/demos/${b.id}/invite`, {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Could not send invite');
      toast.success('Scheduling invite emailed');
      fetchBookings();
    } catch (err) {
      toast.error('Could not send invite');
    }
  };

  const handleReschedule = (b) => {
    const current = b.scheduled_at ? new Date(b.scheduled_at).toISOString().slice(0, 16) : '';
    const input = window.prompt(
      'New date & time (YYYY-MM-DDTHH:mm, e.g. 2026-08-01T14:30):',
      current
    );
    if (input === null) return;
    const iso = new Date(input);
    if (Number.isNaN(iso.getTime())) return toast.error('Invalid date/time');
    patchBooking(b.id, { scheduledAt: iso.toISOString(), status: 'scheduled' }, 'Demo rescheduled');
  };

  const handleEditLink = (b) => {
    const input = window.prompt('Meeting link:', b.meeting_link || '');
    if (input === null) return;
    patchBooking(b.id, { meetingLink: input.trim() }, 'Meeting link updated');
  };

  const handleComplete = async (b) => {
    try {
      const res = await fetch(`${API_URL}/api/demos/${b.id}/complete`, {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Could not complete');
      toast.success('Marked completed');
      fetchBookings();
    } catch (err) {
      toast.error('Could not complete');
    }
  };

  const handleCancel = (b) =>
    patchBooking(b.id, { status: 'cancelled' }, 'Demo cancelled');

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete the demo booking for "${b.hospital_name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/demos/${b.id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Delete failed');
      toast.success('Booking deleted');
      fetchBookings();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesSearch =
        !q ||
        [b.hospital_name, b.contact_name, b.email, b.city]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [search, statusFilter]);
  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const statCards = [
    { title: 'Total Bookings', value: counts.total, icon: CalendarDays, color: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
    { title: 'Requested', value: counts.requested, icon: Clock, color: 'border-amber-500', bg: 'bg-amber-100', text: 'text-amber-600' },
    { title: 'Scheduled', value: counts.scheduled, icon: CalendarClock, color: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600' },
    { title: 'Completed', value: counts.completed, icon: CheckCircle2, color: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600' }
  ];

  return (
    <DashboardLayout
      title="Demo Bookings"
      subtitle="Manage demo requests from prospective hospitals — reschedule, complete, or remove."
      user={user}
    >
      <DashboardTabs role="superadmin" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className={`bg-white rounded-2xl p-4 sm:p-6 shadow border-b-4 ${c.color}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">{c.title}</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-medical-dark mt-2">{c.value}</p>
                </div>
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-medical-dark">All demo requests</h2>
            <p className="text-sm text-gray-500">{filtered.length} of {bookings.length} shown</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital, name, email…"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none focus:border-medical-blue"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-medical-blue bg-white"
            >
              <option value="all">All statuses</option>
              <option value="requested">Requested</option>
              <option value="invited">Invited</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={fetchBookings}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full font-semibold shadow-sm transition"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading demo bookings…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-medical-blue/10 text-medical-dark text-sm">
                  <th className="py-3 px-4 font-semibold rounded-tl-lg">Hospital</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold">Scheduled</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Meeting</th>
                  <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-medical-dark">{b.hospital_name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-1">
                        {b.city || '—'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-800">{b.contact_name}</div>
                      <div className="text-gray-500 text-xs">{b.email}</div>
                      {b.phone && <div className="text-gray-500 text-xs">{b.phone}</div>}
                    </td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{fmt(b.scheduled_at)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {b.meeting_link ? (
                        <a
                          href={b.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-medical-blue hover:underline text-xs font-medium"
                        >
                          <Video size={14} /> Join
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">No link</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {(b.status === 'requested' || b.status === 'invited') && (
                          <ActionBtn onClick={() => handleInvite(b)} className="text-purple-600 hover:bg-purple-50">
                            <Send size={14} /> {b.status === 'invited' ? 'Resend invite' : 'Send invite'}
                          </ActionBtn>
                        )}
                        <ActionBtn onClick={() => handleReschedule(b)} className="text-indigo-600 hover:bg-indigo-50">
                          <CalendarClock size={14} /> Reschedule
                        </ActionBtn>
                        <ActionBtn onClick={() => handleEditLink(b)} className="text-slate-600 hover:bg-slate-50">
                          <Link2 size={14} /> Link
                        </ActionBtn>
                        {b.status !== 'completed' && (
                          <ActionBtn onClick={() => handleComplete(b)} className="text-green-600 hover:bg-green-50">
                            <CheckCircle2 size={14} /> Complete
                          </ActionBtn>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <ActionBtn onClick={() => handleCancel(b)} className="text-amber-600 hover:bg-amber-50">
                            <XCircle size={14} /> Cancel
                          </ActionBtn>
                        )}
                        <ActionBtn onClick={() => handleDelete(b)} className="text-red-600 hover:bg-red-50">
                          <Trash2 size={14} /> Delete
                        </ActionBtn>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500 italic">
                      No demo bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
    </DashboardLayout>
  );
}

function ActionBtn({ onClick, className = '', children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}
