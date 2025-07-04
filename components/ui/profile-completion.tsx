'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User,
  Settings,
  ChevronRight
} from 'lucide-react';

interface ProfileField {
  id: string;
  label: string;
  value: any;
  required: boolean;
  weight: number; // How much this field contributes to completion percentage
}

interface ProfileCompletionProps {
  userRole: 'client' | 'agent' | 'inspector' | 'company';
  fields: ProfileField[];
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export function ProfileCompletion({ 
  userRole, 
  fields, 
  onEditClick,
  showEditButton = true 
}: ProfileCompletionProps) {
  // Calculate completion percentage
  const completedFields = fields.filter(field => {
    if (field.required) {
      return field.value && field.value.toString().trim() !== '';
    }
    return field.value && field.value.toString().trim() !== '';
  });

  const requiredFields = fields.filter(field => field.required);
  const optionalFields = fields.filter(field => !field.required);

  const requiredCompleted = completedFields.filter(field => 
    requiredFields.some(req => req.id === field.id)
  );

  const totalWeight = fields.reduce((sum, field) => sum + field.weight, 0);
  const completedWeight = completedFields.reduce((sum, field) => sum + field.weight, 0);
  
  const completionPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

  const getCompletionStatus = () => {
    if (completionPercentage === 100) return 'complete';
    if (requiredCompleted.length === requiredFields.length) return 'good';
    return 'incomplete';
  };

  const status = getCompletionStatus();

  const getStatusConfig = () => {
    switch (status) {
      case 'complete':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badge: 'Complete',
          badgeVariant: 'default' as const,
          badgeColor: 'bg-green-500'
        };
      case 'good':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badge: 'Good',
          badgeVariant: 'outline' as const,
          badgeColor: 'bg-blue-500'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badge: 'Needs Attention',
          badgeVariant: 'outline' as const,
          badgeColor: 'bg-orange-500'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <p className="text-sm text-muted-foreground">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Profile
              </p>
            </div>
          </div>
          <Badge 
            variant={statusConfig.badgeVariant}
            className={status === 'complete' ? statusConfig.badgeColor + ' text-white' : ''}
          >
            {statusConfig.badge}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className={statusConfig.color}>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Field Status Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Required Fields</span>
              <span className={requiredCompleted.length === requiredFields.length ? 'text-green-600' : 'text-orange-600'}>
                {requiredCompleted.length}/{requiredFields.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Optional Fields</span>
              <span className="text-blue-600">
                {completedFields.length - requiredCompleted.length}/{optionalFields.length}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Fields</span>
              <span className="font-medium">
                {completedFields.length}/{fields.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Completion</span>
              <span className={`font-medium ${statusConfig.color}`}>
                {statusConfig.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {showEditButton && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditClick}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        )}

        {/* Missing Required Fields Alert */}
        {requiredCompleted.length < requiredFields.length && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">
                  Complete required fields to access all features
                </p>
                <p className="text-orange-700 mt-1">
                  {requiredFields.length - requiredCompleted.length} required field(s) missing
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to define profile fields for different roles
export function getProfileFields(role: string, user: any, profile: any): ProfileField[] {
  const baseFields: ProfileField[] = [
    {
      id: 'name',
      label: 'Full Name',
      value: user?.name,
      required: true,
      weight: 20
    },
    {
      id: 'phone',
      label: 'Phone Number',
      value: user?.phone,
      required: true,
      weight: 15
    },
    {
      id: 'image',
      label: 'Profile Photo',
      value: user?.image,
      required: false,
      weight: 10
    }
  ];

  switch (role) {
    case 'client':
      return [
        ...baseFields,
        {
          id: 'preferredLocation',
          label: 'Preferred Location',
          value: profile?.preferredLocation,
          required: true,
          weight: 20
        },
        {
          id: 'budgetRange',
          label: 'Budget Range',
          value: profile?.budgetMin && profile?.budgetMax ? `₦${profile.budgetMin} - ₦${profile.budgetMax}` : null,
          required: true,
          weight: 20
        },
        {
          id: 'propertyType',
          label: 'Property Type Preference',
          value: profile?.propertyType,
          required: false,
          weight: 10
        },
        {
          id: 'bedrooms',
          label: 'Bedroom Preference',
          value: profile?.bedrooms,
          required: false,
          weight: 5
        }
      ];

    case 'agent':
      return [
        ...baseFields,
        {
          id: 'bio',
          label: 'Professional Bio',
          value: profile?.bio,
          required: true,
          weight: 20
        },
        {
          id: 'experience',
          label: 'Years of Experience',
          value: profile?.experience,
          required: true,
          weight: 15
        },
        {
          id: 'specialization',
          label: 'Specialization',
          value: profile?.specialization,
          required: false,
          weight: 10
        },
        {
          id: 'guarantors',
          label: 'Guarantor Information',
          value: profile?.guarantor1Name && profile?.guarantor2Name ? 'Complete' : null,
          required: true,
          weight: 20
        }
      ];

    case 'inspector':
      return [
        ...baseFields,
        {
          id: 'location',
          label: 'Service Location',
          value: profile?.location,
          required: true,
          weight: 25
        },
        {
          id: 'availabilityRadius',
          label: 'Service Radius',
          value: profile?.availabilityRadius ? `${profile.availabilityRadius} km` : null,
          required: true,
          weight: 15
        },
        {
          id: 'rating',
          label: 'Rating',
          value: profile?.rating ? `${profile.rating}/5` : 'Not rated yet',
          required: false,
          weight: 10
        }
      ];

    default:
      return baseFields;
  }
}