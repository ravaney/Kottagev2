import { ref, update, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase';

export interface BlockedDate {
  propertyId: string;
  roomTypeId: string;
  date: string; // YYYY-MM-DD format
  reason: 'reservation' | 'maintenance' | 'manual';
  reservationId?: string;
  createdAt: number;
  createdBy: string;
}

// Block dates manually (for maintenance or owner blocking)
export const blockDatesManually = async (
  propertyId: string,
  roomTypeId: string,
  dates: string[],
  reason: 'maintenance' | 'manual',
  userId: string
): Promise<void> => {
  const updates: { [key: string]: any } = {};
  
  dates.forEach(date => {
    const blockKey = `${propertyId}_${roomTypeId}_${date}`;
    updates[`blockedDates/${blockKey}`] = {
      propertyId,
      roomTypeId,
      date,
      reason,
      createdAt: Date.now(),
      createdBy: userId
    };
  });
  
  await update(ref(database), updates);
};

// Unblock dates manually
export const unblockDatesManually = async (
  propertyId: string,
  roomTypeId: string,
  dates: string[]
): Promise<void> => {
  const updates: { [key: string]: any } = {};
  
  dates.forEach(date => {
    const blockKey = `${propertyId}_${roomTypeId}_${date}`;
    updates[`blockedDates/${blockKey}`] = null;
  });
  
  await update(ref(database), updates);
};

// Get all blocked dates for a property
export const getBlockedDatesForProperty = async (
  propertyId: string,
  roomTypeId?: string
): Promise<BlockedDate[]> => {
  const blockedDatesRef = query(
    ref(database, 'blockedDates'),
    orderByChild('propertyId'),
    equalTo(propertyId)
  );
  
  const snapshot = await get(blockedDatesRef);
  const blockedDates: BlockedDate[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val() as BlockedDate;
      // Filter by room type if specified
      if (!roomTypeId || data.roomTypeId === roomTypeId) {
        blockedDates.push(data);
      }
    });
  }
  
  return blockedDates.sort((a, b) => a.date.localeCompare(b.date));
};

// Get blocked dates in a date range
export const getBlockedDatesInRange = async (
  propertyId: string,
  roomTypeId: string,
  startDate: Date,
  endDate: Date
): Promise<string[]> => {
  const allBlockedDates = await getBlockedDatesForProperty(propertyId, roomTypeId);
  
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  
  return allBlockedDates
    .filter(blocked => blocked.date >= startDateStr && blocked.date <= endDateStr)
    .map(blocked => blocked.date);
};

// Utility function to generate date range
export const generateDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Check if specific dates are blocked
export const checkDatesBlocked = async (
  propertyId: string,
  roomTypeId: string,
  dates: string[]
): Promise<{ [date: string]: boolean }> => {
  const blockedDates = await getBlockedDatesForProperty(propertyId, roomTypeId);
  const blockedDateStrings = new Set(blockedDates.map(d => d.date));
  
  const result: { [date: string]: boolean } = {};
  dates.forEach(date => {
    result[date] = blockedDateStrings.has(date);
  });
  
  return result;
};
