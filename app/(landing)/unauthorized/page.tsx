import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="space-y-6">
          <div>
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-muted-foreground mt-2">
              You don&apos;t have permission to access this page.
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              This could be because:
            </p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>You need to sign in to access this page</li>
              <li>Your account doesn&apos;t have the required permissions</li>
              <li>You&apos;re trying to access a role-specific dashboard</li>
              <li>Your session has expired</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Go Home
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground">
              Need help? <Link href="/contact" className="text-primary hover:text-blue-500">Contact Support</Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}