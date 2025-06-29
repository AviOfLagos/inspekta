import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/agents/{id}/inspections:
 *   get:
 *     tags:
 *       - Agents
 *     summary: "Get an agent's property inspections"
 *     description: "Retrieves all inspection requests for properties listed by a specific agent. The authenticated user must be the agent themselves or a platform admin."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent whose inspections are to be fetched.
 *     responses:
 *       200:
 *         description: A list of inspections for the agent's properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 inspections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inspection'
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
 *               error: "You are not authorized to view these inspections"
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Agent not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id: agentId } = await params;

    if (session.id !== agentId && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to view these inspections' },
        { status: 403 }
      );
    }

    const agent = await prisma.user.findUnique({
      where: { id: agentId, role: UserRole.AGENT },
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    const inspections = await prisma.inspection.findMany({
      where: {
        listing: {
          agentId: agentId,
        },
      },
      include: {
        listing: true,
        clients: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      inspections,
    });

  } catch (error) {
    console.error('Get agent inspections error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve inspections' },
      { status: 500 }
    );
  }
}
