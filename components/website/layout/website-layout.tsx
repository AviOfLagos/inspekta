import { ReactNode } from 'react';
import { LandingNav } from '@/components/navigation/landing-nav';
import { WebsiteFooter } from '@/components/website/shared/website-footer';

interface WebsiteLayoutProps {
  children: ReactNode;
  className?: string;
}

export function WebsiteLayout({ children, className = '' }: WebsiteLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <LandingNav />
      <main className="flex-grow">
        {children}
      </main>
      <WebsiteFooter />
    </div>
  );
}