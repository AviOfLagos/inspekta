import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/clients/{id}/saved-properties:
 *   get:
 *     tags:
 *       - Clients
 *     summary: "Get a client's saved property listings"
 *     description: "Retrieves all property listings that a specific client has saved. The authenticated user must be the client themselves or a platform admin."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client whose saved listings are to be fetched.
 *     responses:
 *       200:
 *         description: A list of the client's saved properties.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 savedListings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedListing'
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
 *               error: "You are not authorized to view these saved listings"
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Client not found"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id: clientId } = await params;

    if (session.id !== clientId && session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to view these saved listings' },
        { status: 403 }
      );
    }

    const client = await prisma.user.findUnique({
      where: { id: clientId, role: UserRole.CLIENT },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const savedListings = await prisma.savedListing.findMany({
      where: {
        userId: clientId,
      },
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      savedListings,
    });

  } catch (error) {
    console.error('Get saved listings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve saved listings' },
      { status: 500 }
    );
  }
}
