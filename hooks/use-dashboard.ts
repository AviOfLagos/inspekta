import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

// Types for dashboard data
interface AgentDashboardData {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  conversionRate: number;
  averageResponseTime: string;
  earningsThisMonth: number;
  topPerformingListing?: any;
  recentInspections: any[];
  pendingInquiries: any[];
}

interface InspectorDashboardData {
  totalInspections: number;
  completionRate: number;
  averageRating: number;
  onTimePercentage: number;
  earningsThisMonth: number;
  upcomingJobs: number;
  availableJobs: any[];
  myInspections: any[];
}

interface ClientDashboardData {
  savedProperties: any[];
  scheduledInspections: any[];
  completedInspections: any[];
  recentActivity: any[];
}

interface AdminDashboardData {
  totalUsers: number;
  totalCompanies: number;
  totalListings: number;
  totalInspections: number;
  totalEarnings: number;
  pendingVerifications: number;
  activeSubscriptions: number;
  monthlyGrowth: number;
  usersByRole: Record<string, number>;
  verificationsByStatus: Record<string, number>;
  recentActivity: {
    users: number;
    listings: number;
    inspections: number;
    companies: number;
  };
}

// API functions
const dashboardAPI = {
  // Agent dashboard
  getAgentDashboard: async (agentId: string): Promise<AgentDashboardData> => {
    const response = await fetch(`/api/analytics/agent/${agentId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agent dashboard data');
    }

    const data = await response.json();
    return data.analytics;
  },

  // Inspector dashboard
  getInspectorDashboard: async (inspectorId: string): Promise<InspectorDashboardData> => {
    const response = await fetch(`/api/analytics/inspector/${inspectorId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inspector dashboard data');
    }

    const data = await response.json();
    return data.analytics;
  },

  // Client dashboard - using multiple endpoints
  getClientDashboard: async (clientId: string): Promise<ClientDashboardData> => {
    const [savedPropertiesRes, inspectionsRes] = await Promise.all([
      fetch(`/api/clients/${clientId}/saved-properties`, { credentials: 'include' }),
      fetch('/api/inspections', { credentials: 'include' }),
    ]);

    if (!savedPropertiesRes.ok || !inspectionsRes.ok) {
      throw new Error('Failed to fetch client dashboard data');
    }

    const [savedPropertiesData, inspectionsData] = await Promise.all([
      savedPropertiesRes.json(),
      inspectionsRes.json(),
    ]);

    const inspections = inspectionsData.inspections || [];
    const scheduledInspections = inspections.filter((i: any) => i.status === 'SCHEDULED');
    const completedInspections = inspections.filter((i: any) => i.status === 'COMPLETED');

    return {
      savedProperties: savedPropertiesData.savedProperties || [],
      scheduledInspections,
      completedInspections,
      recentActivity: [...scheduledInspections, ...completedInspections]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    };
  },

  // Admin dashboard
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const response = await fetch('/api/admin/stats', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin dashboard data');
    }

    const data = await response.json();
    return data.stats;
  },

  // Get agent's listings
  getAgentListings: async (agentId: string) => {
    const response = await fetch(`/api/agents/${agentId}/listings`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agent listings');
    }

    return response.json();
  },

  // Get agent's inspections
  getAgentInspections: async (agentId: string) => {
    const response = await fetch(`/api/agents/${agentId}/inspections`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agent inspections');
    }

    return response.json();
  },

  // Get agent's inquiries
  getAgentInquiries: async (agentId: string) => {
    const response = await fetch(`/api/agents/${agentId}/inquiries`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agent inquiries');
    }

    return response.json();
  },
};

// React Query hooks
export const useAgentDashboard = (agentId: string) => {
  return useQuery({
    queryKey: queryKeys.agentDashboard(agentId),
    queryFn: () => dashboardAPI.getAgentDashboard(agentId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
    enabled: !!agentId,
  });
};

export const useInspectorDashboard = (inspectorId: string) => {
  return useQuery({
    queryKey: queryKeys.inspectorDashboard(inspectorId),
    queryFn: () => dashboardAPI.getInspectorDashboard(inspectorId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
    enabled: !!inspectorId,
  });
};

export const useClientDashboard = (clientId: string) => {
  return useQuery({
    queryKey: ['dashboard', 'client', clientId],
    queryFn: () => dashboardAPI.getClientDashboard(clientId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
    enabled: !!clientId,
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: queryKeys.adminStats(),
    queryFn: dashboardAPI.getAdminDashboard,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    retry: 2,
  });
};

// Specific data hooks for agent dashboard tabs
export const useAgentListings = (agentId: string) => {
  return useQuery({
    queryKey: ['agent', agentId, 'listings'],
    queryFn: () => dashboardAPI.getAgentListings(agentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!agentId,
  });
};

export const useAgentInspections = (agentId: string) => {
  return useQuery({
    queryKey: ['agent', agentId, 'inspections'],
    queryFn: () => dashboardAPI.getAgentInspections(agentId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes
    retry: 2,
    enabled: !!agentId,
  });
};

export const useAgentInquiries = (agentId: string) => {
  return useQuery({
    queryKey: ['agent', agentId, 'inquiries'],
    queryFn: () => dashboardAPI.getAgentInquiries(agentId),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    retry: 2,
    enabled: !!agentId,
  });
};