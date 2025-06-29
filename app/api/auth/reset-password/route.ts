import { NextResponse } from 'next/server';
import { validatePasswordResetToken, updatePassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validation';
import type { ResetPasswordInput } from '@/lib/validation';

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

    // Validate the token
    const userId = await validatePasswordResetToken(token);

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
    console.error('Reset password validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: ResetPasswordInput = await request.json();

    // Validate input data
    const validation = resetPasswordSchema.safeParse(body);
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

    const { token, password } = validation.data;

    // Validate the token and get user ID
    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update the user's password
    const updated = await updatePassword(userId, password);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // TODO: Invalidate all existing sessions for this user
    // TODO: Delete the used reset token from database

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}