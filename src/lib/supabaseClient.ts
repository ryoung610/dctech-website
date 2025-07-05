import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykazuupzkzdqshlicrlo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYXp1dXB6a3pkcXNobGljcmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MjgzOTcsImV4cCI6MjA2MTIwNDM5N30.Xzm0LlMNtWxUUcJ5oQYHGe6kak7k8_Ek-mCAKHo0zrM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
