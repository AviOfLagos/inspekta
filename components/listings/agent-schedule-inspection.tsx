'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar,
  Video,
  MapPin,
  UserPlus
} from 'lucide-react';

interface ScheduleInspectionModalProps {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  trigger: React.ReactNode;
}

type InspectionType = 'virtual' | 'physical';

interface InspectionDetails {
  type: InspectionType;
  scheduledFor: string;
  scheduledTime: string;
  maxParticipants: number;
  inspectorId?: string;
  notes?: string;
}

export function AgentScheduleInspectionModal({ 
  propertyId, 
  propertyTitle, 
  propertyLocation, 
  trigger 
}: ScheduleInspectionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<InspectionDetails>({
    type: 'virtual',
    scheduledFor: '',
    scheduledTime: '',
    maxParticipants: 10,
  });

  // Mock available inspectors - in real app, fetch from API
  const availableInspectors = [
    { id: 'inspector-1', name: 'David Wilson', rating: 4.8, location: 'Lagos Island', specialties: ['Residential', 'Commercial'] },
    { id: 'inspector-2', name: 'Alice Green', rating: 4.9, location: 'Victoria Island', specialties: ['Luxury', 'Residential'] },
    { id: 'inspector-3', name: 'Michael Johnson', rating: 4.7, location: 'Ikoyi', specialties: ['Commercial', 'Industrial'] },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleScheduleSubmit = async () => {
    if (!details.scheduledFor || !details.scheduledTime) {
      alert('Please select date and time');
      return;
    }

    setLoading(true);
    try {
      // Note: This endpoint doesn't exist yet - needs backend implementation
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          type: details.type,
          scheduledFor: `${details.scheduledFor}T${details.scheduledTime}:00`,
          maxParticipants: details.maxParticipants,
          inspectorId: details.inspectorId,
          notes: details.notes,
        }),
      });

      if (response.ok) {
        alert('Inspection scheduled successfully!');
        setOpen(false);
        resetForm();
        // In real app, refresh inspection list
      } else {
        const error = await response.json();
        alert(`Scheduling failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Scheduling error:', error);
      alert('Failed to schedule inspection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDetails({
      type: 'virtual',
      scheduledFor: '',
      scheduledTime: '',
      maxParticipants: 10,
    });
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Inspection as Agent
          </DialogTitle>
          <DialogDescription>
            {propertyTitle} • {propertyLocation}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inspection Type Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Inspection Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer border-2 ${details.type === 'virtual' ? 'border-primary' : 'border-gray-200'}`}
                onClick={() => setDetails(prev => ({ ...prev, type: 'virtual' }))}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-primary" />
                    <CardTitle className="text-base">Virtual Inspection</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    Live video tour via Google Meet
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(15000)}
                  </div>
                  <div className="text-xs text-gray-500">30-45 minutes</div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer border-2 ${details.type === 'physical' ? 'border-primary' : 'border-gray-200'}`}
                onClick={() => setDetails(prev => ({ ...prev, type: 'physical' }))}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    <CardTitle className="text-base">Physical Inspection</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    In-person property visit
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(25000)}
                  </div>
                  <div className="text-xs text-gray-500">1-2 hours</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Inspection Date</Label>
              <Input
                id="date"
                type="date"
                min={minDate}
                value={details.scheduledFor}
                onChange={(e) => setDetails(prev => ({ ...prev, scheduledFor: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={details.scheduledTime}
                onChange={(e) => setDetails(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Inspector Selection */}
          <div>
            <Label className="text-sm font-medium">Assign Inspector (Optional)</Label>
            <div className="mt-2 space-y-2">
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${!details.inspectorId ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                onClick={() => setDetails(prev => ({ ...prev, inspectorId: undefined }))}
              >
                <div className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Auto-assign best available inspector</span>
                </div>
                <div className="text-xs text-gray-500 ml-6">
                  System will assign based on location, rating, and availability
                </div>
              </div>
              
              {availableInspectors.map((inspector) => (
                <div 
                  key={inspector.id}
                  className={`p-3 border rounded-lg cursor-pointer ${details.inspectorId === inspector.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                  onClick={() => setDetails(prev => ({ ...prev, inspectorId: inspector.id }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{inspector.name}</span>
                        <div className="flex items-center ml-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                          <span className="text-xs text-gray-600">{inspector.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{inspector.location}</div>
                    </div>
                    <div className="flex gap-1">
                      {inspector.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Inspection Settings */}
          {details.type === 'virtual' && (
            <div>
              <Label htmlFor="participants">Maximum Participants</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max="20"
                value={details.maxParticipants}
                onChange={(e) => setDetails(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                className="mt-1"
              />
              <div className="text-xs text-gray-500 mt-1">
                How many clients can join this virtual inspection
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div>
            <Label htmlFor="notes">Special Instructions (Optional)</Label>
            <textarea
              id="notes"
              className="w-full mt-1 p-2 border rounded-md h-20"
              placeholder="Any specific areas to focus on or special requirements..."
              value={details.notes || ''}
              onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* Commission Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Commission Breakdown</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div className="flex justify-between">
                <span>Inspection Fee:</span>
                <span className="font-medium">
                  {formatPrice(details.type === 'virtual' ? 15000 : 25000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Your Commission (30%):</span>
                <span className="font-medium text-green-600">
                  {formatPrice((details.type === 'virtual' ? 15000 : 25000) * 0.3)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Inspector Share (60%):</span>
                <span className="font-medium">
                  {formatPrice((details.type === 'virtual' ? 15000 : 25000) * 0.6)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Platform Fee (10%):</span>
                <span>{formatPrice((details.type === 'virtual' ? 15000 : 25000) * 0.1)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleScheduleSubmit}
              disabled={loading || !details.scheduledFor || !details.scheduledTime}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? 'Scheduling...' : 'Schedule Inspection'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}