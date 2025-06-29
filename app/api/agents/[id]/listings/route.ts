import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/agents/{id}/listings:
 *   get:
 *     tags:
 *       - Agents
 *     summary: "Get an agent's property listings"
 *     description: "Retrieves all property listings associated with a specific agent ID. The authenticated user must be the agent themselves or a platform admin."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent whose listings are to be fetched.
 *     responses:
 *       200:
 *         description: A list of the agent's properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 listings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Listing'
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
 *               error: "You are not authorized to view these listings"
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

    // Users can only view their own listings unless they are an admin
    if (session.id !== agentId && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to view these listings' },
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

    const listings = await prisma.listing.findMany({
      where: {
        agentId: agentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      listings,
    });

  } catch (error) {
    console.error('Get agent listings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve listings' },
      { status: 500 }
    );
  }
}
