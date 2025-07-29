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
  KeyboardArrowDown,
} from '@mui/icons-material';
import Carousel from "react-bootstrap/Carousel";
import { Kottage, RoomType } from '../../../hooks';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';
import { ContactHostButton } from '../../Chat';
import { Colors } from '../../constants';
import './viewproperty.css';

interface PropertyHeaderProps {
  kottage: Kottage;
  defaultRoom?: RoomType | null;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onViewRooms?: () => void;
}

export const PropertyPostcard: React.FC<PropertyHeaderProps> = ({
  kottage,
  defaultRoom,
  isFavorite,
  onFavoriteToggle,
  onViewRooms,
}) => {

  // Get all available images for carousel
  const allImages = [
    ...(kottage?.images || []),
    ...(kottage?.roomTypes?.flatMap(room => room.images || []) || [])
  ];


  return (
    <>
      <Box className="property-postcard">
      {/* Carousel Background */}
      {allImages.length > 0 ? (
        <Carousel
          fade
          controls={true}
          indicators={true}
          interval={4000}
          touch={true}
          wrap={true}
          className="mobile-carousel property-carousel"
        >
          {allImages.map((image, index) => (
            <Carousel.Item key={index} className="property-carousel-item">
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                className="property-carousel-image"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Box className="no-images-container">
          <Typography variant="h6" color="text.secondary">
            No images available
          </Typography>
        </Box>
      )}
      
      {/* Dark overlay for text readability */}
      <Box className="dark-overlay" />
      
      {/* Content overlay */}
      <Box className="content-overlay">
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
                    className="property-chip-white"
                  />
                )}
                
                {defaultRoom && (
                  <Chip
                    icon={<People />}
                    label={`Up to ${Math.max(...(kottage?.roomTypes?.map(r => r.maxOccupancy) || [2]))} Guests`}
                    size="small"
                    variant="filled"
                    className="property-chip-white"
                  />
                )}
                
                <Chip
                  icon={<CheckCircle />}
                  label="Verified Property"
                  size="small"
                  variant="filled"
                  className="property-chip-verified"
                />
              </Box>

              {/* Property Description */}
              <Typography variant="body1" color="rgba(255,255,255,0.9)" sx={{ lineHeight: 1.6, mb: 3 }}>
                {kottage?.description || 'Experience luxury and comfort in this beautiful property with modern amenities and exceptional service.'}
              </Typography>

              {/* Action Buttons */}
              <Box display="flex" gap={1} justifyContent="flex-start" sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={onViewRooms}
                  className="stay-here-button"
                  sx={{
                    background: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
                    color: 'white',
                  }}
                >
                  View Rooms
                </Button>
              </Box>

              <Box display="flex" gap={1} justifyContent="flex-start">
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
                  className="property-icon-button"
                  sx={{
                    color: isFavorite ? Colors.raspberry : 'white',
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                
                <IconButton
                  className="property-icon-button"
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box textAlign={{ xs: 'left', md: 'right' }}>
              {/* Pricing Starting From */}
              {defaultRoom && (
                <Box 
                  sx={{ 
                    mb: 3, 
                    p: 2,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: 'fit-content',
                    ml: { xs: 0, md: 'auto' }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="rgba(255,255,255,0.8)"
                    sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Starting from
                  </Typography>
                  
                  <Box display="flex" alignItems="baseline" gap={1}>
                    <Typography 
                      variant="h3" 
                      fontWeight={900} 
                      sx={{ 
                        color: Colors.raspberry,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      ${(() => {
                        const promotion = calculatePromotionalPrice(defaultRoom, undefined, undefined, undefined, kottage?.promotions);
                        return promotion.isPromotionApplied ? promotion.finalPrice : defaultRoom.pricePerNight;
                      })()}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="rgba(255,255,255,0.8)"
                      sx={{ fontWeight: 500 }}
                    >
                      /night
                    </Typography>
                  </Box>
                  
                  {(() => {
                    const promotion = calculatePromotionalPrice(defaultRoom, undefined, undefined, undefined, kottage?.promotions);
                    return promotion.isPromotionApplied && (
                      <Box 
                        sx={{ 
                          mt: 1,
                          p: 1,
                          background: 'rgba(76, 175, 80, 0.2)',
                          borderRadius: 1,
                          border: '1px solid rgba(76, 175, 80, 0.3)'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4caf50', 
                            fontWeight: 700,
                            textAlign: 'center'
                          }}
                        >
                          🎉 Save ${promotion.savings} per night!
                        </Typography>
                      </Box>
                    );
                  })()}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Jumping Down Arrow */}
      <Box
        onClick={onViewRooms}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          animation: 'bounce 2s infinite',
          zIndex: 10,
          '&:hover': {
            transform: 'translateX(-50%) scale(1.1)',
          },
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '40%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
            '60%': {
              transform: 'translateX(-50%) translateY(-5px)',
            },
          },
        }}
      >
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <KeyboardArrowDown fontSize="large" />
        </IconButton>
      </Box>
    </Box>
    </>
  );
};
