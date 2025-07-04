'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OnboardingState } from '@/lib/onboarding-states';
import { OnboardingStep } from '@/lib/generated/prisma';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Mail,
  Phone,
  User,
  Shield,
  FileText,
  CheckSquare,
  ChevronRight,
  Info
} from 'lucide-react';

interface OnboardingProgressProps {
  state: OnboardingState;
  onContinue?: () => void;
  onStepClick?: (step: OnboardingStep) => void;
  showDetails?: boolean;
}

const STEP_ICONS = {
  [OnboardingStep.EMAIL_VERIFICATION]: Mail,
  [OnboardingStep.PHONE_VERIFICATION]: Phone,
  [OnboardingStep.PROFILE_SETUP]: User,
  [OnboardingStep.IDENTITY_VERIFICATION]: Shield,
  [OnboardingStep.DOCUMENT_UPLOAD]: FileText,
  [OnboardingStep.TERMS_ACCEPTANCE]: CheckSquare,
  [OnboardingStep.COMPLETED]: CheckCircle,
};

export function OnboardingProgress({ 
  state, 
  onContinue, 
  onStepClick,
  showDetails = true 
}: OnboardingProgressProps) {
  const getStepStatus = (step: OnboardingStep) => {
    if (state.completedSteps.includes(step)) {
      return 'completed';
    }
    if (step === state.currentStep) {
      return 'current';
    }
    if (state.nextStep === step) {
      return 'next';
    }
    return 'pending';
  };

  const getStepIcon = (step: OnboardingStep, status: string) => {
    const IconComponent = STEP_ICONS[step];
    
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (status === 'current') {
      return <Clock className="w-5 h-5 text-blue-600" />;
    }
    
    return <IconComponent className="w-5 h-5 text-gray-400" />;
  };

  const getStepBadge = (step: OnboardingStep, requirement: any) => {
    const status = getStepStatus(step);
    
    if (status === 'completed') {
      return <Badge className="bg-green-500 text-white">Complete</Badge>;
    }
    if (status === 'current') {
      return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
    }
    if (status === 'next') {
      return <Badge variant="outline" className="border-blue-500 text-blue-600">Next</Badge>;
    }
    if (!requirement.isRequired) {
      return <Badge variant="outline" className="text-gray-500">Optional</Badge>;
    }
    
    return <Badge variant="outline" className="text-gray-500">Pending</Badge>;
  };

  const getStatusColor = () => {
    if (state.isCompleted) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800'
      };
    }
    if (state.blockers.length > 0) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800'
      };
    }
    if (state.canProceed) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800'
      };
    }
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800'
    };
  };

  const statusColors = getStatusColor();

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card className={`border-2 ${statusColors.border} ${statusColors.bg}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${statusColors.bg}`}>
                {state.isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : state.blockers.length > 0 ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Clock className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Account Setup Progress</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {state.isCompleted 
                    ? 'Your account is fully set up!' 
                    : `${state.completedSteps.length} of ${state.requirements.filter(r => r.isRequired).length} required steps completed`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${statusColors.text}`}>
                {state.completionPercentage}%
              </div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={state.completionPercentage} className="h-3" />
          </div>

          {/* Blockers Alert */}
          {state.blockers.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Action Required</h4>
                  <ul className="mt-1 text-sm text-red-700 space-y-1">
                    {state.blockers.map((blocker, index) => (
                      <li key={index}>• {blocker}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          {!state.isCompleted && state.canProceed && onContinue && (
            <Button onClick={onContinue} className="w-full">
              Continue Setup
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Detailed Steps */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.requirements.map((requirement) => {
                const status = getStepStatus(requirement.step);
                const isClickable = onStepClick && (status === 'current' || status === 'next');
                
                return (
                  <div
                    key={requirement.step}
                    className={`p-4 border rounded-lg transition-all ${
                      status === 'current' 
                        ? 'border-blue-200 bg-blue-50' 
                        : status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                    } ${isClickable ? 'cursor-pointer hover:shadow-md' : ''}`}
                    onClick={() => isClickable && onStepClick?.(requirement.step)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStepIcon(requirement.step, status)}
                        <div>
                          <h4 className="font-medium">{requirement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {requirement.description}
                          </p>
                          
                          {/* Dependencies */}
                          {requirement.dependsOn && requirement.dependsOn.length > 0 && (
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Info className="w-3 h-3 mr-1" />
                              Requires: {requirement.dependsOn.map(dep => {
                                const depReq = state.requirements.find(r => r.step === dep);
                                return depReq?.title;
                              }).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStepBadge(requirement.step, requirement)}
                        {isClickable && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Simplified version for dashboard widgets
export function OnboardingProgressWidget({ 
  state, 
  onContinue 
}: { 
  state: OnboardingState; 
  onContinue?: () => void; 
}) {
  if (state.isCompleted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Setup Complete!</h3>
              <p className="text-sm text-green-700">Your account is ready to use</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Complete Your Setup</h3>
                <p className="text-sm text-blue-700">
                  {state.completionPercentage}% complete
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="border-blue-500 text-blue-600">
                {state.requirements.filter(r => r.isRequired).length - state.completedSteps.length} steps left
              </Badge>
            </div>
          </div>
          
          <Progress value={state.completionPercentage} className="h-2" />
          
          {state.canProceed && onContinue && (
            <Button size="sm" onClick={onContinue} className="w-full">
              Continue Setup
            </Button>
          )}
          
          {state.blockers.length > 0 && (
            <div className="text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {state.blockers[0]}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}