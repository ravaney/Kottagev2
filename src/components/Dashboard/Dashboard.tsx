import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Colors } from '../constants';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import MonthlyIncomeCard from './MonthlyIncomeCard';
import ReservationsCard from './ReservationsCard';
import PropertiesCard from './PropertiesCard';
import BookingCalendar from './BookingCalendar';
import UpcomingReservations from './UpcomingReservations';
import { Reservation, ReservationStatus } from '../../hooks/reservationHooks';

const locales = {
  'en-US': enUS,
};

// Mock data
const monthlyIncomeData = [
  { month: 'Jan', income: 2400 },
  { month: 'Feb', income: 1398 },
  { month: 'Mar', income: 9800 },
  { month: 'Apr', income: 3908 },
  { month: 'May', income: 4800 },
  { month: 'Jun', income: 3800 },
];

const upcomingReservations: Reservation[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
        <Paper elevation={3} sx={{ p: 2, height: 400 }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
            <TrendingUpIcon sx={{ color: Colors.blue, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600} color={Colors.blue}>
              Monthly Income
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {/* Chart - 2/3 width */}
            <Grid item xs={8}>
              <ResponsiveContainer width="100%">
                <BarChart data={monthlyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      'Income',
                    ]}
                  />
                  <Bar
                    dataKey="income"
                    fill={Colors.blue}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Grid>

            {/* Stats Cards - 1/3 width */}
            <Grid item xs={4}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                height={300}
                justifyContent="space-between"
              >
                <MonthlyIncomeCard
                  amount="$4,200"
                  percentage="+12.5%"
                  isPositive={true}
                />
                <ReservationsCard
                  count={24}
                  description="Unique guests this month"
                  percentage="+8.3%"
                  isPositive={true}
                />
                <PropertiesCard
                  totalProperties={8}
                  status={{ vacant: 5, occupied: 2, unlisted: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Right Column - Properties, Calendar, and Reservations */}
      <Grid item xs={12} lg={4}>
        <Box display="flex" flexDirection="column" gap={3}>
          <BookingCalendar events={upcomingReservations} />

          <UpcomingReservations reservations={upcomingReservations} />
        </Box>
      </Grid>
    </Grid>
  );
}
