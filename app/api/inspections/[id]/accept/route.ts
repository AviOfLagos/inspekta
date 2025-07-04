import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { UserRole, InspectionStatus } from '@/lib/generated/prisma';
import { NotificationService } from '@/lib/notification-service';

/**
 * @swagger
 * /api/inspections/{id}/accept:
 *   post:
 *     tags:
 *       - Inspections
 *     summary: Accept an inspection job
 *     description: Inspector accepts an available inspection job and gets assigned to it. Inspector role required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inspection ID to accept
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Optional notes from the inspector
 *           example:
 *             notes: "I'm available and excited to inspect this property"
 *     responses:
 *       200:
 *         description: Job accepted successfully
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
 *                       example: "Inspection job accepted successfully"
 *                     inspection:
 *                       $ref: '#/components/schemas/Inspection'
 *       400:
 *         description: Job cannot be accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               alreadyAssigned:
 *                 summary: Job Already Assigned
 *                 value:
 *                   success: false
 *                   error: "This inspection is already assigned to another inspector"
 *               notScheduled:
 *                 summary: Not in Scheduled Status
 *                 value:
 *                   success: false
 *                   error: "Only scheduled inspections can be accepted"
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
 *               error: "Only inspectors can accept inspection jobs"
 *       404:
 *         description: Inspection not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Inspection not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only inspectors can accept jobs
    if (session.role !== UserRole.INSPECTOR) {
      return NextResponse.json(
        { success: false, error: 'Only inspectors can accept inspection jobs' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { notes } = body;

    // Find the inspection
    const inspection = await prisma.inspection.findUnique({
      where: { id },
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

    if (!inspection) {
      return NextResponse.json(
        { success: false, error: 'Inspection not found' },
        { status: 404 }
      );
    }

    // Verify inspection is available for acceptance
    if (inspection.inspectorId) {
      return NextResponse.json(
        { success: false, error: 'This inspection is already assigned to another inspector' },
        { status: 400 }
      );
    }

    if (inspection.status !== InspectionStatus.SCHEDULED) {
      return NextResponse.json(
        { success: false, error: 'Only scheduled inspections can be accepted' },
        { status: 400 }
      );
    }

    // Check if inspection is in the future
    if (inspection.scheduledAt <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Cannot accept past inspections' },
        { status: 400 }
      );
    }

    // Get inspector profile to verify they're active
    const inspector = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        inspectorProfile: true
      }
    });

    if (!inspector || !inspector.inspectorProfile) {
      return NextResponse.json(
        { success: false, error: 'Inspector profile not found' },
        { status: 400 }
      );
    }

    // Generate meeting URL for virtual inspections
    let meetingUrl: string | null = null;
    if (inspection.type === 'VIRTUAL') {
      // In a real app, integrate with Google Meet, Zoom, etc.
      meetingUrl = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;
    }

    // Accept the inspection
    const updatedInspection = await prisma.inspection.update({
      where: { id },
      data: {
        inspectorId: session.id,
        meetingUrl,
        // Add inspector notes if provided
        ...(notes && { 
          // Could store inspector notes in a separate field or JSON
        })
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

    // Update inspector's inspection count
    await prisma.inspectorProfile.update({
      where: { userId: session.id },
      data: {
        inspectionCount: {
          increment: 1
        }
      }
    });

    // Send real-time notifications
    try {
      // Notify all clients that an inspector has been assigned
      for (const client of inspection.clients) {
        await NotificationService.notifyInspectionAccepted(
          client.client.id,
          inspection.id,
          inspection.listing.title,
          inspector.name || 'Inspector'
        );
      }

      // Notify the agent that inspection is confirmed
      if (inspection.listing.agent) {
        await NotificationService.createNotification({
          userId: inspection.listing.agent.id,
          type: 'INSPECTION_ACCEPTED',
          title: 'Inspector Assigned',
          message: `${inspector.name || 'An inspector'} has been assigned to inspect your property "${inspection.listing.title}".`,
          inspectionId: inspection.id,
          listingId: inspection.listing.id,
        });
      }

      // Notify inspector with confirmation details
      await NotificationService.createNotification({
        userId: session.id,
        type: 'JOB_ACCEPTED',
        title: 'Job Accepted Successfully',
        message: `You have successfully accepted the inspection job for "${inspection.listing.title}".${meetingUrl ? ` Meeting URL: ${meetingUrl}` : ''}`,
        inspectionId: inspection.id,
        listingId: inspection.listing.id,
        metadata: {
          meetingUrl,
          scheduledAt: inspection.scheduledAt,
          type: inspection.type
        }
      });
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the entire request if notifications fail
    }

    return NextResponse.json({
      success: true,
      message: 'Inspection job accepted successfully',
      inspection: updatedInspection
    });

  } catch (error) {
    console.error('Accept inspection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept inspection job' },
      { status: 500 }
    );
  }
}