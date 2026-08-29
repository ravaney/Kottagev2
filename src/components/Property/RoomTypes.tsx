import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  CheckCircleRounded,
  HotelRounded,
  LocalOfferRounded,
  PeopleRounded,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Kottage, RoomType } from '../../hooks';
import { Colors } from '../constants';
import {
  calculatePromotionalPrice,
  formatPromotionDiscount,
} from '../../utils/promotionUtils';
import { getAmenityIcon } from './ViewProperty/getAmenityIcon';
import PillButton from '../common/PillButton';

interface RoomTypesProps {
  kottage: Kottage;
  selectedRoom: RoomType | null;
  setSelectedRoom: (room: RoomType | null) => void;
  setDetailedRoomView: (room: RoomType | null) => void;
  checkInDate?: Date;
  checkOutDate?: Date;
  guests?: number;
}

const formatDate = (date?: Date) => {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

function RoomTypes({
  kottage,
  selectedRoom,
  setSelectedRoom,
  setDetailedRoomView,
  checkInDate,
  checkOutDate,
  guests,
}: RoomTypesProps) {
  const navigate = useNavigate();

  const listedRooms =
    kottage?.roomTypes?.filter(room => room.listStatus === 'listed') || [];

  if (!listedRooms.length) {
    return null;
  }

  const nights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
          )
        )
      : 1;

  const cheapestRoomPrice = Math.min(...listedRooms.map(room => room.pricePerNight));

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: { xs: 1, md: 2 },
      }}
    >
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#102133',
            fontSize: { xs: '1.9rem', md: '2.3rem' },
          }}
        >
          Available rooms
        </Typography>
        <Typography variant="body1" color="#475569">
          Compare room types, pricing, occupancy, and amenities before you book.
        </Typography>
      </Stack>

      {(checkInDate || checkOutDate || guests) && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            px: { xs: 2, md: 2.5 },
            py: 1.75,
            borderRadius: 3,
            border: '1px solid rgba(15,23,42,0.08)',
            backgroundColor: '#ffffff',
            boxShadow: '0 12px 28px rgba(15,23,42,0.05)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.25}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {(checkInDate || checkOutDate) && (
                <Chip
                  icon={<HotelRounded sx={{ fontSize: 18 }} />}
                  label={`${formatDate(checkInDate)}${
                    checkOutDate ? ` - ${formatDate(checkOutDate)}` : ''
                  }`}
                  sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}
                />
              )}
              <Chip
                icon={<PeopleRounded sx={{ fontSize: 18 }} />}
                label={`${guests || 1} guest${(guests || 1) > 1 ? 's' : ''}`}
                sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}
              />
              <Chip
                label={`${nights} night${nights > 1 ? 's' : ''}`}
                sx={{ fontWeight: 700, backgroundColor: '#f8fafc' }}
              />
            </Stack>

            <Typography variant="body2" color="#64748b" fontWeight={600}>
              {listedRooms.length} room option{listedRooms.length === 1 ? '' : 's'} available
            </Typography>
          </Stack>
        </Paper>
      )}

      <Stack spacing={2.25}>
        {listedRooms.map(room => {
          const promotion = calculatePromotionalPrice(
            room,
            undefined,
            undefined,
            undefined,
            kottage?.promotions
          );
          const finalPrice = promotion.isPromotionApplied
            ? promotion.finalPrice
            : room.pricePerNight;
          const totalPrice = finalPrice * nights;
          const isSelected = selectedRoom?.id === room.id;
          const canAccommodateGuests = !guests || guests <= room.maxOccupancy;
          const isBestValue = room.pricePerNight === cheapestRoomPrice;

          return (
            <Paper
              key={room.id}
              elevation={0}
              onClick={() => setSelectedRoom(room)}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: `1px solid ${
                  isSelected
                    ? alpha(Colors.cerulean, 0.45)
                    : 'rgba(15,23,42,0.08)'
                }`,
                boxShadow: isSelected
                  ? `0 18px 36px ${alpha(Colors.cerulean, 0.12)}`
                  : '0 14px 34px rgba(15,23,42,0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: alpha(Colors.cerulean, 0.35),
                  boxShadow: '0 18px 36px rgba(15,23,42,0.08)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: '220px minmax(0, 1.35fr) minmax(180px, 0.7fr) minmax(210px, 0.8fr)',
                  },
                  minHeight: { md: 220 },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    minHeight: { xs: 210, md: '100%' },
                    backgroundColor: '#e2e8f0',
                  }}
                >
                  {room.images?.[0] ? (
                    <Box
                      component="img"
                      src={room.images[0]}
                      alt={room.name}
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
                        width: '100%',
                        height: '100%',
                        minHeight: 210,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        backgroundColor: '#f1f5f9',
                      }}
                    >
                      <HotelRounded sx={{ fontSize: 42 }} />
                    </Box>
                  )}

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                    }}
                  >
                    {isBestValue && (
                      <Chip
                        size="small"
                        label="Best value"
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          backgroundColor: Colors.cerulean,
                        }}
                      />
                    )}
                    {promotion.isPromotionApplied && (
                      <Chip
                        size="small"
                        icon={<LocalOfferRounded sx={{ fontSize: 16 }} />}
                        label={formatPromotionDiscount(
                          room.promotion ||
                            kottage.promotions?.find(activePromotion => activePromotion.isActive)!
                        )}
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          backgroundColor: Colors.raspberry,
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Stack spacing={1.25}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: '#102133',
                            fontSize: { xs: '1.35rem', md: '1.55rem' },
                          }}
                        >
                          {room.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            mt: 0.75,
                            lineHeight: 1.65,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {room.description ||
                            'Comfortable accommodations with thoughtful amenities for a smooth stay.'}
                        </Typography>
                      </Box>

                      {isSelected && (
                        <Chip
                          size="small"
                          label="Selected"
                          sx={{
                            alignSelf: 'flex-start',
                            fontWeight: 800,
                            color: Colors.cerulean,
                            backgroundColor: alpha(Colors.cerulean, 0.1),
                          }}
                        />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {(room.amenities || []).slice(0, 5).map(amenity => {
                        const AmenityIcon = getAmenityIcon(amenity);

                        return (
                          <Chip
                            key={`${room.id}-${amenity}`}
                            size="small"
                            icon={<AmenityIcon />}
                            label={amenity}
                            variant="outlined"
                            sx={{
                              borderColor: alpha(Colors.cerulean, 0.2),
                              color: '#334155',
                              '& .MuiChip-icon': {
                                color: Colors.cerulean,
                              },
                            }}
                          />
                        );
                      })}
                      {(room.amenities || []).length > 5 && (
                        <Chip
                          size="small"
                          label={`+${room.amenities.length - 5} more`}
                          sx={{
                            color: Colors.raspberry,
                            backgroundColor: alpha(Colors.raspberry, 0.08),
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    borderTop: { xs: '1px solid rgba(15,23,42,0.08)', md: 'none' },
                    borderLeft: { md: '1px solid rgba(15,23,42,0.08)' },
                    backgroundColor: '#fcfdff',
                  }}
                >
                  <Stack spacing={1.1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PeopleRounded sx={{ color: Colors.cerulean, fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={700} color="#102133">
                        Sleeps up to {room.maxOccupancy}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleRounded
                        sx={{
                          color: room.quantityAvailable > 0 ? '#16a34a' : '#94a3b8',
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body2" fontWeight={700} color="#102133">
                        {room.quantityAvailable} available
                      </Typography>
                    </Box>
                    {!canAccommodateGuests && (
                      <Typography variant="body2" color={Colors.raspberry} fontWeight={700}>
                        This room does not fit your selected guest count.
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    borderTop: { xs: '1px solid rgba(15,23,42,0.08)', md: 'none' },
                    borderLeft: { md: '1px solid rgba(15,23,42,0.08)' },
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Stack spacing={1.5} sx={{ height: '100%' }}>
                    <Box>
                      {promotion.isPromotionApplied && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#94a3b8',
                            textDecoration: 'line-through',
                            fontWeight: 700,
                          }}
                        >
                          ${promotion.originalPrice}
                        </Typography>
                      )}
                      <Stack direction="row" alignItems="baseline" spacing={0.75}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 900,
                            color: Colors.raspberry,
                            lineHeight: 1,
                          }}
                        >
                          ${finalPrice}
                        </Typography>
                        <Typography variant="body2" color="#64748b" fontWeight={600}>
                          / night
                        </Typography>
                      </Stack>
                      {checkInDate && checkOutDate && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.75, color: '#102133', fontWeight: 700 }}
                        >
                          ${totalPrice} total for {nights} night{nights > 1 ? 's' : ''}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Divider sx={{ mb: 1.5 }} />
                      <Stack spacing={1}>
                        <PillButton
                          variant="outlined"
                          onClick={event => {
                            event.stopPropagation();
                            setDetailedRoomView(room);
                          }}
                          sx={{
                            borderColor: alpha(Colors.cerulean, 0.25),
                            color: Colors.cerulean,
                            '&:hover': {
                              backgroundColor: alpha(Colors.cerulean, 0.06),
                            },
                          }}
                        >
                          View details
                        </PillButton>
                        <PillButton
                          variant="contained"
                          disabled={!canAccommodateGuests}
                          onClick={event => {
                            event.stopPropagation();
                            navigate(`/Kottages/${kottage.id}/book-room`, {
                              state: {
                                kottage,
                                room,
                                checkInDate,
                                checkOutDate,
                                guests,
                                totalPrice,
                                nights,
                                pricePerNight: finalPrice,
                              },
                            });
                          }}
                          sx={{
                            backgroundColor: Colors.cerulean,
                            borderColor: Colors.cerulean,
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: Colors.raspberry,
                              borderColor: Colors.raspberry,
                            },
                          }}
                        >
                          {canAccommodateGuests ? 'Reserve this room' : 'Too many guests'}
                        </PillButton>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}

export default RoomTypes;
