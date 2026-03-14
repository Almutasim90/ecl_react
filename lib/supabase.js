import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl ||
  Constants.manifest?.extra?.supabaseUrl;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  Constants.manifest?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase config missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY or add them to app.json extra.'
  );
}

const getRedirectUrl = () => {
  const isExpoGo = Constants.appOwnership === 'expo' || Constants.appOwnership === 'guest';
  return AuthSession.makeRedirectUri({
    scheme: 'daleelplus',
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
      redirectTo: 'daleelplus://reset-password',
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
      // On web, use simple redirect flow
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

        // On web, the page will redirect - return success to indicate flow started
        return { success: true, data };
      }

      // On native, use WebBrowser
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
      // On web, use simple redirect flow
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

      // On native, use WebBrowser
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

// Database helper functions
export const dbHelpers = {
  // Categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return { data, error };
  },

  // Businesses
  getBusinesses: async (options = {}) => {
    let query = supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, name_ar, icon, color)
      `)
      .eq('is_active', true);

    if (options.featured) {
      query = query.eq('is_featured', true);
    }
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  getBusinessById: async (id) => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, name_ar, icon, color),
        business_hours(*),
        business_images(*)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  searchBusinesses: async (query) => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, name_ar, icon, color)
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%`)
      .order('rating_avg', { ascending: false });
    return { data, error };
  },

  // Reviews
  getReviews: async (businessId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
      .eq('business_id', businessId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  addReview: async (businessId, rating, comment, commentAr = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        business_id: businessId,
        user_id: user.id,
        rating,
        comment,
        comment_ar: commentAr,
      })
      .select()
      .single();
    return { data, error };
  },

  // Favorites
  getFavorites: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        business:businesses(
          *,
          category:categories(id, name, name_ar, icon, color)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  addFavorite: async (businessId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        business_id: businessId,
      })
      .select()
      .single();
    return { data, error };
  },

  removeFavorite: async (businessId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('business_id', businessId);
    return { error };
  },

  isFavorite: async (businessId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isFavorite: false };

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('business_id', businessId)
      .single();
    
    return { isFavorite: !!data && !error };
  },
};
