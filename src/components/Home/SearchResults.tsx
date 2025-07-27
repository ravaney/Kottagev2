import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Button,
  Avatar,
  IconButton,
  Divider,
  Paper,
  Fade,
  Stack
} from '@mui/material';
import Grid from "@mui/material/GridLegacy";
import {
  LocationOn,
  People,
  Bed,
  Bathtub,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  Wifi,
  Pool,
  Restaurant,
  LocalParking,
  Pets,
  AcUnit,
  Kitchen,
  Spa,
  FitnessCenter,
  BeachAccess,
  NaturePeople,
  MusicNote,
  LocalBar,
  DirectionsWalk,
  Water,
  LocalOffer
} from '@mui/icons-material';
import { KottageWithId } from '../../hooks/usePropertySearch';
import { useSearchAnalytics } from '../../services/analyticsService';

// Keep Property interface for backward compatibility but mark as deprecated
/** @deprecated Use KottageWithId instead */
export interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  region: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  image: string;
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SearchResultsProps {
  properties: KottageWithId[];
  searchQuery: string;
  isLoading?: boolean;
  onPropertyClick?: (property: KottageWithId) => void;
  searchCriteria?: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
  };
}

// Helper functions to extract data from Kottage
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
  if (kottage.roomTypes && kottage.roomTypes.length > 0) {
    return Math.min(...kottage.roomTypes.map(rt => rt.pricePerNight || 0));
  }
  return 0;
};

// const getPropertyReviews = (kottage: KottageWithId): number => {
//   return kottage.pastReservations || Math.floor(Math.random() * 200) + 50;
// };

const getHostInfo = (kottage: KottageWithId) => ({
  name: `Host ${kottage.host?.name?.slice(0, 8)}` || 'Property Host',
  avatar: kottage.host?.avatar || '/default-avatar.png',
  superhost: kottage.rating > 4.7
});

const getMaxGuests = (kottage: KottageWithId): number => {
  return kottage.maxGuests || kottage.roomTypes?.[0]?.maxOccupancy || 4;
};

const amenityIcons: { [key: string]: React.ReactElement } = {
  'WiFi': <Wifi />,
  'Pool': <Pool />,
  'Kitchen': <Kitchen />,
  'Parking': <LocalParking />,
  'Spa': <Spa />,
  'Gym': <FitnessCenter />,
  'Beach Access': <BeachAccess />,
  'Nature Trails': <NaturePeople />,
  'Recording Studio': <MusicNote />,
  'Beach Bar': <LocalBar />,
  'Hiking': <DirectionsWalk />,
  'River Access': <Water />,
  'Private Beach': <BeachAccess />,
  'Fine Dining': <Restaurant />,
  'Water Sports': <Water />,
  'Coffee Tours': <LocalOffer />,
};

const SearchResults: React.FC<SearchResultsProps> = ({ 
  properties, 
  searchQuery, 
  isLoading = false,
  onPropertyClick,
  searchCriteria 
}) => {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const { trackSearchImpression, trackSearchClick } = useSearchAnalytics();

  // Track search impressions when properties are displayed
  useEffect(() => {
    if (properties && properties.length > 0 && searchQuery) {
      properties.forEach((property, index) => {
        trackSearchImpression(property.key, searchQuery, index + 1);
      });
    }
  }, [properties, searchQuery, trackSearchImpression]);

  const handlePropertyClick = (property: KottageWithId, index: number) => {
    // Track search click
    if (searchQuery) {
      trackSearchClick(property.key, searchQuery, index + 1);
    }
    // Call the original click handler
    onPropertyClick?.(property);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };  const getAmenityIcon = (amenity: string) => {
    return amenityIcons[amenity] || <LocalOffer />;
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" sx={{ textAlign: 'center', color: '#666' }}>
            {searchCriteria?.checkIn && searchCriteria?.checkOut 
              ? 'Checking availability for your dates...' 
              : 'Searching for properties...'
            }
          </Typography>
        </Container>
      </Box>
    );
  }

  if (properties.length === 0) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
              No properties found
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              We couldn't find any properties matching "{searchQuery}". Try adjusting your search criteria.
            </Typography>
            <Button variant="contained" size="large">
              Browse All Properties
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, backgroundColor: '#f8f9fa', minHeight: '60vh' }}>
      <Container maxWidth="lg">
        {/* Search criteria summary */}
        {searchCriteria?.checkIn && searchCriteria?.checkOut && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
              Available Properties
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing properties available from{' '}
              {searchCriteria.checkIn.toLocaleDateString()} to{' '}
              {searchCriteria.checkOut.toLocaleDateString()}
              {searchCriteria.guests && ` for ${searchCriteria.guests} guests`}
              {searchCriteria.location && ` in ${searchCriteria.location}`}
            </Typography>
          </Box>
        )}
        {/* Search Results Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
            Search Results
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>

        {/* Property Grid */}
        <Grid container spacing={3}>
          {properties.map((property, index) => (
            <Grid item xs={12} sm={6} lg={4} key={property.id}>
              <Fade in={true} timeout={500 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => handlePropertyClick(property, index)}
                >
                  {/* Property Image */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={getPropertyImage(property)}
                      alt={property.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.key);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': { backgroundColor: 'white' },
                        width: 40,
                        height: 40
                      }}
                    >
                      {favorites.has(property.key) ? 
                        <Favorite sx={{ color: '#e91e63' }} /> : 
                        <FavoriteBorder />
                      }
                    </IconButton>

                    {/* Availability Badge */}
                    {searchCriteria?.checkIn && searchCriteria?.checkOut && (
                      <Chip
                        label="Available"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: 12,
                          backgroundColor: '#4caf50',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}

                    {/* Superhost Badge */}
                    {getHostInfo(property).superhost && (
                      <Chip
                        label="Superhost"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}

                    {/* Price Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${getPropertyPrice(property)}/night
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Location & Rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                        <LocationOn sx={{ color: '#666', fontSize: 18, mr: 0.5, flexShrink: 0 }} />
                        <Typography 
                          variant="caption" 
                          sx={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {getPropertyLocation(property)}, {getPropertyRegion(property)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Star sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {property.rating}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', ml: 0.5 }}>
                          {/* ({getPropertyReviews(property)}) */}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Property Name */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        minHeight: '2.6em'
                      }}
                    >
                      {property.name}
                    </Typography>

                    {/* Property Details */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <People sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {property.maxGuests} guests
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Bed sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Bathtub sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Amenities */}
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {property.amenities && property.amenities.slice(0, 3).map((amenity) => (
                          <Chip
                            key={amenity}
                            icon={getAmenityIcon(amenity)}
                            label={amenity}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 24,
                              '& .MuiChip-icon': { fontSize: 14 }
                            }}
                          />
                        ))}
                        {property.amenities && property.amenities.length > 3 && (
                          <Chip
                            label={`+${property.amenities.length - 3} more`}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 24,
                              backgroundColor: '#f5f5f5',
                              color: '#666'
                            }}
                          />
                        )}
                      </Stack>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Host Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={getHostInfo(property).avatar}
                          alt={getHostInfo(property).name}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                            {getHostInfo(property).name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                            Host
                          </Typography>
                        </Box>
                      </Box>
                      
                      <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                        <Share sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Load More Button (if needed) */}
        {properties.length >= 6 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button variant="outlined" size="large" sx={{ px: 4 }}>
              Load More Properties
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
