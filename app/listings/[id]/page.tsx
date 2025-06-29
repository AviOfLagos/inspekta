'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TopNav } from '@/components/navigation/top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Phone, 
  Mail, 
  Star,
  ArrowLeft,
  Heart,
  Share2,
  ExternalLink,
  User,
} from 'lucide-react';
import { InspectionBookingModal } from '@/components/listings/inspection-booking-modal';
import { Listing } from '@/types/listing';
import Image from 'next/image';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (response.ok) {
          const { listing } = await response.json();
          setListing(listing);
        } else {
          router.push('/marketplace');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        router.push('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.push('/marketplace')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'Apartment',
      HOUSE: 'House',
      DUPLEX: 'Duplex',
      OFFICE: 'Office',
      SHOP: 'Shop',
      WAREHOUSE: 'Warehouse',
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SOLD': return 'bg-red-100 text-red-800';
      case 'RENTED': return 'bg-blue-100 text-primary';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className='p-2 overflow-hidden'>
              <CardContent className="p-0 ">
                <div className="relative ">
                  {listing.images.length > 0 ? (
                    <>
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <Image 
                          src={listing.images[activeImageIndex]} 
                          alt={listing.title}
                          className="w-full h-full object-cover "
                          width={100}
                          height={100}
                        />
                      </div>
                      {listing.images.length > 1 && (
                        <div className="p-4">
                          <div className="grid grid-cols-4 gap-2">
                            {listing.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setActiveImageIndex(index)}
                                className={`aspect-video rounded-lg overflow-hidden border-2 ${
                                  activeImageIndex === index ? 'border-primary' : 'border-gray-200'
                                }`}
                              >
                                <Image 
                                  src={image} 
                                  alt={`${listing.title} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  width={100} height={100} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-500">No images available</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.address}, {listing.city}, {listing.state}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setSaved(!saved)}>
                      <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Price and Type */}
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(listing.price)}
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {getPropertyTypeLabel(listing.type)}
                  </Badge>
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-3 gap-4">
                  {listing.bedrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{listing.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedroom{listing.bedrooms > 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{listing.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathroom{listing.bathrooms > 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {listing.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{listing.area}</div>
                      <div className="text-sm text-gray-600">sqm</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {listing.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                  </div>
                )}

                {/* Inspections */}
                {listing.inspections && listing.inspections.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recent Inspections</h3>
                    <div className="space-y-2">
                      {listing.inspections.slice(0, 3).map((inspection) => (
                        <div key={inspection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm">
                              {new Date(inspection.scheduledAt).toLocaleDateString()}
                            </span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {inspection.status}
                            </Badge>
                          </div>
                          {inspection.inspector && (
                            <span className="text-sm text-gray-600">
                              by {inspection.inspector.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Listed by
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-lg">{listing.agent.name}</h3>
                  <p className="text-gray-600 text-sm">{listing.agent.email}</p>
                  
                  {listing.agent.agentProfile && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm">4.8 (24 reviews)</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(listing.agent.agentProfile as { successfulDeals?: number })?.successfulDeals || 0} successful deals
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Link href={`/agents/${listing.agent.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Inspection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Inspection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Book a professional inspection to verify this property
                </p>
                
                <InspectionBookingModal
                  propertyId={listing.id}
                  propertyTitle={listing.title}
                  propertyLocation={`${listing.address}, ${listing.city}, ${listing.state}`}
                  trigger={
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Inspection
                    </Button>
                  }
                />

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Virtual inspections from ₦15,000</p>
                  <p>• Physical inspections from ₦25,000</p>
                  <p>• Professional inspector assigned</p>
                  <p>• Detailed report within 24 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-mono text-sm">{listing.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{new Date(listing.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}