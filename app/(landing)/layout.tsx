import { WebsiteFooter } from '@/components/website/shared/website-footer';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  );
}
