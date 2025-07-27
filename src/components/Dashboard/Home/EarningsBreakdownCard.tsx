import React, { useState, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Colors } from '../../constants';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Reservation } from '../../../hooks/reservationHooks';

interface EarningsBreakdownCardProps {
  reservations: Reservation[];
}

export default function EarningsBreakdownCard({ reservations }: EarningsBreakdownCardProps) {
  const [timePeriod, setTimePeriod] = useState<string>('monthly');
  const [breakdownType, setBreakdownType] = useState<number>(0);
  const [dateRange, setDateRange] = useState<string>('last30days');
  
  const handleTimePeriodChange = (event: React.MouseEvent<HTMLElement>, newTimePeriod: string | null) => {
    if (newTimePeriod !== null) {
      setTimePeriod(newTimePeriod);
    }
  };
  
  const handleBreakdownChange = (event: React.SyntheticEvent, newValue: number) => {
    setBreakdownType(newValue);
  };
  
  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
  };

  // Filter reservations based on date range
  const filteredReservations = useMemo(() => {
    const now = new Date();
    const completedReservations = reservations.filter(r => r.status.toLowerCase() === 'completed');
    
    let startDate: Date;
    switch (dateRange) {
      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return completedReservations.filter(r => {
      const checkOut = new Date(r.checkOut);
      return checkOut >= startDate && checkOut <= now;
    });
  }, [reservations, dateRange]);

  // Calculate earnings data based on breakdown type
  const chartData = useMemo(() => {
    if (breakdownType === 0) {
      // By Property
      const propertyEarnings = filteredReservations.reduce((acc, reservation) => {
        const propertyName = reservation.property.name;
        acc[propertyName] = (acc[propertyName] || 0) + reservation.totalPrice;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(propertyEarnings)
        .map(([name, earnings]) => ({ name, earnings }))
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 10); // Top 10 properties
    } else {
      // By Room Type (if available in your data structure)
      // For now, we'll group by guest count as a proxy for room size
      const roomTypeEarnings = filteredReservations.reduce((acc, reservation) => {
        const guestCount = reservation.guests.length;
        let roomType: string;
        
        if (guestCount === 1) roomType = 'Single Room';
        else if (guestCount === 2) roomType = 'Double Room';
        else if (guestCount <= 4) roomType = 'Family Room';
        else roomType = 'Group Room';

        acc[roomType] = (acc[roomType] || 0) + reservation.totalPrice;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(roomTypeEarnings)
        .map(([name, earnings]) => ({ name, earnings }))
        .sort((a, b) => b.earnings - a.earnings);
    }
  }, [filteredReservations, breakdownType]);
  
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: '4px',mb:1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AttachMoneyIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Earnings Breakdown
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
          <ToggleButton value="yearly" aria-label="yearly">
            Yearly
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={breakdownType} 
          onChange={handleBreakdownChange}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              fontSize: '0.8rem',
              textTransform: 'none',
              fontWeight: 600
            }
          }}
        >
          <Tab label="By Property" />
          <Tab label="By Room Type" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            label="Date Range"
            onChange={handleDateRangeChange}
            sx={{ fontSize: '0.8rem' }}
          >
            <MenuItem value="last7days">Last 7 Days</MenuItem>
            <MenuItem value="last30days">Last 30 Days</MenuItem>
            <MenuItem value="last90days">Last 90 Days</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Earnings']}
              contentStyle={{ fontSize: '0.8rem' }}
            />
            <Bar 
              dataKey="earnings" 
              fill={Colors.blue} 
              radius={[4, 4, 0, 0]}
              name="Earnings"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #e0e0e0' }}>
        <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Earnings</span>
          <span>${chartData.reduce((sum, item) => sum + item.earnings, 0).toLocaleString()}</span>
        </Typography>
      </Box>
    </Paper>
  );
}