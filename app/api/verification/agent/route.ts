import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import { UserRole, VerificationStatus } from '@/lib/generated/prisma';

/**
 * @swagger
 * /api/verification/agent:
 *   post:
 *     tags:
 *       - Verification
 *     summary: "Submit agent verification details"
 *     description: "Allows an authenticated agent to submit their NIN/BVN and guarantor details for verification."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nin
 *               - bvn
 *               - guarantors
 *             properties:
 *               nin:
 *                 type: string
 *                 description: National Identification Number.
 *               bvn:
 *                 type: string
 *                 description: Bank Verification Number.
 *               guarantors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     relationship:
 *                       type: string
 *                 description: Array of guarantor details.
 *             example:
 *               nin: "12345678901"
 *               bvn: "22123456789"
 *               guarantors:
 *                 - name: "John Doe"
 *                   phone: "+2348123456789"
 *                   relationship: "Friend"
 *     responses:
 *       200:
 *         description: Verification details submitted successfully.
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
 *                   example: "Agent verification details submitted successfully"
 *       400:
 *         description: Invalid input or missing required fields.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden, only agents can submit verification.
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

    if (session.role !== UserRole.AGENT) {
      return NextResponse.json({ success: false, error: 'Only agents can submit verification details' }, { status: 403 });
    }

    const { nin, bvn, guarantors } = await request.json();

    if (!nin || !bvn || !guarantors || !Array.isArray(guarantors) || guarantors.length === 0) {
      return NextResponse.json({ success: false, error: 'NIN, BVN, and at least one guarantor are required' }, { status: 400 });
    }

    // Update user's NIN and BVN
    await prisma.user.update({
      where: { id: session.id },
      data: {
        ninNumber: nin,
        bvnNumber: bvn,
        verificationStatus: VerificationStatus.PENDING,
      },
    });

    // Update agent profile with guarantor details
    // Assuming AgentProfile already exists for the agent
    await prisma.agentProfile.update({
      where: { userId: session.id },
      data: {
        guarantor1Name: guarantors[0]?.name || null,
        guarantor1Phone: guarantors[0]?.phone || null,
        guarantor2Name: guarantors[1]?.name || null,
        guarantor2Phone: guarantors[1]?.phone || null,
      },
    });

    return NextResponse.json({ success: true, message: 'Agent verification details submitted successfully' });

  } catch (error) {
    console.error('Agent verification submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit agent verification details' }, { status: 500 });
  }
}