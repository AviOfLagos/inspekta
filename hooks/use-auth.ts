import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys, queryClient } from '@/lib/query-client';
import { useAuthStore, useAuthActions, useAuth, useIsAuthenticated, useIsLoading } from '@/stores/auth';
import { UserRole } from '@/lib/generated/prisma';

// Types
interface LoginCredentials {
  email: string;
  password: string;
  callbackUrl?: string;
  intendedRole?: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  role: UserRole;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// API functions
const authAPI = {
  // Get current user session
  me: async () => {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    
    const data = await response.json();
    return data.user;
  },

  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Login failed');
    }
    
    return data.user;
  },

  // Register user
  register: async (userData: RegisterData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Registration failed');
    }
    
    return data.user;
  },

  // Logout user
  logout: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return response.json();
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || result.message || 'Failed to send reset email');
    }
    
    return result;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || result.message || 'Password reset failed');
    }
    
    return result;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || result.message || 'Email verification failed');
    }
    
    return result;
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || result.message || 'Failed to resend verification');
    }
    
    return result;
  },
};

// React Query hooks
export const useSession = () => {
  const { setUser, setLoading } = useAuthActions();
  const user = useAuth();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();

  const query = useQuery({
    queryKey: queryKeys.me(),
    queryFn: authAPI.me,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !user || isAuthenticated,
  });

  // Handle side effects based on query state using useEffect to prevent infinite loops
  useEffect(() => {
    if (query.data && !user) {
      setUser(query.data);
    }
  }, [query.data, user, setUser]);

  useEffect(() => {
    if (query.error && user) {
      setUser(null);
    }
  }, [query.error, user, setUser]);

  useEffect(() => {
    if (!query.isLoading && isLoading) {
      setLoading(false);
    }
  }, [query.isLoading, isLoading, setLoading]);

  return query;
};

export const useLogin = () => {
  const { login } = useAuthActions();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (user) => {
      login(user);
      // Invalidate and refetch user session
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthActions();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if API call fails, clear local auth state
      logout();
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authAPI.forgotPassword,
    onError: (error) => {
      console.error('Forgot password error:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authAPI.resetPassword,
    onError: (error) => {
      console.error('Reset password error:', error);
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authAPI.verifyEmail,
    onSuccess: () => {
      // Refresh user session after email verification
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
    onError: (error) => {
      console.error('Email verification error:', error);
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authAPI.resendVerification,
    onError: (error) => {
      console.error('Resend verification error:', error);
    },
  });
};