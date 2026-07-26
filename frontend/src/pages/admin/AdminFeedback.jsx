import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Edit3, Trash2, X } from 'lucide-react';
import API_URL from '../../config/api';
import Pagination from '../../components/Pagination';

const emptyForm = { customerName: '', rating: 5, message: '' };
const PER_PAGE = 10;

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const paginated = feedbacks.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/api/feedbacks`, { headers: authHeaders() });
      const data = res.ok ? await res.json() : [];
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load feedback'); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (f) => { setEditing(f); setForm({ customerName: f.userName || '', rating: f.rating || 5, message: f.message || '' }); setShowForm(true); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return toast.error('Message is required');
    try {
      const url = editing ? `${API_URL}/api/feedbacks/${editing.id}` : `${API_URL}/api/feedbacks/admin`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Save failed');
      toast.success(editing ? 'Feedback updated' : 'Feedback added');
      setShowForm(false); setForm(emptyForm); setEditing(null); load();
    } catch { toast.error('Save failed'); }
  };

  const remove = async (f) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      const res = await fetch(`${API_URL}/api/feedbacks/${f.id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Delete failed');
      toast.success('Feedback deleted'); load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" /> Patient Feedback
        </h3>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-medical-dark hover:bg-medical-blue text-white font-bold px-4 py-2 rounded-full text-sm transition">
          <Plus size={18} /> Add Feedback
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-medical-dark">{editing ? 'Edit' : 'Add'} Feedback</h4>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Customer name</label>
              <input value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="Jane Doe" className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm mb-4 outline-none focus:border-medical-blue" />
              <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setForm((f) => ({ ...f, rating: n }))}>
                    <Star className={`w-7 h-7 ${form.rating >= n ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} placeholder="What did the customer say?" className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm mb-5 outline-none focus:border-medical-blue resize-none" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-full bg-medical-dark hover:bg-medical-blue text-white font-semibold">{editing ? 'Update' : 'Add'}</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback available.</p>
        ) : (
          paginated.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-medical-dark">{item.userName || 'Patient'}</p>
                  <p className="text-sm text-yellow-600 font-semibold">Rating: {item.rating}/5</p>
                  <p className="text-sm text-gray-700 mt-2">{item.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"><Edit3 size={14} /> Edit</button>
                    <button onClick={() => remove(item)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination page={page} total={feedbacks.length} perPage={PER_PAGE} onChange={setPage} />
    </div>
  );
}
