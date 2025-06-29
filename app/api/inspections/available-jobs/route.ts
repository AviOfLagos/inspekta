import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { UserRole, InspectionStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/inspections/available-jobs:
 *   get:
 *     tags:
 *       - Inspections
 *     summary: Get available inspection jobs for inspectors
 *     description: Retrieves unassigned inspection requests that inspectors can accept. Inspector role required.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [VIRTUAL, PHYSICAL]
 *         description: Filter by inspection type
 *       - in: query
 *         name: urgency
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         description: Filter by job urgency
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by property location (city/state)
 *     responses:
 *       200:
 *         description: List of available inspection jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 availableJobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Inspection ID
 *                       property:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           address:
 *                             type: string
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                           type:
 *                             type: string
 *                           price:
 *                             type: number
 *                       type:
 *                         type: string
 *                         enum: [VIRTUAL, PHYSICAL]
 *                       scheduledAt:
 *                         type: string
 *                         format: date-time
 *                       client:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       agent:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       payment:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: number
 *                           status:
 *                             type: string
 *                             enum: [PENDING, PAID]
 *                       urgency:
 *                         type: string
 *                         enum: [LOW, MEDIUM, HIGH]
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Only inspectors can view available jobs"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only inspectors can view available jobs
    if (session.role !== UserRole.INSPECTOR) {
      return NextResponse.json(
        { success: false, error: 'Only inspectors can view available jobs' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const urgency = searchParams.get('urgency');
    const location = searchParams.get('location');

    // Build where clause for available jobs
    const whereClause = {
      status: InspectionStatus.SCHEDULED,
      inspectorId: null, // Unassigned inspections
      scheduledAt: {
        gte: new Date() // Future inspections only
      }
    };

    if (type) {
      (whereClause as any).type = type;
    }

    if (location) {
      (whereClause as any).listing = {
        OR: [
          { city: { contains: location, mode: 'insensitive' } },
          { state: { contains: location, mode: 'insensitive' } },
          { address: { contains: location, mode: 'insensitive' } }
        ]
      };
    }

    const inspections = await prisma.inspection.findMany({
      where: whereClause,
      include: {
        listing: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        clients: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: [
        { scheduledAt: 'asc' }, // Soonest first
        { createdAt: 'asc' }    // Oldest requests first
      ]
    });

    // Transform data to match frontend expectations
    const availableJobs = inspections.map(inspection => {
      // Calculate urgency based on scheduled time
      const hoursUntilInspection = (inspection.scheduledAt.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      let calculatedUrgency: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      
      if (hoursUntilInspection <= 24) {
        calculatedUrgency = 'HIGH';
      } else if (hoursUntilInspection <= 72) {
        calculatedUrgency = 'MEDIUM';
      }

      // Filter by urgency if specified
      if (urgency && calculatedUrgency !== urgency) {
        return null;
      }

      return {
        id: inspection.id,
        property: {
          id: inspection.listing.id,
          title: inspection.listing.title,
          address: inspection.listing.address,
          city: inspection.listing.city,
          state: inspection.listing.state,
          type: inspection.listing.type,
          price: inspection.listing.price
        },
        type: inspection.type,
        scheduledAt: inspection.scheduledAt,
        status: inspection.status,
        client: inspection.clients[0] ? {
          id: inspection.clients[0].client.id,
          name: inspection.clients[0].client.name,
          email: inspection.clients[0].client.email,
          phone: inspection.clients[0].client.phone
        } : null,
        agent: {
          id: inspection.listing.agent.id,
          name: inspection.listing.agent.name,
          email: inspection.listing.agent.email,
          phone: inspection.listing.agent.phone
        },
        payment: {
          amount: inspection.fee || 0,
          status: inspection.paid ? 'PAID' : 'PENDING'
        },
        urgency: calculatedUrgency,
        duration: inspection.duration,
        notes: inspection.clients[0]?.notes || ''
      };
    }).filter(job => job !== null); // Remove filtered out jobs

    return NextResponse.json({
      success: true,
      availableJobs
    });

  } catch (error) {
    console.error('Get available jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available jobs' },
      { status: 500 }
    );
  }
}