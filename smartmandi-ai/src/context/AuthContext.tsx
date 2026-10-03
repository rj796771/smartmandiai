import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  providerNotConfigured: boolean;
  supabaseProjectUrl: string;
  callbackUrl: string;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithDemo: (demoUser?: { name?: string; email?: string; picture?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_PROJECT_URL = 'https://mhnszbxwfmpgidttpwyd.supabase.co';
const OAUTH_CALLBACK_URL = `${SUPABASE_PROJECT_URL}/auth/v1/callback`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const storedUser = localStorage.getItem('agriplus_user_profile');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agriplus_auth_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [providerNotConfigured, setProviderNotConfigured] = useState<boolean>(false);

  // Helper to map Supabase or Demo user into uniform UserProfile
  const mapSupabaseUser = (sbUser: any, sessionToken?: string): UserProfile => {
    const meta = sbUser.user_metadata || {};
    const fullName = meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'AgriPlus Farmer';
    const parts = fullName.split(' ');
    const givenName = meta.given_name || parts[0] || 'Farmer';
    const familyName = meta.family_name || (parts.length > 1 ? parts.slice(1).join(' ') : '');
    const picture = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;
    const provider = sbUser.app_metadata?.provider || 'google';

    return {
      id: sbUser.id || 'u_' + Date.now(),
      name: fullName,
      email: sbUser.email || '',
      picture,
      givenName,
      familyName,
      provider,
      loginAt: new Date().toISOString()
    };
  };

  // Sync Supabase Auth session on mount and listen to OAuth callback events
  useEffect(() => {
    let isMounted = true;

    // 1. Initial session check from Supabase
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (session?.user) {
        const profile = mapSupabaseUser(session.user, session.access_token);
        setUser(profile);
        setToken(session.access_token);
        localStorage.setItem('agriplus_user_profile', JSON.stringify(profile));
        localStorage.setItem('agriplus_auth_token', session.access_token);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Supabase initial session warning:', err);
      setIsLoading(false);
    });

    // 2. Subscribe to auth state changes (OAuth redirects, token refresh, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const profile = mapSupabaseUser(session.user, session.access_token);
        setUser(profile);
        setToken(session.access_token);
        localStorage.setItem('agriplus_user_profile', JSON.stringify(profile));
        localStorage.setItem('agriplus_auth_token', session.access_token);
        setAuthError(null);
        setProviderNotConfigured(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        localStorage.removeItem('agriplus_user_profile');
        localStorage.removeItem('agriplus_auth_token');
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    setProviderNotConfigured(false);

    try {
      // 1. Trigger Supabase OAuth
      const redirectTo = window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        // If Google provider is not yet toggled on in Supabase dashboard
        const isNotEnabled = 
          error.message?.toLowerCase().includes('not enabled') || 
          error.message?.toLowerCase().includes('validation_failed') ||
          (error as any).code === 'validation_failed' ||
          (error as any).status === 400;

        if (isNotEnabled) {
          setProviderNotConfigured(true);
          setAuthError(
            'Google Sign-In is not enabled yet in your Supabase project. Please enable Google in Supabase Dashboard (Authentication > Providers > Google).'
          );
        } else {
          setAuthError(error.message || 'Google sign-in could not be completed.');
        }
        setIsLoading(false);
        return;
      }

      // If Supabase returned a redirect URL, redirect to Google consent screen
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Google Sign-In Exception:', err);
      setAuthError(err?.message || 'Google sign-in encountered an error.');
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password?: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      if (!password) {
        // Magic link / OTP via Supabase
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setIsLoading(false);
        return { success: true, message: 'Check your email inbox for the instant sign-in link!' };
      }

      // Password sign in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // If account doesn't exist, automatically sign up
        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('user not found')
        ) {
          const signUpRes = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: email.split('@')[0],
              }
            }
          });
          if (signUpRes.error) throw signUpRes.error;
          if (signUpRes.data?.session) {
            const profile = mapSupabaseUser(signUpRes.data.user, signUpRes.data.session.access_token);
            setUser(profile);
            setToken(signUpRes.data.session.access_token);
            localStorage.setItem('agriplus_user_profile', JSON.stringify(profile));
            localStorage.setItem('agriplus_auth_token', signUpRes.data.session.access_token);
            setIsLoading(false);
            return { success: true, message: 'Account created and signed in successfully!' };
          }
          setIsLoading(false);
          return { success: true, message: 'A verification link has been sent to your email.' };
        }
        throw error;
      }

      if (data.session) {
        const profile = mapSupabaseUser(data.user, data.session.access_token);
        setUser(profile);
        setToken(data.session.access_token);
        localStorage.setItem('agriplus_user_profile', JSON.stringify(profile));
        localStorage.setItem('agriplus_auth_token', data.session.access_token);
      }
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Email sign in error:', err);
      setAuthError(err.message || 'Email authentication failed');
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  const loginWithDemo = async (customUser?: { name?: string; email?: string; picture?: string }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const defaultName = customUser?.name || 'Rohan Patil (Farmer)';
      const defaultEmail = customUser?.email || 'rohan.patil@agriplus.ai';
      const defaultPicture = customUser?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const demoProfile: UserProfile = {
        id: 'farmer_demo_' + Date.now(),
        name: defaultName,
        email: defaultEmail,
        picture: defaultPicture,
        givenName: defaultName.split(' ')[0],
        provider: 'demo',
        loginAt: new Date().toISOString()
      };

      const demoToken = 'agriplus_session_' + Math.random().toString(36).substring(2);
      setUser(demoProfile);
      setToken(demoToken);
      localStorage.setItem('agriplus_user_profile', JSON.stringify(demoProfile));
      localStorage.setItem('agriplus_auth_token', demoToken);

      // Inform server session map
      try {
        await fetch('/api/auth/demo-google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: defaultName, email: defaultEmail, picture: defaultPicture })
        });
      } catch (e) {
        // server non-critical
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      await fetch('/api/auth/logout', { method: 'POST', headers });
    } catch (e) {
      // server non-critical
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('agriplus_user_profile');
      localStorage.removeItem('agriplus_auth_token');
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setAuthError(null);
    setProviderNotConfigured(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        authError,
        providerNotConfigured,
        supabaseProjectUrl: SUPABASE_PROJECT_URL,
        callbackUrl: OAUTH_CALLBACK_URL,
        loginWithGoogle,
        loginWithEmail,
        loginWithDemo,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
