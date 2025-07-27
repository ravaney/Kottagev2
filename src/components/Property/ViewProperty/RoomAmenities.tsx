import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { getAmenityIcon } from './getAmenityIcon';

interface RoomAmenitiesProps {
  amenities: string[];
  title?: string;
  variant?: 'grid' | 'list';
  maxDisplay?: number;
}

export const RoomAmenities: React.FC<RoomAmenitiesProps> = ({
  amenities,
  title = 'Room Amenities',
  variant = 'grid',
  maxDisplay,
}) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const displayAmenities = maxDisplay ? amenities.slice(0, maxDisplay) : amenities;
  const remainingCount = maxDisplay && amenities.length > maxDisplay ? amenities.length - maxDisplay : 0;

  if (variant === 'list') {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {displayAmenities.map((amenity, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} sx={{ py: 0.5 }}>
              {React.createElement(getAmenityIcon(amenity))}
              <Typography variant="body2" fontWeight={500}>
                {amenity}
              </Typography>
            </Box>
          ))}
          {remainingCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              +{remainingCount} more amenities
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={1}>
        {displayAmenities.map((amenity, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box display="flex" alignItems="center" gap={1} sx={{ py: 0.5 }}>
              {React.createElement(getAmenityIcon(amenity))}
              <Typography variant="body2" fontWeight={500}>
                {amenity}
              </Typography>
            </Box>
          </Grid>
        ))}
        {remainingCount > 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              +{remainingCount} more amenities
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
