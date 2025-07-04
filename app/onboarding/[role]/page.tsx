'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSession } from '@/hooks/use-auth';
import { 
  User, 
  MapPin, 
  Building, 
  CheckCircle, 
  Clock,
  Phone,
  Mail,
  Home,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';

type UserRole = 'client' | 'agent' | 'inspector' | 'company' | 'platform_admin';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  status: 'pending' | 'completed' | 'optional';
}

interface RoleOnboardingConfig {
  title: string;
  description: string;
  steps: OnboardingStep[];
}

const onboardingConfigs: Record<UserRole, RoleOnboardingConfig> = {
  client: {
    title: 'Welcome to Inspekta',
    description: 'Let\'s set up your profile to help you find the perfect property',
    steps: [
      {
        id: 'profile',
        title: 'Complete Profile',
        description: 'Add your basic information',
        icon: User,
        required: true,
        status: 'pending'
      },
      {
        id: 'preferences',
        title: 'Property Preferences',
        description: 'Tell us what you\'re looking for',
        icon: Home,
        required: true,
        status: 'pending'
      },
      {
        id: 'budget',
        title: 'Budget Range',
        description: 'Set your budget preferences',
        icon: DollarSign,
        required: true,
        status: 'pending'
      },
      {
        id: 'location',
        title: 'Preferred Locations',
        description: 'Choose areas you\'re interested in',
        icon: MapPin,
        required: true,
        status: 'pending'
      }
    ]
  },
  agent: {
    title: 'Agent Onboarding',
    description: 'Set up your agent profile and start listing properties',
    steps: [
      {
        id: 'profile',
        title: 'Agent Profile',
        description: 'Complete your professional information',
        icon: User,
        required: true,
        status: 'pending'
      },
      {
        id: 'verification',
        title: 'Identity Verification',
        description: 'Verify your identity with NIN/BVN',
        icon: CheckCircle,
        required: true,
        status: 'pending'
      },
      {
        id: 'guarantors',
        title: 'Guarantor Information',
        description: 'Provide guarantor details',
        icon: FileText,
        required: true,
        status: 'pending'
      },
      {
        id: 'business',
        title: 'Business Details',
        description: 'Add your business information',
        icon: Building,
        required: false,
        status: 'optional'
      }
    ]
  },
  inspector: {
    title: 'Inspector Onboarding',
    description: 'Set up your inspector profile and availability',
    steps: [
      {
        id: 'profile',
        title: 'Inspector Profile',
        description: 'Complete your professional information',
        icon: User,
        required: true,
        status: 'pending'
      },
      {
        id: 'verification',
        title: 'Identity Verification',
        description: 'Verify your identity and credentials',
        icon: CheckCircle,
        required: true,
        status: 'pending'
      },
      {
        id: 'location',
        title: 'Service Areas',
        description: 'Set your service locations',
        icon: MapPin,
        required: true,
        status: 'pending'
      },
      {
        id: 'availability',
        title: 'Availability',
        description: 'Set your working hours',
        icon: Calendar,
        required: true,
        status: 'pending'
      }
    ]
  },
  company: {
    title: 'Company Onboarding',
    description: 'Set up your company profile and subdomain',
    steps: [
      {
        id: 'company',
        title: 'Company Information',
        description: 'Add your company details',
        icon: Building,
        required: true,
        status: 'pending'
      },
      {
        id: 'verification',
        title: 'Business Verification',
        description: 'Verify with CAC registration',
        icon: CheckCircle,
        required: true,
        status: 'pending'
      },
      {
        id: 'subdomain',
        title: 'Branded Subdomain',
        description: 'Choose your company subdomain',
        icon: FileText,
        required: true,
        status: 'pending'
      },
      {
        id: 'admin',
        title: 'Admin Setup',
        description: 'Set up admin access',
        icon: User,
        required: true,
        status: 'pending'
      }
    ]
  },
  platform_admin: {
    title: 'Platform Administrator',
    description: 'Welcome to the admin dashboard. Your account is already configured.',
    steps: [
      {
        id: 'admin-setup',
        title: 'Admin Access Configured',
        description: 'Your admin privileges are active',
        icon: CheckCircle,
        required: false,
        status: 'completed'
      }
    ]
  }
};

export default function RoleOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: user } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Record<string, any>>({});

  const role = params.role as UserRole;
  const config = onboardingConfigs[role];

  // Redirect if user role doesn't match URL role
  useEffect(() => {
    if (user && user.role.toLowerCase() !== role) {
      router.push(`/onboarding/${user.role.toLowerCase()}`);
    }
    
    // Auto-redirect platform admins who are already set up
    if (user && role === 'platform_admin' && user.isVerified) {
      router.push('/admin');
    }
  }, [user, role, router]);

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-500">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold">Invalid Role</h2>
              <p className="text-muted-foreground">
                The onboarding role "{role}" is not recognized.
              </p>
              <Button onClick={() => router.push('/marketplace')}>
                Go to Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepData = config.steps[currentStep];
  const totalSteps = config.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (!currentStepData.required) {
      setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
      handleNext();
    }
  };

  const handleCompleteStep = (stepData: any) => {
    setFormData(prev => ({ ...prev, [currentStepData.id]: stepData }));
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    handleNext();
  };

  const handleCompleteOnboarding = async () => {
    try {
      // Save onboarding data to backend
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          data: formData,
          completedSteps: Array.from(completedSteps)
        })
      });

      if (response.ok) {
        // Redirect to appropriate dashboard
        if (role === 'platform_admin') {
          router.push('/admin');
        } else {
          router.push(`/${role}`);
        }
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {config.steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStep;
            const isPending = index > currentStep && !isCompleted;

            return (
              <Card 
                key={step.id} 
                className={`border-2 transition-all duration-200 ${
                  isCurrent ? 'border-primary shadow-md' : 
                  isCompleted ? 'border-green-500 bg-green-50' : 
                  'border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      isCurrent ? 'bg-primary text-white' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{step.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {!step.required && (
                          <Badge variant="outline" className="text-xs">Optional</Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="default" className="text-xs bg-green-500">Complete</Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                        {isPending && (
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Step Content */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary rounded-full text-white">
                <currentStepData.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dynamic Step Content Based on Role and Step */}
            <OnboardingStepContent 
              role={role}
              step={currentStepData}
              onComplete={handleCompleteStep}
              formData={formData[currentStepData.id] || {}}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>

              <div className="flex space-x-2">
                {!currentStepData.required && (
                  <Button variant="outline" onClick={handleSkip}>
                    Skip
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {currentStep === totalSteps - 1 ? 
                    (role === 'platform_admin' ? 'Go to Admin Dashboard' : 'Complete Onboarding') : 
                    'Continue'
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dynamic Step Content Component
function OnboardingStepContent({ 
  role, 
  step, 
  onComplete, 
  formData 
}: {
  role: UserRole;
  step: OnboardingStep;
  onComplete: (data: any) => void;
  formData: any;
}) {
  const [data, setData] = useState(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  // Render different content based on role and step
  const renderStepContent = () => {
    if (role === 'client') {
      switch (step.id) {
        case 'profile':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input 
                  value={data.name || ''} 
                  onChange={(e) => setData((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input 
                  value={data.phone || ''} 
                  onChange={(e) => setData((prev: any) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
          );
        case 'preferences':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select 
                  value={data.propertyType || ''} 
                  onChange={(e) => setData((prev: any) => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select property type</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="DUPLEX">Duplex</option>
                  <option value="OFFICE">Office</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Bedrooms</label>
                <select 
                  value={data.bedrooms || ''} 
                  onChange={(e) => setData((prev: any) => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>
            </div>
          );
        case 'budget':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Budget (₦)</label>
                  <Input 
                    type="number"
                    value={data.minBudget || ''} 
                    onChange={(e) => setData((prev: any) => ({ ...prev, minBudget: e.target.value }))}
                    placeholder="5,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Budget (₦)</label>
                  <Input 
                    type="number"
                    value={data.maxBudget || ''} 
                    onChange={(e) => setData((prev: any) => ({ ...prev, maxBudget: e.target.value }))}
                    placeholder="50,000,000"
                  />
                </div>
              </div>
            </div>
          );
        case 'location':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred State</label>
                <select 
                  value={data.state || ''} 
                  onChange={(e) => setData((prev: any) => ({ ...prev, state: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select state</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Rivers">Rivers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Areas</label>
                <Input 
                  value={data.areas || ''} 
                  onChange={(e) => setData((prev: any) => ({ ...prev, areas: e.target.value }))}
                  placeholder="e.g., Victoria Island, Ikoyi, Lekki"
                />
              </div>
            </div>
          );
      }
    }

    // Add other role-specific content here...
    
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Step Coming Soon</h3>
        <p className="text-muted-foreground">
          This onboarding step is being prepared for you.
        </p>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStepContent()}
    </form>
  );
}