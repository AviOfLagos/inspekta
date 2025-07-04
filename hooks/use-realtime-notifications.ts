import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/query-client';

interface RealtimeNotification {
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
}

interface SSEMessage {
  type: 'connected' | 'heartbeat' | 'notification' | 'error';
  data?: RealtimeNotification;
  message?: string;
  timestamp: string;
}

export const useRealtimeNotifications = () => {
  const user = useAuth();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastNotification, setLastNotification] = useState<RealtimeNotification | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const handleNotification = useCallback((notification: RealtimeNotification) => {
    setLastNotification(notification);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });

    // Invalidate notification queries to refresh the notification list
    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    // Optional: Play notification sound (commented out for now)
    // if ('Notification' in window && Notification.permission === 'granted') {
    //   new Notification(notification.title, {
    //     body: notification.message,
    //     icon: '/favicon.ico',
    //     tag: notification.id,
    //   });
    // }
  }, [toast]);

  const connect = useCallback(() => {
    if (!user || eventSourceRef.current) return;

    setConnectionStatus('connecting');
    
    try {
      const eventSource = new EventSource('/api/notifications/stream', {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'connected':
              console.log('Real-time notifications connected');
              break;
            case 'heartbeat':
              // Keep connection alive
              break;
            case 'notification':
              if (message.data) {
                handleNotification(message.data);
              }
              break;
            case 'error':
              console.error('SSE error message:', message.message);
              break;
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setConnectionStatus('error');
        
        // Close current connection
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
          reconnectAttempts.current++;
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
          setConnectionStatus('disconnected');
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      setConnectionStatus('error');
    }
  }, [user, handleNotification]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    reconnectAttempts.current = 0;
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => connect(), 1000);
  }, [disconnect, connect]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Request notification permission on first use
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionStatus,
    lastNotification,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    hasError: connectionStatus === 'error',
    reconnect,
    disconnect,
  };
};