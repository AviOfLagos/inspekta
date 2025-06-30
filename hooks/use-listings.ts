import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys, queryClient } from '@/lib/query-client';
import { PropertyType, ListingStatus } from '@/lib/generated/prisma';

// Types
interface Listing {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: ListingStatus;
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  videoUrl?: string;
  agentId: string;
  companyId?: string;
  featured: boolean;
  tier: string;
  referralCode: string;
  agent: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ListingFilters {
  search?: string;
  type?: PropertyType;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
}

interface ListingsResponse {
  success: boolean;
  listings: Listing[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface CreateListingData {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  address: string;
  city: string;
  state: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  videoUrl?: string;
  agentId: string;
}

// API functions
const listingAPI = {
  // Get all listings with filters
  getListings: async (filters: ListingFilters = {}): Promise<ListingsResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value.toString());
      }
    });

    const response = await fetch(`/api/listings?${searchParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return response.json();
  },

  // Get single listing by ID
  getListing: async (id: string): Promise<Listing> => {
    const response = await fetch(`/api/listings/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }

    const data = await response.json();
    return data.listing;
  },

  // Create new listing
  createListing: async (data: CreateListingData): Promise<Listing> => {
    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create listing');
    }

    const result = await response.json();
    return result.listing;
  },

  // Save/unsave listing
  saveListing: async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}/save`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to save listing');
    }

    return response.json();
  },

  // Unsave listing
  unsaveListing: async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}/save`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to unsave listing');
    }

    return response.json();
  },

  // Get saved listings for current user
  getSavedListings: async (): Promise<Listing[]> => {
    const response = await fetch('/api/clients/saved-properties', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved listings');
    }

    const data = await response.json();
    return data.savedProperties || [];
  },
};

// React Query hooks
export const useListings = (filters: ListingFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.allListings(filters),
    queryFn: () => listingAPI.getListings(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: queryKeys.listing(id),
    queryFn: () => listingAPI.getListing(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  return useMutation({
    mutationFn: listingAPI.createListing,
    onSuccess: (newListing) => {
      // Invalidate listings queries to show the new listing
      queryClient.invalidateQueries({ queryKey: queryKeys.listings });
      
      // Add the new listing to the cache
      queryClient.setQueryData(queryKeys.listing(newListing.id), newListing);
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
    },
  });
};

export const useSaveListing = () => {
  return useMutation({
    mutationFn: listingAPI.saveListing,
    onSuccess: (_, listingId) => {
      // Invalidate saved listings query
      queryClient.invalidateQueries({ queryKey: queryKeys.savedListings('current') });
      
      // Optimistically update listings to show as saved
      queryClient.setQueriesData(
        { queryKey: queryKeys.listings },
        (oldData: ListingsResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            listings: oldData.listings.map(listing =>
              listing.id === listingId
                ? { ...listing, isSaved: true }
                : listing
            ),
          };
        }
      );
    },
    onError: (error) => {
      console.error('Error saving listing:', error);
    },
  });
};

export const useUnsaveListing = () => {
  return useMutation({
    mutationFn: listingAPI.unsaveListing,
    onSuccess: (_, listingId) => {
      // Invalidate saved listings query
      queryClient.invalidateQueries({ queryKey: queryKeys.savedListings('current') });
      
      // Optimistically update listings to show as not saved
      queryClient.setQueriesData(
        { queryKey: queryKeys.listings },
        (oldData: ListingsResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            listings: oldData.listings.map(listing =>
              listing.id === listingId
                ? { ...listing, isSaved: false }
                : listing
            ),
          };
        }
      );
    },
    onError: (error) => {
      console.error('Error unsaving listing:', error);
    },
  });
};

export const useSavedListings = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.savedListings(userId),
    queryFn: listingAPI.getSavedListings,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    enabled: !!userId,
  });
};

// Helper hook for listing actions
export const useListingActions = () => {
  const saveListing = useSaveListing();
  const unsaveListing = useUnsaveListing();

  const toggleSaved = (listingId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveListing.mutate(listingId);
    } else {
      saveListing.mutate(listingId);
    }
  };

  return {
    saveListing: saveListing.mutate,
    unsaveListing: unsaveListing.mutate,
    toggleSaved,
    isLoading: saveListing.isPending || unsaveListing.isPending,
  };
};

// Hook for marketplace search with debouncing
export const useMarketplaceSearch = (filters: ListingFilters, debounceMs = 500) => {
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [filters, debounceMs]);

  return useListings(debouncedFilters);
};