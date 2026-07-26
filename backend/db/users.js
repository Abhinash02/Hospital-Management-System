// Users data access (Supabase). Shared by auth, hospital, and registration controllers.
const { supabase } = require('../config/supabase');

const T = 'users';

const findByEmail = async (email) => {
  const e = String(email || '').trim();
  if (!e) return null;
  const { data, error } = await supabase.from(T).select('*').ilike('email', e).limit(1);
  if (error) throw error; // surface network/DB errors instead of looking like "not found"
  return (data && data[0]) || null;
};

const findById = async (id) => {
  const { data } = await supabase.from(T).select('*').eq('id', id).limit(1);
  return (data && data[0]) || null;
};

const all = async (filters = {}) => {
  let q = supabase.from(T).select('*');
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const { data } = await q.order('createdAt', { ascending: true });
  return data || [];
};

const insert = async (user) => {
  const { data, error } = await supabase.from(T).insert(user).select().single();
  if (error) throw error;
  return data;
};

const update = async (id, patch) => {
  const { data, error } = await supabase.from(T).update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from(T).delete().eq('id', id);
  if (error) throw error;
};

module.exports = { findByEmail, findById, all, insert, update, remove };
