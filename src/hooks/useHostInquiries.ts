import { useEffect, useMemo, useState } from 'react';
import { get, onValue, ref, update } from 'firebase/database';
import { auth, database } from '../firebase';

export type PropertyInquiryStatus = 'new' | 'reviewed' | 'replied';

export interface PropertyInquiry {
  id: string;
  hostId: string;
  hostName: string;
  propertyId: string;
  propertyName: string;
  guestUid?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  message: string;
  source: 'property_page';
  status: PropertyInquiryStatus;
  createdAt: number;
}

const normalizeInquiry = (
  id: string,
  raw: Partial<PropertyInquiry> | null | undefined
): PropertyInquiry | null => {
  if (!raw || !raw.hostId || !raw.propertyId || !raw.propertyName) {
    return null;
  }

  return {
    id,
    hostId: raw.hostId,
    hostName: raw.hostName || 'Property Host',
    propertyId: raw.propertyId,
    propertyName: raw.propertyName,
    guestUid: raw.guestUid,
    guestName: raw.guestName || 'Guest',
    guestEmail: raw.guestEmail || '',
    guestPhone: raw.guestPhone || '',
    message: raw.message || '',
    source: 'property_page',
    status: raw.status || 'new',
    createdAt: raw.createdAt || Date.now(),
  };
};

export const useHostInquiries = (hostId?: string | null) => {
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hostId) {
      setInquiries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const inquiriesRef = ref(database, `propertyInquiries/${hostId}`);

    const unsubscribe = onValue(
      inquiriesRef,
      snapshot => {
        const rawData = snapshot.val() || {};
        const nextInquiries = Object.entries(rawData)
          .map(([id, raw]) =>
            normalizeInquiry(id, raw as Partial<PropertyInquiry> | null)
          )
          .filter((inquiry): inquiry is PropertyInquiry => inquiry !== null)
          .sort((a, b) => b.createdAt - a.createdAt);

        setInquiries(nextInquiries);
        setLoading(false);
      },
      () => {
        setInquiries([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hostId]);

  const unreadCount = useMemo(
    () => inquiries.filter(inquiry => inquiry.status === 'new').length,
    [inquiries]
  );

  const updateInquiryStatus = async (
    inquiryId: string,
    status: PropertyInquiryStatus
  ) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      throw new Error('Host not authenticated');
    }

    await update(ref(database, `propertyInquiries/${currentUserId}/${inquiryId}`), {
      status,
    });
  };

  const markAllAsReviewed = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      return;
    }

    const snapshot = await get(ref(database, `propertyInquiries/${currentUserId}`));
    if (!snapshot.exists()) {
      return;
    }

    const rawData = snapshot.val() || {};
    const updates: Record<string, PropertyInquiryStatus> = {};

    Object.keys(rawData).forEach(inquiryId => {
      if (rawData[inquiryId]?.status === 'new') {
        updates[`${inquiryId}/status`] = 'reviewed';
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(database, `propertyInquiries/${currentUserId}`), updates);
    }
  };

  return {
    inquiries,
    unreadCount,
    loading,
    updateInquiryStatus,
    markAllAsReviewed,
  };
};
