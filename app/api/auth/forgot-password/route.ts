import { NextResponse } from 'next/server';
import { generatePasswordResetToken } from '@/lib/auth';
import { forgotPasswordSchema } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import type { ForgotPasswordInput } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body: ForgotPasswordInput = await request.json();

    // Validate input data
    const validation = forgotPasswordSchema.safeParse(body);
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

    const { email } = validation.data;

    // Generate password reset token
    const token = await generatePasswordResetToken(email);

    if (!token) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Get user data for email sending
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (user) {
        const emailSent = await sendPasswordResetEmail(
          email, 
          user.name || 'User', 
          token
        );
        
        if (!emailSent) {
          console.warn(`Failed to send password reset email to ${email}`);
        }
      }
    } catch (emailError) {
      console.error('Password reset email error:', emailError);
      // Don't fail the request if email fails, but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}