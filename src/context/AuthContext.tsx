import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setupRecaptcha: (containerId: string) => void;
  signInWithPhone: (phoneNumber: string) => Promise<any>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAILS = ['rewornstreet@gmail.com', 'wahidrahaman0619@gmail.com'];
  const ADMIN_PHONES = ['+918927668457', '+919733910142'];

  const isAdminIdentifier = (email: string | null | undefined, phone: string | null | undefined) => {
    if (email && ADMIN_EMAILS.includes(email)) return true;
    if (phone && ADMIN_PHONES.includes(phone)) return true;
    return false;
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', user.id)
        .single();

      if (data) {
        // Auto-upgrade admin
        const isAdmin = isAdminIdentifier(user.email, user.phone);
        if (isAdmin && data.role !== 'admin') {
          const { data: updatedData } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('uid', user.id)
            .select()
            .single();
          setProfile(updatedData);
        } else {
          setProfile(data);
        }
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: user.id,
          displayName: user.user_metadata?.full_name || 'New User',
          email: user.email,
          phoneNumber: user.phone || null,
          photoURL: user.user_metadata?.avatar_url || null,
          role: isAdminIdentifier(user.email, user.phone) ? 'admin' : 'customer',
          walletBalance: 0
        };
        const { data: createdProfile } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();
        setProfile(createdProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) alert(error.message);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
  };

  const setupRecaptcha = (containerId: string) => {
    // Supabase handles this differently or not required for simple phone auth if enabled
    console.log('Recaptcha setup for phone auth placeholder');
  };

  const signInWithPhone = async (phoneNumber: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber
    });
    if (error) {
      if (error.message.includes('phone provider')) {
        throw new Error('Supabase Dashboard এ Phone Provider (যেমন Twilio) সেটআপ করা নেই। দয়া করে Authentication > Providers এ গিয়ে Phone এনাবল করুন।');
      }
      throw error;
    }
    return data;
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms'
    });
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, signIn, signUpWithEmail, signInWithEmail, 
      logout, refreshProfile, setupRecaptcha, signInWithPhone, verifyOtp 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
