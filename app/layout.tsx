import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { TopNav } from '@/components/navigation/top-nav';
import { FloatingDevNav } from '@/components/dev/floating-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
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
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="inspekta-ui-theme"
          >
            <TopNav />
            {children}
            <FloatingDevNav />
            <Toaster />
            <Analytics/>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
