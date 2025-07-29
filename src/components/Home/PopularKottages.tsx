import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Container,
  Button,
  Rating,
  Avatar,
  Fade,
  useTheme,
  alpha,
  Skeleton
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  Visibility,
  ArrowForward,
  TrendingUp,
  LocalOffer
} from "@mui/icons-material";
import { usePopularProperties, KottageWithId } from '../../hooks/usePropertySearch';

// Helper functions to work with KottageWithId
const getPropertyImage = (kottage: KottageWithId): string => {
  if (kottage.images && typeof kottage.images === 'object') {
    const imageValues = Object.values(kottage.images);
    return imageValues[0] as string || '/negril.jpg';
  }
  return '/negril.jpg';
};

const getPropertyLocation = (kottage: KottageWithId): string => {
  return kottage.address?.city || kottage.address?.state || 'Jamaica';
};

const getPropertyRegion = (kottage: KottageWithId): string => {
  return kottage.address?.state || 'Jamaica';
};

const getPropertyPrice = (kottage: KottageWithId): number => {
  if (!kottage.roomTypes || kottage.roomTypes.length === 0) return 0;
  return Math.min(...kottage.roomTypes.map(rt => rt.pricePerNight || 0));
};

// const getPropertyReviews = (kottage: KottageWithId): number => {
//   return kottage.pastReservations || Math.floor(Math.random() * 200) + 50;
// };

const getHostInfo = (kottage: KottageWithId) => ({
  name: `${kottage.host?.name || 'Property Host'}`,
  avatar: kottage.host?.avatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`,
  superhost: kottage.host?.superhost || false
});

type Props = {};

function PopularKottages({}: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState<string[]>([]);
  
  // Use the Firebase-backed popular properties hook
  const { data: properties = [], isLoading: loading, error } = usePopularProperties(6);

  const handlePropertyClick = (property: KottageWithId) => {
    // Navigate to property detail page with property data in state
    navigate(`/Kottages/${property.key}`, {
      state: { 
        kottage: property,
        source: 'popular' // Indicate this came from popular properties
      }
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleImageLoad = (id: string) => {
    setImageLoaded(prev => [...prev, id]);
  };

  return (
    <Box sx={{ py: 8, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUp sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: '#333',
                position: 'relative'
              }}
            >
              Popular Kottages
            </Typography>
          </Box>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover our most loved accommodations across Jamaica's stunning landscapes
          </Typography>
          
          {/* Trending Tags */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            {["Most Booked", "Best Rated", "Trending Now", "Guest Favorites"].map((tag, index) => (
              <Chip
                key={index}
                icon={<LocalOffer />}
                label={tag}
                variant="outlined"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Property Cards Grid */}
        <Grid container spacing={4}>
          {error ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#f44336' }}>
                  Unable to load popular properties
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Please try again later
                </Typography>
              </Box>
            </Grid>
          ) : loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" width="100%" height={250} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            properties.map((property, index) => (
              <Grid item xs={12} sm={6} lg={4} key={property.key}>
                <Fade in={true} timeout={600 + index * 100}>
                  <Card 
                    onClick={() => handlePropertyClick(property)}
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                      },
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Image Container */}
                    <Box sx={{ position: 'relative', height: 250, overflow: 'hidden' }}>
                      {!imageLoaded.includes(property.key) && (
                        <Skeleton 
                          variant="rectangular" 
                          width="100%" 
                          height={250}
                          animation="wave"
                        />
                      )}
                      <CardMedia
                        component="img"
                        height="250"
                        image={getPropertyImage(property)}
                        alt={property.name}
                        onLoad={() => handleImageLoad(property.key)}
                        sx={{
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                          display: imageLoaded.includes(property.key) ? 'block' : 'none'
                        }}
                      />
                      
                      {/* Overlay Actions */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          gap: 1,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '.MuiCard-root:hover &': {
                            opacity: 1
                          }
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.key);
                          }}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: favorites.includes(property.key) ? '#e91e63' : '#666',
                            '&:hover': {
                              backgroundColor: 'white',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          {favorites.includes(property.key) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: '#666',
                            '&:hover': {
                              backgroundColor: 'white',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Share />
                        </IconButton>
                      </Box>

                      {/* Special Badges */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}
                      >
                        {getHostInfo(property).superhost && (
                          <Chip
                            size="small"
                            label="Superhost"
                            sx={{
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                        {index < 2 && (
                          <Chip
                            size="small"
                            label="Popular"
                            sx={{
                              backgroundColor: '#4ecdc4',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>

                      {/* Price Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          borderRadius: 2,
                          px: 2,
                          py: 0.5
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 700,
                            fontSize: '1.1rem'
                          }}
                        >
                          ${getPropertyPrice(property)}
                          <Typography component="span" sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            /night
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>

                    {/* Card Content */}
                    <CardContent sx={{ p: 3 }}>
                      {/* Location & Name */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#666',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: 0.5
                            }}
                          >
                            {getPropertyLocation(property)}, {getPropertyRegion(property)}
                          </Typography>
                        </Box>
                        
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#333',
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3
                          }}
                        >
                          {property.name}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {property.description}
                        </Typography>
                      </Box>

                      {/* Rating & Reviews */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Rating 
                          value={property.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#ffd700'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                          {property.rating}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {/* ({getPropertyReviews(property)} reviews) */}
                        </Typography>
                      </Box>

                      {/* Host Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar 
                          src={getHostInfo(property).avatar} 
                          sx={{ width: 28, height: 28 }}
                        />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Hosted by <strong>{getHostInfo(property).name}</strong>
                        </Typography>
                      </Box>

                      {/* Amenities */}
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 3, flexWrap: 'wrap' }}>
                        {property.amenities && property.amenities.slice(0, 3).map((amenity, amenityIndex) => (
                          <Chip 
                            key={amenityIndex}
                            size="small" 
                            label={amenity}
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 22,
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              color: theme.palette.primary.main,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        ))}
                        {property.amenities && property.amenities.length > 3 && (
                          <Chip 
                            size="small" 
                            label={`+${property.amenities.length - 3}`}
                            sx={{
                              fontSize: '0.7rem',
                              height: 22,
                              backgroundColor: alpha('#666', 0.1),
                              color: '#666',
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        )}
                      </Box>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          borderRadius: 2,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            borderColor: theme.palette.primary.main,
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>

        {/* View All Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<Visibility />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View All Properties
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default PopularKottages;
