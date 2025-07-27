import { useQuery } from '@tanstack/react-query';
import { getDatabase, ref, get } from 'firebase/database';

export const useBlockedDates = (propertyId: string, roomTypeId: string) => {
  return useQuery({
    queryKey: ['blockedDates', propertyId, roomTypeId],
    queryFn: async () => {
      if (!propertyId || !roomTypeId) {
        return [];
      }
      
      
      const db = getDatabase();
      const blockedRef = ref(db, 'blockedDates');
      const snapshot = await get(blockedRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const all = snapshot.val();
      
      if (!all || typeof all !== 'object') {
        return [];
      }
      
      // Filter for this property and roomType
      const filtered = Object.values(all).filter((b: any) => {
        const matches = b && b.propertyId === propertyId && b.roomTypeId === roomTypeId;
        return matches;
      });
      
      
      const dates = filtered.map((b: any) => b.date).filter(date => date);
      
      return dates;
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2, // Retry failed requests
  });
};
