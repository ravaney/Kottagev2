import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Chip,
  Button,
  Rating,
  Fade,
  alpha,
} from "@mui/material";
import {
  Hotel,
  People,
  CheckCircle,
  Image as ImageIcon,
  LocalOffer,
  Star,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Kottage, RoomType } from "../../hooks";
import { Colors } from "../constants";
import { 
  calculatePromotionalPrice, 
  formatPromotionDiscount, 
  getPromotionBadgeColor 
} from "../../utils/promotionUtils";
import { getAmenityIcon } from "./ViewProperty/getAmenityIcon";

interface RoomTypesProps {
  kottage: Kottage;
  selectedRoom: RoomType | null;
  setSelectedRoom: (room: RoomType | null) => void;
  setDetailedRoomView: (room: RoomType | null) => void;
}

function RoomTypes({ kottage, selectedRoom, setSelectedRoom, setDetailedRoomView }: RoomTypesProps) {
  const navigate = useNavigate();

  if (!kottage?.roomTypes || kottage.roomTypes.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <Hotel sx={{ color: Colors.blue, fontSize: 28 }} />
        <Typography variant="h4" fontWeight={700} color={Colors.blue}>
          Choose Your Room
        </Typography>
      </Box>
      
      <Box display="flex" flexDirection="column" gap={2}>
        {kottage.roomTypes
          .filter(room => room.listStatus === 'listed')
          .map((room, index) => (
            <Fade in timeout={500 + index * 100} key={room.id}>
              <Card 
                elevation={0}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  border: '2px solid',
                  borderColor: selectedRoom?.id === room.id ? Colors.blue : 'rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  background: selectedRoom?.id === room.id 
                    ? `linear-gradient(135deg, ${alpha(Colors.blue, 0.1)} 0%, ${alpha(Colors.raspberry, 0.1)} 100%)`
                    : '#ffffff',
                  overflow: 'hidden',
                  minHeight: '140px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    borderColor: selectedRoom?.id === room.id ? Colors.blue : alpha(Colors.blue, 0.3),
                    background: selectedRoom?.id === room.id 
                      ? `linear-gradient(135deg, ${alpha(Colors.blue, 0.15)} 0%, ${alpha(Colors.raspberry, 0.15)} 100%)`
                      : alpha('#f5f5f5', 0.5),
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => setSelectedRoom(room)}
              >
                {/* Room Image with Promotion Badge */}
                <Box sx={{ position: 'relative', width: '180px', flexShrink: 0 }}>
                  {room.images && room.images.length > 0 ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={room.images[0]}
                      alt={room.name}
                      sx={{ 
                        borderRadius: '12px 0 0 12px',
                        objectFit: 'cover',
                        width: '100%'
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
                        borderRadius: '12px 0 0 12px'
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 32, color: alpha(Colors.blue, 0.4) }} />
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
                          fontSize: 14
                        },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    />
                  )}
                  
                  {/* Property-level Promotion Badge */}
                  {!room.promotion && kottage?.promotions && kottage.promotions.length > 0 && kottage.promotions.some(p => p.isActive) && (
                    <Chip
                      icon={<LocalOffer />}
                      label={formatPromotionDiscount(kottage.promotions.find(p => p.isActive)!)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: getPromotionBadgeColor(kottage.promotions.find(p => p.isActive)!),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': { 
                          color: 'white',
                          fontSize: 14
                        },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Room Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={700} color={Colors.blue} sx={{ fontSize: '1.1rem' }}>
                        {room.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                        <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          Up to {room.maxOccupancy} guests
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Price Section */}
                    <Box textAlign="right" sx={{ ml: 2 }}>
                      {(() => {
                        const promotion = calculatePromotionalPrice(room, undefined, undefined, undefined, kottage?.promotions);
                        return (
                          <Box>
                            {promotion.isPromotionApplied ? (
                              <Box>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    textDecoration: 'line-through',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  ${promotion.originalPrice}
                                </Typography>
                                <Typography 
                                  variant="h6" 
                                  fontWeight={800}
                                  sx={{ 
                                    color: Colors.raspberry,
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  ${promotion.finalPrice}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.7rem' }}>
                                  Save ${promotion.savings}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography 
                                variant="h6" 
                                fontWeight={800}
                                sx={{ 
                                  color: Colors.raspberry,
                                  fontSize: '1.2rem'
                                }}
                              >
                                ${room.pricePerNight}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              per night
                            </Typography>
                          </Box>
                        );
                      })()}
                    </Box>
                  </Box>

                  {/* Room Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 1,
                      fontSize: '0.8rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {room.description || 'Comfortable and well-appointed room with modern amenities.'}
                  </Typography>

                  {/* Room Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {room.amenities.slice(0, 2).map((amenity, idx) => {
                          const IconComponent = getAmenityIcon(amenity);
                          return (
                            <Chip
                              key={idx}
                              icon={<IconComponent />}
                              label={amenity}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                borderColor: alpha(Colors.blue, 0.3),
                                color: Colors.blue,
                                '& .MuiChip-icon': { 
                                  fontSize: 12,
                                  color: Colors.blue
                                }
                              }}
                            />
                          );
                        })}
                        {room.amenities.length > 2 && (
                          <Chip
                            label={`+${room.amenities.length - 2}`}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 20,
                              bgcolor: alpha(Colors.raspberry, 0.1),
                              color: Colors.raspberry
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Promotion Info - Compact */}
                  {room.promotion && room.promotion.isActive && (
                    <Box sx={{ mb: 1, p: 1, bgcolor: alpha('#4caf50', 0.05), borderRadius: 1, border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocalOffer sx={{ fontSize: 12, color: '#4caf50' }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color: '#4caf50', fontSize: '0.7rem' }}>
                          {room.promotion.name}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {/* Property-level Promotion - Compact */}
                  {!room.promotion && kottage?.promotions && kottage.promotions.length > 0 && kottage.promotions.some(p => p.isActive) && (
                    <Box sx={{ mb: 1, p: 1, bgcolor: alpha('#4caf50', 0.05), borderRadius: 1, border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
                      {kottage.promotions.filter(p => p.isActive).slice(0, 1).map((promotion, idx) => (
                        <Box key={idx} display="flex" alignItems="center" gap={0.5}>
                          <LocalOffer sx={{ fontSize: 12, color: '#4caf50' }} />
                          <Typography variant="caption" fontWeight={700} sx={{ color: '#4caf50', fontSize: '0.7rem' }}>
                            {promotion.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box display="flex" gap={1} sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: Colors.blue,
                        color: Colors.blue,
                        fontSize: '0.75rem',
                        px: 1.5,
                        py: 0.5,
                        '&:hover': {
                          borderColor: Colors.blue,
                          bgcolor: alpha(Colors.blue, 0.1)
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailedRoomView(room);
                      }}
                    >
                      Details
                    </Button>
                    
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
                        boxShadow: 'none',
                        fontSize: '0.75rem',
                        px: 1.5,
                        py: 0.5,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/book-room', { state: { kottage, room } });
                      }}
                    >
                      Book Now
                    </Button>
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