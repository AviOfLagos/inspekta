'use client';

import { useState } from 'react';
import { Bell, BellRing, Circle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useNotificationList, useNotificationActions } from '@/hooks/use-notifications';
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notificationData, isLoading } = useNotificationList(10);
  const { markAsRead, markAllAsRead, isLoading: isUpdating } = useNotificationActions();
  const { connectionStatus, isConnected, lastNotification } = useRealtimeNotifications();

  const notifications = notificationData?.notifications || [];
  const unreadCount = notificationData?.unreadCount || 0;

  const handleMarkAsRead = (notificationId: string, read: boolean) => {
    if (!read) {
      markAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("relative", className)}
          disabled={isLoading}
        >
          {unreadCount > 0 || lastNotification ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          
          {/* Real-time connection indicator */}
          <div className="absolute -bottom-1 -right-1">
            <Circle 
              className={cn(
                "h-2 w-2 fill-current",
                isConnected ? "text-green-500" : "text-gray-400"
              )} 
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96 overflow-y-auto"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Circle 
                className={cn(
                  "h-2 w-2 fill-current",
                  isConnected ? "text-green-500" : "text-gray-400"
                )} 
              />
              {connectionStatus === 'connected' ? 'Live' : 'Offline'}
            </div>
            
            {/* Mark all as read */}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleMarkAllAsRead}
                disabled={isUpdating}
              >
                Mark all read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start p-3 cursor-pointer",
                !notification.read && "bg-blue-50 border-l-2 border-l-blue-500"
              )}
              onClick={() => handleMarkAsRead(notification.id, notification.read)}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <Circle className="h-2 w-2 fill-current text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
                
                {notification.read && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-sm text-muted-foreground hover:text-foreground">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}