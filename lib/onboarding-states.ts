import { User } from './generated/prisma';
import { 
  OnboardingStep, 
  DocumentVerificationStatus, 
  IdentityVerificationStatus,
  VerificationStatus,
  UserRole 
} from './generated/prisma';

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  nextStep?: OnboardingStep;
  canProceed: boolean;
  isCompleted: boolean;
  completionPercentage: number;
  blockers: string[];
  requirements: OnboardingRequirement[];
}

export interface OnboardingRequirement {
  step: OnboardingStep;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
  dependsOn?: OnboardingStep[];
  roles: UserRole[];
}

// Define role-specific onboarding requirements
export const ONBOARDING_REQUIREMENTS: OnboardingRequirement[] = [
  {
    step: OnboardingStep.EMAIL_VERIFICATION,
    title: 'Email Verification',
    description: 'Verify your email address to secure your account',
    isRequired: true,
    isCompleted: false,
    roles: ['CLIENT', 'AGENT', 'INSPECTOR', 'COMPANY_ADMIN', 'PLATFORM_ADMIN']
  },
  {
    step: OnboardingStep.PHONE_VERIFICATION,
    title: 'Phone Verification',
    description: 'Verify your phone number for WhatsApp notifications',
    isRequired: true,
    isCompleted: false,
    dependsOn: [OnboardingStep.EMAIL_VERIFICATION],
    roles: ['CLIENT', 'AGENT', 'INSPECTOR', 'COMPANY_ADMIN']
  },
  {
    step: OnboardingStep.PROFILE_SETUP,
    title: 'Profile Setup',
    description: 'Complete your profile information',
    isRequired: true,
    isCompleted: false,
    dependsOn: [OnboardingStep.EMAIL_VERIFICATION],
    roles: ['CLIENT', 'AGENT', 'INSPECTOR', 'COMPANY_ADMIN']
  },
  {
    step: OnboardingStep.IDENTITY_VERIFICATION,
    title: 'Identity Verification',
    description: 'Verify your identity with NIN/BVN (Agents & Inspectors only)',
    isRequired: true,
    isCompleted: false,
    dependsOn: [OnboardingStep.PROFILE_SETUP],
    roles: ['AGENT', 'INSPECTOR']
  },
  {
    step: OnboardingStep.DOCUMENT_UPLOAD,
    title: 'Document Upload',
    description: 'Upload required verification documents',
    isRequired: true,
    isCompleted: false,
    dependsOn: [OnboardingStep.IDENTITY_VERIFICATION],
    roles: ['AGENT', 'INSPECTOR', 'COMPANY_ADMIN']
  },
  {
    step: OnboardingStep.TERMS_ACCEPTANCE,
    title: 'Terms & Conditions',
    description: 'Accept terms of service and privacy policy',
    isRequired: true,
    isCompleted: false,
    dependsOn: [OnboardingStep.PROFILE_SETUP],
    roles: ['CLIENT', 'AGENT', 'INSPECTOR', 'COMPANY_ADMIN']
  }
];

export class OnboardingStateManager {
  private user: User;
  
  constructor(user: User) {
    this.user = user;
  }

  /**
   * Get the current onboarding state for the user
   */
  getOnboardingState(): OnboardingState {
    const userRequirements = this.getUserRequirements();
    const completedSteps = this.getCompletedSteps();
    const currentStep = this.getCurrentStep();
    const nextStep = this.getNextStep();
    const blockers = this.getBlockers();
    const canProceed = this.canProceedToNext();
    const isCompleted = this.isOnboardingCompleted(userRequirements);
    const completionPercentage = this.calculateCompletionPercentage(userRequirements);

    return {
      currentStep,
      completedSteps,
      nextStep,
      canProceed,
      isCompleted,
      completionPercentage,
      blockers,
      requirements: userRequirements
    };
  }

  /**
   * Get requirements specific to the user's role
   */
  private getUserRequirements(): OnboardingRequirement[] {
    return ONBOARDING_REQUIREMENTS
      .filter(req => req.roles.includes(this.user.role))
      .map(req => ({
        ...req,
        isCompleted: this.isStepCompleted(req.step)
      }));
  }

  /**
   * Get list of completed onboarding steps
   */
  private getCompletedSteps(): OnboardingStep[] {
    const completed: OnboardingStep[] = [];

    // Email verification
    if (this.user.verificationStatus === VerificationStatus.VERIFIED) {
      completed.push(OnboardingStep.EMAIL_VERIFICATION);
    }

    // Phone verification
    if (this.user.phoneVerified) {
      completed.push(OnboardingStep.PHONE_VERIFICATION);
    }

    // Profile setup
    if (this.user.profileSetupCompleted) {
      completed.push(OnboardingStep.PROFILE_SETUP);
    }

    // Identity verification
    if (this.user.identityVerificationStatus === IdentityVerificationStatus.VERIFIED) {
      completed.push(OnboardingStep.IDENTITY_VERIFICATION);
    }

    // Document upload
    if (this.user.documentsVerificationStatus === DocumentVerificationStatus.APPROVED) {
      completed.push(OnboardingStep.DOCUMENT_UPLOAD);
    }

    // Terms acceptance
    if (this.user.termsAccepted && this.user.privacyPolicyAccepted) {
      completed.push(OnboardingStep.TERMS_ACCEPTANCE);
    }

    return completed;
  }

  /**
   * Get the current onboarding step
   */
  private getCurrentStep(): OnboardingStep {
    return this.user.onboardingStep || OnboardingStep.EMAIL_VERIFICATION;
  }

  /**
   * Get the next step in onboarding
   */
  private getNextStep(): OnboardingStep | undefined {
    const userRequirements = this.getUserRequirements();
    const completedSteps = this.getCompletedSteps();
    
    // Find the first incomplete required step
    for (const requirement of userRequirements) {
      if (requirement.isRequired && !completedSteps.includes(requirement.step)) {
        // Check if dependencies are met
        if (requirement.dependsOn) {
          const dependenciesMet = requirement.dependsOn.every(dep => 
            completedSteps.includes(dep)
          );
          if (dependenciesMet) {
            return requirement.step;
          }
        } else {
          return requirement.step;
        }
      }
    }

    return undefined;
  }

  /**
   * Check if user can proceed to next step
   */
  private canProceedToNext(): boolean {
    const nextStep = this.getNextStep();
    if (!nextStep) return false;

    const requirement = ONBOARDING_REQUIREMENTS.find(req => req.step === nextStep);
    if (!requirement) return false;

    // Check dependencies
    if (requirement.dependsOn) {
      const completedSteps = this.getCompletedSteps();
      return requirement.dependsOn.every(dep => completedSteps.includes(dep));
    }

    return true;
  }

  /**
   * Check if onboarding is completed
   */
  private isOnboardingCompleted(userRequirements: OnboardingRequirement[]): boolean {
    if (this.user.onboardingCompleted) {
      return true;
    }
    // If there are no required steps that are not completed, onboarding is complete.
    return userRequirements.every(req => !req.isRequired || req.isCompleted);
  }

  /**
   * Calculate completion percentage
   */
  private calculateCompletionPercentage(userRequirements: OnboardingRequirement[]): number {
    const requiredSteps = userRequirements.filter(req => req.isRequired);
    const completedRequired = requiredSteps.filter(req => req.isCompleted);
    
    if (requiredSteps.length === 0) return 100;
    
    return Math.round((completedRequired.length / requiredSteps.length) * 100);
  }

  /**
   * Get current blockers preventing progression
   */
  private getBlockers(): string[] {
    const blockers: string[] = [];

    // Email verification blocker
    if (this.user.verificationStatus !== VerificationStatus.VERIFIED) {
      blockers.push('Email verification required');
    }

    // Phone verification blocker (for applicable roles)
    if (['AGENT', 'INSPECTOR', 'COMPANY_ADMIN'].includes(this.user.role) && 
        !this.user.phoneVerified) {
      blockers.push('Phone verification required');
    }

    // Identity verification blocker (for agents and inspectors)
    if (['AGENT', 'INSPECTOR'].includes(this.user.role)) {
      if (this.user.identityVerificationStatus === IdentityVerificationStatus.REJECTED) {
        blockers.push('Identity verification was rejected - please contact support');
      } else if (this.user.identityVerificationStatus === IdentityVerificationStatus.PENDING) {
        blockers.push('Identity verification is under review');
      }
    }

    // Document verification blocker
    if (this.user.documentsVerificationStatus === DocumentVerificationStatus.REJECTED) {
      blockers.push('Document verification was rejected - please resubmit');
    } else if (this.user.documentsVerificationStatus === DocumentVerificationStatus.UNDER_REVIEW) {
      blockers.push('Documents are under review');
    }

    return blockers;
  }

  /**
   * Check if a specific step is completed
   */
  private isStepCompleted(step: OnboardingStep): boolean {
    switch (step) {
      case OnboardingStep.EMAIL_VERIFICATION:
        return this.user.verificationStatus === VerificationStatus.VERIFIED;
      
      case OnboardingStep.PHONE_VERIFICATION:
        return this.user.phoneVerified;
      
      case OnboardingStep.PROFILE_SETUP:
        return this.user.profileSetupCompleted;
      
      case OnboardingStep.IDENTITY_VERIFICATION:
        return this.user.identityVerificationStatus === IdentityVerificationStatus.VERIFIED;
      
      case OnboardingStep.DOCUMENT_UPLOAD:
        return this.user.documentsVerificationStatus === DocumentVerificationStatus.APPROVED;
      
      case OnboardingStep.TERMS_ACCEPTANCE:
        return this.user.termsAccepted && this.user.privacyPolicyAccepted;
      
      case OnboardingStep.COMPLETED:
        return this.user.onboardingCompleted;
      
      default:
        return false;
    }
  }

  /**
   * Update user's onboarding step
   */
  async updateOnboardingStep(step: OnboardingStep): Promise<void> {
    // This would be implemented with Prisma update
    // await prisma.user.update({
    //   where: { id: this.user.id },
    //   data: { onboardingStep: step }
    // });
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(): Promise<void> {
    // This would be implemented with Prisma update
    // await prisma.user.update({
    //   where: { id: this.user.id },
    //   data: {
    //     onboardingCompleted: true,
    //     onboardingCompletedAt: new Date(),
    //     onboardingStep: OnboardingStep.COMPLETED
    //   }
    // });
  }
}

/**
 * Helper function to get onboarding state for a user
 */
export function getOnboardingState(user: User): OnboardingState {
  const manager = new OnboardingStateManager(user);
  return manager.getOnboardingState();
}

/**
 * Check if user needs to complete onboarding
 */
export function needsOnboarding(user: User): boolean {
  const state = getOnboardingState(user);
  return !state.isCompleted;
}

/**
 * Get user-friendly status message
 */
export function getOnboardingStatusMessage(user: User): string {
  const state = getOnboardingState(user);
  
  if (state.isCompleted) {
    return 'Onboarding completed';
  }
  
  if (state.blockers.length > 0) {
    return state.blockers[0]; // Show first blocker
  }
  
  if (state.nextStep) {
    const requirement = ONBOARDING_REQUIREMENTS.find(req => req.step === state.nextStep);
    return requirement ? `Next: ${requirement.title}` : 'Continue onboarding';
  }
  
  return 'Continue onboarding';
}