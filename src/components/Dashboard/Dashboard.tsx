import React from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

import { enUS } from 'date-fns/locale';

import IncomeChartCard from './IncomeChartCard';
import ReservationStatusCard from './ReservationStatusCard';
import EarningsBreakdownCard from './EarningsBreakdownCard';
import BookingCalendar from './BookingCalendar';
import UpcomingReservations from './UpcomingReservations';
import { Reservation, ReservationStatus, useGetMyReservations } from '../../hooks/reservationHooks';


export default function Dashboard() {
  const { data: reservations, isLoading, error } = useGetMyReservations();

  // Debug logging
  console.log('🎯 Dashboard - reservations data:', reservations);
  console.log('🎯 Dashboard - isLoading:', isLoading);
  console.log('🎯 Dashboard - error:', error);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error('🔥 Dashboard error:', error);
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load dashboard data: {error.message || 'Unknown error'}. Please try again.
      </Alert>
    );
  }

  // Ensure reservations is always an array
  const safeReservations = Array.isArray(reservations) ? reservations : [];
  console.log('🛡️ Dashboard - safeReservations:', safeReservations.length, 'items');

  const upcomingReservations = safeReservations.filter(reservation => {
    const checkInDate = new Date(reservation.checkIn);
    const today = new Date();
    return checkInDate >= today;
  });

  // Calculate status counts from real data
  const statusCounts = safeReservations.reduce((counts, reservation) => {
    const status = reservation.status;
    if (status === ReservationStatus.Confirmed) {
      counts.confirmed = (counts.confirmed || 0) + 1;
    } else if (status === ReservationStatus.Pending) {
      counts.pending = (counts.pending || 0) + 1;
    } else if (status === ReservationStatus.Cancelled) {
      counts.cancelled = (counts.cancelled || 0) + 1;
    } else if (status === ReservationStatus.Completed) {
      counts.completed = (counts.completed || 0) + 1;
    }
    return counts;
  }, { confirmed: 0, pending: 0, cancelled: 0, completed: 0 });

  return (
    <Grid container spacing={1} >
      {/* Monthly Income Section */}
      <Grid item xs={12} lg={8} >
        <IncomeChartCard reservations={safeReservations} />
        <ReservationStatusCard
          statusCounts={statusCounts}
        />
        <EarningsBreakdownCard reservations={safeReservations} />
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
