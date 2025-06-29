import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole, InspectionStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/analytics/inspector/{id}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: "Get inspector performance analytics"
 *     description: "Retrieves performance metrics for a specific inspector. The authenticated user must be the inspector themselves or a platform admin."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the inspector whose analytics are to be fetched.
 *     responses:
 *       200:
 *         description: Inspector performance analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     totalInspections:
 *                       type: number
 *                       example: 150
 *                     completionRate:
 *                       type: number
 *                       example: 98.5
 *                     averageRating:
 *                       type: number
 *                       example: 4.8
 *                     onTimePercentage:
 *                       type: number
 *                       example: 95.2
 *                     earningsThisMonth:
 *                       type: number
 *                       example: 280000
 *                     upcomingJobs:
 *                       type: number
 *                       example: 8
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inspector not found
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

    const { id: inspectorId } = await params;

    if (session.id !== inspectorId && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const inspector = await prisma.user.findUnique({
      where: { id: inspectorId, role: UserRole.INSPECTOR },
      include: { inspectorProfile: true },
    });

    if (!inspector) {
      return NextResponse.json({ success: false, error: 'Inspector not found' }, { status: 404 });
    }

    // Get date range for the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch data in parallel
    const [inspections, earningsThisMonth, upcomingInspections] = await Promise.all([
      prisma.inspection.findMany({ where: { inspectorId } }),
      prisma.earning.findMany({
        where: {
          userId: inspectorId,
          createdAt: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),
      prisma.inspection.count({
        where: {
          inspectorId,
          status: InspectionStatus.SCHEDULED,
          scheduledAt: { gt: now },
        },
      }),
    ]);

    // Calculate stats
    const totalInspections = inspections.length;
    const completedInspections = inspections.filter(i => i.status === InspectionStatus.COMPLETED).length;
    const completionRate = totalInspections > 0 ? (completedInspections / totalInspections) * 100 : 0;
    const totalEarningsThisMonth = earningsThisMonth.reduce((sum, earning) => sum + earning.amount, 0);

    const analytics = {
      totalInspections,
      completionRate: parseFloat(completionRate.toFixed(2)),
      averageRating: inspector.inspectorProfile?.rating || 0, // Assuming rating is stored in inspectorProfile
      onTimePercentage: 0, // NOTE: On-time tracking is not implemented
      earningsThisMonth: totalEarningsThisMonth,
      upcomingJobs: upcomingInspections,
    };

    return NextResponse.json({ success: true, analytics });

  } catch (error) {
    console.error('Get inspector analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
