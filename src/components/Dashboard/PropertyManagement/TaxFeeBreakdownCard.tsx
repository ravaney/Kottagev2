import React, { useState } from 'react';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton, Divider, Tooltip } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Colors } from '../../constants';

interface FeeBreakdown {
  platformFee: number;
  taxesWithheld: number;
  serviceFee: number;
  cleaningFee: number;
  otherFees: number;
  netIncome: number;
}

interface TaxFeeBreakdownCardProps {
  monthly: FeeBreakdown;
  yearly: FeeBreakdown;
}

export default function TaxFeeBreakdownCard({ monthly, yearly }: TaxFeeBreakdownCardProps) {
  const [period, setPeriod] = useState<string>('monthly');
  
  const handlePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: string | null) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };
  
  const currentData = period === 'monthly' ? monthly : yearly;
  
  // Calculate total gross income
  const grossIncome = 
    currentData.netIncome + 
    currentData.platformFee + 
    currentData.taxesWithheld + 
    currentData.serviceFee + 
    currentData.cleaningFee + 
    currentData.otherFees;
  
  // Prepare data for pie chart
  const chartData = [
    { name: 'Net Income', value: currentData.netIncome, color: '#4caf50' },
    { name: 'Platform Fee', value: currentData.platformFee, color: Colors.blue },
    { name: 'Taxes', value: currentData.taxesWithheld, color: '#f44336' },
    { name: 'Service Fee', value: currentData.serviceFee, color: '#ff9800' },
    { name: 'Cleaning Fee', value: currentData.cleaningFee, color: '#9c27b0' },
    { name: 'Other Fees', value: currentData.otherFees, color: '#607d8b' },
  ];
  
  // Calculate percentages
  const getPercentage = (value: number) => {
    return ((value / grossIncome) * 100).toFixed(1) + '%';
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Tax & Fee Breakdown
          </Typography>
        </Box>
        <ToggleButtonGroup
          size="small"
          value={period}
          exclusive
          onChange={handlePeriodChange}
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
          <ToggleButton value="monthly" aria-label="monthly">
            Monthly
          </ToggleButton>
          <ToggleButton value="yearly" aria-label="yearly">
            Yearly
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ height: 180, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Gross Income
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            ${grossIncome.toLocaleString()}
          </Typography>
        </Box>
        <Divider />
      </Box>
      
      {chartData.map((item, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
              <Typography variant="body2">
                {item.name}
              </Typography>
              {item.name !== 'Net Income' && (
                <Tooltip title={`This is the ${item.name.toLowerCase()} charged by the platform`}>
                  <HelpOutlineIcon sx={{ fontSize: 14, color: 'text.secondary', ml: 0.5 }} />
                </Tooltip>
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {getPercentage(item.value)}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                ${item.value.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Paper>
  );
}