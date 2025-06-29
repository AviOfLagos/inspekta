import { NextResponse } from 'next/server';
import { createUser, generateVerificationToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { sendVerificationEmail } from '@/lib/email';
import type { RegisterInput } from '@/lib/validation';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with role-specific profile and sends verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             client:
 *               summary: Client Registration
 *               value:
 *                 email: "client@example.com"
 *                 password: "SecurePass123"
 *                 confirmPassword: "SecurePass123"
 *                 name: "John Client"
 *                 phone: "+2348012345678"
 *                 role: "CLIENT"
 *             agent:
 *               summary: Agent Registration
 *               value:
 *                 email: "agent@example.com"
 *                 password: "SecurePass123"
 *                 confirmPassword: "SecurePass123"
 *                 name: "Jane Agent"
 *                 role: "AGENT"
 *                 companyId: "company-uuid"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Account created successfully. Please check your email for verification."
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "User already exists"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security: []
 */
export async function POST(request: Request) {
  try {
    const body: RegisterInput = await request.json();

    // Validate input data
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.error.errors.map(err => err.message)
        },
        { status: 400 }
      );
    }

    const { email, password, name, phone, role, companyId } = validation.data;

    // Create user
    const result = await createUser({
      email,
      password,
      name,
      phone,
      role,
      companyId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Generate verification token and send email
    try {
      const verificationToken = await generateVerificationToken(result.user!.id);
      const emailSent = await sendVerificationEmail(
        result.user!.email, 
        result.user!.name || 'User', 
        verificationToken
      );

      if (!emailSent) {
        console.warn(`Failed to send verification email to ${result.user!.email}`);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail registration if email fails, but log the error
    }

    // Return success without session creation (user needs to verify email first)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      user: {
        id: result.user!.id,
        email: result.user!.email,
        name: result.user!.name,
        role: result.user!.role,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}