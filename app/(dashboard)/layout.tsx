import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
