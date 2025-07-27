import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { RoomType, Kottage } from '../../../hooks';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';
import { Colors } from '../../constants';

interface RoomPricingDisplayProps {
  room: RoomType;
  promotions?: Kottage['promotions'];
  variant?: 'detailed' | 'compact';
  showPerNight?: boolean;
}

export const RoomPricingDisplay: React.FC<RoomPricingDisplayProps> = ({
  room,
  promotions,
  variant = 'detailed',
  showPerNight = true,
}) => {
  const promotion = calculatePromotionalPrice(room, undefined, undefined, undefined, promotions);

  if (variant === 'compact') {
    return (
      <Box textAlign="right">
        {promotion.isPromotionApplied ? (
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'line-through',
                fontSize: '0.9rem'
              }}
            >
              ${promotion.originalPrice}
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={800}
              sx={{ 
                color: Colors.raspberry,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              ${promotion.finalPrice}
            </Typography>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.75rem' }}>
              Save ${promotion.savings}
            </Typography>
          </Box>
        ) : (
          <Typography 
            variant="h5" 
            fontWeight={800}
            sx={{ 
              color: Colors.raspberry,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            ${room.pricePerNight}
          </Typography>
        )}
        {showPerNight && (
          <Typography variant="body2" color="text.secondary">
            per night
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {promotion.isPromotionApplied ? (
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: Colors.raspberry }}>
            ${promotion.finalPrice}
            <Typography component="span" variant="body1" sx={{ ml: 1, textDecoration: 'line-through', color: 'text.secondary' }}>
              ${promotion.originalPrice}
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
            Save ${promotion.savings} per night!
          </Typography>
        </Box>
      ) : (
        <Typography variant="h4" fontWeight={800} sx={{ color: Colors.raspberry }}>
          ${room.pricePerNight}
        </Typography>
      )}
      {showPerNight && (
        <Typography variant="body2" color="text.secondary">
          per night
        </Typography>
      )}
    </Box>
  );
};
