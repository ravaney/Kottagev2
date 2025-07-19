import React from 'react';
import {
  Box,
  Grid,
} from '@mui/material';

import { enUS } from 'date-fns/locale';

import IncomeChartCard from './IncomeChartCard';
import ReservationStatusCard from './ReservationStatusCard';
import EarningsBreakdownCard from './EarningsBreakdownCard';
import BookingCalendar from './BookingCalendar';
import UpcomingReservations from './UpcomingReservations';
import { Reservation, ReservationStatus } from '../../hooks/reservationHooks';


// Mock data

const upcomingReservations: Reservation[] = [
  {
    reservationId: '1',
    guests: [
      { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    ],
    property: {
      id: '1',
      name: 'Cozy Apartment',
      address: {
        address1: '123 Main St',
        city: 'New York',
        country: 'USA',
        state: '',
      },
    },
    checkIn: '2025-07-15T00:00:00Z',
    checkOut: '2025-07-20T00:00:00Z',
    totalPrice: 1500,
    status: ReservationStatus.Confirmed,
    createdAt: '2024-01-01T00:00:00Z',

    userId: '',
  },
  {
    reservationId: '2',
    guests: [
      { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    ],
    property: {
      id: '2',
      name: 'Beach House',
      address: {
        address1: '456 Ocean Ave',
        city: 'Los Angeles',
        country: 'USA',
        state: '',
      },
    },
    checkIn: '2025-08-18T00:00:00Z',
    checkOut: '2025-08-25T00:00:00Z',
    totalPrice: 2100,
    status: ReservationStatus.Confirmed,
    createdAt: '2024-01-02T00:00:00Z',

    userId: '',
  },
  {
    reservationId: '3',
    guests: [
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '555-555-5555',
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '555-555-5555',
      },
    ],
    property: {
      id: '3',
      name: 'Mountain Cabin',
      address: {
        address1: '789 Pine St',
        city: 'Denver',
        country: 'USA',
        state: '',
      },
    },
    checkIn: '2025-07-22T00:00:00Z',
    checkOut: '2025-07-28T00:00:00Z',
    totalPrice: 900,
    status: ReservationStatus.Confirmed,
    createdAt: '2024-01-03T00:00:00Z',

    userId: '',
  },
  {
    reservationId: '4',
    guests: [
      {
        name: 'Jessicca Alba',
        email: 'jessicca@example.com',
        phone: '555-555-5555',
      },
    ],
    property: {
      id: '3',
      name: 'Mountain Cabin',
      address: {
        address1: '789 Pine St',
        city: 'Denver',
        country: 'USA',
        state: '',
      },
    },
    checkIn: '2025-07-22T00:00:00Z',
    checkOut: '2025-07-29T00:00:00Z',
    totalPrice: 900,
    status: ReservationStatus.Confirmed,
    createdAt: '2024-01-03T00:00:00Z',

    userId: '',
  },
];

export default function Dashboard() {
  return (
    <Grid container spacing={1} >
      {/* Monthly Income Section */}
      <Grid item xs={12} lg={8} >
        <IncomeChartCard />
        <ReservationStatusCard
          statusCounts={{
            confirmed: 12,
            pending: 5,
            cancelled: 3,
            completed: 18
          }}
        />
        <EarningsBreakdownCard />
      </Grid>

      {/* Right Column - Properties, Calendar, and Reservations */}
      <Grid item xs={12} lg={4}>
        <Box display="flex" flexDirection="column" gap={1}>


          <BookingCalendar events={upcomingReservations} />

          <UpcomingReservations reservations={upcomingReservations} />
        </Box>
      </Grid>
    </Grid>
  );
}
