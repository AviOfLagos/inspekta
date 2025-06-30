'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Crown,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { SubscriptionModal } from './subscription-modal';

interface SubscriptionStatusProps {
  userRole: 'CLIENT' | 'AGENT' | 'COMPANY_ADMIN';
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  price: number;
  features: string[];
  cancelAtPeriodEnd: boolean;
  nextBillingDate?: string;
}

export function SubscriptionStatus({ userRole }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock subscription data - in real app, fetch from API
  useEffect(() => {
    const fetchSubscription = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockSubscription: Subscription = {
          id: 'sub_12345',
          plan: userRole === 'CLIENT' ? 'Client Monthly' : 
                userRole === 'AGENT' ? 'Agent Premium' : 'Company Professional',
          status: 'active',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-02-01',
          price: userRole === 'CLIENT' ? 5000 : 
                 userRole === 'AGENT' ? 5000 : 25000,
          features: [
            'Unlimited inspections',
            'Priority support',
            'Advanced analytics',
            'WhatsApp notifications'
          ],
          cancelAtPeriodEnd: false,
          nextBillingDate: '2024-02-01'
        };
        
        setSubscription(mockSubscription);
        setLoading(false);
      }, 1000);
    };

    fetchSubscription();
  }, [userRole]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge className="bg-yellow-100 text-yellow-800">Cancelling</Badge>;
    }

    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }

    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }

    try {
      // Note: This endpoint doesn't exist yet - needs backend implementation
      const response = await fetch(`/api/subscriptions/${subscription?.id}/cancel`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Subscription cancelled successfully. You will continue to have access until the end of your current billing period.');
        // Refresh subscription data
        window.location.reload();
      } else {
        alert('Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      // Note: This endpoint doesn't exist yet - needs backend implementation
      const response = await fetch(`/api/subscriptions/${subscription?.id}/reactivate`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Subscription reactivated successfully!');
        // Refresh subscription data
        window.location.reload();
      } else {
        alert('Failed to reactivate subscription. Please try again.');
      }
    } catch (error) {
      console.error('Reactivate subscription error:', error);
      alert('Failed to reactivate subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading subscription details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            Subscribe to unlock premium features and unlimited access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <Crown className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              You don&apos;t have an active subscription. Upgrade to access premium features.
            </p>
            <SubscriptionModal
              userRole={userRole}
              trigger={
                <Button>
                  <Crown className="w-4 h-4 mr-2" />
                  Choose a Plan
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              <CardTitle>Current Subscription</CardTitle>
            </div>
            {getStatusBadge(subscription.status, subscription.cancelAtPeriodEnd)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-4">
            {getStatusIcon(subscription.status, subscription.cancelAtPeriodEnd)}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{subscription.plan}</h3>
              <p className="text-gray-600">
                {formatCurrency(subscription.price)}/month
              </p>
              
              {subscription.cancelAtPeriodEnd ? (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your subscription is set to cancel on {formatDate(subscription.currentPeriodEnd)}. 
                    You will continue to have access until then.
                  </p>
                </div>
              ) : subscription.status === 'active' ? (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Your subscription is active and will renew on {formatDate(subscription.nextBillingDate!)}.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Subscription Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-gray-600">Billing Period</div>
              <div className="font-medium">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Next Billing Date</div>
              <div className="font-medium">
                {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Included Features</h4>
            <ul className="grid grid-cols-2 gap-2">
              {subscription.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <Button variant="outline" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            )}
            
            {subscription.cancelAtPeriodEnd && (
              <Button onClick={handleReactivateSubscription}>
                Reactivate Subscription
              </Button>
            )}
            
            <SubscriptionModal
              userRole={userRole}
              trigger={
                <Button variant="outline">
                  Change Plan
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Mock billing history */}
            {[
              { date: '2024-01-01', amount: subscription.price, status: 'paid', invoice: 'INV-001' },
              { date: '2023-12-01', amount: subscription.price, status: 'paid', invoice: 'INV-002' },
              { date: '2023-11-01', amount: subscription.price, status: 'paid', invoice: 'INV-003' },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 interactive-element rounded-lg">
                <div>
                  <div className="font-medium">{formatDate(payment.date)}</div>
                  <div className="text-sm text-gray-600">{payment.invoice}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(payment.amount)}</div>
                  <Badge className="bg-green-100 text-green-800">Paid</Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 interactive-element rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center mr-3">
                VISA
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 1234</div>
                <div className="text-sm text-gray-600">Expires 12/26</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}