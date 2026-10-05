import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ensureUserProfile, getUserProfile } from '../services/profileService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncAndFetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await syncAndFetchProfile(currentUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function syncAndFetchProfile(currentUser, fullNameInput = null) {
    try {
      let userProf = await getUserProfile(currentUser.id);
      if (!userProf) {
        // Pass the role from auth metadata so it is not silently defaulted to 'donor'
        const metaRole = currentUser.user_metadata?.role || null;
        userProf = await ensureUserProfile(currentUser, fullNameInput, metaRole);
      }
      setProfile(userProf);
    } catch (err) {
      console.warn('Profile sync warning:', err);
    } finally {
      setLoading(false);
    }
  }

  // Email + Password Sign Up
  async function signUp(email, password, fullName, role = 'donor') {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        // Handle specific Supabase error responses
        if (error.message?.includes('User already registered') || error.message?.includes('already exists')) {
          setLoading(false);
          throw new Error('An account with this email already exists. Please sign in instead.');
        }

        setLoading(false);
        throw error;
      }

      if (data?.user) {
        const prof = await ensureUserProfile(data.user, fullName, role);
        setProfile(prof);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }

  // Email + Password Sign In
  async function signInWithPassword(email, password) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        throw error;
      }

      if (data?.user) {
        await syncAndFetchProfile(data.user);
      }
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }

  // Google OAuth Sign In
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
    return data;
  }

  // Sign Out
  async function signOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
    if (error) throw error;
  }

  // Forgot Password — sends reset email via Supabase
  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  }

  // Update user profile — uses UPDATE (not upsert) to safely modify only specified fields.
  async function updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      const updated = data || { id: userId, ...profile, ...updates };
      setProfile(updated);
      return updated;
    } catch (err) {
      console.warn('updateProfile error, updating local state:', err);
      const fallback = { id: userId, ...profile, ...updates };
      setProfile(fallback);
      return fallback;
    }

  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
