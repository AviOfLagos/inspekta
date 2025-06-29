'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Eye,
  Camera,
  FileText,
  Star,
  TrendingUp,
  Search,
  Plus,
  User,
  Home,
  Timer,
  Briefcase
} from 'lucide-react';
import { DashboardTabs } from '@/components/ui/dashboard-tabs';

interface InspectionJob {
  id: string;
  property: {
    id: string;
    title: string;
    address: string;
    city: string;
    state: string;
    type: string;
    price: number;
  };
  type: 'VIRTUAL' | 'PHYSICAL';
  scheduledAt: Date;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  client: {
    id: string;
    name: string;
    email: string;
  };
  agent: {
    id: string;
    name: string;
    email: string;
  };
  payment: {
    amount: number;
    status: 'PENDING' | 'PAID';
  };
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

const inspectorTabs = [
  { id: 'jobs', label: 'Available Jobs', icon: Briefcase },
  { id: 'inspections', label: 'My Inspections', icon: FileText },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'profile', label: 'My Profile', icon: User },
];

export default function InspectorDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [availableJobs, setAvailableJobs] = useState<InspectionJob[]>([]);
  const [myInspections, setMyInspections] = useState<InspectionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  // const [filterType, setFilterType] = useState('');

  // Demo inspector ID - in real app, get from auth context
  // const inspectorId = 'demo-inspector-id';

  useEffect(() => {
    // Simulate fetching inspection jobs
    const fetchJobs = async () => {
      // In a real app, this would be API calls
      const mockAvailableJobs: InspectionJob[] = [
        {
          id: 'job-1',
          property: {
            id: 'prop-1',
            title: 'Modern 3BR Apartment',
            address: '123 Victoria Island',
            city: 'Lagos',
            state: 'Lagos',
            type: 'APARTMENT',
            price: 45000000
          },
          type: 'PHYSICAL',
          scheduledAt: new Date('2024-01-20T10:00:00'),
          status: 'PENDING',
          client: { id: 'client-1', name: 'Sarah Johnson', email: 'sarah@example.com' },
          agent: { id: 'agent-1', name: 'John Doe', email: 'john@example.com' },
          payment: { amount: 25000, status: 'PENDING' },
          urgency: 'HIGH'
        },
        {
          id: 'job-2',
          property: {
            id: 'prop-2',
            title: 'Luxury Villa',
            address: '456 Ikoyi Road',
            city: 'Lagos',
            state: 'Lagos',
            type: 'HOUSE',
            price: 120000000
          },
          type: 'VIRTUAL',
          scheduledAt: new Date('2024-01-21T14:00:00'),
          status: 'PENDING',
          client: { id: 'client-2', name: 'Michael Chen', email: 'michael@example.com' },
          agent: { id: 'agent-2', name: 'Jane Smith', email: 'jane@example.com' },
          payment: { amount: 15000, status: 'PENDING' },
          urgency: 'MEDIUM'
        }
      ];

      const mockMyInspections: InspectionJob[] = [
        {
          id: 'insp-1',
          property: {
            id: 'prop-3',
            title: 'Office Complex',
            address: '789 Business District',
            city: 'Lagos',
            state: 'Lagos',
            type: 'OFFICE',
            price: 80000000
          },
          type: 'PHYSICAL',
          scheduledAt: new Date('2024-01-18T09:00:00'),
          status: 'COMPLETED',
          client: { id: 'client-3', name: 'Corporate Ltd', email: 'info@corporate.com' },
          agent: { id: 'agent-3', name: 'Bob Wilson', email: 'bob@example.com' },
          payment: { amount: 30000, status: 'PAID' },
          urgency: 'LOW'
        },
        {
          id: 'insp-2',
          property: {
            id: 'prop-4',
            title: 'Family Home',
            address: '321 Suburban Area',
            city: 'Lagos',
            state: 'Lagos',
            type: 'HOUSE',
            price: 35000000
          },
          type: 'VIRTUAL',
          scheduledAt: new Date('2024-01-19T16:00:00'),
          status: 'IN_PROGRESS',
          client: { id: 'client-4', name: 'David Brown', email: 'david@example.com' },
          agent: { id: 'agent-4', name: 'Alice Green', email: 'alice@example.com' },
          payment: { amount: 15000, status: 'PENDING' },
          urgency: 'MEDIUM'
        }
      ];

      setAvailableJobs(mockAvailableJobs);
      setMyInspections(mockMyInspections);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-primary';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'VIRTUAL' ? <Camera className="w-4 h-4" /> : <Eye className="w-4 h-4" />;
  };

  const handleAcceptJob = (jobId: string) => {
    console.log('Accepting job:', jobId);
    // In real app, make API call to accept job
  };

  const handleCompleteInspection = (inspectionId: string) => {
    console.log('Completing inspection:', inspectionId);
    // In real app, make API call to complete inspection
  };

  const totalEarnings = myInspections
    .filter(insp => insp.payment.status === 'PAID')
    .reduce((sum, insp) => sum + insp.payment.amount, 0);

  const pendingEarnings = myInspections
    .filter(insp => insp.payment.status === 'PENDING')
    .reduce((sum, insp) => sum + insp.payment.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Inspector Dashboard</h1>
          <p className="text-muted-foreground">
            Manage inspection jobs, track earnings, and maintain your professional profile
          </p>
        </div>

        {/* Navigation Tabs */}
        <DashboardTabs
          tabs={inspectorTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Available Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableJobs.length}</div>
                  <p className="text-xs text-muted-foreground">Pending assignments</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Inspections</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myInspections.length}</div>
                  <p className="text-xs text-muted-foreground">Total assigned</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings (Paid)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(pendingEarnings)}</div>
                  <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </CardContent>
              </Card>
            </div>

            {/* Jobs List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Available Jobs ({availableJobs.length})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-48"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading jobs...</div>
                ) : availableJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Home className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <p>No available jobs at the moment</p>
                  </div>
                ) : (
                  availableJobs.map((job) => (
                    <Card key={job.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{job.property.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.property.address}, {job.property.city}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {formatPrice(job.payment.amount)}
                              </div>
                              <Badge className={getUrgencyColor(job.urgency)}>
                                {job.urgency}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="flex items-center">
                                {getTypeIcon(job.type)}
                                <span className="ml-1">{job.type}</span>
                              </Badge>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(job.scheduledAt).toLocaleDateString()} at{' '}
                                {new Date(job.scheduledAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm">
                              <div><strong>Client:</strong> {job.client.name}</div>
                              <div><strong>Agent:</strong> {job.agent.name}</div>
                            </div>
                            <Button onClick={() => handleAcceptJob(job.id)}>
                              Accept Job
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    My Inspections ({myInspections.length})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="">All Status</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading inspections...</div>
                ) : myInspections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <p>No inspections assigned yet</p>
                  </div>
                ) : (
                  myInspections.map((inspection) => (
                    <Card key={inspection.id} className={`border-l-4 ${
                      inspection.status === 'COMPLETED' ? 'border-l-green-500' :
                      inspection.status === 'IN_PROGRESS' ? 'border-l-purple-500' :
                      'border-l-primary'
                    }`}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{inspection.property.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                {inspection.property.address}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(inspection.status)}>
                                {inspection.status}
                              </Badge>
                              <div className="text-sm mt-1">
                                <Badge variant={inspection.payment.status === 'PAID' ? 'default' : 'secondary'}>
                                  {formatPrice(inspection.payment.amount)} - {inspection.payment.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="flex items-center">
                              {getTypeIcon(inspection.type)}
                              <span className="ml-1">{inspection.type}</span>
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(inspection.scheduledAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm">
                              <div><strong>Client:</strong> {inspection.client.name}</div>
                            </div>
                            <div className="space-x-2">
                              {inspection.status === 'IN_PROGRESS' && (
                                <Button 
                                  onClick={() => handleCompleteInspection(inspection.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Complete
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            {/* Earnings Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(totalEarnings + pendingEarnings)}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">Received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(pendingEarnings)}</div>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myInspections.map((inspection) => (
                    <div key={inspection.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{inspection.property.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(inspection.scheduledAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatPrice(inspection.payment.amount)}</div>
                        <Badge className={inspection.payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {inspection.payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {myInspections.filter(i => i.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-600">Completed Inspections</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">On-Time Rate</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{formatPrice(totalEarnings + pendingEarnings)}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
          </div>
        )}

        {/* My Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Inspector Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <Input defaultValue="Demo Inspector" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input defaultValue="inspector@example.com" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input defaultValue="+234 123 456 7890" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">License Number</label>
                        <Input defaultValue="INS-2024-001234" />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Years of Experience</label>
                        <Input defaultValue="8" type="number" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Specialization</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Residential Properties</option>
                          <option>Commercial Properties</option>
                          <option>Industrial Buildings</option>
                          <option>Virtual Inspections</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Service Radius (km)</label>
                        <Input defaultValue="50" type="number" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bio</label>
                        <textarea 
                          className="w-full p-2 border rounded-md h-20" 
                          defaultValue="Certified property inspector with extensive experience in residential and commercial property assessments."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Certifications & Verifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">ID Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Inspector License</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Background Check</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Insurance Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Equipment Certified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Continuing Education</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}