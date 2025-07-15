import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Colors } from '../constants';

interface MonthlyIncomeCardProps {
  amount: string;
  percentage: string;
  isPositive: boolean;
}

export default function MonthlyIncomeCard({ amount, percentage, isPositive }: MonthlyIncomeCardProps) {
  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <AttachMoneyIcon sx={{ color: Colors.blue, fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            This Month
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} color={Colors.blue}>
          {amount}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
          <ArrowUpwardIcon sx={{ color: isPositive ? 'green' : 'red', fontSize: 16 }} />
          <Typography variant="caption" color={isPositive ? 'green' : 'red'} fontWeight={600}>
            {percentage}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}