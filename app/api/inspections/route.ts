import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { InspectionType, InspectionStatus, UserRole } from '@/lib/generated/prisma';
import { NotificationService } from '@/lib/notification-service';

/**
 * @swagger
 * /api/inspections:
 *   get:
 *     tags:
 *       - Inspections
 *     summary: Get user's inspections
 *     description: Retrieves inspections based on user role - clients see their scheduled inspections, inspectors see their assigned jobs, agents see inspections for their properties
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Filter by inspection status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [VIRTUAL, PHYSICAL]
 *         description: Filter by inspection type
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Only return future inspections
 *     responses:
 *       200:
 *         description: List of user's inspections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 inspections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inspection'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as InspectionStatus | null;
    const type = searchParams.get('type') as InspectionType | null;
    const upcoming = searchParams.get('upcoming') === 'true';

    const whereClause: Record<string, any> = {};

    // Role-based filtering
    if (session.role === UserRole.CLIENT) {
      // Clients see inspections they're registered for
      whereClause.clients = {
        some: {
          clientId: session.id
        }
      };
    } else if (session.role === UserRole.INSPECTOR) {
      // Inspectors see their assigned inspections
      whereClause.inspectorId = session.id;
    } else if (session.role === UserRole.AGENT || session.role === UserRole.COMPANY_ADMIN) {
      // Agents see inspections for their listings
      whereClause.listing = {
        agentId: session.id
      };
    } else if (session.role === UserRole.PLATFORM_ADMIN) {
      // Platform admin sees all inspections
      // No additional filtering
    }

    // Apply filters
    if (status) {
      whereClause.status = status;
    }
    if (type) {
      whereClause.type = type;
    }
    if (upcoming) {
      whereClause.scheduledAt = {
        gte: new Date()
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
                agentProfile: true
              }
            }
          }
        },
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
            inspectorProfile: true
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
        },
        earnings: true
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      inspections
    });

  } catch (error) {
    console.error('Get inspections error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inspections' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/inspections:
 *   post:
 *     tags:
 *       - Inspections
 *     summary: Schedule a new inspection
 *     description: Creates a new inspection request for a property. Client role required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 description: ID of the property to inspect
 *               type:
 *                 type: string
 *                 enum: [VIRTUAL, PHYSICAL]
 *                 description: Type of inspection
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 description: When the inspection should take place
 *               notes:
 *                 type: string
 *                 description: Optional notes from the client
 *             required:
 *               - propertyId
 *               - type
 *               - scheduledAt
 *           examples:
 *             virtualInspection:
 *               summary: Schedule Virtual Inspection
 *               value:
 *                 propertyId: "clm123abc"
 *                 type: "VIRTUAL"
 *                 scheduledAt: "2024-02-15T14:00:00Z"
 *                 notes: "Very interested in this property"
 *             physicalInspection:
 *               summary: Schedule Physical Inspection
 *               value:
 *                 propertyId: "clm123abc"
 *                 type: "PHYSICAL"
 *                 scheduledAt: "2024-02-15T10:00:00Z"
 *                 notes: "Would like detailed structural inspection"
 *     responses:
 *       201:
 *         description: Inspection scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Inspection scheduled successfully"
 *                     inspection:
 *                       $ref: '#/components/schemas/Inspection'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
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
 *               error: "Only clients can schedule inspections"
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Property not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only clients can schedule inspections
    if (session.role !== UserRole.CLIENT) {
      return NextResponse.json(
        { success: false, error: 'Only clients can schedule inspections' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { propertyId, type, scheduledAt, notes } = body;

    // Validate required fields
    if (!propertyId || !type || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: 'Property ID, type, and scheduled time are required' },
        { status: 400 }
      );
    }

    // Validate inspection type
    if (!Object.values(InspectionType).includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid inspection type' },
        { status: 400 }
      );
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Inspection must be scheduled for a future date' },
        { status: 400 }
      );
    }

    // Verify property exists and is active
    const property = await prisma.listing.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        company: true
      }
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Property is not available for inspection' },
        { status: 400 }
      );
    }

    // Calculate inspection fee
    const baseFee = type === InspectionType.VIRTUAL ? 15000 : 25000; // Nigerian Naira
    
    // TODO: Auto-assign inspector based on location and availability
    // For now, we'll leave inspectorId null and handle assignment separately
    
    // Create inspection
    const inspection = await prisma.inspection.create({
      data: {
        type,
        status: InspectionStatus.SCHEDULED,
        scheduledAt: scheduledDate,
        duration: type === InspectionType.VIRTUAL ? 30 : 60, // minutes
        listingId: propertyId,
        companyId: property.companyId,
        fee: baseFee,
        paid: false,
        inspectorId: null, // Will be assigned later when inspector accepts
        
        // Register the client for this inspection
        clients: {
          create: {
            clientId: session.id,
            interested: true,
            notes: notes || ''
          }
        }
      },
      include: {
        listing: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
            inspectorProfile: true
          }
        },
        clients: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Send real-time notifications
    try {
      // Notify the client that their inspection was scheduled
      await NotificationService.notifyInspectionScheduled(
        session.id, 
        inspection.id, 
        property.title
      );

      // Notify the property agent of new inspection request
      if (property.agent) {
        await NotificationService.createNotification({
          userId: property.agent.id,
          type: 'INSPECTION_SCHEDULED',
          title: 'New Inspection Request',
          message: `A client has scheduled an inspection for your property "${property.title}".`,
          inspectionId: inspection.id,
          listingId: property.id,
        });
      }

      // Notify available inspectors of new job opportunity
      const availableInspectors = await prisma.user.findMany({
        where: {
          role: UserRole.INSPECTOR,
          verificationStatus: 'VERIFIED',
          // TODO: Add location-based filtering
        },
        select: { id: true }
      });

      if (availableInspectors.length > 0) {
        await NotificationService.createBulkNotifications(
          availableInspectors.map(inspector => inspector.id),
          {
            type: 'NEW_JOB_AVAILABLE',
            title: 'New Inspection Job Available',
            message: `New ${type.toLowerCase()} inspection available for "${property.title}" on ${scheduledDate.toLocaleDateString()}.`,
            inspectionId: inspection.id,
            listingId: property.id,
          }
        );
      }
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the entire request if notifications fail
    }

    return NextResponse.json({
      success: true,
      message: 'Inspection scheduled successfully',
      inspection
    }, { status: 201 });

  } catch (error) {
    console.error('Schedule inspection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule inspection' },
      { status: 500 }
    );
  }
}