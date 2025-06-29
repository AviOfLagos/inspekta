import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/users/{id}/profile:
 *   put:
 *     tags:
 *       - User Management
 *     summary: "Update user profile information"
 *     description: "Allows an authenticated user to update their own profile information. Platform admins can update any user's profile."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose profile is to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *               // Add other updatable fields as needed
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "You are not authorized to update this profile"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "User not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { id: userId } = await params;
    const data = await request.json();

    // Authorization check
    const isAuthorized = 
      session.id === userId || // User can update their own profile
      session.role === UserRole.PLATFORM_ADMIN; // Platform admin can update any user's profile

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'You are not authorized to update this profile' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name || user.name,
        phone: data.phone || user.phone,
        image: data.image || user.image,
        // Add other updatable fields here
      },
    });

    // Update specific profile models if they exist
    if (user.role === UserRole.CLIENT && data.clientProfile) {
      await prisma.clientProfile.update({
        where: { userId: userId },
        data: data.clientProfile,
      });
    }
    if (user.role === UserRole.AGENT && data.agentProfile) {
      await prisma.agentProfile.update({
        where: { userId: userId },
        data: data.agentProfile,
      });
    }
    if (user.role === UserRole.INSPECTOR && data.inspectorProfile) {
      await prisma.inspectorProfile.update({
        where: { userId: userId },
        data: data.inspectorProfile,
      });
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user profile' }, { status: 500 });
  }
}