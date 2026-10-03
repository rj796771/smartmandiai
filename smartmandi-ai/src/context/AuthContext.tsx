import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthSession } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: (demoUser?: { name?: string; email?: string; picture?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Sync state with server session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/auth/me', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            localStorage.setItem('agriplus_user_profile', JSON.stringify(data.user));
          } else if (!token && !user) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const loginWithGoogle = async (customUser?: { name?: string; email?: string; picture?: string }) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Step 1: Check server Google OAuth config
      const configRes = await fetch('/api/auth/google/url');
      const configData = await configRes.json();

      if (configData.configured && configData.url) {
        // Open Google OAuth popup flow
        const authWindow = window.open(
          configData.url,
          'google_oauth_popup',
          'width=600,height=700,status=no,scrollbars=yes,resizable=yes'
        );

        if (!authWindow) {
          setAuthError('Popup blocker prevented Google sign-in window from opening. Please allow popups.');
          setIsLoading(false);
          return;
        }

        // Listen for postMessage from callback
        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
            const newUser = event.data.user;
            const newToken = event.data.token;
            setUser(newUser);
            setToken(newToken);
            localStorage.setItem('agriplus_user_profile', JSON.stringify(newUser));
            if (newToken) {
              localStorage.setItem('agriplus_auth_token', newToken);
            }
            setIsLoading(false);
            window.removeEventListener('message', handleMessage);
          } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
            setAuthError(event.data.error || 'Google sign-in was cancelled or failed. Please try again.');
            setIsLoading(false);
            window.removeEventListener('message', handleMessage);
          }
        };

        window.addEventListener('message', handleMessage);

        // Fallback check if popup closed manually
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }
        }, 800);

      } else {
        // Instant Google Authentication session flow (when GOOGLE_CLIENT_ID is pending setup in AI Studio)
        const res = await fetch('/api/auth/demo-google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customUser || {})
        });

        if (!res.ok) {
          throw new Error('Google authentication service error');
        }

        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('agriplus_user_profile', JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem('agriplus_auth_token', data.token);
          }
        } else {
          throw new Error('Failed to create user session');
        }
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Google Sign-In Exception:', err);
      setAuthError(err?.message || 'Google sign-in was cancelled. Please try again.');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      await fetch('/api/auth/logout', { method: 'POST', headers });
    } catch (e) {
      console.error('Logout request error:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('agriplus_user_profile');
      localStorage.removeItem('agriplus_auth_token');
      setIsLoading(false);
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        authError,
        loginWithGoogle,
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
