import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/admin/companies - Get all companies for admin management
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
    const status = url.searchParams.get('status') || '';
    const tier = url.searchParams.get('tier') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      whereCondition.verificationStatus = status;
    }

    if (tier) {
      whereCondition.subscriptionTier = tier;
    }

    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where: whereCondition,
        include: {
          users: {
            select: { id: true, role: true }
          },
          listings: {
            select: { id: true, status: true }
          },
          earnings: {
            select: { amount: true, paid: true }
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.company.count({ where: whereCondition }),
    ]);

    // Transform companies to include stats
    const companiesWithStats = companies.map(company => {
      const totalEarnings = company.earnings.reduce((sum, earning) => sum + earning.amount, 0);
      const activeListings = company.listings.filter(listing => listing.status === 'ACTIVE').length;
      
      // Count users by role
      const usersByRole = company.users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        id: company.id,
        name: company.name,
        subdomain: company.subdomain,
        customDomain: company.customDomain,
        logo: company.logo,
        description: company.description,
        cacNumber: company.cacNumber,
        verificationStatus: company.verificationStatus,
        subscriptionTier: company.subscriptionTier,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        stats: {
          userCount: company.users.length,
          listingCount: company.listings.length,
          activeListings,
          totalEarnings,
          usersByRole,
        },
      };
    });

    return NextResponse.json({
      success: true,
      companies: companiesWithStats,
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
    console.error('Admin companies fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}