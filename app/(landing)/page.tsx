import Link from 'next/link';
import { SubdomainForm } from '@/app/subdomain-form'; // Adjusted import path
import { rootDomain } from '@/lib/utils';

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 dark:from-blue-950 to-background p-4 relative">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </Link>
      </div>
 
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {rootDomain}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Create your own subdomain with a custom emoji
          </p>
        </div>

        <div className="mt-8 bg-card shadow-md rounded-lg p-6">
          <SubdomainForm />
        </div>
      </div>
    </div>
  );
}
