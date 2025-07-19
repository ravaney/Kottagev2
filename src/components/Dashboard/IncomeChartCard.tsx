import React, { useState } from 'react';
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

// Mock data for different time periods
const incomeData = {
  weekly: [
    { period: 'Mon', income: 600 },
    { period: 'Tue', income: 450 },
    { period: 'Wed', income: 850 },
    { period: 'Thu', income: 700 },
    { period: 'Fri', income: 1200 },
    { period: 'Sat', income: 1500 },
    { period: 'Sun', income: 900 },
  ],
  monthly: [
    { period: 'Jan', income: 2400 },
    { period: 'Feb', income: 1398 },
    { period: 'Mar', income: 9800 },
    { period: 'Apr', income: 3908 },
    { period: 'May', income: 4800 },
    { period: 'Jun', income: 3800 },
  ],
  ytd: [
    { period: 'Q1', income: 13598 },
    { period: 'Q2', income: 18508 },
    { period: 'Q3', income: 22400 },
    { period: 'Q4', income: 15600 },
  ],
};

export default function IncomeChartCard() {
  const [timePeriod, setTimePeriod] = useState<string>('monthly');
  
  const handleTimePeriodChange = (event: React.MouseEvent<HTMLElement>, newTimePeriod: string | null) => {
    if (newTimePeriod !== null) {
      setTimePeriod(newTimePeriod);
    }
  };
  
  const currentData = incomeData[timePeriod as keyof typeof incomeData];
  
  // Calculate total income for the selected period
  const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0);
  
  // Period-specific data for stat cards
  const periodData = {
    weekly: {
      income: { amount: '$5,200', percentage: '+8.3%', isPositive: true, period: 'This Week' },
      guests: { count: 18, description: 'Unique guests this week', percentage: '+12.5%', isPositive: true }
    },
    monthly: {
      income: { amount: '$24,500', percentage: '+12.5%', isPositive: true, period: 'This Month' },
      guests: { count: 42, description: 'Unique guests this month', percentage: '+8.3%', isPositive: true }
    },
    ytd: {
      income: { amount: '$70,106', percentage: '+15.2%', isPositive: true, period: 'Year to Date' },
      guests: { count: 156, description: 'Unique guests this year', percentage: '+22.4%', isPositive: true }
    }
  };
  
  const currentPeriodData = periodData[timePeriod as keyof typeof periodData];
  
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
            <BarChart data={currentData}>
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
              amount={currentPeriodData.income.amount}
              percentage={currentPeriodData.income.percentage}
              isPositive={currentPeriodData.income.isPositive}
              period={currentPeriodData.income.period}
            />
            <ReservationsCard
              count={currentPeriodData.guests.count}
              description={currentPeriodData.guests.description}
              percentage={currentPeriodData.guests.percentage}
              isPositive={currentPeriodData.guests.isPositive}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}