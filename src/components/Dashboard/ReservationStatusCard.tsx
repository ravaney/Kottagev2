import React, { useState } from 'react';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Colors } from '../constants';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { ReservationStatus } from '../../hooks/reservationHooks';

interface ReservationStatusCount {
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}

interface ReservationStatusCardProps {
  statusCounts: ReservationStatusCount;
}

export default function ReservationStatusCard({ statusCounts }: ReservationStatusCardProps) {
  const [timePeriod, setTimePeriod] = useState<string>('monthly');
  
  const handleTimePeriodChange = (event: React.MouseEvent<HTMLElement>, newTimePeriod: string | null) => {
    if (newTimePeriod !== null) {
      setTimePeriod(newTimePeriod);
    }
  };
  // Mock data for different time periods with trends
  const mockData = {
    weekly: {
      confirmed: { value: statusCounts.confirmed, trend: 5 },
      pending: { value: statusCounts.pending, trend: -2 },
      cancelled: { value: statusCounts.cancelled, trend: -1 },
      completed: { value: statusCounts.completed, trend: 3 }
    },
    monthly: {
      confirmed: { value: statusCounts.confirmed * 4, trend: 12 },
      pending: { value: statusCounts.pending * 3, trend: -8 },
      cancelled: { value: Math.round(statusCounts.cancelled * 3.5), trend: 2 },
      completed: { value: statusCounts.completed * 4, trend: 15 }
    },
    yearly: {
      confirmed: { value: statusCounts.confirmed * 48, trend: 120 },
      pending: { value: statusCounts.pending * 36, trend: -45 },
      cancelled: { value: Math.round(statusCounts.cancelled * 42), trend: 18 },
      completed: { value: statusCounts.completed * 52, trend: 85 }
    }
  };
  
  const currentData = mockData[timePeriod as keyof typeof mockData];
  
  const totalReservations = 
    currentData.confirmed.value + 
    currentData.pending.value + 
    currentData.cancelled.value + 
    currentData.completed.value;
  
  const data = [
    { name: 'Confirmed', value: currentData.confirmed.value, trend: currentData.confirmed.trend, color: '#4caf50' },
    { name: 'Pending', value: currentData.pending.value, trend: currentData.pending.trend, color: '#ff9800' },
    { name: 'Cancelled', value: currentData.cancelled.value, trend: currentData.cancelled.trend, color: '#f44336' },
    { name: 'Completed', value: currentData.completed.value, trend: currentData.completed.trend, color: '#2196f3' },
  ];
  
  const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'Pending': return <PendingIcon sx={{ color: '#ff9800', fontSize: 16 }} />;
      case 'Cancelled': return <CancelIcon sx={{ color: '#f44336', fontSize: 16 }} />;
      case 'Completed': return <AssignmentTurnedInIcon sx={{ color: '#2196f3', fontSize: 16 }} />;
      default: return null;
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: '4px',mb:1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
          {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Reservations
        </Typography>
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
      
      <Box sx={{ display: 'flex', height: 180 }}>
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} reservations`, 'Count']}
              labelFormatter={(name) => `${name}`}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
          {data.map((item) => (
            <Box key={item.name} sx={{ mb: 0.5 }}>
              <Box display="flex" alignItems="center" gap={1}>
                {getStatusIcon(item.name)}
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {item.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
                  {item.name !== 'Pending' && (
                    <>
                      {item.trend > 0 ? (
                        <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 14 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: '#f44336', fontSize: 14 }} />
                      )}
                      <Typography variant="caption" color={item.trend > 0 ? '#4caf50' : '#f44336'} sx={{ fontWeight: 600 }}>
                        {Math.abs(item.trend)}%
                      </Typography>
                    </>
                  )}
                  <Typography variant="body2" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>

            </Box>
          ))}
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #e0e0e0' }}>
            <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total</span>
              <span>{totalReservations}</span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}