import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole, VerificationStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/verification/{id}/approve:
 *   put:
 *     tags:
 *       - Verification
 *     summary: "Admin approve/reject verification"
 *     description: "Allows a platform admin to approve or reject a user's or company's verification submission."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user or company verification to approve/reject.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - VERIFIED
 *                   - REJECTED
 *                 description: The new verification status.
 *               reason:
 *                 type: string
 *                 description: Optional reason for rejection.
 *             example:
 *               status: "VERIFIED"
 *     responses:
 *       200:
 *         description: Verification status updated successfully.
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
 *                   example: "Verification status updated successfully"
 *       400:
 *         description: Invalid input.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only platform admins can approve/reject verifications.
 *       404:
 *         description: User or Company not found.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security:
 *       - cookieAuth: []
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (session.role !== UserRole.PLATFORM_ADMIN) {
      return NextResponse.json({ success: false, error: 'Only platform admins can approve or reject verifications' }, { status: 403 });
    }

    const { id } = await params;
    const { status, reason } = await request.json();

    if (!status || (status === VerificationStatus.REJECTED && !reason)) {
      return NextResponse.json({ success: false, error: 'Status and reason for rejection are required' }, { status: 400 });
    }

    // Try to find a user first
    let record: any = await prisma.user.findUnique({
      where: { id },
    });

    let modelName: 'user' | 'company' = 'user';

    if (!record) {
      // If not a user, try to find a company
      record = await prisma.company.findUnique({
        where: { id },
      });
      modelName = 'company';
    }

    if (!record) {
      return NextResponse.json({ success: false, error: 'User or Company not found' }, { status: 404 });
    }

    if (modelName === 'user') {
      await prisma.user.update({
        where: { id },
        data: {
          verificationStatus: status,
          // You might want to store the reason for rejection in a dedicated field or log
        },
      });
    } else {
      await prisma.company.update({
        where: { id },
        data: {
          verificationStatus: status,
          // You might want to store the reason for rejection in a dedicated field or log
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Verification status updated successfully' });

  } catch (error) {
    console.error('Approve/reject verification error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update verification status' }, { status: 500 });
  }
}