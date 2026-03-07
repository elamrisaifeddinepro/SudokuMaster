import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://your-project.supabase.co';
const DEFAULT_ANON_KEY = 'your-anon-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Petit test optionnel de connexion Supabase (utile en dev)
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (
      !import.meta.env.VITE_SUPABASE_URL ||
      !import.meta.env.VITE_SUPABASE_ANON_KEY ||
      supabaseUrl === DEFAULT_URL ||
      supabaseAnonKey === DEFAULT_ANON_KEY
    ) {
      console.warn('⚠️ Supabase non configuré (.env manquant ou placeholders)');
      return false;
    }

    const { error } = await supabase.from('leaderboard').select('id').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('⚠️ Supabase connection not available:', err);
    return false;
  }
};
