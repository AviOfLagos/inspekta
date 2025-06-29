import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { PaymentStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     tags:
 *       - Payments
 *     summary: "Confirm a payment"
 *     description: "Confirms a payment record, updating its status and optionally storing the payment gateway transaction ID."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - status
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: The ID of the payment record to confirm.
 *               status:
 *                 type: string
 *                 enum:
 *                   - COMPLETED
 *                   - FAILED
 *                   - REFUNDED
 *                 description: The new status of the payment.
 *               paymentGatewayId:
 *                 type: string
 *                 description: The transaction ID from the payment gateway.
 *             example:
 *               paymentId: "clm123abc"
 *               status: "COMPLETED"
 *               paymentGatewayId: "txn_xyz789"
 *     responses:
 *       200:
 *         description: Payment confirmed successfully.
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
 *                   example: "Payment confirmed successfully"
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid input.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Payment not found.
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

    const { paymentId, status, paymentGatewayId } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json({ success: false, error: 'Payment ID and status are required' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    // Only the user who created the payment or an admin can confirm it
    if (payment.userId !== session.id && session.role !== 'PLATFORM_ADMIN') {
      return NextResponse.json({ success: false, error: 'You are not authorized to confirm this payment' }, { status: 403 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status as PaymentStatus,
        paymentGatewayId: paymentGatewayId || payment.paymentGatewayId,
      },
    });

    return NextResponse.json({ success: true, message: 'Payment confirmed successfully', payment: updatedPayment });

  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to confirm payment' }, { status: 500 });
  }
}
