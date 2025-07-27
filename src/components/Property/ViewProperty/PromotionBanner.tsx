import React from 'react';
import {
  Box,
  Typography,
  alpha,
} from '@mui/material';
import { RoomType, Kottage } from '../../../hooks';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';

interface PromotionBannerProps {
  room: RoomType;
  kottage?: Kottage;
  variant?: 'room' | 'property';
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({
  room,
  kottage,
  variant = 'room',
}) => {
  const promotion = calculatePromotionalPrice(room, undefined, undefined, undefined, kottage?.promotions);

  if (!promotion.isPromotionApplied) {
    return null;
  }

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#4caf50', 0.1), borderRadius: 2 }}>
      {room.promotion ? (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#2e7d32', mb: 1 }}>
            🎉 {room.promotion.name}
          </Typography>
          {room.promotion.description && (
            <Typography variant="body2" sx={{ color: '#2e7d32' }}>
              {room.promotion.description}
            </Typography>
          )}
        </>
      ) : kottage?.promotions?.some(p => p.isActive) && (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#2e7d32', mb: 1 }}>
            🎉 {kottage.promotions.find(p => p.isActive)?.name}
          </Typography>
          {kottage.promotions.find(p => p.isActive)?.description && (
            <Typography variant="body2" sx={{ color: '#2e7d32' }}>
              {kottage.promotions.find(p => p.isActive)?.description}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};
