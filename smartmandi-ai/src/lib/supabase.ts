import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mhnszbxwfmpgidttpwyd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obnN6Ynh3Zm1wZ2lkdHRwd3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDg3MzYsImV4cCI6MjEwNjUyNDczNn0.AqUpHcOTo-V3p0JoBmJLHbckJMQC7tWLy-rCHbY1i1k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
