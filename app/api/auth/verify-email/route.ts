import { NextResponse } from 'next/server';
import { verifyEmailToken, updateUserVerificationStatus, getUserById } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { VerificationStatus } from '@/lib/generated/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token and get user ID
    const userId = await verifyEmailToken(token);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update user verification status
    const updated = await updateUserVerificationStatus(userId, VerificationStatus.VERIFIED);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    // Send welcome email after successful verification
    try {
      const user = await getUserById(userId);
      if (user) {
        const emailSent = await sendWelcomeEmail(
          user.email, 
          user.name || 'User', 
          user.role
        );
        
        if (!emailSent) {
          console.warn(`Failed to send welcome email to ${user.email}`);
        }
      }
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail verification if welcome email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const userId = await verifyEmailToken(token);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      userId
    });

  } catch (error) {
    console.error('Email verification check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}