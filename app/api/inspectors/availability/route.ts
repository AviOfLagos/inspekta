import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/inspectors/availability:
 *   post:
 *     tags:
 *       - Inspector
 *     summary: "Set inspector availability"
 *     description: "Allows an authenticated inspector to set their availability for inspections."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *               - isAvailable
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date for which availability is being set (YYYY-MM-DD).
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: The start time of availability (HH:MM).
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: The end time of availability (HH:MM).
 *               isAvailable:
 *                 type: boolean
 *                 description: Whether the inspector is available on this date/time slot.
 *             example:
 *               date: "2025-07-10"
 *               startTime: "09:00"
 *               endTime: "17:00"
 *               isAvailable: true
 *     responses:
 *       200:
 *         description: Availability set successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Availability updated successfully"
 *                 availability:
 *                   $ref: '#/components/schemas/InspectorAvailability'
 *       400:
 *         description: Invalid input.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only inspectors can set availability.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (session.role !== UserRole.INSPECTOR) {
      return NextResponse.json({ success: false, error: 'Only inspectors can set availability' }, { status: 403 });
    }

    const { date, startTime, endTime, isAvailable } = await request.json();

    if (!date || !startTime || !endTime || typeof isAvailable !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Date, start time, end time, and availability status are required' }, { status: 400 });
    }

    // Combine date and time strings into Date objects
    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    // Find or create inspector profile
    let inspectorProfile = await prisma.inspectorProfile.findUnique({
      where: { userId: session.id },
    });

    if (!inspectorProfile) {
      inspectorProfile = await prisma.inspectorProfile.create({
        data: { userId: session.id },
      });
    }

    const availability = await prisma.inspectorAvailability.upsert({
      where: {
        inspectorProfileId_date: {
          inspectorProfileId: inspectorProfile.id,
          date: new Date(date),
        },
      },
      update: {
        isAvailable,
        startTime: startDateTime,
        endTime: endDateTime,
      },
      create: {
        inspectorProfileId: inspectorProfile.id,
        date: new Date(date),
        isAvailable,
        startTime: startDateTime,
        endTime: endDateTime,
      },
    });

    return NextResponse.json({ success: true, message: 'Availability updated successfully', availability });

  } catch (error) {
    console.error('Set inspector availability error:', error);
    return NextResponse.json({ success: false, error: 'Failed to set availability' }, { status: 500 });
  }
}
