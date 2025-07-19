import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAddress } from "../../public/QuickType";
import { push, getDatabase, ref, query, orderByChild, equalTo, get, set, update } from "firebase/database";
import { auth, database } from "../firebase";
import { getAuth } from "firebase/auth";
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
  NoShow = "no_show",
  Refunded = "refunded",
  InProgress = "in_progress",
}

export interface KottageStump{
  id: string;
  name: string;
  address: IAddress;
}
export interface PaymentDetails {
  method: 'card' | 'paypal' | 'cash' | 'bank_transfer';
  transactionId?: string;
  paid: boolean;
  paidAt?: string;
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
  edits?: Array<{
    userId: string;
    timestamp: string;
    changes: Partial<Reservation>;
  }>;
}


export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: Omit<Reservation, 'id'>) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const newReservationRef = push(ref(database, 'reservations'));
      const reservationId = `BK-${newReservationRef.key!}-RES`;      
      const fullReservation: Reservation = {
        ...reservation,
        userId: user.uid,
        createdAt: Date.now().toString(),
      };

     const updates: Record<string, any> = {
        [`reservations/${reservationId}`]: fullReservation,
        [`users/${user.uid}/reservations/${reservationId}`]: true,
        [`properties/${reservation.property.id}/reservations/${reservationId}`]: true,
      };

      await update(ref(database), updates);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
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

export const useGetMyReservations = () => {
  return useQuery({
    queryKey: ['userReservations'],
    queryFn: async () => {
      const db = getDatabase();
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) return [];

      const reservationsRef = ref(db, "reservations");
      const q = query(reservationsRef, orderByChild("userId"), equalTo(currentUser.uid));

      const snapshot = await get(q);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([id, res]) => ({ id, ...(res as any) }));
      } else {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};