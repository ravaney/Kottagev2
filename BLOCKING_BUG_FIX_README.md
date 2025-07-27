# Date Blocking Bug Fix

## Problem Description
When users made a reservation through the BookRoom component, the selected dates were not being blocked automatically, allowing other users to book the same dates.

## Root Causes Identified

1. **Status Mismatch**: Reservations were created with `ReservationStatus.Pending`, but the Firebase function only blocked dates for `['confirmed', 'Checked-in', 'in_progress']` statuses.

2. **Missing Required Fields**: The reservation data structure was missing `propertyId` and `roomTypeId` fields that the Firebase blocking function expected.

3. **Cache Invalidation**: The `useBlockedDates` query cache wasn't being invalidated when new reservations were created.

## Changes Made

### 1. Updated Reservation Interface (`src/hooks/reservationHooks.ts`)
- Added `propertyId: string` and `roomTypeId: string` fields to the `Reservation` interface

### 2. Modified BookRoom Component (`src/components/Property/Reservations/BookRoom.tsx`)
- Changed reservation status from `ReservationStatus.Pending` to `ReservationStatus.Confirmed` (since payment is processed immediately)
- Added `propertyId` and `roomTypeId` fields to reservation data

### 3. Updated Firebase Functions (`functions/src/manageBlockedDates.ts`)
- Added `'pending'` to the list of statuses that trigger date blocking
- Enhanced the blocking functions to handle both new field structure and legacy fallbacks
- Improved error handling for missing propertyId/roomTypeId

### 4. Enhanced Cache Management (`src/hooks/reservationHooks.ts`)
- Added `blockedDates` query invalidation to `useCreateReservation` success handler

## How It Works Now

1. User selects dates and clicks "Confirm & Pay"
2. Reservation is created with `status: 'confirmed'` and includes `propertyId` and `roomTypeId`
3. Firebase function `onReservationCreated` triggers automatically
4. Function blocks all nights between check-in and check-out dates
5. `useBlockedDates` cache is invalidated, causing UI to refresh
6. Previously selected dates now appear as blocked for other users

## Testing

To test the fix:
1. Book a room for specific dates
2. Go back to the same room's booking page
3. Verify that the previously selected dates are now disabled in the date picker
4. Try booking from another user account to confirm dates are globally blocked

## Deployment

Make sure to deploy the updated Firebase functions:
```bash
cd functions
npm run build
firebase deploy --only functions
```
