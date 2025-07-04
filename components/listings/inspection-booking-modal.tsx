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
  CheckCircle,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface InspectionBookingModalProps {
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
  specialRequests?: string;
}

export function InspectionBookingModal({ 
  propertyId, 
  propertyTitle, 
  propertyLocation, 
  trigger 
}: InspectionBookingModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'schedule' | 'payment' | 'confirmation'>('select');
  const [selectedType, setSelectedType] = useState<InspectionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [details, setDetails] = useState<InspectionDetails>({
    type: 'virtual',
    scheduledFor: '',
    scheduledTime: '',
    maxParticipants: 5,
  });

  const inspectionOptions = [
    {
      type: 'virtual' as InspectionType,
      title: 'Virtual Inspection',
      description: 'Live video tour via Google Meet with professional inspector',
      price: 15000,
      duration: '30-45 minutes',
      icon: Video,
      features: [
        'Professional inspector guide',
        'Live interaction and Q&A',
        'Detailed video recording',
        'Written inspection report',
        'Up to 10 participants'
      ],
      badge: 'Most Popular'
    },
    {
      type: 'physical' as InspectionType,
      title: 'Physical Inspection',
      description: 'In-person property visit with certified inspector',
      price: 25000,
      duration: '1-2 hours',
      icon: MapPin,
      features: [
        'Certified inspector visit',
        'Detailed physical assessment',
        'Photo documentation',
        'Comprehensive written report',
        'Structural evaluation'
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleTypeSelect = (type: InspectionType) => {
    setSelectedType(type);
    setDetails(prev => ({ ...prev, type }));
    setStep('schedule');
  };

  const handleScheduleSubmit = () => {
    if (!details.scheduledFor || !details.scheduledTime) {
      alert('Please select date and time');
      return;
    }
    setStep('payment');
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          type: details.type.toUpperCase(), // Convert to match API enum
          scheduledAt: `${details.scheduledFor}T${details.scheduledTime}:00.000Z`,
          notes: details.specialRequests,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingResponse(data);
        setStep('confirmation');
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.error || error.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book inspection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedType(null);
    setBookingResponse(null);
    setDetails({
      type: 'virtual',
      scheduledFor: '',
      scheduledTime: '',
      maxParticipants: 5,
    });
  };

  const selectedOption = inspectionOptions.find(opt => opt.type === selectedType);

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Property Inspection
          </DialogTitle>
          <DialogDescription>
            {propertyTitle} • {propertyLocation}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Choose your preferred inspection method:
            </div>
            
            {inspectionOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.type}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => handleTypeSelect(option.type)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Icon className="w-6 h-6 mr-3 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(option.price)}
                        </div>
                        <div className="text-sm text-gray-500">{option.duration}</div>
                        {option.badge && (
                          <Badge className="mt-1">{option.badge}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {step === 'schedule' && selectedOption && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setStep('select')}
                className="flex items-center"
              >
                ← Back to options
              </Button>
              <Badge variant="outline">{selectedOption.title}</Badge>
            </div>

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

            {details.type === 'virtual' && (
              <div>
                <Label htmlFor="participants">Maximum Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  max="10"
                  value={details.maxParticipants}
                  onChange={(e) => setDetails(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Invite family or friends to join the virtual tour
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="requests">Special Requests (Optional)</Label>
              <Input
                id="requests"
                placeholder="Any specific areas or concerns you'd like the inspector to focus on..."
                value={details.specialRequests || ''}
                onChange={(e) => setDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You&apos;ll receive WhatsApp and email confirmation</li>
                <li>• Inspector will be assigned based on location</li>
                {details.type === 'virtual' && <li>• Google Meet link will be shared 1 hour before</li>}
                <li>• Detailed report delivered within 24 hours</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button onClick={handleScheduleSubmit}>
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && selectedOption && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setStep('schedule')}
                className="flex items-center"
              >
                ← Back to schedule
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{selectedOption.title}</span>
                  <span className="font-semibold">{formatPrice(selectedOption.price)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(selectedOption.price)}</span>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                  <div className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a demo. Payment integration with Paystack/Flutterwave is not yet implemented.
                    The booking will be created as pending payment.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property</span>
                  <span className="font-medium">{propertyTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{selectedOption.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">
                    {new Date(`${details.scheduledFor}T${details.scheduledTime}`).toLocaleString()}
                  </span>
                </div>
                {details.type === 'virtual' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">{details.maxParticipants}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('schedule')}>
                Back
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? 'Processing...' : 'Confirm & Book'}
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Inspection Booked Successfully!
              </h3>
              <p className="text-gray-600">
                Your {selectedOption?.title.toLowerCase()} has been scheduled.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-mono">#{bookingResponse?.inspection?.id?.slice(-8).toUpperCase() || 'PENDING'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span>{new Date(`${details.scheduledFor}T${details.scheduledTime}`).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span>{selectedOption?.title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Confirmation sent to your email and WhatsApp</li>
                <li>✓ Available inspectors notified of this job</li>
                <li>• Inspector will be assigned within 2-4 hours</li>
                <li>• You'll receive inspector contact details 24h before</li>
                {details.type === 'virtual' && <li>• Google Meet link shared 1h before inspection</li>}
                {details.type === 'physical' && <li>• Inspector will contact you to confirm timing</li>}
                <li>• Detailed inspection report delivered within 24h</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.location.href = '/client'}
                className="flex-1"
              >
                View My Bookings
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}