import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { addConnection, removeConnection } from '@/lib/sse-server';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getSession();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Store connection for this user
        addConnection(user.id, controller);

        // Send initial connection message
        const data = JSON.stringify({
          type: 'connected',
          timestamp: new Date().toISOString(),
          message: 'Real-time notifications connected'
        });
        
        controller.enqueue(`data: ${data}\n\n`);

        // Send heartbeat every 30 seconds
        const heartbeat = setInterval(() => {
          try {
            const heartbeatData = JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            });
            controller.enqueue(`data: ${heartbeatData}\n\n`);
          } catch (error) {
            console.error('Heartbeat error:', error);
            clearInterval(heartbeat);
          }
        }, 30000);

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          removeConnection(user.id);
          clearInterval(heartbeat);
          try {
            controller.close();
          } catch (error) {
            console.error('Error closing SSE stream:', error);
          }
        });
      },
      cancel() {
        removeConnection(user.id);
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('SSE connection error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}