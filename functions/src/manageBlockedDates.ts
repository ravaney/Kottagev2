// functions/src/manageBlockedDates.ts
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.database();

// Automatically block dates when reservation is created
export const onReservationCreated = functions.database
  .ref('/reservations/{reservationId}')
  .onCreate(async (snapshot, context) => {
    const reservation = snapshot.val();
    const reservationId = context.params.reservationId;
    
    if (reservation.status !== 'confirmed') return;
    
    try {
      await blockDatesForReservation(reservation, reservationId);
      console.log(`Blocked dates for reservation ${reservationId}`);
    } catch (error) {
      console.error('Error blocking dates:', error);
    }
  });

// Unblock dates when reservation is cancelled
export const onReservationUpdated = functions.database
  .ref('/reservations/{reservationId}')
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();
    const reservationId = context.params.reservationId;
    
    // If reservation was cancelled or rejected
    if (before.status === 'confirmed' && 
        (after.status === 'cancelled' || after.status === 'rejected')) {
      try {
        await unblockDatesForReservation(before, reservationId);
        console.log(`Unblocked dates for cancelled reservation ${reservationId}`);
      } catch (error) {
        console.error('Error unblocking dates:', error);
      }
    }
    
    // If reservation was confirmed
    if (before.status !== 'confirmed' && after.status === 'confirmed') {
      try {
        await blockDatesForReservation(after, reservationId);
        console.log(`Blocked dates for confirmed reservation ${reservationId}`);
      } catch (error) {
        console.error('Error blocking dates:', error);
      }
    }
  });

async function blockDatesForReservation(reservation: any, reservationId: string) {
  const { propertyId, roomTypeId, checkIn, checkOut, userId } = reservation;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  const updates: { [key: string]: any } = {};
  
  // Block each night between check-in and check-out
  for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const blockKey = `${propertyId}_${roomTypeId}_${dateStr}`;
    
    updates[`/blockedDates/${blockKey}`] = {
      propertyId,
      roomTypeId,
      date: dateStr,
      reason: 'reservation',
      reservationId,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      createdBy: userId
    };
  }
  
  await db.ref().update(updates);
}

async function unblockDatesForReservation(reservation: any, reservationId: string) {
  const { propertyId, roomTypeId, checkIn, checkOut } = reservation;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  const updates: { [key: string]: any } = {};
  
  // Unblock each night
  for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const blockKey = `${propertyId}_${roomTypeId}_${dateStr}`;
    updates[`/blockedDates/${blockKey}`] = null; // Delete the entry
  }
  
  await db.ref().update(updates);
}