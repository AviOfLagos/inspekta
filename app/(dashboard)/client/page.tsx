'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListingCard } from '@/components/listings/listing-card';
import { SubscriptionStatus } from '@/components/subscriptions/subscription-status';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Heart, 
  Home,
  User,
  Clock,
  Star,
  XCircle,
  Eye,
  Crown
} from 'lucide-react';
import { DashboardTabs } from '@/components/ui/dashboard-tabs';
import { useSession } from '@/hooks/use-auth';
import { useClientDashboard } from '@/hooks/use-dashboard';
import { useMarketplaceSearch, useListingActions, useSavedListings } from '@/hooks/use-listings';
import { Listing } from '@/types/listing';

interface ClientInspection {
  id: string;
  property: {
    id: string;
    title: string;
    address: string;
    image: string;
  };
  type: 'VIRTUAL' | 'PHYSICAL';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: Date;
  inspector: {
    name: string;
    rating: number;
  };
  cost: number;
}

interface SavedProperty extends Listing {
  savedAt?: Date;
  notes?: string;
}


const clientTabs = [
  { id: 'browse', label: 'Browse Properties', icon: Home },
  { id: 'inspections', label: 'My Inspections', icon: Calendar },
  { id: 'saved', label: 'Saved Properties', icon: Heart },
  { id: 'subscription', label: 'Subscription', icon: Crown },
  { id: 'profile', label: 'My Profile', icon: User },
];

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });

  // Get authenticated user
  const { data: user } = useSession();
  
  // Use React Query hooks for data fetching  
  const dashboardQuery = useClientDashboard(user?.id || '');
  const savedQuery = useSavedListings(user?.id || '');
  const { data: listingsData, isLoading: listingsLoading } = useMarketplaceSearch({
    search: searchTerm,
    type: filters.type as 'APARTMENT' | 'HOUSE' | 'DUPLEX' | 'OFFICE' | 'WAREHOUSE' | undefined,
    location: filters.location,
    minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
  });
  
  const { toggleSaved, isLoading: actionLoading } = useListingActions();

  // Extract data from hooks
  const listings = listingsData?.listings || [];
  const inspections = dashboardQuery.data?.scheduledInspections || [];
  const savedProperties: SavedProperty[] = (savedQuery.data || []) as unknown as SavedProperty[];
  const loading = dashboardQuery.isLoading || savedQuery.isLoading || listingsLoading;

  // Mock inspections for demo - in real app, would come from dashboard hook
  const mockInspections: ClientInspection[] = [
    {
      id: 'insp-1',
      property: {
        id: 'prop-1',
        title: 'Modern 3BR Apartment',
        address: '123 Victoria Island, Lagos',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
      },
      type: 'PHYSICAL',
      status: 'SCHEDULED',
      scheduledAt: new Date('2024-01-25T14:00:00'),
      inspector: { name: 'David Wilson', rating: 4.8 },
      cost: 25000
    },
    {
      id: 'insp-2',
      property: {
        id: 'prop-2',
        title: 'Luxury Villa',
        address: '456 Ikoyi Road, Lagos',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
      },
      type: 'VIRTUAL',
      status: 'COMPLETED',
      scheduledAt: new Date('2024-01-15T10:00:00'),
      inspector: { name: 'Sarah Johnson', rating: 4.9 },
      cost: 15000
    }
  ];

  // Search is now handled by the useMarketplaceSearch hook with debouncing

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically handled by useMarketplaceSearch hook
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const handleSaveProperty = (listingId: string) => {
  //   console.log('Saving property:', listingId);
  //   // In real app, make API call to save property
  // };

  const handleRemoveSaved = (listingId: string) => {
    toggleSaved(listingId, true); // true means it's currently saved, so unsave it
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>
          <p className="text-muted-foreground">
            Discover properties, manage inspections, and track your favorites
          </p>
        </div>

        {/* Navigation Tabs */}
        <DashboardTabs
          tabs={clientTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Browse Properties Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Properties</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{listings.length}</div>
                  <p className="text-xs text-muted-foreground">Active listings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Inspections</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inspections.length}</div>
                  <p className="text-xs text-muted-foreground">Total scheduled</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{savedProperties.length}</div>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by location..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Button type="submit">Search</Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Types</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="HOUSE">House</option>
                      <option value="DUPLEX">Duplex</option>
                      <option value="OFFICE">Office</option>
                      <option value="WAREHOUSE">Warehouse</option>
                    </select>

                    <Input
                      placeholder="Min Price"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />

                    <Input
                      placeholder="Max Price"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />

                    <Input
                      placeholder="Location (City/State)"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Listings Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Available Properties</h2>
                <div className="text-sm text-muted-foreground">
                  {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading properties...</div>
              ) : listings.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or check back later for new listings
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing as any}
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

        {/* My Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Inspections ({mockInspections.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading inspections...</div>
                  ) : mockInspections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No inspections scheduled</h3>
                      <p>Start browsing properties and schedule your first inspection</p>
                      <Button className="mt-4" onClick={() => setActiveTab('browse')}>
                        Browse Properties
                      </Button>
                    </div>
                  ) : (
                    mockInspections.map((inspection) => (
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
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(inspection.scheduledAt).toLocaleDateString()} at{' '}
                                  {new Date(inspection.scheduledAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                  {inspection.inspector.name} ({inspection.inspector.rating})
                                </div>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(inspection.cost)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              {inspection.status === 'SCHEDULED' && (
                                <Button variant="outline" size="sm">
                                  Reschedule
                                </Button>
                              )}
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

        {/* Saved Properties Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties ({savedProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading saved properties...</div>
                  ) : savedProperties.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No saved properties</h3>
                      <p>Save properties you&apos;re interested in for easy access later</p>
                      <Button className="mt-4" onClick={() => setActiveTab('browse')}>
                        Browse Properties
                      </Button>
                    </div>
                  ) : (
                    savedProperties.map((saved) => (
                      <Card key={saved.id} className="border-l-4 border-l-pink-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div>
                                <h3 className="font-semibold">{saved.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {saved.address}, {saved.city}
                                </p>
                              </div>
                              
                              {saved.notes && (
                                <p className="text-sm italic text-gray-600">
                                  &ldquo;{saved.notes}&rdquo;
                                </p>
                              )}

                              <div className="flex items-center space-x-4 text-sm">
                                {saved.savedAt && <span>Saved: {new Date(saved.savedAt).toLocaleDateString()}</span>}
                                <span className="font-medium text-primary">
                                  {formatCurrency(saved.price)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.href = `/listings/${saved.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Property
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveSaved(saved.id)}
                                disabled={actionLoading}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Remove
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
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <SubscriptionStatus userRole="CLIENT" />
          </div>
        )}

        {/* My Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Settings
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
                        <Input defaultValue="Demo Client" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input defaultValue="client@example.com" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input defaultValue="+234 123 456 7890" />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Property Preferences</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Preferred Location</label>
                        <Input defaultValue="Lagos, Nigeria" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Budget Range</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Min" defaultValue="5000000" />
                          <Input placeholder="Max" defaultValue="50000000" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Property Type</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Any</option>
                          <option>Apartment</option>
                          <option>House</option>
                          <option>Office</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications for new properties</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS alerts for inspection reminders</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly property digest</span>
                      <input type="checkbox" />
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