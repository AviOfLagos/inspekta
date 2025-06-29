import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// PUT /api/notifications/[id]/read - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const notificationId = resolvedParams.id;

    // Verify the notification belongs to the user
    const existingNotification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!existingNotification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }

    if (existingNotification.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access to notification' },
        { status: 403 }
      );
    }

    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('Notification read error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id]/read - Mark notification as unread
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const notificationId = resolvedParams.id;

    // Verify the notification belongs to the user
    const existingNotification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!existingNotification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }

    if (existingNotification.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access to notification' },
        { status: 403 }
      );
    }

    // Mark as unread
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification marked as unread',
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('Notification unread error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark notification as unread' },
      { status: 500 }
    );
  }
}