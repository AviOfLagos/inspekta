import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PropertyType, ListingStatus } from '@/lib/generated/prisma';
import { cache, cacheKeys, cacheTTL, invalidateCache } from '@/lib/cache';

/**
 * @swagger
 * /api/listings:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Get all property listings
 *     description: Retrieves all property listings with optional filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *         example: "modern apartment"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [APARTMENT, HOUSE, OFFICE, LAND]
 *         description: Filter by property type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, PENDING, SOLD]
 *         description: Filter by listing status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *         example: "Lagos"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter (in Naira)
 *         example: 1000000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter (in Naira)
 *         example: 50000000
 *     responses:
 *       200:
 *         description: List of property listings
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
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security: []
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as PropertyType | null;
    const status = searchParams.get('status') as ListingStatus | null;
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50); // Max 50 per page
    const skip = (page - 1) * limit;

    // Create cache key from query parameters
    const cacheKey = cacheKeys.listings({
      type,
      status: status || 'ACTIVE',
      location,
      minPrice,
      maxPrice,
      search,
      page,
      limit,
    });

    // Try to get from cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      const response = NextResponse.json(cachedResult);
      response.headers.set('X-Cache', 'HIT');
      response.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
      return response;
    }

    // Build where clause for better performance
    const where: any = {
      ...(type && { type }),
      ...(status ? { status } : { status: 'ACTIVE' }), // Default to active listings
      ...(location && { 
        OR: [
          { address: { contains: location, mode: 'insensitive' } },
          { city: { contains: location, mode: 'insensitive' } },
          { state: { contains: location, mode: 'insensitive' } }
        ]
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    };

    // Get total count for pagination
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          address: true,
          city: true,
          state: true,
          price: true,
          currency: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          images: true,
          featured: true,
          tier: true,
          createdAt: true,
          updatedAt: true,
          companyId: true,
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              agentProfile: {
                select: {
                  id: true,
                  listingCount: true,
                  successfulDeals: true,
                }
              }
            }
          },
          inspections: {
            select: {
              id: true,
              status: true,
              scheduledAt: true,
            },
            take: 3, // Only get latest 3 inspections
            orderBy: {
              scheduledAt: 'desc'
            }
          },
          _count: {
            select: {
              inquiries: true,
              savedBy: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' }, // Featured listings first
          { tier: 'desc' },     // Then by tier
          { createdAt: 'desc' } // Then by creation date
        ],
      }),
      prisma.listing.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const result = {
      listings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    };

    // Cache the result (2 minutes for listings with search, 5 minutes for basic listings)
    const ttl = search || location ? cacheTTL.short : cacheTTL.medium;
    cache.set(cacheKey, result, ttl);

    // Set cache headers for better performance
    const response = NextResponse.json(result);
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create new listing
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      price,
      address,
      city,
      state,
      bedrooms,
      bathrooms,
      area,
      images,
      agentId,
      companyId,
      latitude,
      longitude,
    } = body;

    // Validate required fields
    if (!title || !type || !price || !address || !agentId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, price, address, agentId' },
        { status: 400 }
      );
    }

    // Validate data types and ranges
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Verify agent exists and has AGENT role
    const agent = await prisma.user.findFirst({
      where: { 
        id: agentId, 
        role: 'AGENT',
        ...(companyId && { companyId }) // If companyId provided, verify agent belongs to company
      },
      select: { id: true, companyId: true }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid agent ID or agent not found' },
        { status: 400 }
      );
    }

    // Process and validate images
    const processedImages = Array.isArray(images) ? images.slice(0, 10) : []; // Max 10 images

    // Use transaction for data consistency
    const listing = await prisma.$transaction(async (tx) => {
      // Create the listing
      const newListing = await tx.listing.create({
        data: {
          title: title.trim(),
          description: description?.trim() || '',
          type,
          price: parsedPrice,
          address: address.trim(),
          city: city?.trim() || '',
          state: state?.trim() || '',
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          area: area ? parseFloat(area) : null,
          images: processedImages,
          agentId,
          companyId: companyId || agent.companyId,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          address: true,
          city: true,
          state: true,
          price: true,
          currency: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          images: true,
          featured: true,
          tier: true,
          referralCode: true,
          companyId: true,
          createdAt: true,
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              agentProfile: {
                select: {
                  id: true,
                  listingCount: true,
                  successfulDeals: true,
                }
              }
            }
          }
        }
      });

      // Update agent's listing count
      await tx.agentProfile.update({
        where: { userId: agentId },
        data: {
          listingCount: {
            increment: 1
          }
        }
      });

      return newListing;
    });

    // Invalidate relevant cache entries
    invalidateCache('listings');
    invalidateCache(`agent:${agentId}`);
    if (listing.companyId) {
      invalidateCache(`company:${listing.companyId}`);
    }

    // Set cache-busting headers
    const response = NextResponse.json({ listing }, { status: 201 });
    response.headers.set('Cache-Control', 'no-cache');
    
    return response;
  } catch (error: any) {
    console.error('Create listing error:', error);
    
    // Handle specific Prisma errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A listing with similar details already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}