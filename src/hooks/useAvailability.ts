import { useQuery } from '@tanstack/react-query';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase';

export interface AvailabilityParams {
  propertyId: string;
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
}

export interface AvailabilityResult {
  available: boolean;
  conflictingDates: string[];
  blockedDates: string[];
}

export interface PropertyAvailabilityResult {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  roomTypes: Array<{
    roomTypeId: string;
    roomType: any;
    available: boolean;
    conflictingDates: string[];
    blockedDates: string[];
  }>;
  hasAvailability: boolean;
}

// Check availability for a specific room type
export const useRoomAvailability = (params: AvailabilityParams) => {
  return useQuery({
    queryKey: ['availability', params.propertyId, params.roomTypeId, params.checkIn, params.checkOut],
    queryFn: async (): Promise<AvailabilityResult> => {
      const { propertyId, roomTypeId, checkIn, checkOut } = params;
      
      // Get all blocked dates for this room type
      const blockedDatesRef = query(
        ref(database, 'blockedDates'),
        orderByChild('propertyId'),
        equalTo(propertyId)
      );
      
      const snapshot = await get(blockedDatesRef);
      const blockedDates: string[] = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const data = child.val();
          if (data.roomTypeId === roomTypeId) {
            blockedDates.push(data.date);
          }
        });
      }
      
      // Check if any dates in the range are blocked
      const requestedDates = getDateRange(checkIn, checkOut);
      const conflictingDates = requestedDates.filter(date => 
        blockedDates.includes(date)
      );
      
      return {
        available: conflictingDates.length === 0,
        conflictingDates,
        blockedDates
      };
    },
    enabled: !!(params.propertyId && params.roomTypeId && params.checkIn && params.checkOut),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get all available room types for a property and date range
export const usePropertyAvailability = (propertyId: string, checkIn: Date, checkOut: Date) => {
  return useQuery({
    queryKey: ['propertyAvailability', propertyId, checkIn, checkOut],
    queryFn: async (): Promise<PropertyAvailabilityResult> => {
      // Get property details
      const propertyRef = ref(database, `properties/${propertyId}`);
      const propertySnapshot = await get(propertyRef);
      
      if (!propertySnapshot.exists()) {
        throw new Error('Property not found');
      }
      
      const property = propertySnapshot.val();
      const roomTypes = property.roomTypes || {};
      
      // Check availability for each room type
      const availabilityPromises = Object.entries(roomTypes).map(async ([roomTypeId, roomType]: [string, any]) => {
        const availability = await checkRoomTypeAvailability(propertyId, roomTypeId, checkIn, checkOut);
        return {
          roomTypeId,
          roomType,
          ...availability
        };
      });
      
      const results = await Promise.all(availabilityPromises);
      
      return {
        propertyId,
        checkIn,
        checkOut,
        roomTypes: results,
        hasAvailability: results.some(r => r.available)
      };
    },
    enabled: !!(propertyId && checkIn && checkOut),
    staleTime: 1 * 60 * 1000,
  });
};

// Helper function to check room type availability
async function checkRoomTypeAvailability(
  propertyId: string, 
  roomTypeId: string, 
  checkIn: Date, 
  checkOut: Date
): Promise<AvailabilityResult> {
  const blockedDatesRef = query(
    ref(database, 'blockedDates'),
    orderByChild('propertyId'),
    equalTo(propertyId)
  );
  
  const snapshot = await get(blockedDatesRef);
  const blockedDates: string[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.roomTypeId === roomTypeId) {
        blockedDates.push(data.date);
      }
    });
  }
  
  const requestedDates = getDateRange(checkIn, checkOut);
  const conflictingDates = requestedDates.filter(date => 
    blockedDates.includes(date)
  );
  
  return {
    available: conflictingDates.length === 0,
    conflictingDates,
    blockedDates
  };
}

// Helper function to check simple property availability (no room types)
export async function checkSimplePropertyAvailability(
  propertyId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const blockedDatesRef = query(
    ref(database, 'blockedDates'),
    orderByChild('propertyId'),
    equalTo(propertyId)
  );
  
  const snapshot = await get(blockedDatesRef);
  const blockedDates: string[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      blockedDates.push(data.date);
    });
  }
  
  const requestedDates = getDateRange(checkIn, checkOut);
  return !requestedDates.some(date => blockedDates.includes(date));
}

// Utility function to get date range
function getDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  // Note: We check nights, not the checkout date itself
  while (currentDate < endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// Helper function to check property availability with room types
export async function checkPropertyAvailability(
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
  guests?: number
): Promise<boolean> {
  try {
    // Get property details to check room types
    const propertyRef = ref(database, `properties/${propertyId}`);
    const propertySnapshot = await get(propertyRef);
    
    if (!propertySnapshot.exists()) return false;
    
    const property = propertySnapshot.val();
    const roomTypes = property.roomTypes || {};
    
    // If no room types, check property-level availability
    if (Object.keys(roomTypes).length === 0) {
      return await checkSimplePropertyAvailability(propertyId, checkIn, checkOut);
    }
    
    // Check if any room type is available for the guest count
    for (const [roomTypeId, roomType] of Object.entries(roomTypes)) {
      const roomTypeData = roomType as any;
      
      // Skip if room can't accommodate guests
      if (guests && roomTypeData.maxOccupancy < guests) continue;
      
      // Check if this room type is available
      const availability = await checkRoomTypeAvailability(
        propertyId, 
        roomTypeId, 
        checkIn, 
        checkOut
      );
      
      if (availability.available) return true; // Found at least one available room type
    }
    
    return false; // No room types available
  } catch (error) {
    console.error('Error checking availability:', error);
    return false; // Assume unavailable on error
  }
}
