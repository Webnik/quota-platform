import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kcopnwhyxsnvadzbmjit.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb3Bud2h5eHNudmFkemJtaml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NTkyMjIsImV4cCI6MjA1MDQzNTIyMn0.uN9x2gCDY3UuaabQWhIuJA7mQXFEL-bD4IGHMdelR8c";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      }
    }
  }
);