import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys, queryClient } from '@/lib/query-client';

// Types
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  inspectionId?: string;
  listingId?: string;
  paymentId?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

interface NotificationParams {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  unreadCount: number;
}

// API functions
const notificationAPI = {
  // Get user notifications
  getNotifications: async (params: NotificationParams = {}): Promise<NotificationResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.unreadOnly) searchParams.set('unreadOnly', 'true');
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    const response = await fetch(`/api/notifications?${searchParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  // Mark notification as unread
  markAsUnread: async (notificationId: string) => {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as unread');
    }

    return response.json();
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await fetch('/api/notifications/mark-all-read', {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },
};

// React Query hooks
export const useNotifications = (params: NotificationParams = {}) => {
  return useQuery({
    queryKey: queryKeys.allNotifications(params),
    queryFn: () => notificationAPI.getNotifications(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
    retry: 2,
  });
};

// Hook for unread notifications count
export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: queryKeys.allNotifications({ unreadOnly: true, limit: 1 }),
    queryFn: () => notificationAPI.getNotifications({ unreadOnly: true, limit: 1 }),
    select: (data) => data.unreadCount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 2,
  });
};

// Hook for notification bell/dropdown
export const useNotificationList = (limit = 10) => {
  return useQuery({
    queryKey: queryKeys.allNotifications({ limit }),
    queryFn: () => notificationAPI.getNotifications({ limit }),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 2,
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onSuccess: (_, notificationId) => {
      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications },
        (oldData: NotificationResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map(notification =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
            unreadCount: Math.max(0, oldData.unreadCount - 1),
          };
        }
      );

      // Invalidate to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    },
  });
};

export const useMarkNotificationAsUnread = () => {
  return useMutation({
    mutationFn: notificationAPI.markAsUnread,
    onSuccess: (_, notificationId) => {
      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications },
        (oldData: NotificationResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map(notification =>
              notification.id === notificationId
                ? { ...notification, read: false }
                : notification
            ),
            unreadCount: oldData.unreadCount + 1,
          };
        }
      );

      // Invalidate to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => {
      console.error('Error marking notification as unread:', error);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: notificationAPI.markAllAsRead,
    onSuccess: () => {
      // Optimistically update all notification queries
      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications },
        (oldData: NotificationResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map(notification => ({
              ...notification,
              read: true,
            })),
            unreadCount: 0,
          };
        }
      );

      // Invalidate to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    },
  });
};

// Helper hook for notification actions
export const useNotificationActions = () => {
  const markAsRead = useMarkNotificationAsRead();
  const markAsUnread = useMarkNotificationAsUnread();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  return {
    markAsRead: markAsRead.mutate,
    markAsUnread: markAsUnread.mutate,
    markAllAsRead: markAllAsRead.mutate,
    isLoading: markAsRead.isPending || markAsUnread.isPending || markAllAsRead.isPending,
  };
};