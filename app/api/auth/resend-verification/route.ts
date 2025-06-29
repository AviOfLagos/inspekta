import { NextResponse } from 'next/server';
import { generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { VerificationStatus } from '@/lib/generated/prisma';
import { z } from 'zod';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input data
    const validation = resendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email address'
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists and is unverified, we have sent a new verification link.'
      });
    }

    // Check if user is already verified
    if (user.verificationStatus === VerificationStatus.VERIFIED) {
      return NextResponse.json({
        success: false,
        error: 'This email address is already verified.'
      }, { status: 400 });
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.id,
        token: { startsWith: 'verify_' }
      }
    });

    // Generate new verification token and send email
    try {
      const verificationToken = await generateVerificationToken(user.id);
      const emailSent = await sendVerificationEmail(
        user.email, 
        user.name || 'User', 
        verificationToken
      );

      if (!emailSent) {
        console.warn(`Failed to resend verification email to ${user.email}`);
        return NextResponse.json({
          success: false,
          error: 'Failed to send verification email. Please try again later.'
        }, { status: 500 });
      }
    } catch (emailError) {
      console.error('Resend verification email error:', emailError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send verification email. Please try again later.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}