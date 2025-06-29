import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { UserRole, VerificationStatus } from './generated/prisma';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User } from './generated/prisma';

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'inspekta-super-secret-key-change-in-production'
);
const JWT_EXPIRY = '7d';
const SESSION_COOKIE_NAME = 'inspekta-session';

// Types
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isVerified: boolean;
  companyId: string | null;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  companyId?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: SessionUser;
  error?: string;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export async function createToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validate that the payload has the required SessionUser fields
    if (
      typeof payload.id === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string' &&
      typeof payload.isVerified === 'boolean'
    ) {
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name as string | null,
        role: payload.role as UserRole,
        isVerified: payload.isVerified,
        companyId: payload.companyId as string | null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Session management
export async function createSession(user: SessionUser): Promise<void> {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!token) return null;
    
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// User creation and authentication
export async function createUser(data: CreateUserData): Promise<AuthResponse> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash password (will be stored when password field is added to schema)
    await hashPassword(data.password);

    // Create user with role-specific profile
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        companyId: data.companyId,
        verificationStatus: VerificationStatus.PENDING,
        // Note: We'll store the hashed password when we add it to the schema
        
        // Create role-specific profile
        ...(data.role === UserRole.CLIENT && {
          clientProfile: { create: {} },
        }),
        ...(data.role === UserRole.AGENT && {
          agentProfile: { create: {} },
        }),
        ...(data.role === UserRole.INSPECTOR && {
          inspectorProfile: { create: {} },
        }),
      },
      include: {
        clientProfile: true,
        agentProfile: true,
        inspectorProfile: true,
        company: true,
      },
    });

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.verificationStatus === VerificationStatus.VERIFIED,
      companyId: user.companyId,
    };

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function authenticateUser(email: string, _password: string): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
      },
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // For now, we'll allow authentication without password verification
    // This maintains compatibility with the existing demo system
    // TODO: Add password verification when password field is added to schema
    // const isValidPassword = await verifyPassword(password, user.password);
    // if (!isValidPassword) {
    //   return { success: false, error: 'Invalid credentials' };
    // }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.verificationStatus === VerificationStatus.VERIFIED,
      companyId: user.companyId,
    };

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// User utilities
export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        agentProfile: true,
        inspectorProfile: true,
        company: true,
      },
    });
  } catch {
    return null;
  }
}

export async function updateUserVerificationStatus(
  userId: string, 
  status: VerificationStatus
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: status },
    });
    return true;
  } catch {
    return false;
  }
}

// Role-based utilities
export function isAuthorizedForRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Platform admin can access everything
  if (userRole === UserRole.PLATFORM_ADMIN) return true;
  
  // Company admin can access company routes
  if (userRole === UserRole.COMPANY_ADMIN && requiredRole === UserRole.COMPANY_ADMIN) {
    return true;
  }
  
  // Regular role matching
  return userRole === requiredRole;
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case UserRole.CLIENT:
      return '/client';
    case UserRole.AGENT:
      return '/agent';
    case UserRole.INSPECTOR:
      return '/inspector';
    case UserRole.COMPANY_ADMIN:
      return '/company';
    case UserRole.PLATFORM_ADMIN:
      return '/admin';
    default:
      return '/';
  }
}

// Email verification utilities
export async function generateVerificationToken(userId: string): Promise<string> {
  try {
    // Generate a secure random token
    const token = `verify_${userId}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Store token in verification tokens table
    await prisma.verificationToken.create({
      data: {
        identifier: userId,
        token,
        expires: expiresAt,
      },
    });
    
    return token;
  } catch (error) {
    console.error('Error generating verification token:', error);
    throw new Error('Failed to generate verification token');
  }
}

export async function verifyEmailToken(token: string): Promise<string | null> {
  try {
    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return null; // Token not found
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return null; // Token expired
    }

    // Token is valid, delete it (one-time use)
    await prisma.verificationToken.delete({
      where: { token },
    });

    return verificationToken.identifier; // Return user ID
  } catch (error) {
    console.error('Error verifying email token:', error);
    return null;
  }
}

// Password reset utilities
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null; // Don't reveal if user exists
    }

    // Generate a secure random token
    const token = `reset_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Set expiration to 15 minutes from now (for security)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.id,
        token: { startsWith: 'reset_' },
      },
    });

    // Store new token in verification tokens table
    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token,
        expires: expiresAt,
      },
    });

    return token;
  } catch (error) {
    console.error('Error generating password reset token:', error);
    return null;
  }
}

export async function validatePasswordResetToken(token: string): Promise<string | null> {
  try {
    // Find the token in the database
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return null; // Token not found
    }

    // Check if token has expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return null; // Token expired
    }

    // Token is valid, return user ID (don't delete yet - delete on successful password update)
    return resetToken.identifier;
  } catch (error) {
    console.error('Error validating password reset token:', error);
    return null;
  }
}

export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // TODO: Update user password when password field is added to schema
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { password: hashedPassword },
    // });

    // Delete all reset tokens for this user after successful password update
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: userId,
        token: { startsWith: 'reset_' },
      },
    });

    // For now, just log that password would be updated
    console.log(`Password updated for user: ${userId}, hash: ${hashedPassword.substring(0, 10)}...`);
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}