import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { auth, database } from '../firebase';
import { get, push, ref, set, update } from 'firebase/database';
import {
  getStorage,
  ref as ref2,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { IAddress } from '../../public/QuickType';

export interface RoomPromotion {
  id: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (0-100) or fixed amount
  startDate: string;
  endDate: string;
  isActive: boolean;
  minNights?: number;
  maxNights?: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  blackoutDates?: string[];
}

export interface RoomType {
  id: string; // e.g. "standard", "penthouse"
  name: string; // "Standard Room", "Penthouse Suite"
  description: string;
  maxOccupancy: number;
  pricePerNight: number;
  quantityAvailable: number;
  amenities: string[];
  images: string[];
  listStatus: 'listed' | 'unlisted';
  promotion?: RoomPromotion;
}

export interface ApprovalDocument {
  id: string;
  name: string;
  type: 'title_deed' | 'utility_bill' | 'property_tax' | 'lease_agreement' | 'authorization_letter' | 'other';
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface PropertyApproval {
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_documents';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  requiredDocuments: string[];
  submittedDocuments: ApprovalDocument[];
  notes?: string;
  approvalScore?: number;
}

export interface IHostInfo {
  id: string;
  name: string;
  avatar: string;
  superhost?: boolean;
}

export interface Kottage {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  phone: string;
  address: IAddress;
  rating: number;
  isListed: boolean;
  amenities: string[];
  roomTypes?: RoomType[];
  promotions?: RoomPromotion[];
  images: string[];
  approval: PropertyApproval;
  createdAt: string;
  updatedAt?: string;
  propertyType?: 'villa' | 'apartment' | 'house' | 'cabin' | 'cottage' | 'resort' | 'other';
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  host?: IHostInfo;
}

export const useAddProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      property,
      approvalDocuments,
    }: {
      property: Omit<Kottage, 'id' | 'createdAt' | 'approval'>;
      approvalDocuments?: File[];
    }) => {
      const newPropertyRef = push(ref(database, 'properties'));
      const propertyId = newPropertyRef.key!;

      // Fetch current user data to populate host info
      const currentUserId = auth?.currentUser?.uid;
      let hostInfo: IHostInfo | undefined;

      if (currentUserId) {
        const userSnapshot = await get(ref(database, 'users/' + currentUserId));
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          hostInfo = {
            id: currentUserId,
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
            avatar: userData.photoURL || auth?.currentUser?.photoURL || '',
            superhost: false // Default to false, can be updated later based on business logic
          };
        }
      }

      // Create initial approval status
      const initialApproval: PropertyApproval = {
        status: 'requires_documents',
        submittedAt: new Date().toISOString(),
        requiredDocuments: [
          'Title Deed',
          'Recent Utility Bill',
          'Property Tax Receipt',
          'Lease Agreement',
          'Notarized Letter of Authorization'
        ],
        submittedDocuments: [],
        approvalScore: 0
      };

      const fullProperty: Kottage = {
        id: propertyId,
        createdAt: new Date().toISOString(),
        approval: initialApproval,
        ...property,
        ownerId: currentUserId || '',
        host: hostInfo,
      };

      await set(ref(database, 'properties/' + propertyId), fullProperty);
      await set(
        ref(
          database,
          'users/' + auth?.currentUser?.uid + '/myProperties/' + propertyId
        ),
        true
      );

      // Upload approval documents
      if (approvalDocuments && approvalDocuments.length > 0) {
        const documentUploadPromises = approvalDocuments.map(async (file: File, index: number) => {
          const snapshot = await uploadBytesResumable(
            ref2(getStorage(), `approvalDocuments/${propertyId}/${file.name}`),
            file
          );
          const url = await getDownloadURL(snapshot.ref);
          
          const document: ApprovalDocument = {
            id: `doc_${index}_${Date.now()}`,
            name: file.name,
            type: 'other', // This would be determined by file type or user selection
            url,
            uploadedAt: new Date().toISOString(),
            status: 'pending'
          };

          await set(
            ref(database, `properties/${propertyId}/approval/submittedDocuments/${document.id}`),
            document
          );

          return document;
        });

        await Promise.all(documentUploadPromises);

        // Update approval status to pending if documents are submitted
        await update(ref(database, `properties/${propertyId}/approval`), {
          status: 'pending'
        });
      }

      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useMyProperties = (): UseQueryResult<Kottage[]> => {
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

export const useAllProperties = () => {
  return useQuery({
    queryKey: ['allProperties'],
    queryFn: async (): Promise<Kottage[]> => {
      const snapshot = await get(ref(database, 'properties'));
      if (!snapshot.exists()) return [];

      const propertiesData = snapshot.val();
      const properties: Kottage[] = Object.values(propertiesData);
      
      return properties.filter((property) => property !== null);
    },
    // This query is for staff use, so it doesn't depend on current user
  });
};

export const useGetPropertyById = (propertyId: string | undefined) => {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async (): Promise<Kottage | null> => {
      if (!propertyId) return null;
      
      const propertySnapshot = await get(ref(database, `properties/${propertyId}`));
      if (!propertySnapshot.exists()) return null;
      
      return propertySnapshot.val() as Kottage;
    },
    enabled: !!propertyId,
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
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
        return url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      
      // Store as an array of URLs instead of an object
      await set(
        ref(database, 'properties/' + propertyId + '/images'),
        imageUrls
      );

      return imageUrls;
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

export const useUploadApprovalDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      documents,
      documentTypes,
    }: {
      propertyId: string;
      documents: File[];
      documentTypes: ApprovalDocument['type'][];
    }) => {
      const uploadPromises = documents.map(async (file: File, index: number) => {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `approvalDocuments/${propertyId}/${file.name}`),
          file
        );
        const url = await getDownloadURL(snapshot.ref);
        
        const document: ApprovalDocument = {
          id: `doc_${index}_${Date.now()}`,
          name: file.name,
          type: documentTypes[index] || 'other',
          url,
          uploadedAt: new Date().toISOString(),
          status: 'pending'
        };

        await set(
          ref(database, `properties/${propertyId}/approval/submittedDocuments/${document.id}`),
          document
        );

        return document;
      });

      const uploadedDocuments = await Promise.all(uploadPromises);

      // Update approval status to pending if it was requires_documents
      const propertySnapshot = await get(ref(database, `properties/${propertyId}/approval/status`));
      if (propertySnapshot.val() === 'requires_documents') {
        await update(ref(database, `properties/${propertyId}/approval`), {
          status: 'pending',
          submittedAt: new Date().toISOString()
        });
      }

      return uploadedDocuments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });
};

export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      status,
      rejectionReason,
      notes,
      reviewedBy,
    }: {
      propertyId: string;
      status: PropertyApproval['status'];
      rejectionReason?: string;
      notes?: string;
      reviewedBy?: string;
    }) => {
      const updateData: Partial<PropertyApproval> = {
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy,
        notes,
      };

      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      console.log('Updating approval status:', { propertyId, updateData });
      
      try {
        await update(ref(database, `properties/${propertyId}/approval`), updateData);
        console.log('Approval status updated successfully');
      } catch (error) {
        console.error('Error updating approval status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Mutation succeeded, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      queryClient.invalidateQueries({ queryKey: ['allProperties'] });
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    }
  });
};

export const useUploadRoomImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      images,
      propertyId,
      roomId,
    }: {
      images: File[];
      propertyId: string;
      roomId: string;
    }) => {
      const uploadPromises = images.map(async (image: File, index: number) => {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `roomImages/${propertyId}/${roomId}/${Date.now()}_${index}_${image.name}`),
          image
        );
        const url = await getDownloadURL(snapshot.ref);
        return url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      return imageUrls;
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

