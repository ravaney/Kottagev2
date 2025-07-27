/**
 * Utility functions for reservation management
 */

import { Kottage, Reservation, ReservationStatus, RoomType } from '../../../hooks';
import { analyticsService } from '../../../services/analyticsService';
import { blockDatesForReservation } from '../../../utils/blockingUtils';

export interface ConfirmPaymentParams {
  startDate: Date;
  endDate: Date;
  room: RoomType;
  kottage: Kottage;
  uid: string;
  appUser: any;
  total: number;
  guests: number;
  createReservation: (data: Reservation) => Promise<any>;
  updateProperty: {
    mutateAsync: (data: { id: string; roomTypes: RoomType[] }) => Promise<any>;
  };
  refetchBlockedDates: () => void;
  setPaymentSuccess: (success: boolean) => void;
  setPaymentError: (error: string) => void;
}

/**
 * Calculate the number of nights between two dates
 */
export const calculateNights = (startDate?: Date, endDate?: Date): number => {
  if (startDate && endDate && endDate > startDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  return 0;
};

/**
 * Check if a date range has blocked dates in between
 */
export const hasBlockedDatesInRange = (
  start: Date, 
  end: Date, 
  blockedDates: string[]
): boolean => {
  if (!start || !end || start >= end) return false;
  
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  
  // Generate all dates between start and end (exclusive of end date)
  const datesInRange: string[] = [];
  const currentDate = new Date(start);
  
  while (currentDate < end) {
    datesInRange.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Check if any date in the range is blocked
  const hasBlocked = datesInRange.some(date => blockedDates.includes(date));
  
  return hasBlocked;
};

/**
 * Find the next available checkout date after a given checkin date
 */
export const getMaxCheckoutDate = (
  checkinDate: Date, 
  blockedDates: string[]
): Date | undefined => {
  if (!checkinDate) return undefined;
  
  const nextDay = new Date(checkinDate);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Find the first blocked date after checkin
  let currentDate = new Date(nextDay);
  const maxDate = new Date(checkinDate);
  maxDate.setMonth(maxDate.getMonth() + 3); // Search up to 3 months ahead
  
  while (currentDate <= maxDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (blockedDates.includes(dateStr)) {
      // Found a blocked date, so max checkout is the day before
      const maxCheckout = new Date(currentDate);
      maxCheckout.setDate(maxCheckout.getDate() - 1);
      return maxCheckout > checkinDate ? maxCheckout : undefined;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return maxDate; // No blocked dates found within 3 months
};

/**
 * Handle the confirmation and payment process for a reservation
 */
export const handleConfirmPayment = async (params: ConfirmPaymentParams): Promise<void> => {
  const {
    startDate,
    endDate,
    room,
    kottage,
    uid,
    appUser,
    total,
    guests,
    createReservation,
    updateProperty,
    refetchBlockedDates,
    setPaymentSuccess,
    setPaymentError
  } = params;

  try {
    // Track booking attempt
    analyticsService.trackBookingAttempt(kottage.id);
    
    // Generate a temporary reservation ID
    const tempReservationId = `BK-${Date.now()}-RES`;

    const reservationData: Reservation = {
      reservationId: tempReservationId,
      userId: String(uid),
      checkIn: startDate.toISOString(),
      checkOut: endDate.toISOString(),
      guests: [
        {
          name: appUser?.firstName + ' ' + appUser?.lastName || '',
          email: appUser?.email || ''
        },
      ],
      rooms: [room.id],
      totalPrice: total,
      status: ReservationStatus.Confirmed,
      createdAt: new Date().toISOString(),
      payment: {
        method: 'card',
        transactionId: '0000000',
        paid: true,
        amount: total,
      },
      property:{
        id: kottage.id,
        name: kottage.name,
      },
      // Add required fields for date blocking
      propertyId: kottage.id,
      roomTypeId: room.id
    };

    // Block dates for the reservation
    await blockDatesForReservation(
      kottage.id,
      room.id,
      startDate,
      endDate,
      tempReservationId,
      String(uid)
    );

    // Create the reservation
    await createReservation(reservationData);
    console.log('Reservation created successfully');
    
    // Decrement room quantityAvailable
    try {
      const updatedRoomTypes = kottage.roomTypes?.map(rt =>
        rt.id === room.id
          ? { ...rt, quantityAvailable: Math.max(0, rt.quantityAvailable - 1) }
          : rt
      ) || [];
      await updateProperty.mutateAsync({ id: kottage.id, roomTypes: updatedRoomTypes });
    } catch (e) {
      console.error('Failed to update room quantity:', e);
    }
    
    // Refetch blocked dates to update the UI
    refetchBlockedDates();
    
    // Track completed booking
    analyticsService.trackBookingCompleted(
      kottage.id,
      room.id,
      String(uid),
      total,
      guests,
      startDate.toISOString(),
      endDate.toISOString()
    );
    
    setPaymentSuccess(true);
    
  } catch (error) {
    setPaymentError(error instanceof Error ? error.message : 'Failed to create reservation. Please try again.');
  }
};

