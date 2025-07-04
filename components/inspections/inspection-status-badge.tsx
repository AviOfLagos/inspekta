'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, Clock, CheckCircle, XCircle, Play } from 'lucide-react';

interface InspectionStatusBadgeProps {
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  className?: string;
  showIcon?: boolean;
}

export function InspectionStatusBadge({ 
  status, 
  className,
  showIcon = true 
}: InspectionStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          icon: Calendar,
          variant: 'secondary' as const,
          className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          icon: Play,
          variant: 'secondary' as const,
          className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          icon: CheckCircle,
          variant: 'secondary' as const,
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          variant: 'secondary' as const,
          className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
        };
      default:
        return {
          label: status,
          icon: Clock,
          variant: 'secondary' as const,
          className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}