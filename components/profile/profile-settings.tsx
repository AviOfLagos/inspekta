'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProfileCompletion, getProfileFields } from '@/components/ui/profile-completion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Home, 
  Building,
  Save,
  Camera,
  Shield,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfileSettingsProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    verificationStatus: string;
    onboardingCompleted: boolean;
  };
  profile: any; // Role-specific profile data
  onSave: (data: any) => Promise<void>;
  onImageUpdate: (imageUrl: string) => Promise<void>;
}

interface FormData {
  name: string;
  phone: string;
  image: string;
  [key: string]: any; // For role-specific fields
}

export function ProfileSettings({ user, profile, onSave, onImageUpdate }: ProfileSettingsProps) {
  const [formData, setFormData] = useState<FormData>({
    name: user.name || '',
    phone: user.phone || '',
    image: user.image || '',
    // Role-specific initialization
    ...(user.role === 'client' && {
      preferredLocation: profile?.preferredLocation || '',
      budgetMin: profile?.budgetMin || '',
      budgetMax: profile?.budgetMax || '',
      propertyType: profile?.propertyType || '',
      bedrooms: profile?.bedrooms || '',
      state: profile?.state || ''
    }),
    ...(user.role === 'agent' && {
      bio: profile?.bio || '',
      experience: profile?.experience || '',
      specialization: profile?.specialization || '',
      guarantor1Name: profile?.guarantor1Name || '',
      guarantor1Phone: profile?.guarantor1Phone || '',
      guarantor2Name: profile?.guarantor2Name || '',
      guarantor2Phone: profile?.guarantor2Phone || ''
    }),
    ...(user.role === 'inspector' && {
      location: profile?.location || '',
      availabilityRadius: profile?.availabilityRadius || 50
    })
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to cloud storage and get URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      await onImageUpdate(imageUrl);
    }
  };

  // Get completion status
  const profileFields = getProfileFields(user.role, user, profile);

  const getVerificationBadge = () => {
    switch (user.verificationStatus) {
      case 'VERIFIED':
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
      default:
        return <Badge variant="outline" className="border-red-500 text-red-600">Unverified</Badge>;
    }
  };

  const renderRoleSpecificFields = () => {
    switch (user.role) {
      case 'client':
        return (
          <>
            {/* Property Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Property Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
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
                    <label className="block text-sm font-medium mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Preferred Location
                    </label>
                    <Input
                      value={formData.preferredLocation}
                      onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                      placeholder="e.g., Victoria Island, Ikoyi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Min Budget (₦)
                    </label>
                    <Input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                      placeholder="5,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Budget (₦)</label>
                    <Input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                      placeholder="50,000,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Any type</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="HOUSE">House</option>
                      <option value="DUPLEX">Duplex</option>
                      <option value="OFFICE">Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
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
              </CardContent>
            </Card>
          </>
        );

      case 'agent':
        return (
          <>
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell clients about your experience and expertise..."
                    className="w-full p-2 border rounded-md min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <Input
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialization</label>
                    <Input
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      placeholder="e.g., Luxury Properties, Commercial"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Guarantor Information
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  >
                    {showSensitiveInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showSensitiveInfo && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Guarantor 1 Name</label>
                        <Input
                          value={formData.guarantor1Name}
                          onChange={(e) => handleInputChange('guarantor1Name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Guarantor 1 Phone</label>
                        <Input
                          value={formData.guarantor1Phone}
                          onChange={(e) => handleInputChange('guarantor1Phone', e.target.value)}
                          placeholder="+234 xxx xxx xxxx"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Guarantor 2 Name</label>
                        <Input
                          value={formData.guarantor2Name}
                          onChange={(e) => handleInputChange('guarantor2Name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Guarantor 2 Phone</label>
                        <Input
                          value={formData.guarantor2Phone}
                          onChange={(e) => handleInputChange('guarantor2Phone', e.target.value)}
                          placeholder="+234 xxx xxx xxxx"
                        />
                      </div>
                    </div>
                  </>
                )}
                {!showSensitiveInfo && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4" />
                    <p>Guarantor information is hidden for privacy</p>
                    <p className="text-sm">Click the eye icon to view/edit</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        );

      case 'inspector':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Lagos, Abuja"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Radius (km)
                </label>
                <Input
                  type="number"
                  value={formData.availabilityRadius}
                  onChange={(e) => handleInputChange('availabilityRadius', Number(e.target.value))}
                  placeholder="50"
                  min="1"
                  max="200"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum distance you're willing to travel for inspections
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Status */}
      <ProfileCompletion
        userRole={user.role as any}
        fields={profileFields}
        showEditButton={false}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
              {getVerificationBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <Image 
                      src={formData.image} 
                      alt="Profile" 
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-photo"
                />
                <label 
                  htmlFor="profile-photo"
                  className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <Camera className="w-3 h-3" />
                </label>
              </div>
              <div>
                <h3 className="font-medium">Profile Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo to help clients recognize you
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 xxx xxx xxxx"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <Input
                value={user.email}
                disabled
                className="bg-gray-50 text-gray-500"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific fields */}
        {renderRoleSpecificFields()}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">WhatsApp Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates on WhatsApp</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}