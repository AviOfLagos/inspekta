'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FormState {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  status: 'idle' | 'loading' | 'success' | 'error' | 'validating';
  message: string;
}

function ResetPasswordForm() {
  const [formState, setFormState] = useState<FormState>({
    password: '',
    confirmPassword: '',
    showPassword: false,
    status: 'validating',
    message: 'Validating reset token...'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setTokenValid(false);
      setFormState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Reset token is missing. Please request a new password reset.' 
      }));
    }
  }, [token]);

  const validateToken = async (resetToken: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken }),
      });

      const data = await response.json();

      if (data.success) {
        setTokenValid(true);
        setFormState(prev => ({ 
          ...prev, 
          status: 'idle', 
          message: '' 
        }));
      } else {
        setTokenValid(false);
        setFormState(prev => ({ 
          ...prev, 
          status: 'error', 
          message: data.error || 'Reset token is invalid or expired. Please request a new password reset.' 
        }));
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setTokenValid(false);
      setFormState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Network error. Please try again.' 
      }));
    }
  };

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Password validation
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formState.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, status: 'loading', message: '' }));
    setErrors({});

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          password: formState.password,
          confirmPassword: formState.confirmPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormState(prev => ({ 
          ...prev, 
          status: 'success', 
          message: 'Password reset successfully! You can now sign in with your new password.' 
        }));
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        if (data.details && Array.isArray(data.details)) {
          // Handle validation errors from server
          const serverErrors: FormErrors = {};
          data.details.forEach((error: string) => {
            if (error.includes('password')) {
              serverErrors.password = error;
            } else {
              serverErrors.general = error;
            }
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: data.error || 'Password reset failed' });
        }
        setFormState(prev => ({ ...prev, status: 'idle' }));
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: 'Network error. Please try again.' });
      setFormState(prev => ({ ...prev, status: 'idle' }));
    }
  };

  if (formState.status === 'validating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="space-y-4">
            <div className="text-4xl">⏳</div>
            <h1 className="text-xl font-semibold">Validating Reset Token</h1>
            <p className="text-muted-foreground">Please wait...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="space-y-6">
            <div>
              <div className="text-4xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-destructive">Invalid Reset Link</h1>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
              {formState.message}
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This could be because:</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>The link has expired (links are valid for 15 minutes)</li>
                <li>The link has already been used</li>
                <li>The link is malformed or incomplete</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/forgot-password">
                  Request New Reset Link
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/login">
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your new password below
            </p>
          </div>

          {formState.status === 'success' ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 px-4 py-3 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-medium">Password Reset Successful!</p>
                    <p className="text-sm">{formState.message}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting to login page in 3 seconds...
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Continue to Sign In
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={formState.showPassword ? 'text' : 'password'}
                      value={formState.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your new password"
                      className={errors.password ? 'border-destructive' : ''}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('showPassword', !formState.showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {formState.showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Must contain uppercase, lowercase, and number. At least 8 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formState.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                    required
                  />
                  {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={formState.status === 'loading'}
                >
                  {formState.status === 'loading' ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary hover:text-primary/80 font-medium"
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}