import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole, EarningType } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/agents/earnings:
 *   get:
 *     tags:
 *       - Agents
 *       - Payments
 *     summary: "Get agent earnings data"
 *     description: "Retrieves the earnings data for the authenticated agent."
 *     responses:
 *       200:
 *         description: Agent earnings data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 earnings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Earning'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only agents can view their earnings.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (session.role !== UserRole.AGENT && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json({ success: false, error: 'Only agents can view their earnings' }, { status: 403 });
    }

    const earnings = await prisma.earning.findMany({
      where: {
        userId: session.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, earnings });

  } catch (error) {
    console.error('Get agent earnings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve earnings' }, { status: 500 });
  }
}
