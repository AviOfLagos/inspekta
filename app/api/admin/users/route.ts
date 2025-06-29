import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/admin/users - Get all users for admin management
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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';
    const status = url.searchParams.get('status') || '';
    const companyId = url.searchParams.get('companyId') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      whereCondition.role = role;
    }

    if (status) {
      whereCondition.verificationStatus = status;
    }

    if (companyId) {
      whereCondition.companyId = companyId;
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              subdomain: true,
            },
          },
          // Get user stats based on role
          listings: {
            select: { id: true },
            where: { status: 'ACTIVE' }
          },
          inspections: {
            select: { id: true }
          },
          earnings: {
            select: { amount: true, paid: true }
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    // Transform users to include stats
    const usersWithStats = users.map(user => {
      const totalEarnings = user.earnings.reduce((sum, earning) => sum + earning.amount, 0);
      const paidEarnings = user.earnings
        .filter(earning => earning.paid)
        .reduce((sum, earning) => sum + earning.amount, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role,
        verificationStatus: user.verificationStatus,
        ninNumber: user.ninNumber,
        bvnNumber: user.bvnNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        company: user.company,
        stats: {
          listings: user.listings.length,
          inspections: user.inspections.length,
          totalEarnings,
          paidEarnings,
          pendingEarnings: totalEarnings - paidEarnings,
        },
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}