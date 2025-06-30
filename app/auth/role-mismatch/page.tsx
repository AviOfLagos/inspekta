'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User, Shield, Search, Users, UserCheck, Building } from 'lucide-react';

interface RoleInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  requirements: string[];
}

const roleDefinitions: Record<string, RoleInfo> = {
  client: {
    id: 'client',
    name: 'Client',
    icon: Search,
    description: 'Browse properties and schedule inspections',
    color: 'bg-blue-500',
    requirements: ['Valid ID', 'Phone verification']
  },
  agent: {
    id: 'agent',
    name: 'Agent',
    icon: Users,
    description: 'List and manage properties',
    color: 'bg-emerald-500',
    requirements: ['NIN verification', 'BVN verification', 'Two guarantors']
  },
  inspector: {
    id: 'inspector',
    name: 'Inspector',
    icon: UserCheck,
    description: 'Conduct property inspections',
    color: 'bg-amber-500',
    requirements: ['Professional certification', 'NIN/BVN verification', 'Guarantor']
  },
  company_admin: {
    id: 'company_admin',
    name: 'Company Admin',
    icon: Building,
    description: 'Manage company and team',
    color: 'bg-purple-500',
    requirements: ['Company registration', 'CAC verification', 'Admin approval']
  },
  platform_admin: {
    id: 'platform_admin',
    name: 'Platform Admin',
    icon: Shield,
    description: 'Full platform access',
    color: 'bg-red-500',
    requirements: ['Platform invitation only']
  }
};

function RoleMismatchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const currentRole = searchParams.get('currentRole') || '';
  const intendedRole = searchParams.get('intendedRole') || '';
  const intendedPath = searchParams.get('intendedPath') || '';

  const currentRoleInfo = roleDefinitions[currentRole];
  const intendedRoleInfo = roleDefinitions[intendedRole];

  const handleRoleSwitch = async () => {
    setIsLoading(true);
    // Redirect to onboarding for the new role
    router.push(`/onboarding?role=${intendedRole}&returnTo=${encodeURIComponent(intendedPath)}`);
  };

  const handleStayCurrentRole = () => {
    const dashboardPath = getDashboardPathForRole(currentRole);
    router.push(dashboardPath);
  };

  if (!currentRoleInfo || !intendedRoleInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="space-y-4">
            <div className="text-4xl">❌</div>
            <h1 className="text-xl font-semibold">Invalid Request</h1>
            <p className="text-muted-foreground">
              Something went wrong with your request. Please try again.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="text-4xl">🔄</div>
            <h1 className="text-2xl font-bold">Role Access Required</h1>
            <p className="text-muted-foreground">
              You're trying to access a feature that requires a different account type.
            </p>
          </div>

          {/* Role Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Role */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">Your Current Role</Badge>
                <div className={`${currentRoleInfo.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <currentRoleInfo.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{currentRoleInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{currentRoleInfo.description}</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>

            {/* Intended Role */}
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="default" className="mb-2">Required Role</Badge>
                <div className={`${intendedRoleInfo.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <intendedRoleInfo.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{intendedRoleInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{intendedRoleInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Requirements for New Role */}
          <div className="bg-muted/30 border border-border rounded-lg p-6">
            <h4 className="font-semibold mb-3">Requirements for {intendedRoleInfo.name} Role:</h4>
            <ul className="space-y-2">
              {intendedRoleInfo.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleRoleSwitch}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Setting up...' : `Upgrade to ${intendedRoleInfo.name}`}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleStayCurrentRole}
              className="flex-1"
            >
              Stay as {currentRoleInfo.name}
            </Button>
          </div>

          {/* Info Note */}
          <div className="text-center text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
            <p>
              <strong>Note:</strong> Upgrading your account will give you access to additional features. 
              You can always switch back to your current role later.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function getDashboardPathForRole(role: string): string {
  switch (role) {
    case 'client':
      return '/client';
    case 'agent':
      return '/agent';
    case 'inspector':
      return '/inspector';
    case 'company_admin':
      return '/company';
    case 'platform_admin':
      return '/admin';
    default:
      return '/';
  }
}

export default function RoleMismatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <RoleMismatchContent />
    </Suspense>
  );
}