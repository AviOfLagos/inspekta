'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications';
import { Badge } from '@/components/ui/badge';

export function NotificationTester() {
  const [testMessage, setTestMessage] = useState('Test notification message');
  const [testTitle, setTestTitle] = useState('Test Notification');
  const [isSending, setIsSending] = useState(false);
  
  const { 
    connectionStatus, 
    isConnected, 
    lastNotification, 
    reconnect 
  } = useRealtimeNotifications();

  const sendTestNotification = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'GENERAL',
          title: testTitle,
          message: testMessage,
        }),
      });

      if (response.ok) {
        console.log('Test notification sent successfully');
      } else {
        console.error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Real-time Notifications Test</h3>
      
      {/* Connection Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus)}`} />
          <span className="text-sm font-medium">
            Status: <Badge variant="outline">{connectionStatus}</Badge>
          </span>
        </div>
        
        {!isConnected && (
          <Button
            onClick={reconnect}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Reconnect
          </Button>
        )}
      </div>

      {/* Test Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Test Title</Label>
          <Input
            id="title"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Enter notification title"
          />
        </div>
        
        <div>
          <Label htmlFor="message">Test Message</Label>
          <Input
            id="message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter notification message"
          />
        </div>
        
        <Button
          onClick={sendTestNotification}
          disabled={isSending || !isConnected}
          className="w-full"
        >
          {isSending ? 'Sending...' : 'Send Test Notification'}
        </Button>
      </div>

      {/* Last Received Notification */}
      {lastNotification && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Last Received:</h4>
          <div className="text-xs space-y-1">
            <div><strong>Title:</strong> {lastNotification.title}</div>
            <div><strong>Message:</strong> {lastNotification.message}</div>
            <div><strong>Type:</strong> {lastNotification.type}</div>
            <div><strong>Time:</strong> {new Date(lastNotification.createdAt).toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </Card>
  );
}