import React, { useState } from 'react';
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
import { Colors } from '../constants';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Mock data
const propertyData = [
  { name: 'Beach House', earnings: 4200 },
  { name: 'Mountain Cabin', earnings: 3100 },
  { name: 'City Apartment', earnings: 2800 },
  { name: 'Lake Cottage', earnings: 1900 }
];

const roomTypeData = [
  { name: 'Deluxe Suite', earnings: 5200 },
  { name: 'Standard Room', earnings: 3800 },
  { name: 'Economy Room', earnings: 2100 },
  { name: 'Family Suite', earnings: 900 }
];

// Source data removed as requested

interface EarningsBreakdownCardProps {
  // Add props if needed
}

export default function EarningsBreakdownCard({}: EarningsBreakdownCardProps) {
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
  
  // Get data based on selected breakdown type
  const getChartData = () => {
    switch (breakdownType) {
      case 0: return propertyData;
      case 1: return roomTypeData;
      default: return propertyData;
    }
  };
  
  const chartData = getChartData();
  
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