'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { MapPin, Bed, Bath, Square, Eye, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Listing } from '@/types/listing';
import Image from 'next/image';

interface ListingCardProps {
  listing: Listing;
  onView?: (id: string) => void;
  onScheduleInspection?: (id: string) => void;
  showActions?: boolean;
}

export function ListingCard({ 
  listing, 
  onView, 
  onScheduleInspection, 
  showActions = true 
}: ListingCardProps) {
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };


  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT': return 'Apartment';
      case 'HOUSE': return 'House';
      case 'CONDO': return 'Condo';
      case 'OFFICE': return 'Office';
      case 'WAREHOUSE': return 'Warehouse';
      case 'RETAIL': return 'Retail';
      case 'LAND': return 'Land';
      default: return type;
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="">
        <div className="flex justify-between items-start ">
          <CardTitle className="text-lg line-clamp-2 mr-1">{listing.title}</CardTitle>
          <StatusBadge status={listing.status} variant="outline" />
        </div>
        <div className="flex items-center  gap-[2px] text-sm text-nowrap overflow-hidden text-muted-foreground ">
          <MapPin className="min-w-4 h-4 " />
          {listing.address}, {listing.city}, {listing.state}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 ">
        {/* Image placeholder */}
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          {listing.images.length > 0 ? (
            <Image 
              src={listing.images[0]} 
              alt={listing.title}
              className="w-full h-full object-cover rounded-md"
              width={100}
              height={100}
            />
          ) : (
            <div className="text-muted-foreground">No image available yet!</div>
          )}
        </div>

        {/* Property details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
            <Badge variant="outline">{getTypeLabel(listing.type)}</Badge>
          </div>

          {/* Property specs */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {listing.bedrooms && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
              </div>
            )}
            {listing.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
              </div>
            )}
            {listing.area && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                {listing.area} sqm
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          )}

        </div>

        {/* Agent info */}
        <div className="border-t pt-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Listed by: </span>
            <span className="font-medium">{listing.agent.name}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col gap-2 pt-2 ">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView ? onView(listing.id) : router.push(`/listings/${listing.id}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1 "
              onClick={() => onScheduleInspection ? onScheduleInspection(listing.id) : router.push('/auth/signin')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Inspection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}