'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CompanyVerificationForm } from '@/components/verification/company-verification-form';
import { SubscriptionStatus } from '@/components/subscriptions/subscription-status';
import { SubscriptionModal } from '@/components/subscriptions/subscription-modal';
import { DashboardTabs } from '@/components/ui/dashboard-tabs';
import { 
  Building, 
  Users, 
  Settings, 
  TrendingUp, 
  Shield,
  Globe,
  DollarSign,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Crown
} from 'lucide-react';

const companyTabs = [
  { id: 'overview', label: 'Overview', icon: Building },
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'subdomain', label: 'Subdomain', icon: Globe },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'subscription', label: 'Subscription', icon: Crown },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock company data
  const companyData = {
    name: "Premium Real Estate Ltd",
    isVerified: true,
    subdomain: "premium-estate",
    teamSize: 12,
    totalListings: 45,
    monthlyRevenue: 2800000,
    verificationStatus: 'approved' // 'pending', 'approved', 'rejected', 'not_started'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Verification Failed</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{companyData.name}</h1>
              <div className="flex items-center space-x-3">
                {getVerificationBadge(companyData.verificationStatus)}
                {companyData.subdomain && (
                  <span className="text-sm text-gray-600">
                    {companyData.subdomain}.inspekta.com
                  </span>
                )}
              </div>
            </div>
            {companyData.verificationStatus !== 'approved' && (
              <CompanyVerificationForm
                trigger={
                  <Button>
                    <Shield className="w-4 h-4 mr-2" />
                    Complete Verification
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Verification Alert */}
        {companyData.verificationStatus === 'pending' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h4 className="font-medium text-yellow-800">Verification Under Review</h4>
                <p className="text-sm text-yellow-700">
                  Your company verification is being reviewed. This typically takes 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        )}

        {companyData.verificationStatus === 'not_started' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="font-medium text-blue-800">Complete Company Verification</h4>
                  <p className="text-sm text-blue-700">
                    Verify your company to access enterprise features and build client trust.
                  </p>
                </div>
              </div>
              <CompanyVerificationForm
                trigger={
                  <Button variant="outline">
                    Start Verification
                  </Button>
                }
              />
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <DashboardTabs
          tabs={companyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companyData.teamSize}</div>
                  <p className="text-xs text-muted-foreground">Agents & Inspectors</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companyData.totalListings}</div>
                  <p className="text-xs text-muted-foreground">Published properties</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(companyData.monthlyRevenue)}</div>
                  <p className="text-xs text-muted-foreground">Commission earnings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verification</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {companyData.verificationStatus === 'approved' ? '✓' : '⚡'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {companyData.verificationStatus === 'approved' ? 'Verified' : 'Pending'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Team Management
                  </CardTitle>
                  <CardDescription>
                    Invite and manage agents and inspectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Team Members
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Subdomain Portal
                  </CardTitle>
                  <CardDescription>
                    Customize your branded company portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Manage Subdomain
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Analytics & Reports
                  </CardTitle>
                  <CardDescription>
                    Monitor performance and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Team Management Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members ({companyData.teamSize})</CardTitle>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>Team management interface coming soon</p>
                  <p className="text-sm">Invite and manage agents, inspectors, and support staff</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subdomain Tab */}
        {activeTab === 'subdomain' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Company Subdomain
                </CardTitle>
                <CardDescription>
                  Customize your branded company portal at {companyData.subdomain}.inspekta.com
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subdomain URL</label>
                  <div className="flex mt-1">
                    <Input 
                      value={companyData.subdomain} 
                      className="rounded-r-none"
                    />
                    <div className="flex items-center px-3 bg-gray-50 border border-l-0 rounded-r-md text-sm text-gray-600">
                      .inspekta.com
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Subdomain is active and configured</span>
                </div>

                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Your Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Company Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm">Track team performance, revenue, and growth metrics</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <SubscriptionStatus userRole="COMPANY_ADMIN" />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Company Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <Input defaultValue={companyData.name} className="mt-1" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Business Email</label>
                    <Input defaultValue="contact@premium-estate.com" className="mt-1" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input defaultValue="+234 123 456 7890" className="mt-1" />
                  </div>
                </div>

                {/* Verification Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Company Verification</h3>
                    <CompanyVerificationForm
                      trigger={
                        <Button variant="outline" size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Update Verification
                        </Button>
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">CAC Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Tax Clearance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Director Verified</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        Your company verification is complete and approved
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Verified companies get custom subdomains and enterprise features
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}