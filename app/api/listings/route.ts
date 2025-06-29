import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PropertyType, ListingStatus } from '@/lib/generated/prisma';

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

    const listings = await prisma.listing.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status }),
        ...(location && { 
          OR: [
            { address: { contains: location, mode: 'insensitive' } },
            { city: { contains: location, mode: 'insensitive' } },
            { state: { contains: location, mode: 'insensitive' } }
          ]
        }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            agentProfile: true,
          },
        },
        inspections: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ listings });
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
    } = body;

    // Validate required fields
    if (!title || !type || !price || !address || !agentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId, role: 'AGENT' },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        type,
        price: parseFloat(price),
        address,
        city: city || '',
        state: state || '',
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        images: images || [],
        agentId,
        status: 'ACTIVE',
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            agentProfile: true,
          },
        },
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}