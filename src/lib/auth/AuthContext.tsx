'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  tier: 'free' | 'pro' | 'enterprise';
  avatar?: string;
  isDemo?: boolean;
}

export type DemoPersonaKey = 'consultant' | 'freelancer' | 'agency';

export interface DemoPersona {
  key: DemoPersonaKey;
  name: string;
  email: string;
  role: string;
  monthlyIncome: number;
  initialSavings: number;
  description: string;
}

export const DEMO_PERSONAS: Record<DemoPersonaKey, DemoPersona> = {
  consultant: {
    key: 'consultant',
    name: 'Alex Vance',
    email: 'alex.vance@cashfloor.app',
    role: 'Senior Technology Consultant',
    monthlyIncome: 14500,
    initialSavings: 42000,
    description: '3 retainers, $14.5k/mo, quarterly estimated taxes & 6-month buffer.',
  },
  freelancer: {
    key: 'freelancer',
    name: 'Sarah Lin',
    email: 'sarah.lin@cashfloor.app',
    role: 'Brand & Product Designer',
    monthlyIncome: 9200,
    initialSavings: 28000,
    description: 'Variable project retainers, $9.2k/mo, irregular invoice payment schedules.',
  },
  agency: {
    key: 'agency',
    name: 'Marcus Sterling',
    email: 'marcus.sterling@cashfloor.app',
    role: 'Boutique Studio Founder',
    monthlyIncome: 24000,
    initialSavings: 75000,
    description: 'High overhead, multi-contract milestone payouts & payroll runway floor.',
  },
};

const LOCAL_STORAGE_USER_KEY = 'cf_auth_profile_v2';

interface AuthContextValue {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isPro: boolean;
  loading: boolean;
  authModalOpen: boolean;
  authModalMessage?: string;
  authModalDefaultTab: 'signin' | 'signup' | 'demo';
  openAuthModal: (message?: string, defaultTab?: 'signin' | 'signup' | 'demo') => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
  updateProfileData: (updates: { name?: string; avatar?: string }) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string; autoConfirmed?: boolean }>;
  signInWithDemo: (personaKey?: DemoPersonaKey) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  isAuthenticated: false,
  isPro: false,
  loading: true,
  authModalOpen: false,
  authModalMessage: undefined,
  authModalDefaultTab: 'signin',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  refreshProfile: async () => {},
  updateProfileData: () => {},
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  signInWithDemo: () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

function formatInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return 'CF';
  const clean = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  const parts = clean.split(/[._\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>(undefined);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [, startTransition] = useTransition();

  // Helper to persist or clear profile in localStorage
  const persistProfile = useCallback((profile: UserProfile | null) => {
    if (typeof window === 'undefined') return;
    try {
      if (profile) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {
      console.warn('Unable to persist profile to localStorage', e);
    }
  }, []);

  const openAuthModal = useCallback((message?: string, defaultTab: 'signin' | 'signup' | 'demo' = 'signin') => {
    setAuthModalMessage(message);
    setAuthModalDefaultTab(defaultTab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalMessage(undefined);
  }, []);

  // Helper to fetch profile from DB
  const fetchDbProfile = useCallback(async (userId: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();
      return data;
    } catch {
      return null;
    }
  }, []);

  // Map Supabase user to UserProfile
  const mapSupabaseUser = useCallback((sbUser: User, dbProfile?: { full_name?: string | null; avatar_url?: string | null } | null): UserProfile => {
    const meta = sbUser.user_metadata || {};
    const email = sbUser.email || '';
    const name = dbProfile?.full_name || meta.full_name || meta.name || email.split('@')[0] || 'Independent Pro';
    const avatar = dbProfile?.avatar_url || meta.avatar_url || meta.picture || undefined;
    return {
      id: sbUser.id,
      email,
      name,
      role: meta.role || 'Consultant / Freelancer',
      tier: 'pro', // Authenticated users get full Pro access
      avatar,
      isDemo: false,
    };
  }, []);

  // Refresh profile from database
  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const dbProfile = await fetchDbProfile(session.user.id);
      const profile = mapSupabaseUser(session.user, dbProfile);
      setUser(profile);
      persistProfile(profile);
    }
  }, [fetchDbProfile, mapSupabaseUser, persistProfile]);

  // Direct optimistic update of profile data
  const updateProfileData = useCallback((updates: { name?: string; avatar?: string }) => {
    setUser(prev => {
      if (!prev) return null;
      const next = {
        ...prev,
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.avatar !== undefined ? { avatar: updates.avatar } : {}),
      };
      persistProfile(next);
      return next;
    });
  }, [persistProfile]);

  // 1. Initial Load & Session Tracking
  useEffect(() => {
    const supabase = createClient();

    // Check local storage for persistent session baseline first
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed parsing stored profile', e);
      }
    }

    // Helper to sync user with db
    const syncUserSession = async (sbUser: User) => {
      const initialProfile = mapSupabaseUser(sbUser);
      setUser(initialProfile);
      persistProfile(initialProfile);

      const dbProfile = await fetchDbProfile(sbUser.id);
      if (dbProfile) {
        const enrichedProfile = mapSupabaseUser(sbUser, dbProfile);
        setUser(enrichedProfile);
        persistProfile(enrichedProfile);
      }
    };

    // Check real Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      startTransition(() => {
        setSession(session);
        if (session?.user) {
          syncUserSession(session.user);
        }
        setLoading(false);
      });
    }).catch(() => {
      setLoading(false);
    });

    // Listen to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        startTransition(() => {
          setSession(session);
          if (session?.user) {
            syncUserSession(session.user);
          } else {
            // Check if there was an active demo user before wiping
            const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_USER_KEY) : null;
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                if (parsed?.isDemo) {
                  setUser(parsed);
                  return;
                }
              } catch {}
            }
            setUser(null);
            persistProfile(null);
          }
          setLoading(false);
        });
      }
    );

    // Listen for realtime updates to public.profiles table
    const profileChannel = supabase
      .channel('realtime:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const newRow = payload.new as any;
            setUser((current) => {
              if (current && current.id === newRow.id) {
                const updated = {
                  ...current,
                  name: newRow.full_name || current.name,
                  avatar: newRow.avatar_url || current.avatar,
                };
                persistProfile(updated);
                return updated;
              }
              return current;
            });
          }
        }
      )
      .subscribe();

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_USER_KEY) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {}
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      profileChannel.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchDbProfile, mapSupabaseUser, persistProfile]);

  // Demo Sign In
  const signInWithDemo = useCallback((personaKey: DemoPersonaKey = 'consultant') => {
    const persona = DEMO_PERSONAS[personaKey] || DEMO_PERSONAS.consultant;
    const demoProfile: UserProfile = {
      id: `demo-${persona.key}`,
      email: persona.email,
      name: persona.name,
      role: persona.role,
      tier: 'pro',
      isDemo: true,
    };
    setUser(demoProfile);
    persistProfile(demoProfile);
  }, [persistProfile]);

  // Sign In with Email & Password
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        const profile = mapSupabaseUser(data.user);
        setUser(profile);
        persistProfile(profile);
        return { success: true };
      }
      return { success: false, error: 'Failed to retrieve session' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication failed' };
    }
  }, [mapSupabaseUser, persistProfile]);

  // Sign Up with Email
  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; error?: string; autoConfirmed?: boolean }> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
          },
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        // Auto-confirmed
        const profile = mapSupabaseUser(data.user);
        setUser(profile);
        persistProfile(profile);
        return { success: true, autoConfirmed: true };
      }

      // Supabase requires email verification: We establish an instant profile so user isn't blocked
      const pendingProfile: UserProfile = {
        id: data.user?.id || `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        role: 'Verified Independent Pro',
        tier: 'pro',
        isDemo: false,
      };
      setUser(pendingProfile);
      persistProfile(pendingProfile);

      return { success: true, autoConfirmed: false };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }, [mapSupabaseUser, persistProfile]);

  // Google OAuth
  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error', e);
    }
    setUser(null);
    setSession(null);
    persistProfile(null);
  }, [persistProfile]);

  const isAuthenticated = !!user;
  const isPro = !!user; // Any signed in user gets full pro capabilities

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isPro,
        loading,
        authModalOpen,
        authModalMessage,
        authModalDefaultTab,
        openAuthModal,
        closeAuthModal,
        refreshProfile,
        updateProfileData,
        signInWithEmail,
        signUpWithEmail,
        signInWithDemo,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
