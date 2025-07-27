import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Colors } from '../../constants';

interface ReservationsCardProps {
  count: number;
  description: string;
  percentage: string;
  isPositive: boolean;
}

export default function ReservationsCard({ count, description, percentage, isPositive }: ReservationsCardProps) {
  return (
    <Card elevation={2} sx={{ borderRadius: '4px', height: 80 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <PeopleIcon sx={{ color: Colors.raspberry, fontSize: 18 }} />
              <Typography variant="caption" color="text.secondary">
                Reservations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant='subtitle1' fontWeight={700} color={Colors.raspberry}>
                {count}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                {description}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
            {isPositive ? (
              <ArrowUpwardIcon sx={{ color: 'green', fontSize: 14 }} />
            ) : (
              <ArrowDownwardIcon sx={{ color: 'red', fontSize: 14 }} />
            )}
            <Typography variant="caption" color={isPositive ? 'green' : 'red'} fontWeight={600}>
              {percentage}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}