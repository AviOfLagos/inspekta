'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreditCard,
  CheckCircle,
  Crown,
  Building,
  Star,
  Zap,
  Users
  
} from 'lucide-react';

interface SubscriptionModalProps {
  trigger: React.ReactNode;
  userRole: 'CLIENT' | 'AGENT' | 'COMPANY_ADMIN';
  onSuccess?: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  icon: React.ComponentType<any>;
  badge?: string;
  savings?: string;
  popular?: boolean;
}

export function SubscriptionModal({ trigger, userRole, onSuccess }: SubscriptionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Different plans based on user role
  const getSubscriptionPlans = (): SubscriptionPlan[] => {
    switch (userRole) {
      case 'CLIENT':
        return [
          {
            id: 'client_monthly',
            name: 'Client Monthly',
            price: 5000,
            duration: '/month',
            description: 'Unlimited property inspections',
            features: [
              'Unlimited virtual inspections',
              'Unlimited physical inspections',
              'Priority booking slots',
              'Detailed inspection reports',
              'WhatsApp notifications',
              'Email support'
            ],
            icon: Star,
            popular: true
          },
          {
            id: 'client_annual',
            name: 'Client Annual',
            price: 50000,
            duration: '/year',
            description: 'Best value for serious property hunters',
            features: [
              'Everything in monthly plan',
              'Priority customer support',
              'Early access to new properties',
              'Personalized property recommendations',
              'Agent direct contact',
              'Inspection history reports'
            ],
            icon: Crown,
            badge: 'Best Value',
            savings: 'Save ₦10,000'
          }
        ];
      
      case 'AGENT':
        return [
          {
            id: 'agent_basic',
            name: 'Agent Basic',
            price: 2500,
            duration: '/month',
            description: 'Essential tools for individual agents',
            features: [
              'Up to 10 active listings',
              'Basic inspection scheduling',
              'Client inquiry management',
              'Email notifications',
              'Basic analytics',
              'Standard support'
            ],
            icon: Star
          },
          {
            id: 'agent_premium',
            name: 'Agent Premium',
            price: 5000,
            duration: '/month',
            description: 'Advanced features for serious agents',
            features: [
              'Unlimited listings',
              'Priority listing placement',
              'Advanced inspection tools',
              'CRM integration',
              'Detailed analytics & reports',
              'WhatsApp notifications',
              'Priority support',
              'Verified agent badge'
            ],
            icon: Crown,
            popular: true,
            badge: 'Most Popular'
          },
          {
            id: 'agent_annual',
            name: 'Agent Annual',
            price: 50000,
            duration: '/year',
            description: 'Premium features with annual savings',
            features: [
              'Everything in Premium',
              'Custom agent profile',
              'Lead generation tools',
              'Commission tracking',
              'Marketing templates',
              'Advanced reporting'
            ],
            icon: Zap,
            savings: 'Save ₦10,000'
          }
        ];
      
      case 'COMPANY_ADMIN':
        return [
          {
            id: 'company_starter',
            name: 'Company Starter',
            price: 15000,
            duration: '/month',
            description: 'Perfect for small real estate companies',
            features: [
              'Up to 5 team members',
              'Custom subdomain',
              'Team management tools',
              'Centralized listing management',
              'Basic analytics',
              'Email support'
            ],
            icon: Building
          },
          {
            id: 'company_professional',
            name: 'Company Professional',
            price: 25000,
            duration: '/month',
            description: 'Advanced tools for growing companies',
            features: [
              'Up to 20 team members',
              'Custom branding',
              'Advanced team permissions',
              'Commission split management',
              'Detailed analytics & reports',
              'WhatsApp integration',
              'Priority support',
              'API access'
            ],
            icon: Crown,
            popular: true,
            badge: 'Recommended'
          },
          {
            id: 'company_enterprise',
            name: 'Company Enterprise',
            price: 50000,
            duration: '/month',
            description: 'Full-featured solution for large companies',
            features: [
              'Unlimited team members',
              'White-label solution',
              'Custom integrations',
              'Advanced reporting suite',
              'Dedicated account manager',
              'Custom training',
              'SLA guarantee',
              '24/7 phone support'
            ],
            icon: Zap,
            badge: 'Enterprise'
          }
        ];
      
      default:
        return [];
    }
  };

  const plans = getSubscriptionPlans();

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    setSelectedPlan(planId);
    
    try {
      // Note: This endpoint doesn't exist yet - needs backend implementation
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          paymentMethod: 'paystack' // Default to Paystack for Nigerian users
        }),
      });

      if (response.ok) {
        const { paymentUrl } = await response.json();
        // Redirect to payment gateway
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert('Subscription activated successfully!');
          setOpen(false);
          onSuccess?.();
        }
      } else {
        const error = await response.json();
        alert(`Subscription failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'CLIENT': return 'Client Subscription Plans';
      case 'AGENT': return 'Agent Subscription Plans';
      case 'COMPANY_ADMIN': return 'Company Subscription Plans';
      default: return 'Subscription Plans';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'CLIENT': return 'Choose a plan to access unlimited property inspections';
      case 'AGENT': return 'Upgrade your agent tools and grow your business';
      case 'COMPANY_ADMIN': return 'Empower your team with enterprise-grade tools';
      default: return 'Choose the right plan for your needs';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            {getRoleTitle(userRole)}
          </DialogTitle>
          <DialogDescription>
            {getRoleDescription(userRole)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              const isSelected = selectedPlan === plan.id;
              const isLoading = loading && isSelected;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative ${isPopular ? 'border-2 border-primary shadow-lg' : 'border'}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className={isPopular ? 'bg-primary' : 'bg-orange-500'}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-full ${isPopular ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${isPopular ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                        <span className="text-gray-600 ml-1">{plan.duration}</span>
                      </div>
                      {plan.savings && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Choose Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Secure payment processing via Paystack</li>
              <li>• All plans can be cancelled anytime</li>
              <li>• Automatic renewal unless cancelled</li>
              <li>• Full refund within 7 days if not satisfied</li>
              <li>• All prices include applicable taxes</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t pt-6">
          <h4 className="font-medium mb-3">Frequently Asked Questions</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-sm">Can I upgrade or downgrade my plan?</h5>
              <p className="text-sm text-gray-600">
                Yes, you can change your plan at any time. Changes take effect immediately with pro-rated billing.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-sm">What payment methods do you accept?</h5>
              <p className="text-sm text-gray-600">
                We accept all major Nigerian bank cards, USSD payments, and bank transfers via Paystack.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-sm">Is there a free trial?</h5>
              <p className="text-sm text-gray-600">
                New users get a 7-day free trial of our premium features. No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise Contact */}
        {userRole === 'COMPANY_ADMIN' && (
          <div className="border-t pt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <h4 className="font-medium">Need a custom solution?</h4>
                  <p className="text-sm text-gray-600">
                    Contact our enterprise team for custom pricing and features tailored to your company.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-3">
                Contact Enterprise Sales
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}