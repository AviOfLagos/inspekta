'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/listings/listing-card';
import { CreateListingForm } from '@/components/listings/create-listing-form';
import { AgentScheduleInspectionModal } from '@/components/listings/agent-schedule-inspection';
import { AgentVerificationForm } from '@/components/verification/agent-verification-form';
import { SubscriptionStatus } from '@/components/subscriptions/subscription-status';
import { SubscriptionModal } from '@/components/subscriptions/subscription-modal';

import { 
  Plus, 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Users,
  User,
  Eye,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Crown
} from 'lucide-react';
import { Listing } from '@/types/listing';
import { DashboardTabs } from '@/components/ui/dashboard-tabs';

interface AgentInspection {
  id: string;
  property: {
    id: string;
    title: string;
    address: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
  };
  inspector: {
    name: string;
    rating: number;
  };
  type: 'VIRTUAL' | 'PHYSICAL';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: Date;
  cost: number;
}

interface ClientInquiry {
  id: string;
  property: {
    id: string;
    title: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
  };
  message: string;
  status: 'NEW' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'CLOSED';
  createdAt: Date;
}

const agentTabs = [
  { id: 'listings', label: 'My Listings', icon: Home },
  { id: 'create', label: 'Create Listing', icon: Plus },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'clients', label: 'Clients & Inspections', icon: Users },
  { id: 'subscription', label: 'Subscription', icon: Crown },
  { id: 'profile', label: 'My Profile', icon: User },
];

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [inspections, setInspections] = useState<AgentInspection[]>([]);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Demo agent ID - in real app, get from auth context
  const agentId = 'demo-agent-id';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/listings');
        if (response.ok) {
          const { listings } = await response.json();
          // In real app, filter by agent
          setListings(listings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }

      // Mock agent-specific data
      const mockInspections: AgentInspection[] = [
        {
          id: 'insp-1',
          property: {
            id: 'prop-1',
            title: 'Modern 3BR Apartment',
            address: '123 Victoria Island, Lagos'
          },
          client: {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+234 123 456 7890'
          },
          inspector: {
            name: 'David Wilson',
            rating: 4.8
          },
          type: 'PHYSICAL',
          status: 'SCHEDULED',
          scheduledAt: new Date('2024-01-25T14:00:00'),
          cost: 25000
        },
        {
          id: 'insp-2',
          property: {
            id: 'prop-2',
            title: 'Luxury Villa',
            address: '456 Ikoyi Road, Lagos'
          },
          client: {
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+234 987 654 3210'
          },
          inspector: {
            name: 'Alice Green',
            rating: 4.9
          },
          type: 'VIRTUAL',
          status: 'COMPLETED',
          scheduledAt: new Date('2024-01-20T10:00:00'),
          cost: 15000
        }
      ];

      const mockInquiries: ClientInquiry[] = [
        {
          id: 'inq-1',
          property: {
            id: 'prop-1',
            title: 'Modern 3BR Apartment'
          },
          client: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+234 555 0123'
          },
          message: 'Hi, I\'m interested in viewing this property. When would be a good time?',
          status: 'NEW',
          createdAt: new Date('2024-01-24T09:30:00')
        },
        {
          id: 'inq-2',
          property: {
            id: 'prop-3',
            title: 'Executive Office Space'
          },
          client: {
            name: 'Emma Wilson',
            email: 'emma@business.com',
            phone: '+234 555 0456'
          },
          message: 'Looking for office space for my startup. Can we schedule a viewing?',
          status: 'CONTACTED',
          createdAt: new Date('2024-01-23T14:15:00')
        }
      ];

      setInspections(mockInspections);
      setInquiries(mockInquiries);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleListingCreated = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
    setActiveTab('listings'); // Switch back to listings tab
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-primary';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NEW': return 'bg-orange-100 text-orange-800';
      case 'CONTACTED': return 'bg-blue-100 text-primary';
      case 'VIEWING_SCHEDULED': return 'bg-purple-100 text-purple-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleContactClient = (inquiry: ClientInquiry) => {
    console.log('Contacting client:', inquiry.client.email);
    // In real app, update inquiry status to CONTACTED
  };

  const totalEarnings = inspections
    .filter(insp => insp.status === 'COMPLETED')
    .reduce((sum, insp) => sum + (insp.cost * 0.3), 0); // Agent gets 30% commission

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Agent Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your listings, track clients, and grow your business
          </p>
        </div>

        {/* Navigation Tabs */}
        <DashboardTabs
          tabs={agentTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* My Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{listings.length}</div>
                  <p className="text-xs text-muted-foreground">Active properties</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inspections</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inspections.length}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Listings Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">My Listings ({listings.length})</h2>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Listing
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading listings...</div>
              ) : listings.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating your first property listing
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Listing
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onView={(id) => {
                        window.location.href = `/listings/${id}`;
                      }}
                      onScheduleInspection={(id) => {
                        window.location.href = `/listings/${id}`;
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Listing Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Property Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateListingForm
                  agentId={agentId}
                  onSuccess={handleListingCreated}
                  onCancel={() => setActiveTab('listings')}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inquiries.length}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-muted-foreground">Inquiry to viewing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-xs text-muted-foreground">To client inquiries</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Listings */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">{listing.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{Math.floor(Math.random() * 200) + 50} views</div>
                        <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 10) + 2} inquiries</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clients & Inspections Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-8">
            {/* Recent Inquiries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Client Inquiries ({inquiries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                      <p>No client inquiries yet</p>
                    </div>
                  ) : (
                    inquiries.map((inquiry) => (
                      <Card key={inquiry.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h3 className="font-semibold">{inquiry.client.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Interested in: {inquiry.property.title}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(inquiry.status)}>
                                  {inquiry.status}
                                </Badge>
                              </div>
                              
                              <p className="text-sm italic">&ldquo;{inquiry.message}&rdquo;</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                <span>{inquiry.client.email}</span>
                                <span>{inquiry.client.phone}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleContactClient(inquiry)}>
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="w-4 h-4 mr-1" />
                                Email
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Inspections */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scheduled Inspections ({inspections.length})</CardTitle>
                  {listings.length > 0 && (
                    <AgentScheduleInspectionModal
                      propertyId={listings[0]?.id || ''}
                      propertyTitle={listings[0]?.title || 'Select Property'}
                      propertyLocation={listings[0] ? `${listings[0].address}, ${listings[0].city}` : ''}
                      trigger={
                        <Button>
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule New Inspection
                        </Button>
                      }
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                      <p>No inspections scheduled</p>
                    </div>
                  ) : (
                    inspections.map((inspection) => (
                      <Card key={inspection.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h3 className="font-semibold">{inspection.property.title}</h3>
                                  <p className="text-sm text-muted-foreground">{inspection.property.address}</p>
                                </div>
                                <Badge className={getStatusColor(inspection.status)}>
                                  {inspection.status}
                                </Badge>
                                <Badge variant="outline">
                                  {inspection.type}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <div>
                                  <strong>Client:</strong> {inspection.client.name}
                                </div>
                                <div>
                                  <strong>Inspector:</strong> {inspection.inspector.name}
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                  {inspection.inspector.rating}
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(inspection.scheduledAt).toLocaleDateString()} at{' '}
                                  {new Date(inspection.scheduledAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                                <span className="font-medium text-green-600">
                                  Commission: {formatCurrency(inspection.cost * 0.3)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <SubscriptionStatus userRole="AGENT" />
          </div>
        )}

        {/* My Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Agent Profile
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
                        <Input defaultValue="Demo Agent" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input defaultValue="agent@example.com" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input defaultValue="+234 123 456 7890" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">License Number</label>
                        <Input defaultValue="RE-2024-001234" />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Years of Experience</label>
                        <Input defaultValue="5" type="number" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Specialization</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Residential Properties</option>
                          <option>Commercial Properties</option>
                          <option>Luxury Homes</option>
                          <option>Investment Properties</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Service Areas</label>
                        <Input defaultValue="Lagos, Abuja, Port Harcourt" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bio</label>
                        <textarea 
                          className="w-full p-2 border rounded-md h-20" 
                          defaultValue="Experienced real estate agent with a passion for helping clients find their dream properties."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Verification Status</h3>
                    <AgentVerificationForm
                      trigger={
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Update Verification
                        </Button>
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">ID Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">License Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Background Check</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        Your agent verification is complete and approved
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Verified agents receive priority listing placement and client trust badges
                    </p>
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