import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/lib/generated/prisma';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isVerified: boolean;
  companyId: string | null;
}

interface AuthState {
  // State
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: SessionUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: SessionUser) => void;
  logout: () => void;
  clearAuth: () => void;
  
  // Helper getters
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isAgent: () => boolean;
  isInspector: () => boolean;
  isClient: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true
      
      // Actions
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        }),
      
      setLoading: (loading) => 
        set({ isLoading: loading }),
      
      login: (user) => 
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        }),
      
      logout: () => 
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        }),
      
      clearAuth: () => 
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        }),
      
      // Helper getters
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
      
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'PLATFORM_ADMIN' || user?.role === 'COMPANY_ADMIN';
      },
      
      isAgent: () => get().hasRole('AGENT'),
      isInspector: () => get().hasRole('INSPECTOR'),
      isClient: () => get().hasRole('CLIENT'),
    }),
    {
      name: 'inspekta-auth', // localStorage key
      partialize: (state) => ({
        // Only persist user and isAuthenticated, not loading state
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // SSR-safe configuration
      skipHydration: true,
    }
  )
);

// Individual property selectors to prevent infinite loops
export const useAuth = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);

// Stable action selectors using useCallback pattern
export const useAuthActions = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return { setUser, setLoading, login, logout, clearAuth };
};

export const useAuthHelpers = () => {
  const hasRole = useAuthStore((state) => state.hasRole);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isAgent = useAuthStore((state) => state.isAgent);
  const isInspector = useAuthStore((state) => state.isInspector);
  const isClient = useAuthStore((state) => state.isClient);

  return { hasRole, isAdmin, isAgent, isInspector, isClient };
};