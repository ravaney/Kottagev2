import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, database } from '../firebase';
import { get, push, ref, set, update } from 'firebase/database';
import {
  getStorage,
  ref as ref2,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { IAddress } from '../../public/QuickType';

export interface RoomType {
  id: string; // e.g. "standard", "penthouse"
  name: string; // "Standard Room", "Penthouse Suite"
  description: string;
  maxGuests: number;
  pricePerNight: number;
  quantityAvailable: number;
  amenities: string[];
  images: string[];
}

export interface Kottage {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  phone: string;
  address: IAddress;
  rating: number;
  currentReservations?: number;
  pastReservations?: number;
  isListed: boolean;
  amenities: string[];
  roomTypes?: RoomType[];
  images?: {} | null;
  price?: number;
}

export const useAddProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      property,
      Files,
    }: {
      property: Omit<Kottage, 'id'>;
      Files: File[];
    }) => {
      const newPropertyRef = push(ref(database, 'properties'));
      const propertyId = newPropertyRef.key!;

      const fullProperty: Kottage = {
        id: propertyId,
        ...property,
      };

      await set(ref(database, 'properties/' + propertyId), fullProperty);
      await set(
        ref(
          database,
          'users/' + auth?.currentUser?.uid + '/myProperties/' + propertyId
        ),
        true
      );

      const uploadPromises = Files.map(async (file: File) => {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `propertyImages/${propertyId}/${file.name}`),
          file
        );
        const url = await getDownloadURL(snapshot.ref);
        const fileName = file.name.split('.')[0];
        await set(
          ref(database, 'properties/' + propertyId + '/images/' + fileName),
          url
        );
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
      const snapshot = await get(
        ref(database, 'users/' + auth?.currentUser?.uid + '/myProperties/')
      );
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
    mutationFn: async ({
      images,
      propertyId,
    }: {
      images: File[];
      propertyId: string;
    }) => {
      const uploadPromises = images.map(async (image: File) => {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `propertyImages/${propertyId}/${image.name}`),
          image
        );
        const url = await getDownloadURL(snapshot.ref);
        const fileName = image.name.split('.')[0];
        await set(
          ref(database, 'properties/' + propertyId + '/images/' + fileName),
          url
        );
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
      await set(
        ref(
          database,
          'users/' + auth?.currentUser?.uid + '/myProperties/' + propertyId
        ),
        null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Kottage> & { id: string }) => {
      const updateData: Record<string, any> = {};
      
      // Build Firebase update paths
      Object.entries(updates).forEach(([key, value]) => {
        updateData[`properties/${id}/${key}`] = value;
      });
      
      // Always update the updatedAt timestamp
      updateData[`properties/${id}/updatedAt`] = new Date().toISOString();
      
      await update(ref(database), updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

