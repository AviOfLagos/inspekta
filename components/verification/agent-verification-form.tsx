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
  Shield,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  CreditCard,
  Users
} from 'lucide-react';

interface AgentVerificationFormProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

interface VerificationData {
  nin: string;
  bvn: string;
  guarantors: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
    address: string;
  }[];
  documents: {
    idCard?: File;
    utilityBill?: File;
    bankStatement?: File;
  };
}

export function AgentVerificationForm({ trigger, onSuccess }: AgentVerificationFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<VerificationData>({
    nin: '',
    bvn: '',
    guarantors: [
      { name: '', phone: '', email: '', relationship: '', address: '' },
      { name: '', phone: '', email: '', relationship: '', address: '' }
    ],
    documents: {}
  });

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'NIN and BVN verification',
      icon: User
    },
    {
      id: 2,
      title: 'Guarantors',
      description: 'Two guarantor references',
      icon: Users
    },
    {
      id: 3,
      title: 'Documents',
      description: 'Upload required documents',
      icon: FileText
    },
    {
      id: 4,
      title: 'Review & Submit',
      description: 'Confirm your information',
      icon: CheckCircle
    }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('nin', data.nin);
      formData.append('bvn', data.bvn);
      formData.append('guarantors', JSON.stringify(data.guarantors));
      
      // Add files if they exist
      if (data.documents.idCard) {
        formData.append('idCard', data.documents.idCard);
      }
      if (data.documents.utilityBill) {
        formData.append('utilityBill', data.documents.utilityBill);
      }
      if (data.documents.bankStatement) {
        formData.append('bankStatement', data.documents.bankStatement);
      }

      // Note: This endpoint doesn't exist yet - needs backend implementation
      const response = await fetch('/api/verification/agent', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Verification submitted successfully! We will review your documents within 2-3 business days.');
        setOpen(false);
        onSuccess?.();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Verification failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setData({
      nin: '',
      bvn: '',
      guarantors: [
        { name: '', phone: '', email: '', relationship: '', address: '' },
        { name: '', phone: '', email: '', relationship: '', address: '' }
      ],
      documents: {}
    });
  };

  const updateGuarantor = (index: number, field: string, value: string) => {
    const newGuarantors = [...data.guarantors];
    newGuarantors[index] = { ...newGuarantors[index], [field]: value };
    setData(prev => ({ ...prev, guarantors: newGuarantors }));
  };

  const handleFileUpload = (field: string, file: File) => {
    setData(prev => ({
      ...prev,
      documents: { ...prev.documents, [field]: file }
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.nin.length === 11 && data.bvn.length === 11;
      case 2:
        return data.guarantors.every(g => g.name && g.phone && g.email && g.relationship);
      case 3:
        return data.documents.idCard && data.documents.utilityBill;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Agent Verification Process
          </DialogTitle>
          <DialogDescription>
            Complete your verification to build trust with clients and access premium features
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-primary border-primary text-white' :
                  'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Why do we need this?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• NIN (National Identification Number) verifies your identity</li>
                <li>• BVN (Bank Verification Number) confirms your banking details</li>
                <li>• This information is encrypted and securely stored</li>
                <li>• Required by Nigerian real estate regulations</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <Input
                  id="nin"
                  placeholder="12345678901"
                  maxLength={11}
                  value={data.nin}
                  onChange={(e) => setData(prev => ({ ...prev, nin: e.target.value.replace(/\D/g, '') }))}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  11-digit number • {data.nin.length}/11 characters
                </div>
              </div>
              
              <div>
                <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
                <Input
                  id="bvn"
                  placeholder="12345678901"
                  maxLength={11}
                  value={data.bvn}
                  onChange={(e) => setData(prev => ({ ...prev, bvn: e.target.value.replace(/\D/g, '') }))}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  11-digit number • {data.bvn.length}/11 characters
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> Ensure your NIN and BVN information matches your government records exactly. 
                Any mismatch will result in verification failure.
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guarantors */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Guarantor Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Must be Nigerian citizens with valid identification</li>
                <li>• Should have known you for at least 2 years</li>
                <li>• Cannot be immediate family members</li>
                <li>• Must be reachable for verification calls</li>
              </ul>
            </div>

            {data.guarantors.map((guarantor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">Guarantor {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`guarantor-${index}-name`}>Full Name</Label>
                      <Input
                        id={`guarantor-${index}-name`}
                        placeholder="John Doe"
                        value={guarantor.name}
                        onChange={(e) => updateGuarantor(index, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guarantor-${index}-phone`}>Phone Number</Label>
                      <Input
                        id={`guarantor-${index}-phone`}
                        placeholder="+234 123 456 7890"
                        value={guarantor.phone}
                        onChange={(e) => updateGuarantor(index, 'phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`guarantor-${index}-email`}>Email Address</Label>
                      <Input
                        id={`guarantor-${index}-email`}
                        type="email"
                        placeholder="john@example.com"
                        value={guarantor.email}
                        onChange={(e) => updateGuarantor(index, 'email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guarantor-${index}-relationship`}>Relationship</Label>
                      <select
                        id={`guarantor-${index}-relationship`}
                        value={guarantor.relationship}
                        onChange={(e) => updateGuarantor(index, 'relationship', e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="">Select relationship</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Business Partner">Business Partner</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Former Employer">Former Employer</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`guarantor-${index}-address`}>Home Address</Label>
                    <textarea
                      id={`guarantor-${index}-address`}
                      placeholder="Full residential address including city and state"
                      value={guarantor.address}
                      onChange={(e) => updateGuarantor(index, 'address', e.target.value)}
                      className="w-full p-2 border rounded-md mt-1 h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Required Documents</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All documents must be clear and readable</li>
                <li>• Maximum file size: 5MB per document</li>
                <li>• Accepted formats: JPG, PNG, PDF</li>
                <li>• Documents must be current (not expired)</li>
              </ul>
            </div>

            <div className="grid gap-6">
              {/* ID Card Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Government-Issued ID Card *
                  </CardTitle>
                  <CardDescription>
                    Driver&apos;s License, National ID Card, or International Passport
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.idCard ? data.documents.idCard.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('idCard', file);
                      }}
                      className="hidden"
                      id="idCard"
                    />
                    <label htmlFor="idCard">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Utility Bill Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Utility Bill *
                  </CardTitle>
                  <CardDescription>
                    Recent electricity, water, or gas bill (not older than 3 months)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.utilityBill ? data.documents.utilityBill.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('utilityBill', file);
                      }}
                      className="hidden"
                      id="utilityBill"
                    />
                    <label htmlFor="utilityBill">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Statement Upload (Optional) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Bank Statement (Optional)
                  </CardTitle>
                  <CardDescription>
                    Recent bank statement for faster verification (not older than 3 months)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.bankStatement ? data.documents.bankStatement.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('bankStatement', file);
                      }}
                      className="hidden"
                      id="bankStatement"
                    />
                    <label htmlFor="bankStatement">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Ready to Submit</h4>
              <p className="text-sm text-green-800">
                Please review your information below. Once submitted, you cannot modify your verification details.
              </p>
            </div>

            {/* Review Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">NIN:</span>
                  <span className="font-mono">***-***-{data.nin.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BVN:</span>
                  <span className="font-mono">***-***-{data.bvn.slice(-4)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Review Guarantors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Guarantors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.guarantors.map((guarantor, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{guarantor.name}</div>
                    <div className="text-sm text-gray-600">{guarantor.relationship}</div>
                    <div className="text-sm text-gray-600">{guarantor.phone} • {guarantor.email}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Review Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ID Card:</span>
                  <Badge variant={data.documents.idCard ? 'default' : 'secondary'}>
                    {data.documents.idCard ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Utility Bill:</span>
                  <Badge variant={data.documents.utilityBill ? 'default' : 'secondary'}>
                    {data.documents.utilityBill ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bank Statement:</span>
                  <Badge variant={data.documents.bankStatement ? 'default' : 'secondary'}>
                    {data.documents.bankStatement ? 'Uploaded' : 'Optional'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Your documents will be reviewed within 2-3 business days</li>
                <li>• We may contact your guarantors for verification</li>
                <li>• You&apos;ll receive email updates on your verification status</li>
                <li>• Once approved, you&apos;ll get a verified badge on your profile</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={() => {
              if (currentStep === 1) {
                setOpen(false);
              } else {
                setCurrentStep(prev => prev - 1);
              }
            }}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          {currentStep < 4 ? (
            <Button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceedToNext()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit Verification'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}