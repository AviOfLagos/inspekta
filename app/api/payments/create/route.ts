import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { PaymentStatus, UserRole } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     tags:
 *       - Payments
 *     summary: "Create a new payment record"
 *     description: "Creates a new payment record for an inspection or subscription. This is typically the first step before integrating with a payment gateway."
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
 *                 description: The amount of the payment.
 *               currency:
 *                 type: string
 *                 description: The currency of the payment (e.g., NGN, USD).
 *               inspectionId:
 *                 type: string
 *                 description: Optional ID of the associated inspection.
 *               subscriptionId:
 *                 type: string
 *                 description: Optional ID of the associated subscription.
 *             example:
 *               amount: 15000.00
 *               currency: "NGN"
 *               inspectionId: "clm123abc"
 *     responses:
 *       201:
 *         description: Payment record created successfully.
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
 *                   example: "Payment record created successfully"
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid input.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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

    const { amount, currency, inspectionId, subscriptionId } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json({ success: false, error: 'Amount and currency are required' }, { status: 400 });
    }

    if (inspectionId && subscriptionId) {
      return NextResponse.json({ success: false, error: 'Payment cannot be associated with both an inspection and a subscription' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        currency,
        userId: session.id,
        inspectionId: inspectionId || null,
        subscriptionId: subscriptionId || null,
        status: PaymentStatus.PENDING, // Initial status
      },
    });

    return NextResponse.json({ success: true, message: 'Payment record created successfully', payment }, { status: 201 });

  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment record' }, { status: 500 });
  }
}
