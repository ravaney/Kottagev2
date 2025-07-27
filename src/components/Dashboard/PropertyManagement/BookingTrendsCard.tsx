import React, { useState } from 'react';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton, Tabs, Tab } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Colors } from '../../constants';

interface BookingData {
  date: string;
  bookings: number;
  revenue: number;
}

interface GuestOrigin {
  country: string;
  state?: string;
  count: number;
  percentage: number;
}

interface BookingTrendsCardProps {
  dailyData: BookingData[];
  weeklyData: BookingData[];
  monthlyData: BookingData[];
  ytdData: BookingData[];
  guestOrigins: GuestOrigin[];
}

export default function BookingTrendsCard({ dailyData, weeklyData, monthlyData, ytdData, guestOrigins }: BookingTrendsCardProps) {
  const [timePeriod, setTimePeriod] = useState<string>('weekly');
  const [chartType, setChartType] = useState<string>('line');
  const [viewTab, setViewTab] = useState<number>(0);
  
  const handleTimePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: string | null) => {
    if (newPeriod !== null) {
      setTimePeriod(newPeriod);
    }
  };
  
  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setViewTab(newValue);
  };
  
  // Get data based on selected time period
  const getChartData = () => {
    switch (timePeriod) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      case 'ytd': return ytdData;
      default: return weeklyData;
    }
  };
  
  const currentData = getChartData();
  
  // Sort guest origins by count
  const sortedOrigins = [...guestOrigins].sort((a, b) => b.count - a.count);
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TrendingUpIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Booking Trends
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <ToggleButtonGroup
            size="small"
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
            sx={{ 
              '& .MuiToggleButton-root': { 
                py: 0.3, 
                px: 1, 
                textTransform: 'none',
                fontSize: '0.7rem'
              },
              '& .Mui-selected': {
                backgroundColor: `${Colors.blue}15 !important`,
                color: Colors.blue,
                fontWeight: 600
              }
            }}
          >
            <ToggleButton value="line" aria-label="line">
              Line
            </ToggleButton>
            <ToggleButton value="bar" aria-label="bar">
              Bar
            </ToggleButton>
          </ToggleButtonGroup>
          
          <ToggleButtonGroup
            size="small"
            value={timePeriod}
            exclusive
            onChange={handleTimePeriodChange}
            aria-label="time period"
            sx={{ 
              '& .MuiToggleButton-root': { 
                py: 0.3, 
                px: 1, 
                textTransform: 'none',
                fontSize: '0.7rem'
              },
              '& .Mui-selected': {
                backgroundColor: `${Colors.blue}15 !important`,
                color: Colors.blue,
                fontWeight: 600
              }
            }}
          >
            <ToggleButton value="daily" aria-label="daily">
              Daily
            </ToggleButton>
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
      </Box>
      
      <Tabs 
        value={viewTab} 
        onChange={handleTabChange}
        sx={{ 
          mb: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            minHeight: 36,
            py: 0
          }
        }}
      >
        <Tab 
          label="Booking Trends" 
          icon={<TrendingUpIcon sx={{ fontSize: 16 }} />} 
          iconPosition="start"
        />
        <Tab 
          label="Guest Origin" 
          icon={<PublicIcon sx={{ fontSize: 16 }} />} 
          iconPosition="start"
        />
      </Tabs>
      
      {viewTab === 0 ? (
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke={Colors.blue}
                  activeDot={{ r: 8 }}
                  name="Bookings"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4caf50"
                  name="Revenue ($)"
                />
              </LineChart>
            ) : (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  fill={Colors.blue}
                  name="Bookings"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#4caf50"
                  name="Revenue ($)"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ height: 300, overflow: 'auto' }}>
          {sortedOrigins.map((origin, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1,
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" fontWeight={500}>
                  {index + 1}.
                </Typography>
                <Typography variant="body2">
                  {origin.country} {origin.state ? `(${origin.state})` : ''}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  {origin.percentage}%
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {origin.count}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}