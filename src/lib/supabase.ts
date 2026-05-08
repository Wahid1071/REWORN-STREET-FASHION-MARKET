/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yoowlwbnuefcxmafxnbo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3dsd2JudWVmY3htYWZ4bmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTMzMjYsImV4cCI6MjA5MzIyOTMyNn0.lW_mtdNXMxbVBsEJWT2LT2478-On6bFU9QlEhl_1nyI';

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error('Supabase URL is missing. Please set VITE_SUPABASE_URL in environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'reworn-street-auth'
  }
});

// Helper for Firestore-like data mapping
export const mapData = (data: any) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => ({ id: item.id || item.uid, ...item }));
  }
  return { id: data.id || data.uid, ...data };
};
