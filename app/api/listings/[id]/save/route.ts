import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/listings/{id}/save:
 *   post:
 *     tags:
 *       - Listings
 *     summary: "Save a property to favorites"
 *     description: "Allows an authenticated client to save a property listing to their favorites."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing to save.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Optional notes for the saved property.
 *             example:
 *               notes: "This could be a great investment property."
 *     responses:
 *       201:
 *         description: Property saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Property already saved.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only clients can save properties.
 *       404:
 *         description: Listing not found.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (session.role !== UserRole.CLIENT) {
      return NextResponse.json({ success: false, error: 'Only clients can save properties' }, { status: 403 });
    }

    const { id: listingId } = await params;
    const { notes } = (await request.json()) || {};

    const existingSaved = await prisma.savedListing.findFirst({
      where: { listingId, userId: session.id },
    });

    if (existingSaved) {
      return NextResponse.json({ success: false, error: 'Property already saved' }, { status: 400 });
    }

    const savedListing = await prisma.savedListing.create({
      data: {
        listingId,
        userId: session.id,
        notes,
      },
    });

    return NextResponse.json({ success: true, message: 'Property saved successfully', savedListing }, { status: 201 });

  } catch (error) {
    console.error('Save property error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save property' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/listings/{id}/save:
 *   delete:
 *     tags:
 *       - Listings
 *     summary: "Unsave a property from favorites"
 *     description: "Allows an authenticated client to remove a property listing from their favorites."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing to unsave.
 *     responses:
 *       200:
 *         description: Property unsaved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only clients can unsave properties.
 *       404:
 *         description: Saved listing not found.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (session.role !== UserRole.CLIENT) {
      return NextResponse.json({ success: false, error: 'Only clients can unsave properties' }, { status: 403 });
    }

    const { id: listingId } = await params;

    const savedListing = await prisma.savedListing.findFirst({
      where: { listingId, userId: session.id },
    });

    if (!savedListing) {
      return NextResponse.json({ success: false, error: 'Saved listing not found' }, { status: 404 });
    }

    await prisma.savedListing.delete({
      where: { id: savedListing.id },
    });

    return NextResponse.json({ success: true, message: 'Property unsaved successfully' });

  } catch (error) {
    console.error('Unsave property error:', error);
    return NextResponse.json({ success: false, error: 'Failed to unsave property' }, { status: 500 });
  }
}
