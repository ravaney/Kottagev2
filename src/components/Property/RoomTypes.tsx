import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Fade,
  alpha,
} from '@mui/material';
import {
  Hotel,
  People,
  Image as ImageIcon,
  LocalOffer,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Kottage, RoomType } from '../../hooks';
import { Colors } from '../constants';
import {
  calculatePromotionalPrice,
  formatPromotionDiscount,
  getPromotionBadgeColor,
} from '../../utils/promotionUtils';
import { getAmenityIcon } from './ViewProperty/getAmenityIcon';

interface RoomTypesProps {
  kottage: Kottage;
  selectedRoom: RoomType | null;
  setSelectedRoom: (room: RoomType | null) => void;
  setDetailedRoomView: (room: RoomType | null) => void;
  checkInDate?: Date;
  checkOutDate?: Date;
  guests?: number;
}

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

  if (!kottage?.roomTypes || kottage.roomTypes.length === 0) {
    return null;
  }

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = calculateNights();

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 6 },
        maxWidth: '1400px',
        mx: 'auto',
      }}
    >
      {/* Modern Header Section */}
      <Box
        sx={{
          mb: 2,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${Colors.blue}15 0%, ${Colors.raspberry}15 100%)`,
          borderRadius: 3,
          p: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${Colors.blue}08 0%, transparent 50%), 
                              radial-gradient(circle at 80% 20%, ${Colors.raspberry}08 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Hotel sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </Box>

          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Choose Your Perfect Room
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{
              mb: 2,
            }}
          >
            <LocationOn sx={{ color: Colors.blue, fontSize: 24 }} />
            <Typography
              variant="h5"
              fontWeight={600}
              color={Colors.blue}
              sx={{
                opacity: 0.9,
              }}
            >
              {kottage.name}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover our collection of beautifully designed rooms, each offering
            unique amenities and comfort for your perfect stay
          </Typography>
        </Box>
      </Box>

      {/* Room Cards Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(auto-fit, minmax(200px, 400px))',
          md: 'repeat(auto-fit, minmax(200px, 400px))',
        }}
        gap={2.5}
        sx={{ mb: 4 }}
        justifyContent={'space-around'}
      >
        {kottage.roomTypes
          .filter(room => room.listStatus === 'listed')
          .map((room, index) => (
            <Fade in timeout={500 + index * 100} key={room.id}>
              <Card
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '2px solid',
                  borderColor:
                    selectedRoom?.id === room.id
                      ? Colors.blue
                      : 'rgba(0, 0, 0, 0.08)',
                  borderRadius: '5px',
                  transition: 'all 0.3s ease',
                  background:
                    selectedRoom?.id === room.id
                      ? `linear-gradient(135deg, ${alpha(
                          Colors.blue,
                          0.1
                        )} 0%, ${alpha(Colors.raspberry, 0.1)} 100%)`
                      : '#ffffff',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderColor:
                      selectedRoom?.id === room.id
                        ? Colors.blue
                        : alpha(Colors.blue, 0.4),
                    background:
                      selectedRoom?.id === room.id
                        ? `linear-gradient(135deg, ${alpha(
                            Colors.blue,
                            0.15
                          )} 0%, ${alpha(Colors.raspberry, 0.15)} 100%)`
                        : alpha('#f8f9fa', 0.8),
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => setSelectedRoom(room)}
              >
                {/* Room Image with Promotion Badge */}
                <Box
                  sx={{
                    position: 'relative',
                    height: '140px',
                    width: '100%',
                    flexShrink: 0,
                  }}
                >
                  {room.images && room.images.length > 0 ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={room.images[0]}
                      alt={room.name}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 140,
                        width: '100%',
                        bgcolor: alpha(Colors.blue, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '14px 14px 0 0',
                      }}
                    >
                      <ImageIcon
                        sx={{ fontSize: 40, color: alpha(Colors.blue, 0.4) }}
                      />
                    </Box>
                  )}

                  {/* Room Promotion Badge */}
                  {room.promotion && room.promotion.isActive && (
                    <Chip
                      icon={<LocalOffer />}
                      label={formatPromotionDiscount(room.promotion)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: getPromotionBadgeColor(room.promotion),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': {
                          color: 'white',
                          fontSize: 14,
                        },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                  )}

                  {/* Property-level Promotion Badge */}
                  {!room.promotion &&
                    kottage?.promotions &&
                    kottage.promotions.length > 0 &&
                    kottage.promotions.some(p => p.isActive) && (
                      <Chip
                        icon={<LocalOffer />}
                        label={formatPromotionDiscount(
                          kottage.promotions.find(p => p.isActive)!
                        )}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: getPromotionBadgeColor(
                            kottage.promotions.find(p => p.isActive)!
                          ),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: 'white',
                            fontSize: 14,
                          },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      />
                    )}
                </Box>

                <CardContent
                  sx={{
                    p: 2,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Room Header */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 1.5 }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={Colors.blue}
                        sx={{ mb: 0.5 }}
                      >
                        {room.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <People
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Up to {room.maxOccupancy} guests
                        </Typography>
                      </Box>
                      {/* Details Button */}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: Colors.blue,
                          color: Colors.blue,
                          px: 1.2,
                          py: 0.4,
                          minHeight: 28,
                          mt: 0.5,
                          '&:hover': {
                            borderColor: Colors.blue,
                            bgcolor: alpha(Colors.blue, 0.1),
                          },
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setDetailedRoomView(room);
                        }}
                      >
                        Details
                      </Button>
                    </Box>

                    {/* Price Section with Details Button - Compact */}
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      gap={1}
                      sx={{ ml: 1.5 }}
                    >
                      {/* Price Section */}
                      <Box textAlign="right">
                        {(() => {
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

                          return (
                            <Box>
                              {promotion.isPromotionApplied ? (
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: 'text.secondary',
                                      textDecoration: 'line-through',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    ${promotion.originalPrice}
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    sx={{
                                      color: Colors.raspberry,
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    ${promotion.finalPrice}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: '#4caf50', fontWeight: 600 }}
                                  >
                                    Save ${promotion.savings}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="h6"
                                  fontWeight={800}
                                  sx={{
                                    color: Colors.raspberry,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  ${room.pricePerNight}
                                </Typography>
                              )}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                per night
                              </Typography>

                              {/* Total Price Display - Compact */}
                              {checkInDate && checkOutDate && (
                                <Box
                                  sx={{
                                    mt: 0.5,
                                    pt: 0.5,
                                    borderTop: '1px solid',
                                    borderColor: alpha(Colors.blue, 0.2),
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    sx={{
                                      color: Colors.blue,
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    Total: ${totalPrice}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {nights} night{nights > 1 ? 's' : ''}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          );
                        })()}
                      </Box>
                    </Box>
                  </Box>

                  {/* Dates Display - More Compact */}
                  {(checkInDate || checkOutDate) && (
                    <Box
                      sx={{
                        mb: 1.5,
                        p: 1,
                        bgcolor: alpha(Colors.blue, 0.05),
                        borderRadius: 1.5,
                        border: `1px solid ${alpha(Colors.blue, 0.15)}`,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 0.5 }}
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Box
                            sx={{
                              p: 0.3,
                              borderRadius: '50%',
                              bgcolor: Colors.blue,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Hotel sx={{ color: 'white', fontSize: 16 }} />
                          </Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: Colors.blue }}
                          >
                            Your Stay
                          </Typography>
                        </Box>

                        {guests && (
                          <Box display="flex" alignItems="center" gap={0.3}>
                            <People
                              sx={{ fontSize: 16, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {guests} guest{guests > 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Check-in
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: Colors.blue, lineHeight: 1.2 }}
                          >
                            {checkInDate
                              ? formatDate(checkInDate)
                              : 'Select date'}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            height: '1px',
                            width: '15px',
                            bgcolor: alpha(Colors.blue, 0.3),
                            mx: 0.5,
                          }}
                        />

                        <Box textAlign="right">
                          <Typography variant="caption" color="text.secondary">
                            Check-out
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: Colors.blue, lineHeight: 1.2 }}
                          >
                            {checkOutDate
                              ? formatDate(checkOutDate)
                              : 'Select date'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Room Description - Compact */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.3,
                    }}
                  >
                    {room.description ||
                      'Comfortable and well-appointed room with modern amenities.'}
                  </Typography>

                  {/* Room Amenities - Compact */}
                  {room.amenities && room.amenities.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Box display="flex" flexWrap="wrap" gap={0.4}>
                        {room.amenities.slice(0, 3).map((amenity, idx) => {
                          const IconComponent = getAmenityIcon(amenity);
                          return (
                            <Chip
                              key={idx}
                              icon={<IconComponent />}
                              label={amenity}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.65rem',
                                height: 18,
                                borderColor: alpha(Colors.blue, 0.3),
                                color: Colors.blue,
                                '& .MuiChip-icon': {
                                  fontSize: 10,
                                  color: Colors.blue,
                                },
                                '& .MuiChip-label': {
                                  px: 0.5,
                                },
                              }}
                            />
                          );
                        })}
                        {room.amenities.length > 3 && (
                          <Chip
                            label={`+${room.amenities.length - 3}`}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 18,
                              bgcolor: alpha(Colors.raspberry, 0.1),
                              color: Colors.raspberry,
                              '& .MuiChip-label': {
                                px: 0.5,
                              },
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Promotion Info - More Compact */}
                  {room.promotion && room.promotion.isActive && (
                    <Box
                      sx={{
                        mb: 1,
                        p: 0.8,
                        bgcolor: alpha('#4caf50', 0.05),
                        borderRadius: 1,
                        border: `1px solid ${alpha('#4caf50', 0.2)}`,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={0.4}>
                        <LocalOffer sx={{ fontSize: 10, color: '#4caf50' }} />
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{ color: '#4caf50' }}
                        >
                          {room.promotion.name}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Property-level Promotion - More Compact */}
                  {!room.promotion &&
                    kottage?.promotions &&
                    kottage.promotions.length > 0 &&
                    kottage.promotions.some(p => p.isActive) && (
                      <Box
                        sx={{
                          mb: 1,
                          p: 0.8,
                          bgcolor: alpha('#4caf50', 0.05),
                          borderRadius: 1,
                          border: `1px solid ${alpha('#4caf50', 0.2)}`,
                        }}
                      >
                        {kottage.promotions
                          .filter(p => p.isActive)
                          .slice(0, 1)
                          .map((promotion, idx) => (
                            <Box
                              key={idx}
                              display="flex"
                              alignItems="center"
                              gap={0.4}
                            >
                              <LocalOffer
                                sx={{ fontSize: 10, color: '#4caf50' }}
                              />
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                sx={{ color: '#4caf50' }}
                              >
                                {promotion.name}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    )}

                  {/* Action Buttons - Compact */}
                  <Box display="flex" gap={1} sx={{ mt: 'auto' }}>
                    {(() => {
                      const canAccommodateGuests =
                        !guests || guests <= room.maxOccupancy;

                      return (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={!canAccommodateGuests}
                          sx={{
                            background: canAccommodateGuests
                              ? `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`
                              : '#e0e0e0',
                            color: canAccommodateGuests ? 'white' : '#9e9e9e',
                            boxShadow: 'none',
                            px: 1.2,
                            py: 0.4,
                            minHeight: 28,
                            flex: 1,
                            cursor: canAccommodateGuests
                              ? 'pointer'
                              : 'not-allowed',
                            '&:hover': canAccommodateGuests
                              ? {
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }
                              : {},
                          }}
                          onClick={e => {
                            e.stopPropagation();
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
                        >
                          {canAccommodateGuests
                            ? 'Book Now'
                            : 'Too Many Guests'}
                        </Button>
                      );
                    })()}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
      </Box>
    </Box>
  );
}

export default RoomTypes;
