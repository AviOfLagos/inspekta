import { NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import type { LoginInput } from '@/lib/validation';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates user credentials and creates a session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@example.com"
 *             password: "SecurePass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Session cookie
 *             schema:
 *               type: string
 *               example: "inspekta-session=jwt-token; HttpOnly; Secure; SameSite=lax; Max-Age=604800"
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
 *                       example: "Login successful"
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               error: "Invalid credentials"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *     security: []
 */
export async function POST(request: Request) {
  try {
    const body: LoginInput = await request.json();

    // Validate input data
    const validation = loginSchema.safeParse(body);
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

    const { email, password, callbackUrl, intendedRole } = validation.data;

    // Authenticate user
    const result = await authenticateUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Create session
    await createSession(result.user!);

    // Check for role mismatch if there was an intended role
    let redirectUrl = callbackUrl || getDashboardUrlForRole(result.user!.role);
    
    if (intendedRole && callbackUrl) {
      const userRole = result.user!.role.toLowerCase();
      const normalizedIntendedRole = intendedRole.toLowerCase();
      
      // Check if user's role matches intended role
      if (userRole !== normalizedIntendedRole && userRole !== 'platform_admin') {
        // Create role mismatch redirect
        const mismatchUrl = new URL('/auth/role-mismatch', request.url);
        mismatchUrl.searchParams.set('currentRole', userRole);
        mismatchUrl.searchParams.set('intendedRole', normalizedIntendedRole);
        mismatchUrl.searchParams.set('intendedPath', callbackUrl);
        redirectUrl = mismatchUrl.pathname + mismatchUrl.search;
      }
    }

    // Return success with user data and redirect URL
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: result.user,
      redirectUrl: redirectUrl
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getDashboardUrlForRole(role: string): string {
  switch (role) {
    case 'CLIENT':
      return '/client';
    case 'AGENT':
      return '/agent';
    case 'INSPECTOR':
      return '/inspector';
    case 'COMPANY_ADMIN':
      return '/company';
    case 'PLATFORM_ADMIN':
      return '/admin';
    default:
      return '/';
  }
}