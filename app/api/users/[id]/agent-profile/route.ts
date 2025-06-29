import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/users/{id}/agent-profile:
 *   put:
 *     tags:
 *       - User Management
 *     summary: "Update agent profile information"
 *     description: "Allows an authenticated agent to update their own agent profile information. Platform admins can update any agent's profile."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent whose profile is to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guarantor1Name:
 *                 type: string
 *               guarantor1Phone:
 *                 type: string
 *               guarantor2Name:
 *                 type: string
 *               guarantor2Phone:
 *                 type: string
 *               // Add other updatable agent profile fields as needed
 *     responses:
 *       200:
 *         description: Agent profile updated successfully.
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
 *                   example: "Agent profile updated successfully"
 *                 agentProfile:
 *                   $ref: '#/components/schemas/AgentProfile'
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
 *               error: "You are not authorized to update this agent profile"
 *       404:
 *         description: User or Agent Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Agent profile not found"
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
      (session.id === userId && session.role === UserRole.AGENT) || // Agent can update their own profile
      session.role === UserRole.PLATFORM_ADMIN; // Platform admin can update any agent's profile

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'You are not authorized to update this agent profile' }, { status: 403 });
    }

    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: userId },
    });

    if (!agentProfile) {
      return NextResponse.json({ success: false, error: 'Agent profile not found' }, { status: 404 });
    }

    const updatedAgentProfile = await prisma.agentProfile.update({
      where: { userId: userId },
      data: {
        guarantor1Name: data.guarantor1Name || agentProfile.guarantor1Name,
        guarantor1Phone: data.guarantor1Phone || agentProfile.guarantor1Phone,
        guarantor2Name: data.guarantor2Name || agentProfile.guarantor2Name,
        guarantor2Phone: data.guarantor2Phone || agentProfile.guarantor2Phone,
        // Add other updatable fields here
      },
    });

    return NextResponse.json({ success: true, message: 'Agent profile updated successfully', agentProfile: updatedAgentProfile });

  } catch (error) {
    console.error('Update agent profile error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update agent profile' }, { status: 500 });
  }
}
