import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/admin/stats - Get platform statistics for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow platform admins
    if (user.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get current month start and end
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total counts
    const [
      totalUsers,
      totalCompanies,
      totalListings,
      totalInspections,
      pendingVerifications,
      activeSubscriptions,
      currentMonthUsers,
      lastMonthUsers,
      platformEarnings,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total companies
      prisma.company.count(),
      
      // Total listings
      prisma.listing.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Total inspections
      prisma.inspection.count(),
      
      // Pending verifications (users + companies)
      prisma.user.count({
        where: { verificationStatus: 'PENDING' }
      }).then(async (userCount) => {
        const companyCount = await prisma.company.count({
          where: { verificationStatus: 'PENDING' }
        });
        return userCount + companyCount;
      }),
      
      // Active subscriptions
      prisma.subscription.count({
        where: { 
          active: true,
          expiresAt: { gt: now }
        }
      }),
      
      // Users created this month
      prisma.user.count({
        where: {
          createdAt: { gte: monthStart }
        }
      }),
      
      // Users created last month
      prisma.user.count({
        where: {
          createdAt: { 
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }),
      
      // Platform earnings this month (10% of all earnings)
      prisma.earning.aggregate({
        where: {
          createdAt: { gte: monthStart }
        },
        _sum: {
          amount: true
        }
      }).then(result => (result._sum.amount || 0) * 0.1), // Platform gets 10%
    ]);

    // Calculate monthly growth
    const monthlyGrowth = lastMonthUsers > 0 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;

    // Get user role breakdown
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    // Get verification status breakdown
    const verificationsByStatus = await prisma.user.groupBy({
      by: ['verificationStatus'],
      _count: {
        id: true
      }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const [
      recentUsers,
      recentListings,
      recentInspections,
      recentCompanies
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.listing.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.inspection.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.company.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      })
    ]);

    const stats = {
      totalUsers,
      totalCompanies,
      totalListings,
      totalInspections,
      totalEarnings: platformEarnings,
      pendingVerifications,
      activeSubscriptions,
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1)),
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count.id;
        return acc;
      }, {} as Record<string, number>),
      verificationsByStatus: verificationsByStatus.reduce((acc, curr) => {
        acc[curr.verificationStatus] = curr._count.id;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: {
        users: recentUsers,
        listings: recentListings,
        inspections: recentInspections,
        companies: recentCompanies
      }
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch platform statistics' },
      { status: 500 }
    );
  }
}