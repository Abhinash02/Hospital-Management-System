import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../../config/api';

const ITEMS_PER_PAGE = 5;
const appointmentStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [editModal, setEditModal] = useState(false);
  const [bookModal, setBookModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    date: '',
    time: '',
    reason: '',
    status: 'Pending',
    hospitalId: '',
    doctorName: 'Any Available Doctor'
  });

  const [bookForm, setBookForm] = useState({
    hospitalId: '',
    doctorName: 'Any Available Doctor',
    date: '',
    time: '',
    patientName: '',
    patientPhone: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchHospitals();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setAppointments(Array.isArray(data) ? data : []);
      } else {
        toast.error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      setHospitalLoading(true);

      const res = await fetch(`${API_URL}/api/hospitals`);
      const data = await res.json();

      if (res.ok) {
        const hospitalList = Array.isArray(data) ? data : [];
        setHospitals(hospitalList);
      } else {
        toast.error(data.message || 'Failed to fetch hospitals');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load hospitals');
    } finally {
      setHospitalLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (
      !bookForm.hospitalId ||
      !bookForm.date ||
      !bookForm.time ||
      !bookForm.patientName ||
      !bookForm.patientPhone
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookForm)
      });

      const data = await res.json();

      if (res.ok) {
        const selectedHospital = hospitals.find((h) => h.id === bookForm.hospitalId);

        toast.success(data.message || 'Appointment booked successfully');
        setAppointments((prev) => [
          {
            ...data.appointment,
            hospitalName: selectedHospital?.name || data.appointment?.hospitalId || '-'
          },
          ...prev
        ]);
        setBookModal(false);
        setBookForm({
          hospitalId: '',
          doctorName: 'Any Available Doctor',
          date: '',
          time: '',
          patientName: '',
          patientPhone: '',
          reason: ''
        });
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error booking appointment');
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Appointment status updated');
        setAppointments((prev) =>
          prev.map((item) =>
            item.id === appointmentId
              ? { ...item, status: data.appointment?.status || status }
              : item
          )
        );
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating appointment status');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Appointment deleted successfully');
        setAppointments((prev) => prev.filter((item) => item.id !== appointmentId));
      } else {
        toast.error(data.message || 'Failed to delete appointment');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting appointment');
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientName: appointment.patientName || '',
      patientPhone: appointment.patientPhone || '',
      date: appointment.date || '',
      time: appointment.time || '',
      reason: appointment.reason || '',
      status: appointment.status || 'Pending',
      hospitalId: appointment.hospitalId || '',
      doctorName: appointment.doctorName || 'Any Available Doctor'
    });
    setEditModal(true);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();

    if (!selectedAppointment) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        const selectedHospital = hospitals.find((h) => h.id === formData.hospitalId);

        toast.success(data.message || 'Appointment updated successfully');
        setAppointments((prev) =>
          prev.map((item) =>
            item.id === selectedAppointment.id
              ? {
                  ...item,
                  ...data.appointment,
                  hospitalName: selectedHospital?.name || item.hospitalName || data.appointment?.hospitalId
                }
              : item
          )
        );
        setEditModal(false);
        setSelectedAppointment(null);
      } else {
        toast.error(data.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating appointment');
    }
  };

  const normalizedStatus = (status) => {
    if (status === 'Confirmed' || status === 'Pending' || status === 'In Progress') return 'Scheduled';
    if (status === 'Completed') return 'Completed';
    if (status === 'Cancelled') return 'Cancelled';
    return 'Scheduled';
  };

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'All') return appointments;
    return appointments.filter((item) => normalizedStatus(item.status) === activeFilter);
  }, [appointments, activeFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, appointments.length]);

  const getStatusPillClass = (status) => {
    const normalized = normalizedStatus(status);

    if (normalized === 'Completed') return 'bg-green-100 text-green-700';
    if (normalized === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  const getExactStatusClass = (status) => {
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Confirmed') return 'bg-blue-100 text-blue-800';
    if (status === 'In Progress') return 'bg-purple-100 text-purple-800';
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const filterBtnClass = (label) =>
    `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
      activeFilter === label
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-sm'
        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-[#f4f5fb] p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Booked Appointment Details
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchAppointments}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setBookModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button className={filterBtnClass('All')} onClick={() => setActiveFilter('All')}>
            <span>📋</span> All
          </button>
          <button className={filterBtnClass('Scheduled')} onClick={() => setActiveFilter('Scheduled')}>
            <span>✅</span> Scheduled
          </button>
          <button className={filterBtnClass('Completed')} onClick={() => setActiveFilter('Completed')}>
            <span>✔</span> Completed
          </button>
          <button className={filterBtnClass('Cancelled')} onClick={() => setActiveFilter('Cancelled')}>
            <span>❌</span> Cancelled
          </button>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr className="text-left">
                  <th className="px-4 py-4 text-sm font-semibold">Date</th>
                  <th className="px-4 py-4 text-sm font-semibold">Time</th>
                  <th className="px-4 py-4 text-sm font-semibold">Patient Name</th>
                  <th className="px-4 py-4 text-sm font-semibold">Phone</th>
                  <th className="px-4 py-4 text-sm font-semibold">Hospital</th>
                  <th className="px-4 py-4 text-sm font-semibold">Appointment Type</th>
                  <th className="px-4 py-4 text-sm font-semibold">Status</th>
                  <th className="px-4 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Loading appointments...
                    </td>
                  </tr>
                ) : paginatedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  paginatedAppointments.map((app, index) => (
                    <tr
                      key={app.id}
                      className={`border-b border-slate-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                      }`}
                    >
                      <td className="px-4 py-4 text-sm text-slate-700">{app.date || '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{app.time || '-'}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700">
                        {app.patientName || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{app.patientPhone || '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {app.hospitalName || app.hospitalId || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                          Consult
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusPillClass(app.status)}`}>
                          {normalizedStatus(app.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => updateAppointmentStatus(app.id, e.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            {appointmentStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleEditClick(app)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteAppointment(app.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {loading ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-gray-500 shadow-sm">
              Loading appointments...
            </div>
          ) : paginatedAppointments.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-gray-500 shadow-sm">
              No appointments found.
            </div>
          ) : (
            paginatedAppointments.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{app.patientName || '-'}</h3>
                    <p className="text-sm text-slate-500">
                      {app.date || '-'} at {app.time || '-'}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusPillClass(app.status)}`}>
                    {normalizedStatus(app.status)}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-slate-600">
                  <p><span className="font-medium">Phone:</span> {app.patientPhone || '-'}</p>
                  <p><span className="font-medium">Hospital:</span> {app.hospitalName || app.hospitalId || '-'}</p>
                  <p><span className="font-medium">Doctor:</span> {app.doctorName || 'Any Available Doctor'}</p>
                  {app.reason ? <p className="italic text-slate-500">"{app.reason}"</p> : null}
                </div>

                <div className="mt-4 space-y-3">
                  <select
                    value={app.status}
                    onChange={(e) => updateAppointmentStatus(app.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {appointmentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <span className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${getExactStatusClass(app.status)}`}>
                    {app.status}
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEditClick(app)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteAppointment(app.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-50 px-4 py-2.5 text-sm font-medium text-pink-600 hover:bg-pink-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredAppointments.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {bookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-white">
              <h2 className="text-lg font-bold sm:text-xl">Book New Appointment</h2>
              <button
                type="button"
                onClick={() => setBookModal(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

           <form onSubmit={handleBookAppointment} className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={bookForm.date}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Appointment Time *
                  </label>
                  <input
                    type="time"
                    value={bookForm.time}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Hospital *
                  </label>
                  <select
                    value={bookForm.hospitalId}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, hospitalId: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  >
                    <option value="">
                      {hospitalLoading ? 'Loading hospitals...' : 'Select hospital'}
                    </option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name} {hospital.location ? `- ${hospital.location}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={bookForm.doctorName}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, doctorName: e.target.value }))}
                    placeholder="Any Available Doctor"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <h3 className="text-base font-semibold text-slate-800">Patient Information</h3>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={bookForm.patientName}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={bookForm.patientPhone}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, patientPhone: e.target.value }))}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <input
                    type="text"
                    value="Pending"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Reason
                  </label>
                  <textarea
                    rows="4"
                    value={bookForm.reason}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="Write appointment reason"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setBookModal(false)}
                  className="rounded-xl bg-slate-500 px-5 py-3 text-sm font-medium text-white hover:bg-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
         <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-xl font-bold text-slate-800">Edit Appointment</h2>
              <button
                onClick={() => {
                  setEditModal(false);
                  setSelectedAppointment(null);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

           <form onSubmit={handleUpdateAppointment} className="flex-1 overflow-y-auto p-5">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, patientName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.patientPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, patientPhone: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Hospital
                  </label>
                  <select
                    value={formData.hospitalId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hospitalId: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  >
                    <option value="">
                      {hospitalLoading ? 'Loading hospitals...' : 'Select hospital'}
                    </option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name} {hospital.location ? `- ${hospital.location}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {appointmentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, doctorName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Reason
                  </label>
                  <textarea
                    rows="4"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, reason: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Update Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
