import { Request, Response } from 'express';
import crypto from 'crypto';

import { createClient } from '@supabase/supabase-js';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  picture: string;
  givenName?: string;
  familyName?: string;
  provider: 'google' | 'supabase' | 'demo' | string;
  loginAt: string;
  sessionId: string;
}

// In-memory session storage (keyed by session ID token)
const activeSessions = new Map<string, UserSession>();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mhnszbxwfmpgidttpwyd.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obnN6Ynh3Zm1wZ2lkdHRwd3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDg3MzYsImV4cCI6MjEwNjUyNDczNn0.AqUpHcOTo-V3p0JoBmJLHbckJMQC7tWLy-rCHbY1i1k';

const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY);

export function createSessionToken(user: Omit<UserSession, 'sessionId'>): { token: string; session: UserSession } {
  const token = 'agriplus_session_' + crypto.randomBytes(24).toString('hex');
  const session: UserSession = {
    ...user,
    sessionId: token
  };
  activeSessions.set(token, session);
  return { token, session };
}

export function getSessionFromRequest(req: Request): UserSession | null {
  // Check Authorization header or cookie
  const authHeader = req.headers.authorization;
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/agriplus_session=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (token && activeSessions.has(token)) {
    return activeSessions.get(token) || null;
  }
  return null;
}

export async function getSessionFromRequestAsync(req: Request): Promise<UserSession | null> {
  const syncSession = getSessionFromRequest(req);
  if (syncSession) return syncSession;

  const authHeader = req.headers.authorization;
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/agriplus_session=([^;]+)/);
    if (match) token = match[1];
  }

  if (token && token.includes('.')) {
    try {
      const { data: { user }, error } = await supabaseServer.auth.getUser(token);
      if (user && !error) {
        const meta = user.user_metadata || {};
        const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'AgriPlus Farmer';
        return {
          id: user.id,
          name: fullName,
          email: user.email || '',
          picture: meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
          givenName: meta.given_name || fullName.split(' ')[0],
          familyName: meta.family_name || '',
          provider: (user.app_metadata?.provider as any) || 'google',
          loginAt: new Date().toISOString(),
          sessionId: token
        };
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function clearSessionFromRequest(req: Request): boolean {
  const authHeader = req.headers.authorization;
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/agriplus_session=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (token) {
    activeSessions.delete(token);
    return true;
  }
  return false;
}

/**
 * Generates the official Google OAuth 2.0 authorization URL
 */
export function getGoogleOAuthUrl(req: Request): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl.replace(/\/$/, '')}/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    prompt: 'select_account',
    access_type: 'offline'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code for Google user profile info
 */
export async function handleGoogleOAuthCallback(code: string, req: Request): Promise<UserSession> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl.replace(/\/$/, '')}/auth/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured in environment variables');
  }

  // 1. Exchange code for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Failed to exchange code with Google: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. Fetch user profile from Google UserInfo endpoint
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!userRes.ok) {
    throw new Error('Failed to fetch user profile from Google');
  }

  const googleUser = await userRes.json();

  const userObj = {
    id: googleUser.sub || 'g_' + Date.now(),
    name: googleUser.name || 'AgriPlus Farmer',
    email: googleUser.email || 'farmer@agriplus.ai',
    picture: googleUser.picture || 'https://lh3.googleusercontent.com/a/default-user',
    givenName: googleUser.given_name || googleUser.name?.split(' ')[0] || 'Farmer',
    familyName: googleUser.family_name || '',
    provider: 'google' as const,
    loginAt: new Date().toISOString()
  };

  const { session } = createSessionToken(userObj);
  return session;
}
