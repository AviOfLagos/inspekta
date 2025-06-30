'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth';

/**
 * Auth provider component that initializes and manages authentication state
 * Should be used near the root of the app to ensure auth state is available everywhere
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Handle hydration for SSR compatibility
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // This hook will automatically:
  // 1. Check for existing session on mount
  // 2. Update Zustand auth store with user data
  // 3. Handle loading states
  const { data: user, isLoading, error } = useSession();

  useEffect(() => {
    if (error && isHydrated) {
      console.log('No active session found');
    }
  }, [error, isHydrated]);

  // Show loading only after hydration and when actually loading
  if (!isHydrated || (isLoading && isHydrated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}