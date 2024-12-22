import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://kcopnwhyxsnvadzbmjit.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb3Bud2h5eHNudmFkemJtaml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyODQ3NjIsImV4cCI6MjAxODg2MDc2Mn0.uN9x2gCDY3UuaabQWhIuJA7mQXFEL-bD4IGHMdelR8c";

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
    },
  }
);