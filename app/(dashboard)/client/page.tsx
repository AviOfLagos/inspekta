'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListingCard } from '@/components/listings/listing-card';
import { SubscriptionStatus } from '@/components/subscriptions/subscription-status';
import { ProfileSettings } from '@/components/profile/profile-settings';
import { ProfileCompletion, getProfileFields } from '@/components/ui/profile-completion';
import { InspectionList } from '@/components/inspections/inspection-list';
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
            {/* Profile Completion Banner */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="md:col-span-1">
                <ProfileCompletion
                  userRole="client"
                  fields={getProfileFields('client', user, dashboardQuery.data?.clientProfile)}
                  onEditClick={() => setActiveTab('profile')}
                />
              </div>
              
              {/* Stats Cards */}
              <div className="md:col-span-3 grid gap-6 md:grid-cols-3">
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
            <InspectionList userRole="CLIENT" />
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
            <ProfileSettings
              user={{
                id: user?.id || '',
                name: user?.name || null,
                email: user?.email || '',
                phone: user?.phone || null,
                image: user?.image || null,
                role: user?.role?.toLowerCase() || 'client',
                verificationStatus: 'PENDING', // Would come from user data
                onboardingCompleted: true // Would come from user data
              }}
              profile={dashboardQuery.data?.clientProfile}
              onSave={async (data) => {
                console.log('Saving profile data:', data);
                // Implement save logic here
              }}
              onImageUpdate={async (imageUrl) => {
                console.log('Updating profile image:', imageUrl);
                // Implement image update logic here
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}