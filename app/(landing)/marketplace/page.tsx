'use client';

import { useState, useEffect, useCallback } from 'react';
import { LandingNav } from '@/components/navigation/landing-nav'; // Use LandingNav
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ListingCard } from '@/components/listings/listing-card';
import { Search, MapPin, SlidersHorizontal, Home, CheckSquare, CalendarCheck, DollarSign } from 'lucide-react'; // Added new icons
import { Listing } from '@/types/listing';

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
  });

  // Mock metrics data - replace with actual fetch later
  const mockMetrics = {
    totalListings: 1250,
    leasedHouses: 890,
    activeListings: 1100,
    ongoingInspections: 150,
  };

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('location', searchTerm);
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms); // Add bedrooms filter
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms); // Add bathrooms filter

      const response = await fetch(`/api/listings?${params}`);
      if (response.ok) {
        const { listings } = await response.json();
        setListings(listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchListings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNav /> {/* Changed to LandingNav */}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover verified properties with professional inspections
            </p>

            {/* Main Search - compact */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2"> {/* Reduced gap */}
                <div className="flex-grow relative"> {/* Use flex-grow for input */}
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by location, type, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 py-3 text-lg bg-white h-12" // Increased height for better aesthetics
                  />
                </div>
                <Button type="submit" size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 h-12"> {/* Increased height */}
                  Search
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)} 
                  className="bg-white text-primary hover:bg-gray-100 px-4 h-12 flex items-center justify-center" // Increased height and centered content
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {showFilters && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Filters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="CONDO">Condo</option>
                <option value="OFFICE">Office</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="RETAIL">Retail</option>
                <option value="LAND">Land</option>
              </select>

              <Input
                placeholder="Min Price (₦)"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              />

              <Input
                placeholder="Max Price (₦)"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />

              <Input
                placeholder="Location (City, State, Address)"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />

              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ Bedroom</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>

              <select
                value={filters.bathrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any Bathrooms</option>
                <option value="1">1+ Bathroom</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
              </select>

              <Button onClick={fetchListings} className="col-span-1 sm:col-span-2 lg:col-span-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Marketplace Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-center space-x-4">
              <Home className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">{mockMetrics.activeListings.toLocaleString()}</div>
                <p className="text-gray-600">Active Listings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center space-x-4">
              <CheckSquare className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{mockMetrics.leasedHouses.toLocaleString()}</div>
                <p className="text-gray-600">Houses Leased</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center space-x-4">
              <CalendarCheck className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{mockMetrics.ongoingInspections.toLocaleString()}</div>
                <p className="text-gray-600">Ongoing Inspections</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{mockMetrics.totalListings.toLocaleString()}</div>
                <p className="text-gray-600">Total Properties</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Properties ({listings.length})
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all available properties
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onView={(id) => {
                  window.location.href = `/listings/${id}`;
                }}
                onScheduleInspection={(id) => {
                  window.location.href = `/listings/${id}/inspect`;
                }}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to list your property?</h3>
          <p className="text-lg mb-6 text-blue-100">
            Join thousands of verified agents and reach qualified buyers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              List Your Property
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Become an Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
