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
  Building,
  CreditCard,
  Users,
  Globe
} from 'lucide-react';

interface CompanyVerificationFormProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

interface CompanyVerificationData {
  companyName: string;
  cacNumber: string;
  tinNumber: string;
  website: string;
  businessAddress: string;
  authorizedSignatory: {
    name: string;
    position: string;
    phone: string;
    email: string;
    nin: string;
  };
  documents: {
    cacCertificate?: File;
    memart?: File;
    taxClearance?: File;
    proofOfAddress?: File;
    directorId?: File;
  };
}

export function CompanyVerificationForm({ trigger, onSuccess }: CompanyVerificationFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CompanyVerificationData>({
    companyName: '',
    cacNumber: '',
    tinNumber: '',
    website: '',
    businessAddress: '',
    authorizedSignatory: {
      name: '',
      position: '',
      phone: '',
      email: '',
      nin: ''
    },
    documents: {}
  });

  const steps = [
    {
      id: 1,
      title: 'Company Details',
      description: 'Basic company information',
      icon: Building
    },
    {
      id: 2,
      title: 'Authorized Signatory',
      description: 'Company representative details',
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
      formData.append('companyName', data.companyName);
      formData.append('cacNumber', data.cacNumber);
      formData.append('tinNumber', data.tinNumber);
      formData.append('website', data.website);
      formData.append('businessAddress', data.businessAddress);
      formData.append('authorizedSignatory', JSON.stringify(data.authorizedSignatory));
      
      // Add files if they exist
      Object.entries(data.documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      // Note: This endpoint doesn't exist yet - needs backend implementation
      const response = await fetch('/api/verification/company', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Company verification submitted successfully! We will review your documents within 3-5 business days.');
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
      companyName: '',
      cacNumber: '',
      tinNumber: '',
      website: '',
      businessAddress: '',
      authorizedSignatory: {
        name: '',
        position: '',
        phone: '',
        email: '',
        nin: ''
      },
      documents: {}
    });
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
        return data.companyName && data.cacNumber && data.businessAddress;
      case 2:
        return data.authorizedSignatory.name && 
               data.authorizedSignatory.position && 
               data.authorizedSignatory.phone && 
               data.authorizedSignatory.email &&
               data.authorizedSignatory.nin.length === 11;
      case 3:
        return data.documents.cacCertificate && data.documents.memart;
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
            Company Verification Process
          </DialogTitle>
          <DialogDescription>
            Verify your company to access enterprise features and build trust with clients
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

        {/* Step 1: Company Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Company Registration Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Company must be registered with Corporate Affairs Commission (CAC)</li>
                <li>• Tax Identification Number (TIN) is required</li>
                <li>• All information must match your CAC registration exactly</li>
                <li>• Company must be in good standing with relevant authorities</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Registered Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="ABC Real Estate Limited"
                  value={data.companyName}
                  onChange={(e) => setData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Enter the exact name as registered with CAC
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cacNumber">CAC Registration Number</Label>
                  <Input
                    id="cacNumber"
                    placeholder="RC1234567"
                    value={data.cacNumber}
                    onChange={(e) => setData(prev => ({ ...prev, cacNumber: e.target.value.toUpperCase() }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tinNumber">Tax Identification Number (TIN)</Label>
                  <Input
                    id="tinNumber"
                    placeholder="12345678-0001"
                    value={data.tinNumber}
                    onChange={(e) => setData(prev => ({ ...prev, tinNumber: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Company Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="https://www.yourcompany.com"
                  value={data.website}
                  onChange={(e) => setData(prev => ({ ...prev, website: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="businessAddress">Registered Business Address</Label>
                <textarea
                  id="businessAddress"
                  placeholder="Full business address as registered with CAC including city and state"
                  value={data.businessAddress}
                  onChange={(e) => setData(prev => ({ ...prev, businessAddress: e.target.value }))}
                  className="w-full p-2 border rounded-md mt-1 h-20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Authorized Signatory */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Authorized Signatory</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Must be a director or authorized representative of the company</li>
                <li>• Should have signing authority for company documents</li>
                <li>• Will be the primary contact for verification matters</li>
                <li>• NIN is required for identity verification</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signatoryName">Full Name</Label>
                  <Input
                    id="signatoryName"
                    placeholder="John Doe"
                    value={data.authorizedSignatory.name}
                    onChange={(e) => setData(prev => ({ 
                      ...prev, 
                      authorizedSignatory: { ...prev.authorizedSignatory, name: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="signatoryPosition">Position/Title</Label>
                  <select
                    id="signatoryPosition"
                    value={data.authorizedSignatory.position}
                    onChange={(e) => setData(prev => ({ 
                      ...prev, 
                      authorizedSignatory: { ...prev.authorizedSignatory, position: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="">Select position</option>
                    <option value="Managing Director">Managing Director</option>
                    <option value="Executive Director">Executive Director</option>
                    <option value="Director">Director</option>
                    <option value="Company Secretary">Company Secretary</option>
                    <option value="Authorized Representative">Authorized Representative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signatoryPhone">Phone Number</Label>
                  <Input
                    id="signatoryPhone"
                    placeholder="+234 123 456 7890"
                    value={data.authorizedSignatory.phone}
                    onChange={(e) => setData(prev => ({ 
                      ...prev, 
                      authorizedSignatory: { ...prev.authorizedSignatory, phone: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="signatoryEmail">Email Address</Label>
                  <Input
                    id="signatoryEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={data.authorizedSignatory.email}
                    onChange={(e) => setData(prev => ({ 
                      ...prev, 
                      authorizedSignatory: { ...prev.authorizedSignatory, email: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signatoryNin">National Identification Number (NIN)</Label>
                <Input
                  id="signatoryNin"
                  placeholder="12345678901"
                  maxLength={11}
                  value={data.authorizedSignatory.nin}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    authorizedSignatory: { ...prev.authorizedSignatory, nin: e.target.value.replace(/\D/g, '') }
                  }))}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  11-digit NIN • {data.authorizedSignatory.nin.length}/11 characters
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> The authorized signatory may be contacted directly for verification 
                and will receive all communication regarding this company&apos;s verification status.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Required Documents</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All documents must be current and valid</li>
                <li>• Documents should be clear and readable</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Accepted formats: JPG, PNG, PDF</li>
              </ul>
            </div>

            <div className="grid gap-6">
              {/* CAC Certificate */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Certificate of Incorporation *
                  </CardTitle>
                  <CardDescription>
                    CAC Certificate of Incorporation or Company Registration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.cacCertificate ? data.documents.cacCertificate.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('cacCertificate', file);
                      }}
                      className="hidden"
                      id="cacCertificate"
                    />
                    <label htmlFor="cacCertificate">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* MEMART */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Memorandum & Articles of Association *
                  </CardTitle>
                  <CardDescription>
                    Company MEMART from CAC
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.memart ? data.documents.memart.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('memart', file);
                      }}
                      className="hidden"
                      id="memart"
                    />
                    <label htmlFor="memart">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Clearance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Tax Clearance Certificate (Optional)
                  </CardTitle>
                  <CardDescription>
                    Current tax clearance certificate for faster verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.taxClearance ? data.documents.taxClearance.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('taxClearance', file);
                      }}
                      className="hidden"
                      id="taxClearance"
                    />
                    <label htmlFor="taxClearance">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Proof of Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Proof of Business Address (Optional)
                  </CardTitle>
                  <CardDescription>
                    Utility bill or lease agreement for business address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.proofOfAddress ? data.documents.proofOfAddress.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('proofOfAddress', file);
                      }}
                      className="hidden"
                      id="proofOfAddress"
                    />
                    <label htmlFor="proofOfAddress">
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Director ID */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Director&apos;s ID (Optional)
                  </CardTitle>
                  <CardDescription>
                    ID card of the authorized signatory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-600 mb-2">
                      {data.documents.directorId ? data.documents.directorId.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('directorId', file);
                      }}
                      className="hidden"
                      id="directorId"
                    />
                    <label htmlFor="directorId">
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

            {/* Review Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Name:</span>
                  <span className="font-medium">{data.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CAC Number:</span>
                  <span className="font-mono">{data.cacNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TIN:</span>
                  <span className="font-mono">{data.tinNumber}</span>
                </div>
                {data.website && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Website:</span>
                    <span className="text-blue-600">{data.website}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Signatory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Authorized Signatory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{data.authorizedSignatory.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span>{data.authorizedSignatory.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span>{data.authorizedSignatory.phone} • {data.authorizedSignatory.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NIN:</span>
                  <span className="font-mono">***-***-{data.authorizedSignatory.nin.slice(-4)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Review Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">CAC Certificate:</span>
                  <Badge variant={data.documents.cacCertificate ? 'default' : 'secondary'}>
                    {data.documents.cacCertificate ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">MEMART:</span>
                  <Badge variant={data.documents.memart ? 'default' : 'secondary'}>
                    {data.documents.memart ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax Clearance:</span>
                  <Badge variant={data.documents.taxClearance ? 'default' : 'secondary'}>
                    {data.documents.taxClearance ? 'Uploaded' : 'Optional'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Proof of Address:</span>
                  <Badge variant={data.documents.proofOfAddress ? 'default' : 'secondary'}>
                    {data.documents.proofOfAddress ? 'Uploaded' : 'Optional'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Director&apos;s ID:</span>
                  <Badge variant={data.documents.directorId ? 'default' : 'secondary'}>
                    {data.documents.directorId ? 'Uploaded' : 'Optional'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Your company documents will be reviewed within 3-5 business days</li>
                <li>• We may contact the authorized signatory for additional information</li>
                <li>• Once approved, your company will receive a verified status</li>
                <li>• You&apos;ll gain access to enterprise features and custom subdomain</li>
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