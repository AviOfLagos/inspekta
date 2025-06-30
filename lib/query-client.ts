import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized settings for Inspekta platform
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for all queries
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when internet reconnects
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for network errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Global defaults for all mutations
      retry: false, // Don't retry mutations by default
      onError: (error: any) => {
        // Global error handling for mutations
        console.error('Mutation error:', error);
        
        // Handle authentication errors globally
        if (error?.status === 401) {
          // Redirect to login or show auth modal
          window.location.href = '/auth/login';
        }
      },
    },
  },
});

// Query key factory for consistent cache keys
export const queryKeys = {
  // Authentication
  auth: ['auth'] as const,
  me: () => [...queryKeys.auth, 'me'] as const,

  // Notifications
  notifications: ['notifications'] as const,
  allNotifications: (params?: { unreadOnly?: boolean; limit?: number; offset?: number }) =>
    [...queryKeys.notifications, 'list', params] as const,

  // Listings/Properties
  listings: ['listings'] as const,
  allListings: (filters?: any) => [...queryKeys.listings, 'list', filters] as const,
  listing: (id: string) => [...queryKeys.listings, 'detail', id] as const,
  savedListings: (userId: string) => [...queryKeys.listings, 'saved', userId] as const,

  // Dashboard data
  dashboard: ['dashboard'] as const,
  agentDashboard: (agentId: string) => [...queryKeys.dashboard, 'agent', agentId] as const,
  inspectorDashboard: (inspectorId: string) => [...queryKeys.dashboard, 'inspector', inspectorId] as const,
  adminStats: () => [...queryKeys.dashboard, 'admin', 'stats'] as const,

  // Inspections
  inspections: ['inspections'] as const,
  userInspections: (userId: string, filters?: any) => 
    [...queryKeys.inspections, 'user', userId, filters] as const,
  availableJobs: (filters?: any) => [...queryKeys.inspections, 'available', filters] as const,

  // User management
  users: ['users'] as const,
  allUsers: (filters?: any) => [...queryKeys.users, 'list', filters] as const,
  userProfile: (userId: string) => [...queryKeys.users, 'profile', userId] as const,

  // Company management
  companies: ['companies'] as const,
  allCompanies: (filters?: any) => [...queryKeys.companies, 'list', filters] as const,
  company: (id: string) => [...queryKeys.companies, 'detail', id] as const,

  // Analytics
  analytics: ['analytics'] as const,
  agentAnalytics: (agentId: string) => [...queryKeys.analytics, 'agent', agentId] as const,
  inspectorAnalytics: (inspectorId: string) => [...queryKeys.analytics, 'inspector', inspectorId] as const,
} as const;

// Helper function to invalidate related queries
export const invalidateQueries = {
  // Invalidate all authentication-related queries
  auth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth }),
  
  // Invalidate all notifications
  notifications: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  
  // Invalidate all listings
  listings: () => queryClient.invalidateQueries({ queryKey: queryKeys.listings }),
  
  // Invalidate specific listing
  listing: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.listing(id) }),
  
  // Invalidate dashboard data
  dashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
  
  // Invalidate user-specific dashboard
  userDashboard: (userId: string, role: 'agent' | 'inspector') => {
    if (role === 'agent') {
      queryClient.invalidateQueries({ queryKey: queryKeys.agentDashboard(userId) });
    } else if (role === 'inspector') {
      queryClient.invalidateQueries({ queryKey: queryKeys.inspectorDashboard(userId) });
    }
  },

  // Invalidate inspections
  inspections: () => queryClient.invalidateQueries({ queryKey: queryKeys.inspections }),
  
  // Invalidate user management
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  
  // Invalidate companies
  companies: () => queryClient.invalidateQueries({ queryKey: queryKeys.companies }),
};