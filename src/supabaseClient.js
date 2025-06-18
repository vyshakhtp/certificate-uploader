import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://retotgaynkzbqzoemdpo.supabase.co'; // Replace this
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldG90Z2F5bmt6YnF6b2VtZHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODI0NDIsImV4cCI6MjA2NTQ1ODQ0Mn0.VofVlH9wweGWj2ZECZhrKeF_R30Q9ijdRxhra6KN6Kg'; // Replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
