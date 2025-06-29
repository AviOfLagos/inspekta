import { NextResponse } from 'next/server';
import { getSession, createSession } from '@/lib/auth';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/auth/switch-role:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Switch user role (Demo mode only)
 *     description: Allows master demo user to switch between different roles for testing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [CLIENT, AGENT, INSPECTOR, COMPANY_ADMIN, PLATFORM_ADMIN]
 *                 description: Role to switch to
 *             required:
 *               - role
 *           examples:
 *             switchToAgent:
 *               summary: Switch to Agent Role
 *               value:
 *                 role: "AGENT"
 *             switchToClient:
 *               summary: Switch to Client Role
 *               value:
 *                 role: "CLIENT"
 *     responses:
 *       200:
 *         description: Role switched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Role switched to AGENT successfully"
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized for role switching
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Role switching only available for demo@inspekta.com"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Get current session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only allow role switching for demo master user
    if (session.email !== 'demo@inspekta.com') {
      return NextResponse.json(
        { success: false, error: 'Role switching only available for demo@inspekta.com' },
        { status: 403 }
      );
    }

    // Create new session with updated role
    const updatedSession = {
      ...session,
      role: role as UserRole,
    };

    await createSession(updatedSession);

    return NextResponse.json({
      success: true,
      message: `Role switched to ${role} successfully`,
      user: updatedSession,
    });

  } catch (error) {
    console.error('Role switch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to switch role' },
      { status: 500 }
    );
  }
}