import { useQuery } from '@tanstack/react-query';
import { database } from '../firebase';
import { get, ref } from 'firebase/database';
import { Kottage } from './propertyHooks';
import { checkPropertyAvailability } from './useAvailability';

export interface SearchData {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  priceRange?: {
    min: number;
    max: number;
  };
  propertyType?: string;
  amenities?: string[];
}

export interface SearchFilters {
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  priceRange?: {
    min: number;
    max: number;
  };
  propertyTypes?: string[];
  amenities?: string[];
  minRating?: number;
}

// Extended Kottage type with Firebase key
export type KottageWithId = Kottage & { key: string };

// Hook to get all approved and listed properties
export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const propertiesRef = ref(database, 'properties');
      const snapshot = await get(propertiesRef);
      
      if (snapshot.exists()) {
        const properties: KottageWithId[] = [];
        snapshot.forEach((childSnapshot) => {
          const property = childSnapshot.val() as Kottage;
          // Only include approved and listed properties
          if (property.approval?.status === 'approved' && property.isListed) {
            properties.push({
              ...property,
              key: childSnapshot.key!
            });
          }
        });
        return properties;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search properties with filters
export const useSearchProperties = (searchData: SearchData, filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['properties', 'search', searchData, filters],
    queryFn: async () => {
      // Get all approved properties first
      const propertiesRef = ref(database, 'properties');
      const snapshot = await get(propertiesRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      let properties: KottageWithId[] = [];
      snapshot.forEach((childSnapshot) => {
        const property = childSnapshot.val() as Kottage;
        // Only include approved and listed properties
        if (property.approval?.status === 'approved' && property.isListed) {
          properties.push({
            ...property,
            key: childSnapshot.key!
          });
        }
      });

      // Apply search filters
      let filteredProperties = properties;

      // Location filter
      if (searchData.location.trim()) {
        const locationQuery = searchData.location.toLowerCase().trim();
        filteredProperties = filteredProperties.filter(property => 
          property.name.toLowerCase().includes(locationQuery) ||
          property.description.toLowerCase().includes(locationQuery) ||
          property.address?.city?.toLowerCase().includes(locationQuery) ||
          property.address?.state?.toLowerCase().includes(locationQuery) ||
          property.address?.address1?.toLowerCase().includes(locationQuery)
        );
      }

      // Guest capacity filter
      if (searchData.guests > 0) {
        filteredProperties = filteredProperties.filter(property => {
          const maxGuests = property.maxGuests || 
                          (property.roomTypes && Math.max(...property.roomTypes.map(rt => rt.maxOccupancy))) || 
                          4;
          return maxGuests >= searchData.guests;
        });
      }

      // Price range filter
      if (searchData.priceRange || filters?.priceRange) {
        const priceRange = searchData.priceRange || filters?.priceRange;
        if (priceRange) {
          filteredProperties = filteredProperties.filter(property => {
            const price = property.price || property.roomTypes?.[0]?.pricePerNight || 0;
            return price >= priceRange.min && price <= priceRange.max;
          });
        }
      }

      // Property type filter
      if (searchData.propertyType || filters?.propertyTypes?.length) {
        const types = searchData.propertyType ? [searchData.propertyType] : filters?.propertyTypes || [];
        filteredProperties = filteredProperties.filter(property => 
          types.includes(property.propertyType || 'other')
        );
      }

      // Amenities filter
      if (searchData.amenities?.length || filters?.amenities?.length) {
        const requiredAmenities = searchData.amenities || filters?.amenities || [];
        filteredProperties = filteredProperties.filter(property => 
          requiredAmenities.every(amenity => 
            property.amenities?.includes(amenity)
          )
        );
      }

      // Rating filter
      if (filters?.minRating) {
        filteredProperties = filteredProperties.filter(property => 
          property.rating >= filters.minRating!
        );
      }

      // Availability filter - check if dates are provided
      if (searchData.checkIn && searchData.checkOut) {
        const availabilityPromises = filteredProperties.map(async (property) => {
          const isAvailable = await checkPropertyAvailability(
            property.key,
            searchData.checkIn!,
            searchData.checkOut!,
            searchData.guests
          );
          return isAvailable ? property : null;
        });
        
        const availabilityResults = await Promise.all(availabilityPromises);
        filteredProperties = availabilityResults.filter((property): property is KottageWithId => 
          property !== null
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        filteredProperties.sort((a, b) => {
          let aValue: number, bValue: number;
           
          switch (filters.sortBy) {
            case 'price':
              aValue = a.price || a.roomTypes?.[0]?.pricePerNight || 0;
              bValue = b.price || b.roomTypes?.[0]?.pricePerNight || 0;
              break;
            case 'rating':
              aValue = a.rating;
              bValue = b.rating;
              break;
            case 'popularity':
              // Use the calculated popularity score from the analytics engine
              aValue = (a as any).popularityScore || 0;
              bValue = (b as any).popularityScore || 0;
              break;
            default:
              return 0;
          }
          
          return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });
      }
      // Convert to SearchResults Property format
      return filteredProperties;
    },
    enabled: true, // Always enabled, will return all properties if no search criteria
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Hook to get popular properties (highest rated + most bookings)
export const usePopularProperties = (limit: number = 6) => {
  return useQuery({
    queryKey: ['properties', 'popular', limit],
    queryFn: async () => {
      const propertiesRef = ref(database, 'properties');
      const snapshot = await get(propertiesRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      let properties: KottageWithId[] = [];
      snapshot.forEach((childSnapshot) => {
        const property = childSnapshot.val() as Kottage;
        // Only include approved and listed properties
        if (property.approval?.status === 'approved' && property.isListed) {
          properties.push({
            ...property,
            key: childSnapshot.key!
          });
        }
      });

      // Sort by popularity score (with fallback to rating-based calculation)
      const sortedProperties = properties
        .sort((a, b) => {
          // Use calculated popularity score if available, otherwise fallback to rating * log formula
          const aScore = (a as any).popularityScore || (a.rating * Math.log((0) + 1));
          const bScore = (b as any).popularityScore || (b.rating * Math.log((0) + 1));
          return bScore - aScore;
        })
        .slice(0, limit);

      return sortedProperties;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for popular properties
  });
};

// Hook to get properties by region/parish
export const usePropertiesByRegion = (region: string) => {
  return useQuery({
    queryKey: ['properties', 'region', region],
    queryFn: async () => {
      const propertiesRef = ref(database, 'properties');
      const snapshot = await get(propertiesRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      let properties: KottageWithId[] = [];
      snapshot.forEach((childSnapshot) => {
        const property = childSnapshot.val() as Kottage;
        // Only include approved and listed properties in the specified region
        if (property.approval?.status === 'approved' && 
            property.isListed && 
            property.address?.state?.toLowerCase() === region.toLowerCase()) {
          properties.push({
            ...property,
            key: childSnapshot.key!
          });
        }
      });

      return properties;
    },
    enabled: !!region,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get a single property by ID
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const propertyRef = ref(database, `properties/${id}`);
      const snapshot = await get(propertyRef);
      
      if (snapshot.exists()) {
        const property = snapshot.val() as Kottage;
        if (property.approval?.status === 'approved' && property.isListed) {
          return { ...property, key: id };
        }
      }
      return null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
