import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, database } from '../firebase';
import { get, push, ref, set, update } from 'firebase/database';
import { getStorage, ref as ref2, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { IAddress } from '../../public/QuickType';

export interface Reservation {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Room {
  id: string;
  type: string;
  count: number;
  price: number;
  images?: string[];
  description?: string;
}

export interface Kottage {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  address: IAddress;
  price: number;
  guests: number;
  rooms: number;
  description?: string;
  bathrooms: number;
  images?: {} | null;
  currentReservations?: number;
  pastReservations?: number;
  isListed?: boolean;
  roomConfigurations?: Room[];
}

export const useAddProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ property, Files }: { property: Omit<Kottage, 'id'>; Files: File[] }) => {
      const newPropertyRef = push(ref(database, 'properties'));
      const propertyId = newPropertyRef.key!;

      const fullProperty: Kottage = {
        id: propertyId,
        ...property
      };

      await set(ref(database, 'properties/' + propertyId), fullProperty);
      await set(ref(database, 'users/' + auth?.currentUser?.uid + '/myProperties/' + propertyId), true);

      const uploadPromises = Files.map(async (file: File) => {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `propertyImages/${propertyId}/${file.name}`),
          file
        );
        const url = await getDownloadURL(snapshot.ref);
        const fileName = file.name.split('.')[0];
        await set(ref(database, 'properties/' + propertyId + '/images/' + fileName), url);
        return url;
      });

      await Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useMyProperties = () => {
  return useQuery({
    queryKey: ['myProperties'],
    queryFn: async (): Promise<Kottage[]> => {
      const snapshot = await get(ref(database, 'users/' + auth?.currentUser?.uid + '/myProperties/'));
      if (!snapshot.exists()) return [];
      
      const propertyIds = Object.keys(snapshot.val() as object);
      const properties = await Promise.all(
        propertyIds.map(async (id: string) => {
          const propertySnapshot = await get(ref(database, 'properties/' + id));
          return propertySnapshot.val() as Kottage;
        })
      );
      
      return properties.filter((property) => property !== null);
    },
    enabled: !!auth?.currentUser?.uid,
  });
};

export const useAddPropertyImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ images, propertyId }: { images: File[]; propertyId: string }) => {
      const uploadPromises = images.map(async (image: File) => {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `propertyImages/${propertyId}/${image.name}`),
          image
        );
        const url = await getDownloadURL(snapshot.ref);
        const fileName = image.name.split('.')[0];
        await set(ref(database, 'properties/' + propertyId + '/images/' + fileName), url);
        return url;
      });

      return await Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      // Remove from properties
      await set(ref(database, 'properties/' + propertyId), null);
      // Remove from user's myProperties
      await set(ref(database, 'users/' + auth?.currentUser?.uid + '/myProperties/' + propertyId), null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: Omit<Reservation, 'id'>) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const newReservationRef = push(ref(database, 'reservations'));
      const reservationId = newReservationRef.key!;
      
      const fullReservation: Reservation = {
        id: reservationId,
        ...reservation,
        userId: user.uid,
        createdAt: Date.now().toString(),
      };

     const updates: Record<string, any> = {
        [`reservations/${reservationId}`]: fullReservation,
        [`users/${user.uid}/reservations/${reservationId}`]: true,
        [`properties/${reservation.propertyId}/reservations/${reservationId}`]: true,
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
    mutationFn: async (reservation: Reservation) => {
      // Update reservation in reservations collection
      await set(ref(database, 'reservations/' + reservation.id), reservation);
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

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (property: Kottage) => {
      await set(ref(database, 'properties/' + property.id), property);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};