import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { UserRole, InspectionStatus, EarningType } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/inspections/{id}/complete:
 *   put:
 *     tags:
 *       - Inspections
 *     summary: Mark inspection as completed
 *     description: Inspector marks an assigned inspection as completed with optional report and recording. Inspector role required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inspection ID to complete
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Inspection completion notes
 *               report:
 *                 type: string
 *                 description: Detailed inspection report
 *               recordingUrl:
 *                 type: string
 *                 description: URL to inspection recording (for virtual inspections)
 *               recommendations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Inspector recommendations
 *           example:
 *             notes: "Inspection completed successfully"
 *             report: "Property is in excellent condition. All major systems are functioning properly."
 *             recordingUrl: "https://storage.com/recording-123.mp4"
 *             recommendations: ["Consider minor paint touch-ups", "HVAC system is due for maintenance"]
 *     responses:
 *       200:
 *         description: Inspection completed successfully
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
 *                       example: "Inspection completed successfully"
 *                     inspection:
 *                       $ref: '#/components/schemas/Inspection'
 *                     earning:
 *                       type: object
 *                       description: Earning record created for the inspector
 *                       properties:
 *                         id:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         type:
 *                           type: string
 *                           example: "INSPECTION_FEE"
 *       400:
 *         description: Inspection cannot be completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               notAssigned:
 *                 summary: Not Assigned to Inspector
 *                 value:
 *                   success: false
 *                   error: "You are not assigned to this inspection"
 *               alreadyCompleted:
 *                 summary: Already Completed
 *                 value:
 *                   success: false
 *                   error: "This inspection is already completed"
 *               notStarted:
 *                 summary: Cannot Complete Before Start Time
 *                 value:
 *                   success: false
 *                   error: "Cannot complete inspection before scheduled time"
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
 *               error: "Only inspectors can complete inspections"
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
export async function PUT(
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

    // Only inspectors can complete inspections
    if (session.role !== UserRole.INSPECTOR) {
      return NextResponse.json(
        { success: false, error: 'Only inspectors can complete inspections' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { notes, report, recordingUrl, recommendations } = body;

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
        },
        company: true
      }
    });

    if (!inspection) {
      return NextResponse.json(
        { success: false, error: 'Inspection not found' },
        { status: 404 }
      );
    }

    // Verify inspector is assigned to this inspection
    if (inspection.inspectorId !== session.id) {
      return NextResponse.json(
        { success: false, error: 'You are not assigned to this inspection' },
        { status: 400 }
      );
    }

    // Verify inspection is not already completed
    if (inspection.status === InspectionStatus.COMPLETED) {
      return NextResponse.json(
        { success: false, error: 'This inspection is already completed' },
        { status: 400 }
      );
    }

    // Allow completing slightly before scheduled time (up to 30 minutes early)
    const now = new Date();
    const scheduledTime = new Date(inspection.scheduledAt);
    const thirtyMinutesEarly = new Date(scheduledTime.getTime() - 30 * 60 * 1000);
    
    if (now < thirtyMinutesEarly) {
      return NextResponse.json(
        { success: false, error: 'Cannot complete inspection more than 30 minutes before scheduled time' },
        { status: 400 }
      );
    }

    // Calculate revenue split (60% inspector, 30% agent, 10% platform)
    const totalFee = inspection.fee || 0;
    const inspectorEarning = totalFee * 0.6;  // 60% to inspector
    const agentEarning = totalFee * 0.3;      // 30% to agent
    // const platformEarning = totalFee * 0.1;   // 10% to platform (reserved for future use)

    // Start transaction to complete inspection and create earnings
    const result = await prisma.$transaction(async (tx) => {
      // Update inspection status
      const updatedInspection = await tx.inspection.update({
        where: { id },
        data: {
          status: InspectionStatus.COMPLETED,
          recordingUrl: recordingUrl || null,
          // Store completion data in a JSON field if needed
          // completionData: {
          //   notes,
          //   report,
          //   recommendations,
          //   completedAt: new Date()
          // }
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

      // Create inspector earning
      const inspectorEarningRecord = await tx.earning.create({
        data: {
          type: EarningType.INSPECTION_FEE,
          amount: inspectorEarning,
          currency: 'NGN',
          userId: session.id,
          companyId: inspection.companyId,
          inspectionId: id,
          paid: false, // Will be paid during payout cycle
          platformCut: 0.1
        }
      });

      // Create agent earning
      await tx.earning.create({
        data: {
          type: EarningType.INSPECTION_FEE,
          amount: agentEarning,
          currency: 'NGN',
          userId: inspection.listing.agentId,
          companyId: inspection.companyId,
          inspectionId: id,
          paid: false,
          platformCut: 0.1
        }
      });

      // Update inspector profile stats
      await tx.inspectorProfile.update({
        where: { userId: session.id },
        data: {
          inspectionCount: {
            increment: 1
          }
          // Could also update average rating if we track ratings
        }
      });

      // Update agent profile stats
      await tx.agentProfile.update({
        where: { userId: inspection.listing.agentId },
        data: {
          // Could track agent inspection stats here
        }
      });

      return { updatedInspection, inspectorEarningRecord };
    });

    // TODO: Send completion notifications
    // - Notify client that inspection is complete
    // - Notify agent of completion
    // - Send inspection report/recording links
    // - Schedule follow-up communications

    console.log('Inspection completed:', {
      inspectionId: id,
      inspector: session.name,
      notes,
      report: report?.substring(0, 100) + '...',
      recommendations: recommendations?.length || 0
    });

    return NextResponse.json({
      success: true,
      message: 'Inspection completed successfully',
      inspection: result.updatedInspection,
      earning: result.inspectorEarningRecord
    });

  } catch (error) {
    console.error('Complete inspection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete inspection' },
      { status: 500 }
    );
  }
}