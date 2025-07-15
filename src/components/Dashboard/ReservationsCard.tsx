import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { Colors } from '../constants';

interface ReservationsCardProps {
  count: number;
  description: string;
}

export default function ReservationsCard({ count, description }: ReservationsCardProps) {
  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <PeopleIcon sx={{ color: Colors.raspberry, fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Reservations
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} color={Colors.raspberry}>
          {count}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}