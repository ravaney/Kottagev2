import React from 'react';
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowForwardRounded,
  Favorite,
  FavoriteBorder,
  Hotel,
  ImageOutlined,
  LocationOn,
  People,
  Share,
  Verified,
  Wifi,
  BusinessCenter,
  LaptopMac,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Kottage, RoomType } from '../../../hooks';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';
import { ContactHostButton } from '../../Chat';
import { Colors } from '../../constants';
import PillButton from '../../common/PillButton';
import { getNomadPerkLabels, isNomadVerified } from '../../../utils/nomadUtils';

interface PropertyHeaderProps {
  kottage: Kottage;
  defaultRoom?: RoomType | null;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onViewRooms?: () => void;
  primaryActionLabel?: string;
}

const getPerkIcon = (perk: string) => {
  const lower = perk.toLowerCase();

  if (lower.includes('coworking')) {
    return <BusinessCenter sx={{ fontSize: 16 }} />;
  }

  if (lower.includes('wifi')) {
    return <Wifi sx={{ fontSize: 16 }} />;
  }

  return <LaptopMac sx={{ fontSize: 16 }} />;
};

export const PropertyPostcard: React.FC<PropertyHeaderProps> = ({
  kottage,
  defaultRoom,
  isFavorite,
  onFavoriteToggle,
  onViewRooms,
  primaryActionLabel = 'View available rooms',
}) => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const nomadVerified = isNomadVerified(kottage);
  const nomadPerks = getNomadPerkLabels(kottage.nomad, {
    includeWifiSpeed: true,
  }).slice(0, 3);

  const allImages = React.useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...(kottage?.images || []),
            ...(kottage?.roomTypes?.flatMap(room => room.images || []) || []),
          ].filter(Boolean)
        )
      ),
    [kottage]
  );

  const displayedImages = allImages.slice(0, 8);
  const activeImage = displayedImages[activeImageIndex] || displayedImages[0] || '';
  const maxOccupancy = Math.max(
    ...(kottage?.roomTypes?.map(room => room.maxOccupancy) || [kottage?.maxGuests || 1])
  );

  const defaultPromotion = defaultRoom
    ? calculatePromotionalPrice(
        defaultRoom,
        undefined,
        undefined,
        undefined,
        kottage?.promotions
      )
    : null;

  const startingPrice = defaultPromotion?.isPromotionApplied
    ? defaultPromotion.finalPrice
    : defaultRoom?.pricePerNight;

  const savings = defaultPromotion?.isPromotionApplied ? defaultPromotion.savings : 0;

  const propertyFacts = [
    `${kottage?.roomTypes?.length || 0} room types`,
    `Up to ${maxOccupancy} guests`,
    kottage?.propertyType ? kottage.propertyType : 'Boutique stay',
  ].filter(Boolean);

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        pt: { xs: 3, md: 4 },
        pb: { xs: 12, md: 5 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, lg: 3 },
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.55fr) minmax(340px, 420px)' },
          alignItems: 'start',
        }}
      >
        <Box>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow: '0 24px 56px rgba(15,23,42,0.08)',
              backgroundColor: '#ffffff',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: { xs: 280, sm: 360, md: 460 },
                backgroundColor: '#e2e8f0',
              }}
            >
              {activeImage ? (
                <Box
                  component="img"
                  src={activeImage}
                  alt={kottage.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    gap: 1,
                  }}
                >
                  <ImageOutlined sx={{ fontSize: 44 }} />
                  <Typography>No property photos yet</Typography>
                </Box>
              )}

              {displayedImages.length > 0 && (
                <Chip
                  label={`${activeImageIndex + 1} / ${displayedImages.length}`}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    bottom: 16,
                    fontWeight: 700,
                    color: 'white',
                    backgroundColor: 'rgba(15,23,42,0.62)',
                    backdropFilter: 'blur(12px)',
                  }}
                />
              )}
            </Box>

            {displayedImages.length > 1 && (
              <Box
                sx={{
                  p: 1.5,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(4, minmax(0, 1fr))',
                    md: 'repeat(6, minmax(0, 1fr))',
                  },
                  gap: 1,
                }}
              >
                {displayedImages.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    onClick={() => setActiveImageIndex(index)}
                    sx={{
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      aspectRatio: '1 / 1',
                      border:
                        index === activeImageIndex
                          ? `2px solid ${Colors.cerulean}`
                          : '2px solid transparent',
                      boxShadow:
                        index === activeImageIndex
                          ? `0 0 0 3px ${alpha(Colors.cerulean, 0.12)}`
                          : 'none',
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${kottage.name} thumbnail ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: { xs: 2, md: 2.5 },
              borderRadius: 4,
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="h5" fontWeight={800} color="#102133">
                About this stay
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#334155', lineHeight: 1.7 }}
              >
                {kottage?.description ||
                  'Experience a thoughtfully hosted stay with comfortable rooms, dependable amenities, and easy access to the destination around you.'}
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {propertyFacts.map(fact => (
                  <Chip
                    key={fact}
                    label={fact}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                    }}
                  />
                ))}
                <Chip
                  icon={<Verified sx={{ fontSize: 16 }} />}
                  label="Verified property"
                  sx={{
                    fontWeight: 700,
                    color: '#166534',
                    backgroundColor: alpha('#16a34a', 0.1),
                  }}
                />
              </Stack>

              {kottage.amenities?.length ? (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {kottage.amenities.slice(0, 8).map(amenity => (
                    <Chip
                      key={amenity}
                      size="small"
                      label={amenity}
                      variant="outlined"
                      sx={{
                        borderColor: alpha(Colors.cerulean, 0.25),
                        color: '#334155',
                      }}
                    />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 24px 56px rgba(15,23,42,0.08)',
            p: { xs: 2.25, md: 3 },
            position: { lg: 'sticky' },
            top: 96,
          }}
        >
          <Stack spacing={2}>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: '#102133',
                      fontSize: { xs: '2rem', md: '2.6rem' },
                      lineHeight: 1.05,
                    }}
                  >
                    {kottage?.name || 'Beautiful Property'}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1.25}
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                    sx={{ mt: 1.25 }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <LocationOn sx={{ color: Colors.raspberry, fontSize: 20 }} />
                      <Typography variant="body1" color="#475569" fontWeight={600}>
                        {[
                          kottage?.address?.city,
                          kottage?.address?.state,
                          kottage?.address?.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </Typography>
                    </Box>

                    {kottage?.rating ? (
                      <Box display="flex" alignItems="center" gap={0.75}>
                        <Rating value={kottage.rating} readOnly precision={0.5} size="small" />
                        <Typography variant="body2" fontWeight={700} color="#102133">
                          {kottage.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    ) : null}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                  <IconButton
                    onClick={onFavoriteToggle}
                    sx={{
                      width: 44,
                      height: 44,
                      border: '1px solid rgba(15,23,42,0.08)',
                      color: isFavorite ? Colors.raspberry : '#475569',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton
                    sx={{
                      width: 44,
                      height: 44,
                      border: '1px solid rgba(15,23,42,0.08)',
                      color: '#475569',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Share />
                  </IconButton>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {nomadVerified && (
                  <Chip
                    icon={<Verified />}
                    label="Nomad Verified"
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      backgroundColor: Colors.cerulean,
                    }}
                  />
                )}

                {nomadPerks.map(perk => (
                  <Chip
                    key={perk}
                    icon={getPerkIcon(perk)}
                    label={perk}
                    sx={{
                      fontWeight: 700,
                      color: '#102133',
                      backgroundColor: alpha(Colors.cerulean, 0.08),
                    }}
                  />
                ))}
              </Stack>
            </Stack>

            <Divider />

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(
                  Colors.cerulean,
                  0.08
                )} 0%, ${alpha(Colors.raspberry, 0.08)} 100%)`,
                border: '1px solid rgba(15,23,42,0.06)',
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#64748b',
                  fontWeight: 800,
                  letterSpacing: 1.1,
                }}
              >
                Starting from
              </Typography>

              {startingPrice ? (
                <>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: Colors.raspberry,
                        lineHeight: 1,
                      }}
                    >
                      ${startingPrice}
                    </Typography>
                    <Typography variant="body1" color="#475569" fontWeight={600}>
                      / night
                    </Typography>
                  </Stack>

                  {savings > 0 && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.75, color: '#166534', fontWeight: 700 }}
                    >
                      Save ${savings} on the entry rate
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body1" color="#475569">
                  Select a room below for pricing
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
              <Chip
                icon={<Hotel sx={{ fontSize: 18 }} />}
                label={`${kottage?.roomTypes?.length || 0} room types`}
                sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}
              />
              <Chip
                icon={<People sx={{ fontSize: 18 }} />}
                label={`Sleeps up to ${maxOccupancy}`}
                sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}
              />
            </Stack>

            <PillButton
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              onClick={onViewRooms}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                py: 1.4,
                fontSize: '1rem',
                backgroundColor: Colors.cerulean,
                borderColor: Colors.cerulean,
                color: '#fff',
                '&:hover': {
                  backgroundColor: Colors.raspberry,
                  borderColor: Colors.raspberry,
                },
              }}
            >
              {primaryActionLabel}
            </PillButton>

            {kottage?.ownerId && (
              <ContactHostButton
                hostId={kottage.ownerId}
                hostName={kottage.host?.name || kottage.name || 'Property Host'}
                propertyId={kottage.id}
                propertyName={kottage.name}
                variant="outlined"
                size="large"
                fullWidth
              />
            )}
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          px: 2,
          pt: 1.25,
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          background:
            'linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(248,250,252,0.92) 20%, rgba(248,250,252,0.98) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1.25,
            borderRadius: 999,
            backgroundColor: '#ffffff',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 18px 40px rgba(15,23,42,0.16)',
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#64748b',
                fontWeight: 800,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
              }}
            >
              {startingPrice ? 'Starting from' : 'Continue booking'}
            </Typography>
            <Typography
              sx={{
                color: '#102133',
                fontWeight: 900,
                fontSize: '1rem',
                lineHeight: 1.1,
              }}
            >
              {startingPrice ? `$${startingPrice}/night` : primaryActionLabel}
            </Typography>
          </Box>

          <PillButton
            variant="contained"
            endIcon={<ArrowForwardRounded />}
            onClick={onViewRooms}
            sx={{
              flexShrink: 0,
              minWidth: 170,
              py: 1.1,
              px: 2,
              fontSize: '0.95rem',
              backgroundColor: Colors.cerulean,
              borderColor: Colors.cerulean,
              color: '#fff',
              '&:hover': {
                backgroundColor: Colors.raspberry,
                borderColor: Colors.raspberry,
              },
            }}
          >
            {primaryActionLabel}
          </PillButton>
        </Box>
      </Box>
    </Box>
  );
};
