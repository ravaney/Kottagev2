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
  Chip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Colors } from '../constants';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import MonthlyIncomeCard from './MonthlyIncomeCard';
import ReservationsCard from './ReservationsCard';
import PropertiesCard from './PropertiesCard';
import BookingCalendar from './BookingCalendar';
import UpcomingReservations from './UpcomingReservations';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Mock data
const monthlyIncomeData = [
  { month: 'Jan', income: 2400 },
  { month: 'Feb', income: 1398 },
  { month: 'Mar', income: 9800 },
  { month: 'Apr', income: 3908 },
  { month: 'May', income: 4800 },
  { month: 'Jun', income: 3800 },
];

const upcomingReservations = [
  { id: 1, guest: 'John Doe', property: 'Villa Velha', checkIn: '2024-02-15', checkOut: '2024-02-20', amount: '$1,200' },
  { id: 2, guest: 'Jane Smith', property: 'Beach House', checkIn: '2024-02-18', checkOut: '2024-02-25', amount: '$2,100' },
  { id: 3, guest: 'Mike Johnson', property: 'Mountain Cabin', checkIn: '2024-02-22', checkOut: '2024-02-28', amount: '$900' },
];

const bookedDates = [
  {
    title: 'Villa Velha - John Doe',
    start: new Date(2024, 1, 15),
    end: new Date(2024, 1, 20),
  },
  {
    title: 'Beach House - Jane Smith',
    start: new Date(2024, 1, 18),
    end: new Date(2024, 1, 25),
  },
  {
    title: 'Mountain Cabin - Mike Johnson',
    start: new Date(2024, 1, 22),
    end: new Date(2024, 1, 28),
  },
];

export default function Dashboard() {
  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" fontWeight={700} color={Colors.blue} sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Monthly Income Section */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
              <TrendingUpIcon sx={{ color: Colors.blue, fontSize: 28 }} />
              <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                Monthly Income
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {/* Chart - 2/3 width */}
              <Grid item xs={8}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Income']} />
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
                <Box display="flex" flexDirection="column" gap={2} height={300} justifyContent="center">
                  <MonthlyIncomeCard 
                    amount="$4,200" 
                    percentage="+12.5%" 
                    isPositive={true} 
                  />
                  <ReservationsCard 
                    count={24} 
                    description="Unique guests this month" 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Properties, Calendar, and Reservations */}
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            <BookingCalendar events={bookedDates} />
            <PropertiesCard 
              totalProperties={8} 
              status={{ vacant: 5, occupied: 2, unlisted: 1 }} 
            />
            <UpcomingReservations reservations={upcomingReservations} />
          </Box>
        </Grid>


      </Grid>
    </Box>
  );
}