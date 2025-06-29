import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { PayoutStatus, UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/payouts/request:
 *   post:
 *     tags:
 *       - Payments
 *     summary: "Request a payout"
 *     description: "Allows an authenticated agent or inspector to request a payout of their accumulated earnings."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to be paid out.
 *               currency:
 *                 type: string
 *                 description: The currency of the payout (e.g., NGN).
 *             example:
 *               amount: 50000.00
 *               currency: "NGN"
 *     responses:
 *       201:
 *         description: Payout request created successfully.
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
 *                   example: "Payout request submitted successfully"
 *                 payout:
 *                   $ref: '#/components/schemas/Payout'
 *       400:
 *         description: Invalid input or insufficient funds.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only agents or inspectors can request payouts.
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

    if (session.role !== UserRole.AGENT && session.role !== UserRole.INSPECTOR) {
      return NextResponse.json({ success: false, error: 'Only agents and inspectors can request payouts' }, { status: 403 });
    }

    const { amount, currency } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json({ success: false, error: 'Amount and currency are required' }, { status: 400 });
    }

    // In a real application, you would check if the user has sufficient earnings
    // For now, we'll just create the payout request.

    const payout = await prisma.payout.create({
      data: {
        amount,
        currency,
        userId: session.id,
        status: PayoutStatus.PENDING,
      },
    });

    return NextResponse.json({ success: true, message: 'Payout request submitted successfully', payout }, { status: 201 });

  } catch (error) {
    console.error('Payout request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit payout request' }, { status: 500 });
  }
}