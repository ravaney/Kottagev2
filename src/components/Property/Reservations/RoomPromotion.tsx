import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

interface Promotion {
  name: string;
  description?: string;
  endDate: string;
  isActive: boolean;
}

interface RoomPromotionProps {
  promotion?: Promotion;
}

const RoomPromotion: React.FC<RoomPromotionProps> = ({ promotion }) => {
  if (!promotion || !promotion.isActive) return null;

  return (
    <Box
      sx={{
        mb: 1,
        p: 2,
        bgcolor: alpha('#4caf50', 0.05),
        borderRadius: 2,
        border: `1px solid ${alpha('#4caf50', 0.2)}`,
      }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <LocalOffer sx={{ fontSize: 16, color: '#4caf50' }} />
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#4caf50' }}>
          {promotion.name}
        </Typography>
      </Box>
      {promotion.description && (
        <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.8rem' }}>
          {promotion.description}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.75rem', mt: 0.5 }}>
        Valid until {new Date(promotion.endDate).toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default RoomPromotion;