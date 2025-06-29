import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { TopNavbar } from '@/components/layout/top-navbar';
import { FloatingDevNav } from '@/components/dev/floating-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Inspekta',
  description: 'Verified real estate marketplace platform for remote property inspections.'
};
 
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="inspekta-ui-theme"
        >
          <TopNavbar />
          {children}
          <FloatingDevNav />
          <Toaster />
          <Analytics/>
        </ThemeProvider>
      </body>
    </html>
  );
}
