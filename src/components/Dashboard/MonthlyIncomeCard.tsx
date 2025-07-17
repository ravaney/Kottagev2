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
    <Card elevation={2} sx={{ borderRadius: '4px', height: 80 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <AttachMoneyIcon sx={{ color: Colors.blue, fontSize: 18 }} />
              <Typography variant="caption" color="text.secondary">
                This Month
              </Typography>
            </Box>
            <Typography variant='subtitle1' fontWeight={700} color={Colors.blue}>
              {amount}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
            <ArrowUpwardIcon sx={{ color: isPositive ? 'green' : 'red', fontSize: 14 }} />
            <Typography variant="caption" color={isPositive ? 'green' : 'red'} fontWeight={600}>
              {percentage}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}