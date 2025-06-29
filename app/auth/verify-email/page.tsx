'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VerificationState {
  status: 'pending' | 'verifying' | 'success' | 'error' | 'expired';
  message: string;
}

function VerifyEmailForm() {
  const [state, setState] = useState<VerificationState>({
    status: 'pending',
    message: ''
  });
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setState({ status: 'verifying', message: 'Verifying your email...' });

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (data.success) {
        setState({ 
          status: 'success', 
          message: 'Email verified successfully! You can now sign in.' 
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setState({ 
          status: 'error', 
          message: data.error || 'Verification failed. The link may be expired or invalid.' 
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setState({ 
        status: 'error', 
        message: 'Network error. Please try again.' 
      });
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setState(prev => ({ 
        ...prev, 
        message: 'Email address not found. Please register again.' 
      }));
      return;
    }

    setResendLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setState(prev => ({ 
          ...prev, 
          message: 'Verification email sent! Please check your inbox.' 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          message: data.error || 'Failed to resend verification email.' 
        }));
      }
    } catch (error) {
      console.error('Resend error:', error);
      setState(prev => ({ 
        ...prev, 
        message: 'Network error. Please try again.' 
      }));
    } finally {
      setResendLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'verifying':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
      case 'expired':
        return '❌';
      default:
        return '📧';
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'expired':
        return 'text-red-600';
      case 'verifying':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="space-y-6">
          <div>
            <div className="text-6xl mb-4">{getStatusIcon()}</div>
            <h1 className="text-2xl font-bold">Email Verification</h1>
            
            {!token && (
              <p className="text-muted-foreground mt-2">
                Please check your email for a verification link.
              </p>
            )}
          </div>

          {state.message && (
            <div className={`p-4 rounded-lg border ${
              state.status === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                : state.status === 'error' || state.status === 'expired'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-primary'
            }`}>
              <p className={getStatusColor()}>{state.message}</p>
            </div>
          )}

          {!token && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>We&apos;ve sent a verification link to:</p>
                <p className="font-medium text-foreground mt-1">
                  {email || 'your email address'}
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Didn&apos;t receive the email?</p>
                <ul className="list-disc list-inside text-left space-y-1">
                  <li>Check your spam/junk folder</li>
                  <li>Wait a few minutes for delivery</li>
                  <li>Make sure the email address is correct</li>
                </ul>
              </div>

              <Button 
                onClick={resendVerification}
                disabled={resendLoading}
                variant="outline" 
                className="w-full"
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>
          )}

          {state.status === 'success' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Redirecting to login page in 3 seconds...
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Continue to Login
                </Link>
              </Button>
            </div>
          )}

          {(state.status === 'error' || state.status === 'expired') && (
            <div className="space-y-3">
              <Button 
                onClick={resendVerification}
                disabled={resendLoading}
                className="w-full"
              >
                {resendLoading ? 'Sending...' : 'Send New Verification Email'}
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">
                  Back to Registration
                </Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already verified?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}