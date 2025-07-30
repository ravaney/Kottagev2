import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

interface Promotion {
  name: string;
  description?: string;
  endDate: string;
  isActive: boolean;
}

interface PromotionBannerProps {
  promotions: Promotion[];
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({ promotions }) => {
  const activePromotions = promotions.filter(p => p.isActive);
  
  if (activePromotions.length === 0) return null;

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
      {activePromotions.map((promotion, idx) => (
        <Box
          key={idx}
          sx={{
            mb: idx < activePromotions.length - 1 ? 2 : 0,
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
      ))}
    </Box>
  );
};

export default PromotionBanner;