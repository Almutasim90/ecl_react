import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, authHelpers } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const authBypass = process.env.EXPO_PUBLIC_AUTH_BYPASS === 'true';
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(authBypass);

  // Initialize auth state
  useEffect(() => {
    if (authBypass) {
      setIsLoading(false);
      setIsInitialized(true);
      return undefined;
    }
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [authBypass]);

  // Fetch user profile from database
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.signUp(email, password, fullName);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Email confirmation is required
      if (data?.user && !data.session) {
        return { 
          success: true, 
          needsEmailConfirmation: true,
          message: 'Please check your email to confirm your account'
        };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with OTP (magic link via email)
  const signInWithOTP = async (email) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.signInWithOTP(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Check your email for the login code'
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP token
  const verifyOTP = async (email, token) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.verifyOTP(email, token);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.resetPassword(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Check your email for the password reset link'
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.updatePassword(newPassword);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await authHelpers.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setIsLoading(true);
    try {
      const { data, error } = await authHelpers.updateProfile(updates);
      
      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy login function (for backward compatibility)
  const login = async (email, password) => {
    return signIn(email, password);
  };

  // Legacy logout function
  const logout = async () => {
    return signOut();
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await authHelpers.signInWithGoogle();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Apple OAuth
  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const result = await authHelpers.signInWithApple();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // State
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    isAuthenticated: authBypass ? true : !!session,
    
    // Auth methods
    signUp,
    signIn,
    signInWithOTP,
    verifyOTP,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    fetchProfile,
    
    // Legacy methods (backward compatibility)
    login,
    logout,
    
    // OAuth methods
    signInWithGoogle,
    signInWithApple,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
