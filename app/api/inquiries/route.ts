import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     tags:
 *       - Inquiries
 *     summary: "Submit a new inquiry for a property"
 *     description: "Allows an authenticated client to submit an inquiry or message for a specific property listing."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listingId
 *               - message
 *             properties:
 *               listingId:
 *                 type: string
 *                 description: The ID of the property listing to inquire about.
 *               message:
 *                 type: string
 *                 description: The content of the inquiry message.
 *             example:
 *               listingId: "clxyz12345"
 *               message: "I am very interested in this property and would like to know more about the neighborhood."
 *     responses:
 *       201:
 *         description: Inquiry submitted successfully.
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
 *                   example: "Inquiry submitted successfully"
 *                 inquiry:
 *                   $ref: '#/components/schemas/Inquiry'
 *       400:
 *         description: Bad request, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Listing ID and message are required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Only clients can submit inquiries"
 *       404:
 *         description: Listing not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Listing not found"
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

    if (session.role !== UserRole.CLIENT) {
      return NextResponse.json(
        { success: false, error: 'Only clients can submit inquiries' },
        { status: 403 }
      );
    }

    const { listingId, message } = await request.json();

    if (!listingId || !message) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and message are required' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        listingId,
        clientId: session.id,
        message,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        listing: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        inquiry,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Submit inquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
