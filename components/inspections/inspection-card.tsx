'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InspectionStatusBadge } from './inspection-status-badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow, format, isFuture, isPast } from 'date-fns';

interface InspectionCardProps {
  inspection: {
    id: string;
    type: 'VIRTUAL' | 'PHYSICAL';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    scheduledAt: string;
    duration: number;
    fee: number;
    paid: boolean;
    listing: {
      id: string;
      title: string;
      location: string;
      agent?: {
        id: string;
        name: string;
        email: string;
      };
    };
    inspector?: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    } | null;
    clients?: Array<{
      client: {
        id: string;
        name: string;
        email: string;
      };
      notes?: string;
    }>;
  };
  userRole: 'CLIENT' | 'AGENT' | 'INSPECTOR' | 'COMPANY_ADMIN' | 'PLATFORM_ADMIN';
  onAction?: (action: string, inspectionId: string) => void;
}

export function InspectionCard({ inspection, userRole, onAction }: InspectionCardProps) {
  const scheduledDate = new Date(inspection.scheduledAt);
  const isUpcoming = isFuture(scheduledDate);
  const isPastDue = isPast(scheduledDate) && inspection.status === 'SCHEDULED';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTimeDisplay = () => {
    if (isUpcoming) {
      return `in ${formatDistanceToNow(scheduledDate)}`;
    } else {
      return formatDistanceToNow(scheduledDate, { addSuffix: true });
    }
  };

  const canJoinInspection = () => {
    return inspection.status === 'SCHEDULED' && 
           inspection.type === 'VIRTUAL' && 
           isUpcoming &&
           (userRole === 'CLIENT' || userRole === 'INSPECTOR') &&
           // Only allow joining 15 minutes before scheduled time
           (scheduledDate.getTime() - Date.now()) <= 15 * 60 * 1000;
  };

  const canContactInspector = () => {
    return inspection.inspector && 
           inspection.status !== 'CANCELLED' && 
           (userRole === 'CLIENT' || userRole === 'AGENT');
  };

  const canAcceptJob = () => {
    return userRole === 'INSPECTOR' && 
           inspection.status === 'SCHEDULED' && 
           !inspection.inspector &&
           isUpcoming;
  };

  const canCompleteInspection = () => {
    return userRole === 'INSPECTOR' && 
           inspection.inspector && 
           inspection.status === 'IN_PROGRESS';
  };

  const canCancelInspection = () => {
    return inspection.status === 'SCHEDULED' && 
           isUpcoming &&
           (userRole === 'CLIENT' || 
            (userRole === 'AGENT' && inspection.listing.agent?.id) ||
            (userRole === 'INSPECTOR' && inspection.inspector));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{inspection.listing.title}</h3>
              <InspectionStatusBadge status={inspection.status} />
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{inspection.listing.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-primary">
              {formatPrice(inspection.fee)}
            </div>
            <Badge variant={inspection.paid ? 'default' : 'secondary'}>
              {inspection.paid ? 'Paid' : 'Pending Payment'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inspection Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium">
                {format(scheduledDate, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>
                {format(scheduledDate, 'h:mm a')} ({inspection.duration} min)
              </span>
            </div>
            <div className="flex items-center text-sm">
              {inspection.type === 'VIRTUAL' ? (
                <Video className="w-4 h-4 mr-2 text-muted-foreground" />
              ) : (
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              )}
              <span className="capitalize">{inspection.type.toLowerCase()} Inspection</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="ml-1 font-medium">{getTimeDisplay()}</span>
            </div>
            {inspection.listing.agent && (
              <div className="text-sm">
                <span className="text-muted-foreground">Agent:</span>
                <span className="ml-1 font-medium">{inspection.listing.agent.name}</span>
              </div>
            )}
            {inspection.inspector && (
              <div className="text-sm">
                <span className="text-muted-foreground">Inspector:</span>
                <span className="ml-1 font-medium">{inspection.inspector.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning for overdue inspections */}
        {isPastDue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm text-red-800">
              This inspection is overdue. Please contact support.
            </span>
          </div>
        )}

        {/* Inspector not assigned warning */}
        {!inspection.inspector && inspection.status === 'SCHEDULED' && isUpcoming && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
            <span className="text-sm text-amber-800">
              Inspector not yet assigned. You'll be notified once confirmed.
            </span>
          </div>
        )}

        {/* Client notes (for agents and inspectors) */}
        {(userRole === 'AGENT' || userRole === 'INSPECTOR') && 
         inspection.clients?.[0]?.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Client Notes:</h4>
            <p className="text-sm text-blue-800">{inspection.clients[0].notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {canJoinInspection() && (
            <Button 
              onClick={() => onAction?.('join', inspection.id)}
              className="flex items-center"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Virtual Inspection
            </Button>
          )}

          {canAcceptJob() && (
            <Button 
              onClick={() => onAction?.('accept', inspection.id)}
              className="flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              Accept Job
            </Button>
          )}

          {canCompleteInspection() && (
            <Button 
              onClick={() => onAction?.('complete', inspection.id)}
              className="flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Inspection
            </Button>
          )}

          {canContactInspector() && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAction?.('contact-inspector', inspection.id)}
                className="flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Inspector
              </Button>
            </>
          )}

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAction?.('view-details', inspection.id)}
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>

          {canCancelInspection() && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAction?.('cancel', inspection.id)}
              className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}