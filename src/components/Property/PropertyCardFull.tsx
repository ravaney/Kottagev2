import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Star,
  People,
  Bed,
  Bathtub,
  Share,
  Verified,
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
  BusinessCenter,
  LaptopMac,
} from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import { KottageWithId } from '../../hooks/usePropertySearch';
import { useState } from 'react';
import { getNomadPerkLabels, isNomadVerified } from '../../utils/nomadUtils';

interface PropertyCardFullProps {
  kottage: KottageWithId;
  handlePropertyClick: (property: KottageWithId, index: number) => void;
  index?: number; // Optional index prop for handling click events
  compact?: boolean;
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
  compact = false,
  searchCriteria,
}: PropertyCardFullProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const nomadVerified = isNomadVerified(kottage);
  const nomadPerks = getNomadPerkLabels(kottage.nomad, {
    includeWifiSpeed: true,
  }).slice(0, compact ? 1 : 2);
  const visibleAmenities = kottage?.amenities?.slice(0, compact ? 2 : 3) || [];

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
        height: compact ? 188 : '100%',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
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
      <Box
        sx={{
          position: 'relative',
          width: compact ? '46%' : '100%',
          minWidth: compact ? 0 : 'auto',
          flexBasis: compact ? '46%' : 'auto',
          maxWidth: compact ? '46%' : 'none',
          flexShrink: 0,
        }}
      >
        <CardMedia
          component="img"
          image={kottage.images?.[0] || ''}
          alt={kottage.name}
          sx={{
            objectFit: 'cover',
            height: compact ? '100%' : 220,
          }}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(kottage.key);
          }}
          sx={{
            position: 'absolute',
            top: compact ? 10 : 12,
            right: compact ? 10 : 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'white' },
            width: compact ? 34 : 40,
            height: compact ? 34 : 40,
          }}
        >
          {favorites?.has(kottage.key) ? (
            <Favorite sx={{ color: '#e91e63' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        <Stack
          direction="column"
          spacing={compact ? 0.5 : 1}
          sx={{ position: 'absolute', top: compact ? 10 : 12, left: compact ? 10 : 12 }}
        >
          {kottage?.host?.superhost && (
            <Chip
              label="Superhost"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                fontWeight: 600,
                fontSize: compact ? '0.68rem' : '0.75rem',
                height: compact ? 24 : undefined,
              }}
            />
          )}
          {nomadVerified && (
            <Chip
              icon={<Verified sx={{ fontSize: 16 }} />}
              label="Nomad Verified"
              size="small"
              color="primary"
              sx={{
                fontWeight: 700,
                maxWidth: 'fit-content',
                backgroundColor: 'rgba(25,118,210,0.92)',
                color: 'white',
                height: compact ? 24 : undefined,
                '& .MuiChip-label': {
                  px: compact ? 0.75 : undefined,
                },
                '& .MuiChip-icon': {
                  ml: compact ? 0.55 : undefined,
                },
              }}
            />
          )}
        </Stack>

        {/* Availability Badge */}
        {searchCriteria?.checkIn && searchCriteria?.checkOut && (
          <Chip
            label="Available"
            size="small"
            sx={{
            position: 'absolute',
            bottom: compact ? 10 : 12,
            right: compact ? 10 : 12,
            backgroundColor: '#4caf50',
            color: 'white',
            fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Price Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: compact ? 10 : 12,
            left: compact ? 10 : 12,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            px: compact ? 1.25 : 2,
            py: compact ? 0.4 : 0.5,
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

      <CardContent
        sx={{
          flexGrow: 1,
          width: compact ? '54%' : 'auto',
          minWidth: 0,
          p: compact ? 1.2 : 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: compact ? 'space-between' : 'flex-start',
        }}
      >
        {/* Location & Rating */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: compact ? 0.35 : 1,
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
                fontSize: compact ? '0.68rem' : undefined,
                whiteSpace: compact ? 'nowrap' : 'normal',
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
          variant={compact ? 'subtitle1' : 'h6'}
          sx={{
            fontWeight: 600,
            mb: compact ? 0.4 : 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: compact ? 2 : 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: compact ? 1.15 : 1.3,
            minHeight: compact ? '2.3em' : '2.6em',
            fontSize: compact ? '0.92rem' : undefined,
          }}
        >
          {kottage.name}
        </Typography>

        {/* Property Details */}
        <Box
          sx={{
            display: 'flex',
            gap: compact ? 0.9 : 2,
            mb: compact ? 0.55 : 2,
            flexWrap: compact ? 'wrap' : 'nowrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People sx={{ fontSize: 16, color: '#666' }} />
            <Typography
              variant="caption"
              sx={{ color: '#666', fontSize: compact ? '0.66rem' : undefined }}
            >
              {kottage.maxGuests} guests
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bed sx={{ fontSize: 16, color: '#666' }} />
            <Typography
              variant="caption"
              sx={{ color: '#666', fontSize: compact ? '0.66rem' : undefined }}
            >
              {kottage.bedrooms} bed
              {kottage.bedrooms !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bathtub sx={{ fontSize: 16, color: '#666' }} />
            <Typography
              variant="caption"
              sx={{ color: '#666', fontSize: compact ? '0.66rem' : undefined }}
            >
              {kottage.bathrooms} bath
              {kottage.bathrooms !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        {nomadVerified && nomadPerks.length > 0 && (
          <Box sx={{ mb: compact ? 0.65 : 2 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {nomadPerks.map(perk => (
                <Chip
                  key={perk}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={
                    perk.toLowerCase().includes('coworking') ? (
                      <BusinessCenter />
                    ) : perk.toLowerCase().includes('wifi') ? (
                      <Wifi />
                    ) : (
                      <LaptopMac />
                    )
                  }
                  label={perk}
                  sx={{
                    fontSize: compact ? '0.66rem' : '0.72rem',
                    height: compact ? 22 : 24,
                    '& .MuiChip-icon': { fontSize: compact ? 13 : 14 },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Amenities */}
        <Box sx={{ mb: compact ? 0.45 : 2 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            {(compact ? visibleAmenities.slice(0, 1) : visibleAmenities).map(amenity => (
                <Chip
                  key={amenity}
                  icon={getAmenityIcon(amenity)}
                  label={amenity}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: compact ? '0.65rem' : '0.7rem',
                    height: compact ? 22 : 24,
                    '& .MuiChip-icon': { fontSize: compact ? 12 : 14 },
                  }}
                />
              ))}
            {compact &&
              kottage?.amenities &&
              kottage.amenities.length > 1 && (
                <Chip
                  label={`+${kottage.amenities.length - 1}`}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    height: 22,
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  }}
                />
              )}
            {!compact &&
              kottage?.amenities &&
              kottage.amenities.length > visibleAmenities.length && (
              <Chip
                label={`+${kottage?.amenities.length - visibleAmenities.length} more`}
                size="small"
                sx={{
                  fontSize: compact ? '0.65rem' : '0.7rem',
                  height: compact ? 22 : 24,
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                }}
              />
              )}
          </Stack>
        </Box>

        {!compact && <Divider sx={{ mb: 2 }} />}

        {/* Host Info */}
        {!compact && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 0,
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
                  sx={{
                    fontWeight: 600,
                    display: 'block',
                  }}
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
        )}
      </CardContent>
    </Card>
  );
};
