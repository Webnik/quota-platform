import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://kcopnwhyxsnvadzbmjit.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb3Bud2h5eHNudmFkemJtaml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyODI0MDAsImV4cCI6MjAxODg1ODQwMH0.qA8kHlhJamX5q4einekfYFdPNHmG_l_6HI5fZLGqQ4U';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      flowType: 'pkce'
    }
  }
);