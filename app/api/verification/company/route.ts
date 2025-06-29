import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole, VerificationStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/verification/company:
 *   post:
 *     tags:
 *       - Verification
 *     summary: "Submit company verification details"
 *     description: "Allows an authenticated company admin to submit CAC documents and business registration details for verification."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cacNumber
 *             properties:
 *               cacNumber:
 *                 type: string
 *                 description: Company's Corporate Affairs Commission (CAC) registration number.
 *               // Add other company registration document fields as needed (e.g., document URLs)
 *             example:
 *               cacNumber: "RC123456"
 *     responses:
 *       200:
 *         description: Company verification details submitted successfully.
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
 *                   example: "Company verification details submitted successfully"
 *       400:
 *         description: Invalid input or missing required fields.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only company admins can submit verification.
 *       404:
 *         description: Company not found for the authenticated user.
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

    if (session.role !== UserRole.COMPANY_ADMIN || !session.companyId) {
      return NextResponse.json({ success: false, error: 'Only company admins can submit verification details for their company' }, { status: 403 });
    }

    const { cacNumber } = await request.json();

    if (!cacNumber) {
      return NextResponse.json({ success: false, error: 'CAC Number is required' }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id: session.companyId },
    });

    if (!company) {
      return NextResponse.json({ success: false, error: 'Company not found for the authenticated user' }, { status: 404 });
    }

    await prisma.company.update({
      where: { id: session.companyId },
      data: {
        cacNumber: cacNumber,
        verificationStatus: VerificationStatus.PENDING,
      },
    });

    return NextResponse.json({ success: true, message: 'Company verification details submitted successfully' });

  } catch (error) {
    console.error('Company verification submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit company verification details' }, { status: 500 });
  }
}