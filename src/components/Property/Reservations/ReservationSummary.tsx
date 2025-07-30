import React from 'react';
import { Box, Typography, Paper, Divider, alpha } from '@mui/material';
import { Colors } from '../../constants';
import './ReservationSummary.css';

interface ReservationSummaryProps {
  startDate: Date;
  endDate: Date;
  guests: number;
  roomName: string;
  nights: number;
  basePrice: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  promotionalPricing?: {
    isPromotionApplied: boolean;
    originalPrice: number;
    finalPrice: number;
    savings: number;
  } | null;
  totalSavings: number;
  roomForPricing?: {
    promotion?: {
      name: string;
      description?: string;
    };
  };
  kottage?: {
    promotions?: Array<{
      name: string;
      description?: string;
      isActive: boolean;
    }>;
  };
}

const ReservationSummary: React.FC<ReservationSummaryProps> = ({
  startDate,
  endDate,
  guests,
  roomName,
  nights,
  basePrice,
  subtotal,
  cleaningFee,
  serviceFee,
  total,
  promotionalPricing,
  totalSavings,
  roomForPricing,
  kottage,
}) => {
  const formatMoney = (amount: number) =>
    amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        border: '1px solid #e9ecef',
        width: '100%',
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: Colors.blue }}
      >
        Reservation & Pricing Summary
      </Typography>

      {/* Reservation Details */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: '#f0f8ff',
          borderRadius: 1,
          border: '1px solid #e3f2fd',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Check-in:</strong> {startDate.toLocaleDateString()}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Check-out:</strong> {endDate.toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>Guests:</strong> {guests}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Room:</strong> {roomName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Nights:</strong> {nights}
          </Typography>
        </Box>
      </Box>

      {/* Price Breakdown */}
      {promotionalPricing?.isPromotionApplied ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              {formatMoney(promotionalPricing.originalPrice)} × {nights} nights
            </Typography>
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              {formatMoney(nights * promotionalPricing.originalPrice)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: '#4caf50', fontWeight: 600 }}
            >
              {formatMoney(basePrice)} × {nights} nights (Promotional Rate)
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#4caf50', fontWeight: 600 }}
            >
              {formatMoney(subtotal)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: '#4caf50', fontWeight: 600 }}
            >
              Total Savings
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#4caf50', fontWeight: 600 }}
            >
              -{formatMoney(totalSavings)}
            </Typography>
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            {formatMoney(basePrice)} × {nights} nights
          </Typography>
          <Typography variant="body2">{formatMoney(subtotal)}</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Cleaning fee</Typography>
        <Typography variant="body2">{formatMoney(cleaningFee)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2">Service fee</Typography>
        <Typography variant="body2">{formatMoney(serviceFee)}</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Total
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: Colors.raspberry }}
        >
          {formatMoney(total)}
        </Typography>
      </Box>

      {/* Promotion Information */}
      {promotionalPricing?.isPromotionApplied && (
        <Box
          className="hide-on-small-height"
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: alpha('#4caf50', 0.1),
            borderRadius: 1,
            border: `1px solid ${alpha('#4caf50', 0.3)}`,
          }}
        >
          {roomForPricing?.promotion ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: '#2e7d32',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                🎉 {roomForPricing.promotion.name} Applied!
              </Typography>
              {roomForPricing.promotion.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2e7d32',
                    fontSize: '0.8rem',
                    mt: 0.5,
                  }}
                >
                  {roomForPricing.promotion.description}
                </Typography>
              )}
            </>
          ) : (
            kottage?.promotions?.some(p => p.isActive) && (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#2e7d32',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  🎉 {kottage.promotions.find(p => p.isActive)?.name} Applied!
                </Typography>
                {kottage.promotions.find(p => p.isActive)?.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#2e7d32',
                      fontSize: '0.8rem',
                      mt: 0.5,
                    }}
                  >
                    {kottage.promotions.find(p => p.isActive)?.description}
                  </Typography>
                )}
              </>
            )
          )}
        </Box>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.85rem' }}
      >
        By confirming, you agree to the booking terms and conditions.
      </Typography>
    </Paper>
  );
};

export default ReservationSummary;
