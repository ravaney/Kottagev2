import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { IAddress } from "../../public/QuickType";
import { push, getDatabase, ref, query, orderByChild, equalTo, get, set, update } from "firebase/database";
import { auth, database } from "../firebase";
import { blockDatesForReservation } from "../utils/blockingUtils";

/*
 * FIREBASE INDEXING NOTE:
 * If you encounter "Index not defined" errors, add these rules to your Firebase Realtime Database Rules:
 * 
 * {
 *   "rules": {
 *     "reservations": {
 *       ".indexOn": ["userId"]
 *     }
 *   }
 * }
 * 
 * This will enable efficient querying by userId. The hooks below include fallback logic
 * to scan all reservations if the index is not available.
 */
export interface Guest {
  name: string;
  email?: string;
  phone?: string;
  age?: number;
}

export enum ReservationStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
  Completed = "completed",
  CheckedIn = 'Checked-in',
  CheckedOut = 'Checked-out',
  NoShow = "no_show",
  Refunded = "refunded",
  InProgress = "in_progress",
}

export interface KottageStump{
  id: string;
  name: string;
}
export interface PaymentDetails {
  method: 'card' | 'paypal' | 'cash' | 'bank_transfer';
  transactionId?: string;
  paid: boolean;
  paidAt?: string;
  amount?: number; // Amount paid, if applicable
}
export interface Reservation {
  reservationId: string;
  userId: string;
  checkIn: string; // ISO 8601 format: e.g., "2025-07-20T15:00:00Z"
  checkOut: string;
  guests: Guest[];
  rooms?: string[]; // optional list of room IDs reserved
  totalPrice: number;
  currency?: string; // e.g., "USD", "JMD"
  status: ReservationStatus;
  createdAt: string;
  updatedAt?: string;
  notes?: string; // optional user message
  payment?: PaymentDetails;
  property: KottageStump;
  // Required fields for date blocking functionality
  propertyId: string;
  roomTypeId: string;
  edits?: Array<{
    userId: string;
    timestamp: string;
    changes: Partial<Reservation>;
  }>;
}

export interface BlockedDate {
  propertyId: string;
  roomTypeId: string;
  date: string; // YYYY-MM-DD format
  reason: 'reservation' | 'maintenance' | 'manual';
  reservationId?: string;
  createdAt: Date;
  createdBy: string;
}


export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: Omit<Partial<Reservation>, 'id'>) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const newReservationRef = push(ref(database, 'reservations'));
      const reservationId = `BK-${newReservationRef.key!}-RES`;      
      

     const updates: Record<string, any> = {
        [`reservations/${reservationId}`]: {
          ...reservation,
          reservationId
        },
        [`users/${user.uid}/reservations/${reservationId}`]: true,
        [`properties/${reservation.property?.id}/reservations/${reservationId}`]: true,
      };

      await update(ref(database), updates);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['blockedDates'] });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reservation> & { id: string }) => {
      const updateData: Record<string, any> = {};
      
      // Build Firebase update paths
      Object.entries(updates).forEach(([key, value]) => {
        updateData[`reservations/${id}/${key}`] = value;
      });
      
      // Always update the updatedAt timestamp
      updateData[`reservations/${id}/updatedAt`] = new Date().toISOString();
      
      await update(ref(database), updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reservationId, propertyId }: { reservationId: string; propertyId: string }) => {
      // Remove from reservations collection
      await set(ref(database, 'reservations/' + reservationId), null);
      // Remove from user's reservations
      await set(ref(database, 'users/' + auth?.currentUser?.uid + '/reservations/' + reservationId), null);
      // Remove from property's reservations
      await set(ref(database, 'properties/' + propertyId + '/reservations/' + reservationId), null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useGetMyReservations = ():UseQueryResult<Reservation[],Error> => {
  return useQuery({
    queryKey: ['userReservations'],
    queryFn: async () => {
      try {
        const db = getDatabase();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.log('🔍 No current user found, returning empty array');
          return [];
        }

        // Try the indexed query first, fall back to full scan if index is missing
        try {
          const reservationsRef = ref(db, "reservations");
          const q = query(reservationsRef, orderByChild("userId"), equalTo(currentUser.uid));
          const snapshot = await get(q);
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            
            const reservations = Object.entries(data).map(([reservationId, res]) => ({ 
              reservationId, 
              ...(res as any) 
            })) as Reservation[];
            
            return reservations;
          } else {
            console.log('📭 No reservations found for user (indexed), returning empty array');
            return [];
          }
        } catch (indexError: any) {
          // If indexing error, fall back to scanning all reservations
          if (indexError.message?.includes('Index not defined') || indexError.message?.includes('indexOn')) {
            console.log('⚠️ Database index missing, falling back to full scan...');
            
            const reservationsRef = ref(db, "reservations");
            const snapshot = await get(reservationsRef);
            
            if (snapshot.exists()) {
              const allReservations = snapshot.val();
              console.log('🔍 Scanning all reservations for user matches...');
              
              const userReservations = Object.entries(allReservations)
                .filter(([reservationId, reservation]: [string, any]) => {
                  return reservation.userId === currentUser.uid;
                })
                .map(([reservationId, res]) => ({ 
                  reservationId, 
                  ...(res as any) 
                })) as Reservation[];
              
              console.log('✅ Found user reservations (full scan):', userReservations.length);
              return userReservations;
            } else {
              console.log('📭 No reservations found in database, returning empty array');
              return [];
            }
          } else {
            throw indexError; // Re-throw if it's a different error
          }
        }
      } catch (error: any) {
        console.error('❌ Error fetching user reservations:', error);
        
        // Provide user-friendly error messages
        if (error.message?.includes('Index not defined') || error.message?.includes('indexOn')) {
          throw new Error('Database is being optimized. Please try again in a moment.');
        } else if (error.message?.includes('permission')) {
          throw new Error('You don\'t have permission to view reservations. Please contact support.');
        } else if (error.message?.includes('network') || error.message?.includes('offline')) {
          throw new Error('No internet connection. Please check your connection and try again.');
        } else {
          throw new Error('Unable to load your reservations. Please try again later.');
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// Hook to get reservations for properties owned by the current user
export const useGetMyPropertyReservations = (): UseQueryResult<Reservation[], Error> => {
  return useQuery({
    queryKey: ['myPropertyReservations'],
    queryFn: async () => {
      try {
        const db = getDatabase();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.log('🔍 No current user found for property reservations, returning empty array');
          return [];
        }

        // First, get all reservations
        const reservationsRef = ref(db, "reservations");
        const snapshot = await get(reservationsRef);
        
        if (!snapshot.exists()) {
          console.log('📭 No reservations found in database, returning empty array');
          return [];
        }

        const allReservations = snapshot.val();
        
        // Then, get the current user's properties
        const userPropertiesRef = ref(db, `users/${currentUser.uid}/myProperties`);
        const userPropertiesSnapshot = await get(userPropertiesRef);
        
        if (!userPropertiesSnapshot.exists()) {
          console.log('🏠 No properties found for current user, returning empty array');
          return [];
        }

        const userPropertyIds = Object.keys(userPropertiesSnapshot.val());
        console.log('🏠 User owns properties:', userPropertyIds);

        // Filter reservations for properties owned by the current user
        const myPropertyReservations = Object.entries(allReservations)
          .filter(([reservationId, reservation]: [string, any]) => {
            return userPropertyIds.includes(reservation.property?.id);
          })
          .map(([reservationId, res]) => ({ 
            reservationId, 
            ...(res as any) 
          })) as Reservation[];

        console.log('✅ Found reservations for my properties:', myPropertyReservations.length);
        return myPropertyReservations;
      } catch (error: any) {
        console.error('❌ Error fetching property reservations:', error);
        
        // Provide user-friendly error messages
        if (error.message?.includes('permission')) {
          throw new Error('You don\'t have permission to view property reservations. Please contact support.');
        } else if (error.message?.includes('network') || error.message?.includes('offline')) {
          throw new Error('No internet connection. Please check your connection and try again.');
        } else {
          throw new Error('Unable to load your property reservations. Please try again later.');
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false
  });
};

// New hook to get ALL reservations for admin/staff use
export const useGetAllReservations = () => {
  return useQuery({
    queryKey: ['allReservations'],
    queryFn: async () => {
      try {
        const db = getDatabase();
        const reservationsRef = ref(db, "reservations");

        const snapshot = await get(reservationsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          return Object.entries(data).map(([id, res]) => ({ 
            reservationId: id, 
            ...(res as any) 
          })) as Reservation[];
        } else {
          return [];
        }
      } catch (error: any) {
        console.error('❌ Error fetching all reservations:', error);
        
        if (error.message?.includes('permission')) {
          throw new Error('You don\'t have permission to view all reservations. Admin access required.');
        } else if (error.message?.includes('network') || error.message?.includes('offline')) {
          throw new Error('No internet connection. Please check your connection and try again.');
        } else {
          throw new Error('Unable to load reservations. Please try again later.');
        }
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for admin data
  });
};

// Hook to get reservations with fraud analysis
export const useGetReservationsWithFraudAnalysis = () => {
  return useQuery({
    queryKey: ['reservationsWithFraud'],
    queryFn: async () => {
      try {
        const db = getDatabase();
        const reservationsRef = ref(db, "reservations");

        const snapshot = await get(reservationsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const reservations = Object.entries(data).map(([id, res]) => ({ 
            reservationId: id, 
            ...(res as any) 
          })) as Reservation[];

          // Add fraud analysis to each reservation
          return reservations.map(reservation => ({
            ...reservation,
            fraudScore: calculateFraudScore(reservation),
            riskLevel: getRiskLevel(reservation),
            fraudFlags: getFraudFlags(reservation)
          }));
        } else {
          return [];
        }
      } catch (error: any) {
        console.error('❌ Error fetching reservations for fraud analysis:', error);
        
        if (error.message?.includes('permission')) {
          throw new Error('You don\'t have permission to access fraud analysis. Admin access required.');
        } else if (error.message?.includes('network') || error.message?.includes('offline')) {
          throw new Error('No internet connection. Please check your connection and try again.');
        } else {
          throw new Error('Unable to load fraud analysis data. Please try again later.');
        }
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Helper functions for fraud analysis
const calculateFraudScore = (reservation: Reservation): number => {
  let score = 0;
  
  // Check for suspicious patterns
  if (reservation.payment?.method === 'card' && !reservation.payment.transactionId) {
    score += 20;
  }
  
  // Check for unusual booking patterns
  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const stayDuration = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (stayDuration > 30) score += 15; // Very long stays
  if (stayDuration < 1) score += 25; // Same day booking/checkout
  
  // Check guest information completeness
  const primaryGuest = reservation.guests[0];
  if (!primaryGuest?.email) score += 30;
  if (!primaryGuest?.phone) score += 20;
  
  // Check timing patterns
  const createdAt = new Date(reservation.createdAt);
  const bookingAdvance = (checkInDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  
  if (bookingAdvance < 1) score += 20; // Last minute booking
  if (bookingAdvance > 365) score += 10; // Very far advance booking
  
  return Math.min(score, 100);
};

const getRiskLevel = (reservation: Reservation): 'low' | 'medium' | 'high' | 'critical' => {
  const score = calculateFraudScore(reservation);
  
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

const getFraudFlags = (reservation: Reservation): string[] => {
  const flags: string[] = [];
  
  const primaryGuest = reservation.guests[0];
  
  if (!primaryGuest?.email) flags.push('Missing email');
  if (!primaryGuest?.phone) flags.push('Missing phone');
  if (!reservation.payment?.transactionId) flags.push('No transaction ID');
  
  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const stayDuration = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (stayDuration > 30) flags.push('Extended stay');
  if (stayDuration < 1) flags.push('Same day booking');
  
  const createdAt = new Date(reservation.createdAt);
  const bookingAdvance = (checkInDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  
  if (bookingAdvance < 1) flags.push('Last minute booking');
  if (reservation.totalPrice > 5000) flags.push('High value transaction');
  
  return flags;
};