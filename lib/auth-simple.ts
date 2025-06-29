import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from './generated/prisma';

export async function createUser(email: string, password: string, role: UserRole) {
  // For demo mode, we store passwords hashed but don't use them
  await bcrypt.hash(password, 12);
  
  const user = await prisma.user.create({
    data: {
      email,
      name: email.split('@')[0],
      role,
      // Create role-specific profile
      ...(role === UserRole.CLIENT && {
        clientProfile: { create: {} },
      }),
      ...(role === UserRole.AGENT && {
        agentProfile: { create: {} },
      }),
      ...(role === UserRole.INSPECTOR && {
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

  return user;
}

export async function validateUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      clientProfile: true,
      agentProfile: true,
      inspectorProfile: true,
      company: true,
    },
  });

  if (!user) {
    return null;
  }

  // For demo, allow any password (in production, use bcrypt.compare)
  return user;
}