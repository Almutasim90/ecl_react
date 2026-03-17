import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = 'https://ffgtgjonipvrhejwvldw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZ3Rnam9uaXB2cmhland2bGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjQ0NjIsImV4cCI6MjA4OTIwMDQ2Mn0.2OcFte21Xp3uwqv0mJjlKoId_DM25o5AHK_JfnXG5qg';

const getRedirectUrl = () => {
  const isExpoGo = Constants.appOwnership === 'expo' || Constants.appOwnership === 'guest';
  return AuthSession.makeRedirectUri({
    scheme: 'eclapp',
    path: 'auth/callback',
    useProxy: isExpoGo,
  });
};

// Custom storage for web compatibility
const customStorage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with OTP (magic link)
  signInWithOTP: async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    return { data, error };
  },

  // Verify OTP token
  verifyOTP: async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Reset password (send email)
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'eclapp://reset-password',
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Update user profile
  updateProfile: async (updates) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return { error: userError };

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  },

  // Get user profile
  getProfile: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return { error: userError };

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return { data, error };
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      if (Platform.OS === 'web') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data };
      }

      const redirectUrl = getRedirectUrl();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (sessionError) {
              return { success: false, error: sessionError.message };
            }

            return { success: true, data: sessionData };
          }
        }

        if (result.type === 'cancel' || result.type === 'dismiss') {
          return { success: false, error: 'Authentication cancelled' };
        }
      }

      return { success: false, error: 'Failed to start OAuth flow' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with Apple OAuth
  signInWithApple: async () => {
    try {
      if (Platform.OS === 'web') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data };
      }

      const redirectUrl = getRedirectUrl();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (sessionError) {
              return { success: false, error: sessionError.message };
            }

            return { success: true, data: sessionData };
          }
        }

        if (result.type === 'cancel' || result.type === 'dismiss') {
          return { success: false, error: 'Authentication cancelled' };
        }
      }

      return { success: false, error: 'Failed to start OAuth flow' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
