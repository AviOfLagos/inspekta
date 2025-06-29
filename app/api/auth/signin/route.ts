import { NextResponse } from 'next/server';
import { validateUser, createUser } from '@/lib/auth-simple';
import { UserRole } from '@/lib/generated/prisma';

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // First try to validate existing user
    let user = await validateUser(email);

    // If user doesn't exist, create them
    if (!user) {
      user = await createUser(email, 'demo-password', role as UserRole);
    }

    // Return user data (excluding sensitive info)
    const { ...userData } = user;
    
    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        verificationStatus: userData.verificationStatus,
      }
    });

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}