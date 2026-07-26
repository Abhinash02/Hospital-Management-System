const { supabase } = require('../config/supabase');
const Users = require('../db/users');

const T = 'hospitals';

const getHospitals = async (req, res) => {
  const { data, error } = await supabase.from(T).select('*').order('createdAt', { ascending: false });
  if (error) { console.error('[hospitals] list:', error); return res.status(500).json({ message: 'Could not load hospitals' }); }
  return res.json(data || []);
};

const getHospitalById = async (req, res) => {
  const { data } = await supabase.from(T).select('*').eq('id', req.params.id).limit(1);
  const hospital = data && data[0];
  if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
  return res.json(hospital);
};

const createHospital = async (req, res) => {
  const { name, location, icu, careType, specialty, beds, contact, videoUrl, imageUrl, adminName, adminEmail, adminPassword, timings, emergency } = req.body;
  if (!name || !location) return res.status(400).json({ message: 'Hospital name and location are required' });

  const hospitalId = Date.now().toString();
  const newHospital = {
    id: hospitalId, name, location,
    icu: icu || '24/7 ICU', careType: careType || 'Advanced Care', specialty: specialty || 'Super Specialty',
    beds: beds || '300+', contact: contact || '+91 91225-56789', videoUrl: videoUrl || '',
    email: adminEmail || '', timings: timings || 'Mon - Sat • 8:00 AM - 8:00 PM', emergency: emergency || '24/7 Emergency Available'
  };
  // Only include the image when one was uploaded (so it works even before the imageUrl column is added).
  if (imageUrl) newHospital.imageUrl = imageUrl;

  let { data: inserted, error } = await supabase.from(T).insert(newHospital).select().single();
  // If the imageUrl column hasn't been added yet, save the hospital without the image.
  if (error && error.code === 'PGRST204' && 'imageUrl' in newHospital) {
    console.warn('[hospitals] imageUrl column missing — saving without image. Add it with: alter table hospitals add column "imageUrl" text;');
    const { imageUrl, ...rest } = newHospital;
    ({ data: inserted, error } = await supabase.from(T).insert(rest).select().single());
  }
  if (error) { console.error('[hospitals] create:', error); return res.status(500).json({ message: 'Could not create hospital' }); }

  // Optional admin login (created with the registrant's own password at approval otherwise).
  let createdAdmin = null;
  if (adminEmail) {
    const password = (adminPassword && String(adminPassword).trim()) ? String(adminPassword).trim() : Math.random().toString(36).slice(-10);
    const existing = await Users.findByEmail(adminEmail);
    if (existing) createdAdmin = await Users.update(existing.id, { hospital: name, hospitalId });
    else createdAdmin = await Users.insert({ id: (Date.now() + 1).toString(), name: adminName || `${name} Admin`, email: adminEmail, password, role: 'admin', hospital: name, hospitalId, active: true });
  }

  return res.status(201).json({ success: true, message: 'Hospital created successfully', hospital: inserted, admin: createdAdmin });
};

const updateHospital = async (req, res) => {
  const { id } = req.params;
  const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
  const existing = arr && arr[0];
  if (!existing) return res.status(404).json({ message: 'Hospital not found' });

  const { adminName, adminEmail, adminPassword, id: _ignore, ...hospitalUpdates } = req.body;
  const patch = { ...hospitalUpdates, ...(adminEmail ? { email: adminEmail } : {}) };
  // Drop an empty imageUrl so updates work even before the column is added.
  if (!patch.imageUrl) delete patch.imageUrl;

  let { data: updated, error } = await supabase.from(T).update(patch).eq('id', id).select().single();
  if (error && error.code === 'PGRST204' && 'imageUrl' in patch) {
    const { imageUrl, ...rest } = patch;
    ({ data: updated, error } = await supabase.from(T).update(rest).eq('id', id).select().single());
  }
  if (error) { console.error('[hospitals] update:', error); return res.status(500).json({ message: 'Could not update hospital' }); }

  // Reflect on the linked admin.
  const admins = await Users.all({ role: 'admin', hospitalId: id });
  if (admins[0]) {
    const ap = { hospital: updated.name, hospitalId: updated.id };
    if (adminName) ap.name = adminName;
    if (adminEmail) ap.email = adminEmail;
    if (adminPassword) ap.password = adminPassword;
    await Users.update(admins[0].id, ap);
  }
  return res.json(updated);
};

const updateOwnHospitalTimings = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only hospital admin can update timings' });
  const { timings, emergency } = req.body;
  const { data: arr } = await supabase.from(T).select('*').eq('id', req.user.hospitalId).limit(1);
  const h = arr && arr[0];
  if (!h) return res.status(404).json({ message: 'Hospital not found for this admin' });

  const { data: updated } = await supabase.from(T).update({
    timings: timings || h.timings || 'Mon - Sat • 8:00 AM - 8:00 PM',
    emergency: emergency || h.emergency || '24/7 Emergency Available'
  }).eq('id', h.id).select().single();
  return res.json({ message: 'Hospital timings updated successfully', hospital: updated });
};

const deleteHospital = async (req, res) => {
  const { id } = req.params;
  const { data: arr } = await supabase.from(T).select('*').eq('id', id).limit(1);
  const removed = arr && arr[0];
  if (!removed) return res.status(404).json({ message: 'Hospital not found' });

  await supabase.from(T).delete().eq('id', id);
  const admins = await Users.all({ role: 'admin', hospitalId: id });
  if (admins[0]) await Users.remove(admins[0].id);

  return res.json({ message: 'Hospital deleted', hospital: removed });
};

module.exports = { getHospitals, getHospitalById, createHospital, updateHospital, updateOwnHospitalTimings, deleteHospital };
