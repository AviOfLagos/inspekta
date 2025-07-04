// Server-Sent Events (SSE) real-time notification system

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>();

// Function to broadcast notification to a specific user
export function broadcastNotificationToUser(userId: string, notification: any): boolean {
  const controller = connections.get(userId);
  if (controller) {
    try {
      const data = JSON.stringify({
        type: 'notification',
        data: notification,
        timestamp: new Date().toISOString()
      });
      controller.enqueue(`data: ${data}\n\n`);
      return true;
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      // Remove dead connection
      connections.delete(userId);
      return false;
    }
  }
  return false;
}

// Function to broadcast to multiple users
export function broadcastNotificationToUsers(userIds: string[], notification: any): number {
  const results = userIds.map(userId => 
    broadcastNotificationToUser(userId, notification)
  );
  return results.filter(Boolean).length;
}

// Function to get connected users count
export function getConnectedUsersCount(): number {
  return connections.size;
}

// Function to check if user is connected
export function isUserConnected(userId: string): boolean {
  return connections.has(userId);
}

// Function to add a connection
export function addConnection(userId: string, controller: ReadableStreamDefaultController): void {
  connections.set(userId, controller);
}

// Function to remove a connection
export function removeConnection(userId: string): void {
  connections.delete(userId);
}