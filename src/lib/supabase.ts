import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For debugging
console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create a regular Supabase client for non-authenticated operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

/**
 * Create a Supabase client with auth headers from Clerk JWT
 * This approach is more reliable than setting session on an existing client
 */
export function createClerkSupabaseClient(supabaseToken: string | null) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseToken}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

/**
 * Hook to get a Supabase client authenticated with the user's Clerk session
 */
export function useSupabaseClient() {
  const { getToken } = useAuth();
  const [supabaseClient, setSupabaseClient] = useState(supabase);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getSupabaseToken = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (token) {
          setToken(token);
          // Create a new client with the token in Authorization header 
          // instead of trying to set a session on an existing client
          const client = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: {
                Authorization: `Bearer ${token}`
              }
            },
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            }
          });
          setSupabaseClient(client);
        }
      } catch (error) {
        console.error('Error getting Supabase token:', error);
        // Fall back to anonymous client
        setSupabaseClient(supabase);
      }
    };

    getSupabaseToken();
  }, [getToken]);

  return { supabaseClient, token };
}

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          role: string
          created_at: string
          updated_at: string | null
          avatar_url: string | null
          clerk_id: string | null
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null
          clerk_id?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null
          clerk_id?: string | null
        }
      }
      vehicle_models: {
        Row: {
          id: string
          make: string
          model: string
          year: number
          fuel_type: string
          transmission: string
          engine: string
          body_type: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          fuel_type: string
          transmission: string
          engine: string
          body_type: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year?: number
          fuel_type?: string
          transmission?: string
          engine?: string
          body_type?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      vehicle_trims: {
        Row: {
          id: string
          model_id: string
          name: string
          wheel_drive: string
          transmission: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          model_id: string
          name: string
          wheel_drive: string
          transmission: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          model_id?: string
          name?: string
          wheel_drive?: string
          transmission?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      vehicle_units: {
        Row: {
          id: string
          trim_id: string
          unit_number: number
          status: string
          color: string
          last_updated: string
          updated_by: string
          created_at: string
        }
        Insert: {
          id?: string
          trim_id: string
          unit_number: number
          status: string
          color: string
          last_updated?: string
          updated_by: string
          created_at?: string
        }
        Update: {
          id?: string
          trim_id?: string
          unit_number?: number
          status?: string
          color?: string
          last_updated?: string
          updated_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Derived types
export type Brand = Database['public']['Tables']['brands']['Row'];
export type VehicleModel = Database['public']['Tables']['vehicle_models']['Row'];
export type VehicleTrim = Database['public']['Tables']['vehicle_trims']['Row'];
export type VehicleUnit = Database['public']['Tables']['vehicle_units']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// Extended types for nested data
export interface VehicleTrimWithUnits extends VehicleTrim {
  units: VehicleUnit[];
}

export interface VehicleModelWithTrims extends VehicleModel {
  trims: VehicleTrimWithUnits[];
}

export interface GroupedVehiclesByMake {
  make: string;
  models: VehicleModelWithTrims[];
  totalUnits: number;
  availableUnits: number;
}

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { data: null, error: signInError };
  }

  // Get user profile after successful sign in
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', signInData.user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    return { data: signInData, error: profileError };
  }

  return {
    data: {
      ...signInData,
      user: {
        ...signInData.user,
        profile: profileData
      }
    },
    error: null
  };
};

export const signUp = async (email: string, password: string, userData: any) => {
  // Validate email domain
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
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return { user: null, error };

  if (user) {
    // Fetch user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    return { user: { ...user, profile: profile || null }, error: null };
  }

  return { user: null, error: null };
}; 