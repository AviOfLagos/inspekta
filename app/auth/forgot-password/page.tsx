'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface FormState {
  email: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function ForgotPassword() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'idle',
    message: ''
  });

  const handleInputChange = (value: string) => {
    setFormState(prev => ({ 
      ...prev, 
      email: value,
      status: 'idle',
      message: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.email) {
      setFormState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Email is required' 
      }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setFormState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Please enter a valid email address' 
      }));
      return;
    }

    setFormState(prev => ({ 
      ...prev, 
      status: 'loading', 
      message: '' 
    }));

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formState.email }),
      });

      const data = await response.json();

      if (data.success) {
        setFormState(prev => ({ 
          ...prev, 
          status: 'success', 
          message: 'Password reset link sent! Please check your email.' 
        }));
      } else {
        setFormState(prev => ({ 
          ...prev, 
          status: 'error', 
          message: data.error || 'Failed to send reset email. Please try again.' 
        }));
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setFormState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Network error. Please try again.' 
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold">Forgot Password?</h1>
            <p className="text-muted-foreground mt-2">
              No worries! Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {formState.status === 'success' ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-medium">Email sent successfully!</p>
                    <p className="text-sm">{formState.message}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">What to do next:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your inbox for an email from Inspekta</li>
                    <li>Click the reset link in the email</li>
                    <li>Create a new password</li>
                    <li>If you don&apos;t see it, check your spam folder</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={() => setFormState({ email: '', status: 'idle', message: '' })}
                    variant="outline" 
                    className="w-full"
                  >
                    Send Another Email
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {formState.message && formState.status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formState.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter your email address"
                    className={formState.status === 'error' && !formState.email ? 'border-red-500' : ''}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll send a password reset link to this email
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={formState.status === 'loading'}
                >
                  {formState.status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          )}

          <div className="text-center space-y-2">
            <Link 
              href="/auth/login" 
              className="text-sm text-primary hover:text-blue-500"
            >
              ← Back to Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/register" 
                className="text-primary hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>The reset link will expire in 15 minutes for security.</p>
            <p>If you need help, <Link href="/contact" className="text-primary hover:text-blue-500">contact support</Link></p>
          </div>
        </div>
      </Card>
    </div>
  );
}