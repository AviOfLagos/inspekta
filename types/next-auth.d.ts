import { UserRole, VerificationStatus } from '@/lib/generated/prisma';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    companyId?: string;
    verificationStatus: VerificationStatus;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: UserRole;
      companyId?: string;
      verificationStatus: VerificationStatus;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    companyId?: string;
    verificationStatus: VerificationStatus;
  }
}