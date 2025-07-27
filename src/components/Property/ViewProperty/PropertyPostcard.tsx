import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Rating,
  Button,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  People,
  Hotel,
  CheckCircle,
} from '@mui/icons-material';
import Carousel from "react-bootstrap/Carousel";
import { Kottage, RoomType } from '../../../hooks';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';
import { ContactHostButton } from '../../Chat';
import { Colors } from '../../constants';

interface PropertyHeaderProps {
  kottage: Kottage;
  defaultRoom?: RoomType | null;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onShowRooms?: () => void;
}

export const PropertyPostcard: React.FC<PropertyHeaderProps> = ({
  kottage,
  defaultRoom,
  isFavorite,
  onFavoriteToggle,
  onShowRooms,
}) => {
  // Get all available images for carousel
  const allImages = [
    ...(kottage?.images || []),
    ...(kottage?.roomTypes?.flatMap(room => room.images || []) || [])
  ];


  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .mobile-carousel .carousel-control-prev,
            .mobile-carousel .carousel-control-next {
              display: none !important;
            }
            .mobile-carousel .carousel-indicators {
              display: none !important;
            }
          }
        `}
      </style>
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
      {/* Carousel Background */}
      {allImages.length > 0 ? (
        <Carousel
          fade
          controls={true}
          indicators={true}
          interval={4000}
          touch={true}
          wrap={true}
          className="mobile-carousel"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            width: '100%',
            zIndex: 1
          }}
        >
          {allImages.map((image, index) => (
            <Carousel.Item key={index} style={{ height: '100vh' }}>
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100vh',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No images available
          </Typography>
        </Box>
      )}
      
      {/* Dark overlay for text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Content overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          color: 'white',
          p: 4,
          pointerEvents: 'auto',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.95))'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box>
              {/* Property Name and Location */}
              <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mb: 1 }}>
                {kottage?.name || 'Beautiful Property'}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LocationOn sx={{ color: Colors.raspberry, fontSize: 20 }} />
                  <Typography variant="body1" color="white">
                    {kottage?.address?.city || kottage?.address?.country || 'Prime Location'}
                  </Typography>
                </Box>
                
                {kottage?.rating && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Rating value={kottage.rating} readOnly size="small" sx={{ color: 'white' }} />
                    <Typography variant="body2" fontWeight={600} color="white">
                      {kottage.rating.toFixed(1)} rating
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Property Features */}
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                {kottage?.roomTypes && (
                  <Chip
                    icon={<Hotel />}
                    label={`${kottage.roomTypes.length} Room Types`}
                    size="small"
                    variant="filled"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}
                
                {defaultRoom && (
                  <Chip
                    icon={<People />}
                    label={`Up to ${Math.max(...(kottage?.roomTypes?.map(r => r.maxOccupancy) || [2]))} Guests`}
                    size="small"
                    variant="filled"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}
                
                <Chip
                  icon={<CheckCircle />}
                  label="Verified Property"
                  size="small"
                  variant="filled"
                  sx={{ 
                    borderColor: '#4caf50', 
                    color: '#4caf50',
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    '& .MuiChip-icon': { color: '#4caf50' }
                  }}
                />
              </Box>

              {/* Property Description */}
              <Typography variant="body1" color="rgba(255,255,255,0.9)" sx={{ lineHeight: 1.6 }}>
                {kottage?.description || 'Experience luxury and comfort in this beautiful property with modern amenities and exceptional service.'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box textAlign={{ xs: 'left', md: 'right' }}>
              {/* Pricing Starting From */}
              {defaultRoom && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    Starting from
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: Colors.raspberry }}>
                    ${(() => {
                      const promotion = calculatePromotionalPrice(defaultRoom, undefined, undefined, undefined, kottage?.promotions);
                      return promotion.isPromotionApplied ? promotion.finalPrice : defaultRoom.pricePerNight;
                    })()}
                    <Typography component="span" variant="body1" color="rgba(255,255,255,0.7)">
                      /night
                    </Typography>
                  </Typography>
                  {(() => {
                    const promotion = calculatePromotionalPrice(defaultRoom, undefined, undefined, undefined, kottage?.promotions);
                    return promotion.isPromotionApplied && (
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                        Save ${promotion.savings} per night!
                      </Typography>
                    );
                  })()}
                </Box>
              )}

              {/* Action Buttons */}
              <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} sx={{ mb: 2 }}>
                {onShowRooms && (
                  <Button
                    variant="contained"
                    onClick={onShowRooms}
                    sx={{
                      background: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
                      color: 'white',
                      fontWeight: 700,
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Stay Here
                  </Button>
                )}
              </Box>

              <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                {kottage?.ownerId && (
                  <ContactHostButton 
                    hostId={kottage.ownerId}
                    hostName={kottage.name || 'Property Host'}
                    propertyId={kottage.id}
                    propertyName={kottage.name}
                    variant="contained"
                    size="small"
                  />
                )}
                <IconButton
                  onClick={onFavoriteToggle}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: isFavorite ? Colors.raspberry : 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  );
};
