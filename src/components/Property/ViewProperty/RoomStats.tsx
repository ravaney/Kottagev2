import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  People,
  CheckCircle,
} from '@mui/icons-material';
import { RoomType } from '../../../hooks';
import { Colors } from '../../constants';

interface RoomStatsProps {
  room: RoomType;
  showAvailability?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export const RoomStats: React.FC<RoomStatsProps> = ({
  room,
  showAvailability = true,
  variant = 'horizontal',
}) => {
  if (variant === 'vertical') {
    return (
      <Box sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <People sx={{ color: Colors.blue, fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Up to {room.maxOccupancy} guests
          </Typography>
        </Box>
        {showAvailability && (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>
              {room.quantityAvailable} available
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={showAvailability ? 6 : 12}>
          <Box display="flex" alignItems="center" gap={1}>
            <People sx={{ color: Colors.blue, fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>
              Up to {room.maxOccupancy} guests
            </Typography>
          </Box>
        </Grid>
        {showAvailability && (
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
              <Typography variant="body2" fontWeight={600}>
                {room.quantityAvailable} available
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
