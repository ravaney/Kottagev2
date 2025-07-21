import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
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
import { Colors } from '../constants';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import IncomeCard from './IncomeCard';
import ReservationsCard from './ReservationsCard';
import { Reservation } from '../../hooks/reservationHooks';

interface IncomeChartCardProps {
  reservations: Reservation[];
}

export default function IncomeChartCard({ reservations }: IncomeChartCardProps) {
  const [timePeriod, setTimePeriod] = useState<string>('monthly');
  
  const handleTimePeriodChange = (event: React.MouseEvent<HTMLElement>, newTimePeriod: string | null) => {
    if (newTimePeriod !== null) {
      setTimePeriod(newTimePeriod);
    }
  };

  // Calculate income data from real reservations
  const incomeData = useMemo(() => {
    const now = new Date();
    const completedReservations = reservations.filter(r => r.status.toLowerCase() === 'completed');
    
    if (timePeriod === 'weekly') {
      // Get last 7 days
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayIncome = completedReservations
          .filter(r => {
            const checkOut = new Date(r.checkOut);
            return checkOut.toDateString() === date.toDateString();
          })
          .reduce((sum, r) => sum + r.totalPrice, 0);
        
        weeklyData.push({ period: dayName, income: dayIncome });
      }
      return weeklyData;
    } else if (timePeriod === 'monthly') {
      // Get last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthIncome = completedReservations
          .filter(r => {
            const checkOut = new Date(r.checkOut);
            return checkOut.getMonth() === date.getMonth() && 
                   checkOut.getFullYear() === date.getFullYear();
          })
          .reduce((sum, r) => sum + r.totalPrice, 0);
        
        monthlyData.push({ period: monthName, income: monthIncome });
      }
      return monthlyData;
    } else {
      // Year to date - by quarters
      const currentYear = now.getFullYear();
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      
      return quarters.map((quarter, index) => {
        const startMonth = index * 3;
        const endMonth = startMonth + 2;
        
        const quarterIncome = completedReservations
          .filter(r => {
            const checkOut = new Date(r.checkOut);
            return checkOut.getFullYear() === currentYear &&
                   checkOut.getMonth() >= startMonth &&
                   checkOut.getMonth() <= endMonth;
          })
          .reduce((sum, r) => sum + r.totalPrice, 0);
        
        return { period: quarter, income: quarterIncome };
      });
    }
  }, [reservations, timePeriod]);

  // Calculate current period statistics
  const currentPeriodStats = useMemo(() => {
    const now = new Date();
    const completedReservations = reservations.filter(r => r.status.toLowerCase() === 'completed');
    
    if (timePeriod === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      
      const thisWeekReservations = completedReservations.filter(r => {
        const checkOut = new Date(r.checkOut);
        return checkOut >= weekStart && checkOut <= now;
      });
      
      const income = thisWeekReservations.reduce((sum, r) => sum + r.totalPrice, 0);
      const guests = new Set(thisWeekReservations.flatMap(r => r.guests.map(g => g.email))).size;
      
      return {
        income: { amount: `$${income.toLocaleString()}`, percentage: '+8.3%', isPositive: true, period: 'This Week' },
        guests: { count: guests, description: 'Unique guests this week', percentage: '+12.5%', isPositive: true }
      };
    } else if (timePeriod === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const thisMonthReservations = completedReservations.filter(r => {
        const checkOut = new Date(r.checkOut);
        return checkOut >= monthStart && checkOut <= now;
      });
      
      const income = thisMonthReservations.reduce((sum, r) => sum + r.totalPrice, 0);
      const guests = new Set(thisMonthReservations.flatMap(r => r.guests.map(g => g.email))).size;
      
      return {
        income: { amount: `$${income.toLocaleString()}`, percentage: '+12.5%', isPositive: true, period: 'This Month' },
        guests: { count: guests, description: 'Unique guests this month', percentage: '+8.3%', isPositive: true }
      };
    } else {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      
      const thisYearReservations = completedReservations.filter(r => {
        const checkOut = new Date(r.checkOut);
        return checkOut >= yearStart && checkOut <= now;
      });
      
      const income = thisYearReservations.reduce((sum, r) => sum + r.totalPrice, 0);
      const guests = new Set(thisYearReservations.flatMap(r => r.guests.map(g => g.email))).size;
      
      return {
        income: { amount: `$${income.toLocaleString()}`, percentage: '+15.2%', isPositive: true, period: 'Year to Date' },
        guests: { count: guests, description: 'Unique guests this year', percentage: '+22.4%', isPositive: true }
      };
    }
  }, [reservations, timePeriod]);
  
  // Format title based on selected period
  const getTitle = () => {
    switch(timePeriod) {
      case 'weekly': return 'Weekly Income';
      case 'monthly': return 'Monthly Income';
      case 'ytd': return 'Year to Date Income';
      default: return 'Income';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: 400, mb: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TrendingUpIcon sx={{ color: Colors.blue, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600} color={Colors.blue}>
            {getTitle()}
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          value={timePeriod}
          exclusive
          onChange={handleTimePeriodChange}
          aria-label="time period"
          sx={{ 
            '& .MuiToggleButton-root': { 
              py: 0.5, 
              px: 1.5, 
              textTransform: 'none',
              fontSize: '0.75rem'
            },
            '& .Mui-selected': {
              backgroundColor: `${Colors.blue}15 !important`,
              color: Colors.blue,
              fontWeight: 600
            }
          }}
        >
          <ToggleButton value="weekly" aria-label="weekly">
            Weekly
          </ToggleButton>
          <ToggleButton value="monthly" aria-label="monthly">
            Monthly
          </ToggleButton>
          <ToggleButton value="ytd" aria-label="ytd">
            Year to Date
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid container spacing={3}>
        {/* Chart - 2/3 width */}
        <Grid item xs={8}>
          <ResponsiveContainer width="100%">
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
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
            gap={3}
            height={300}
            justifyContent="space-between"
          >
            <IncomeCard
              amount={currentPeriodStats.income.amount}
              percentage={currentPeriodStats.income.percentage}
              isPositive={currentPeriodStats.income.isPositive}
              period={currentPeriodStats.income.period}
            />
            <ReservationsCard
              count={currentPeriodStats.guests.count}
              description={currentPeriodStats.guests.description}
              percentage={currentPeriodStats.guests.percentage}
              isPositive={currentPeriodStats.guests.isPositive}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}