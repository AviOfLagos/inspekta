import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole, ListingStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/analytics/agent/{id}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: "Get agent performance analytics"
 *     description: "Retrieves performance metrics for a specific agent. The authenticated user must be the agent themselves or a platform admin."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the agent whose analytics are to be fetched.
 *     responses:
 *       200:
 *         description: Agent performance analytics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AgentAnalytics'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Agent not found
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

    const { id: agentId } = await params;

    if (session.id !== agentId && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const agent = await prisma.user.findUnique({
      where: { id: agentId, role: UserRole.AGENT },
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    // Get date range for the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch data in parallel
    const [listings, inquiries, earningsThisMonth] = await Promise.all([
      prisma.listing.findMany({ where: { agentId } }),
      prisma.inquiry.findMany({ where: { listing: { agentId } } }),
      prisma.earning.findMany({
        where: {
          userId: agentId,
          createdAt: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
    ]);

    // Calculate stats
    const totalListings = listings.length;
    const activeListings = listings.filter(l => l.status === ListingStatus.ACTIVE).length;
    const totalInquiries = inquiries.length;
    const totalEarningsThisMonth = earningsThisMonth.reduce((sum, earning) => sum + earning.amount, 0);

    // Find top performing listing (by number of inquiries)
    const inquiryCounts = inquiries.reduce((acc, inquiry) => {
      acc[inquiry.listingId] = (acc[inquiry.listingId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topListingId = Object.keys(inquiryCounts).sort((a, b) => inquiryCounts[b] - inquiryCounts[a])[0];
    const topPerformingListing = topListingId ? listings.find(l => l.id === topListingId) : null;

    const analytics = {
      totalListings,
      activeListings,
      totalViews: 0, // NOTE: View tracking is not implemented
      totalInquiries,
      conversionRate: 0, // NOTE: Cannot calculate without views
      averageResponseTime: 'N/A', // NOTE: Response time tracking is not implemented
      earningsThisMonth: totalEarningsThisMonth,
      topPerformingListing,
    };

    return NextResponse.json({ success: true, analytics });

  } catch (error) {
    console.error('Get agent analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
