import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://ywgnwkncpyuczxaegizx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here'; // Replace with your anon key

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email, password, userData) => {
  // Check if email has allowed domain
  if (!email.endsWith('@mikano-intl.com') && !email.endsWith('@mikanomotors.com')) {
    return { 
      error: { 
        message: 'Please use a company email (@mikano-intl.com or @mikanomotors.com)' 
      } 
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (user) {
    // Fetch user profile from database
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    return { user: { ...user, profile }, error };
  }
  
  return { user, error };
};

// Database operations
export const fetchVehicleModels = async () => {
  const { data, error } = await supabase
    .from('vehicle_models')
    .select('*')
    .order('make', { ascending: true });
  return { data, error };
};

export const fetchUnits = async (filters = {}) => {
  let query = supabase
    .from('units')
    .select(`
      *,
      vehicle_model:vehicle_model_id (
        make,
        model,
        year,
        fuel_type,
        transmission,
        body_type
      )
    `);
  
  // Apply filters if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.location) {
    query = query.eq('current_location', filters.location);
  }
  
  if (filters.vehicle_model_id) {
    query = query.eq('vehicle_model_id', filters.vehicle_model_id);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createUnit = async (unitData) => {
  const { data, error } = await supabase
    .from('units')
    .insert(unitData)
    .select();
  return { data, error };
};

export const updateUnit = async (id, updates) => {
  const { data, error } = await supabase
    .from('units')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const fetchUnitHistory = async (unitId) => {
  const { data, error } = await supabase
    .from('unit_history')
    .select(`
      *,
      changed_by_user:changed_by (
        email,
        user_profiles (
          first_name,
          last_name,
          role
        )
      )
    `)
    .eq('unit_id', unitId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Default export for the Supabase client
export default supabase; 