import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/agents/profile/{username}:
 *   get:
 *     tags:
 *       - Agents
 *     summary: "Get agent profile by username"
 *     description: "Retrieves the public profile and listings for a specific agent using their username."
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the agent.
 *     responses:
 *       200:
 *         description: Agent profile and listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 agent:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     image:
 *                       type: string
 *                     listings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Listing'
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
 */
export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    const agent = await prisma.user.findUnique({
      where: { username, role: UserRole.AGENT },
      include: {
        agentProfile: true,
        listings: {
          where: { status: 'ACTIVE' }, // Only show active listings
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    // Sanitize agent data for public view
    const publicAgentProfile = {
      id: agent.id,
      name: agent.name,
      username: agent.username,
      image: agent.image,
      listings: agent.listings,
      // Add other public fields from agentProfile if needed
      listingCount: agent.agentProfile?.listingCount || 0,
      successfulDeals: agent.agentProfile?.successfulDeals || 0,
    };

    return NextResponse.json({ success: true, agent: publicAgentProfile });

  } catch (error) {
    console.error('Get agent by username error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve agent profile' }, { status: 500 });
  }
}
