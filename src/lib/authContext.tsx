import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
  location: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const withTimeoutFallback = async <T,>(promise: Promise<T>, fallback: T, ms = 3000): Promise<T> => {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);
  };

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        setProfile(null);
        return null;
      }

      const resolvedProfile = (data as Profile | null) ?? null;
      setProfile(resolvedProfile);
      return resolvedProfile;
    } catch {
      setProfile(null);
      return null;
    }
  };

  const loadProfileSafe = async (userId: string) => {
    await withTimeoutFallback(fetchProfile(userId), null, 3000);
  };

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await loadProfileSafe(data.session.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        const shouldBlockUi = event === 'SIGNED_OUT';
        if (shouldBlockUi) setIsLoading(true);

        setSession(newSession);
        setUser(newSession?.user ?? null);

        try {
          // Avoid expensive profile reload on token refresh/focus events.
          if (event === 'TOKEN_REFRESHED') {
            return;
          }

          if (newSession?.user) {
            await loadProfileSafe(newSession.user.id);
          } else {
            setProfile(null);
          }
        } finally {
          if (shouldBlockUi) setIsLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            role: 'user',
          },
        ]);

      if (profileError) throw profileError;
      await loadProfileSafe(data.user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
