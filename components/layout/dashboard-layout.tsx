'use client';

import { TopNav } from '@/components/navigation/top-nav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav user={user} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}