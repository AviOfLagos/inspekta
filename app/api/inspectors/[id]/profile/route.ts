import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/inspectors/{id}/profile:
 *   get:
 *     tags:
 *       - User Management
 *     summary: "Get inspector profile information"
 *     description: "Retrieves detailed profile information for a specific inspector. The authenticated user must be the inspector themselves or a platform admin."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the inspector whose profile is to be fetched.
 *     responses:
 *       200:
 *         description: Inspector profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     inspectorProfile:
 *                       type: object
 *                       properties:
 *                         location:
 *                           type: string
 *                         availabilityRadius:
 *                           type: number
 *                         rating:
 *                           type: number
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
 *               error: "You are not authorized to view this profile"
 *       404:
 *         description: User or Inspector Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Inspector not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { id: userId } = await params;

    const inspector = await prisma.user.findUnique({
      where: { id: userId, role: UserRole.INSPECTOR },
      include: {
        inspectorProfile: true,
      },
    });

    if (!inspector) {
      return NextResponse.json({ success: false, error: 'Inspector not found' }, { status: 404 });
    }

    // Authorization check
    const isAuthorized = 
      session.id === userId || // User can view their own profile
      session.role === UserRole.PLATFORM_ADMIN; // Platform admin can view any inspector's profile

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'You are not authorized to view this profile' }, { status: 403 });
    }

    const profile = {
      id: inspector.id,
      email: inspector.email,
      name: inspector.name,
      username: inspector.username,
      phone: inspector.phone,
      image: inspector.image,
      role: inspector.role,
      emailVerified: inspector.emailVerified,
      verificationStatus: inspector.verificationStatus,
      createdAt: inspector.createdAt,
      updatedAt: inspector.updatedAt,
      inspectorProfile: inspector.inspectorProfile,
    };

    return NextResponse.json({ success: true, profile });

  } catch (error) {
    console.error('Get inspector profile error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve inspector profile' }, { status: 500 });
  }
}
