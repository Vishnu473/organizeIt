import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import type { AuthContextType } from '../types/AuthContextType';


const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  login: async () => ({ error: new Error('Not implemented') }),
  signup: async () => ({ error: new Error('Not implemented') }),
  logout: async () => {},
  resetPassword: async () => ({ error: new Error('Not implemented') }),
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user && !user) {
        toast.success(`Welcome back${session.user.email ? ', ' + session.user.email.split('@')[0] : ''}!`);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    const loadingToast = toast.loading('Signing in...');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message, { id: loadingToast });
        return { error };
      }
      
      toast.success('Signed in successfully!', { id: loadingToast });
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in', { id: loadingToast });
      return { error };
    }
  };

  const signup = async (email: string, password: string) => {
    const loadingToast = toast.loading('Creating your account...');
    
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast.error(error.message, { id: loadingToast });
        return { error };
      }
      
      toast.success('Account created successfully!', { id: loadingToast });
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account', { id: loadingToast });
      return { error };
    }
  };

  const logout = async () => {
    const loadingToast = toast.loading('Signing out...');
    
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully', { id: loadingToast });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to sign out', { id: loadingToast });
    }
  };

  const resetPassword = async (email: string) => {
    const loadingToast = toast.loading('Sending password reset email...');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message, { id: loadingToast });
        return { error };
      }
      
      toast.success('Password reset email sent!', { id: loadingToast });
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email', { id: loadingToast });
      return { error };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);