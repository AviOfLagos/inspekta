import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NotificationService } from '@/lib/notification-service';

// POST /api/admin/users/[id]/verify - Verify or reject user account
export async function POST(
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

    // Only allow platform admins
    if (user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, reason } = body; // action: 'approve' | 'reject', reason: optional rejection reason

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const newStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED';

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: newStatus,
      },
    });

    // Send notification to user
    try {
      if (action === 'approve') {
        await NotificationService.notifyVerificationApproved(userId);
      } else {
        await NotificationService.notifyVerificationRejected(userId, reason);
      }
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the entire request if notification fails
    }

    return NextResponse.json({
      success: true,
      message: `User ${action === 'approve' ? 'verified' : 'rejected'} successfully`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        verificationStatus: updatedUser.verificationStatus,
      },
    });
  } catch (error) {
    console.error('User verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user verification status' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id]/verify - Update user details (admin only)
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

    // Only allow platform admins
    if (user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, role, verificationStatus } = body;

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (verificationStatus !== undefined) updateData.verificationStatus = verificationStatus;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}