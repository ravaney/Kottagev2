import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Star,
  People,
  Bed,
  Bathtub,
  Share,
} from '@mui/icons-material';
import {
  Card,
  CardMedia,
  IconButton,
  Chip,
  Typography,
  CardContent,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Wifi,
  Pool,
  Restaurant,
  LocalParking,
  Kitchen,
  Spa,
  FitnessCenter,
  BeachAccess,
  NaturePeople,
  MusicNote,
  LocalBar,
  DirectionsWalk,
  Water,
  LocalOffer,
} from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import { KottageWithId } from '../../hooks/usePropertySearch';
import { useState } from 'react';

interface PropertyCardFullProps {
  kottage: KottageWithId;
  handlePropertyClick: (property: KottageWithId, index: number) => void;
  index?: number; // Optional index prop for handling click events
  searchCriteria?:
    | {
        location?: string;
        checkIn?: Date;
        checkOut?: Date;
        guests?: number;
      }
    | undefined;
}

const amenityIcons: { [key: string]: React.ReactElement } = {
  WiFi: <Wifi />,
  Pool: <Pool />,
  Kitchen: <Kitchen />,
  Parking: <LocalParking />,
  Spa: <Spa />,
  Gym: <FitnessCenter />,
  'Beach Access': <BeachAccess />,
  'Nature Trails': <NaturePeople />,
  'Recording Studio': <MusicNote />,
  'Beach Bar': <LocalBar />,
  Hiking: <DirectionsWalk />,
  'River Access': <Water />,
  'Private Beach': <BeachAccess />,
  'Fine Dining': <Restaurant />,
  'Water Sports': <Water />,
  'Coffee Tours': <LocalOffer />,
};

const getAmenityIcon = (amenity: string) => {
  return amenityIcons[amenity] || <LocalOffer />;
};
export const PropertyCardFull = ({
  kottage,
  handlePropertyClick,
  index,
  searchCriteria,
}: PropertyCardFullProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
  };

  return (
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
        },
      }}
      onClick={() => handlePropertyClick(kottage, index ?? 0)}
    >
      {/* Property Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={kottage.images?.[0] || ''}
          alt={kottage.name}
          sx={{ objectFit: 'cover' }}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(kottage.key);
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'white' },
            width: 40,
            height: 40,
          }}
        >
          {favorites?.has(kottage.key) ? (
            <Favorite sx={{ color: '#e91e63' }} />
          ) : (
            <FavoriteBorder />
          )}
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
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Superhost Badge */}
        {kottage?.host?.superhost && (
          <Chip
            label="Superhost"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(255,255,255,0.95)',
              fontWeight: 600,
              fontSize: '0.75rem',
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
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            $
            {kottage.roomTypes && kottage.roomTypes.length > 0
              ? Math.min(...kottage.roomTypes.map(rt => rt.pricePerNight || 0))
              : 0}
            /night
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Location & Rating */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 0,
              flex: 1,
            }}
          >
            <LocationOn
              sx={{
                color: '#666',
                fontSize: 18,
                mr: 0.5,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {kottage.address?.city || kottage.address?.state || 'Jamaica'},{' '}
              {kottage.address?.country || 'Jamaica'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Star sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {kottage.rating}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', ml: 0.5 }}>
              {/* ({getPropertyReviews(kottage)}) */}
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
            minHeight: '2.6em',
          }}
        >
          {kottage.name}
        </Typography>

        {/* Property Details */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              {kottage.maxGuests} guests
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bed sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              {kottage.bedrooms} bed
              {kottage.bedrooms !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bathtub sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="caption" sx={{ color: '#666' }}>
              {kottage.bathrooms} bath
              {kottage.bathrooms !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        {/* Amenities */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            {kottage?.amenities &&
              kottage?.amenities.slice(0, 3).map(amenity => (
                <Chip
                  key={amenity}
                  icon={getAmenityIcon(amenity)}
                  label={amenity}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-icon': { fontSize: 14 },
                  }}
                />
              ))}
            {kottage?.amenities && kottage?.amenities.length > 3 && (
              <Chip
                label={`+${kottage?.amenities.length - 3} more`}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                }}
              />
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Host Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={kottage.host?.avatar}
              alt={`Host ${kottage.host?.name?.slice(0, 8)}` || 'Property Host'}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, display: 'block' }}
              >
                {`Host ${kottage.host?.name?.slice(0, 8)}` || 'Property Host'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#666', fontSize: '0.7rem' }}
              >
                Host
              </Typography>
            </Box>
          </Box>

          <IconButton size="small" onClick={e => e.stopPropagation()}>
            <Share sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
