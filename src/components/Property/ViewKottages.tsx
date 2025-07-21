import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Chip,
  IconButton,
  Button,
  Rating,
  Divider,
  Fade,
  useTheme,
  alpha,
  Avatar,
  Badge
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  Visibility,
  People,
  Hotel,
  Bathtub,
  Wifi,
  LocalParking,
  Pool,
  Restaurant,
  Spa,
  FitnessCenter,
  BusinessCenter,
  RoomService,
  AcUnit,
  Balcony,
  Kitchen,
  Pets,
  SmokingRooms,
  SmokeFree,
  Star,
  CheckCircle,
  TrendingUp,
  Image as ImageIcon
} from "@mui/icons-material";
import { Stack } from "@fluentui/react";
import BigGallery from "./BigGallery";
import PropertyNav from "./PropertyNav";
import AboutProperty from "./AboutProperty";
import Policy from "./Policy";
import Reviews from "./Reviews";
import { Kottage, RoomType } from "../../hooks";
import { useLocation } from "react-router-dom";
import CreateReservation from "./Reservations/CreateReservation";
import { usePropertyAnalytics } from "../../services/analyticsService";
import { Colors } from "../constants";

function ViewKottages() {
  const location = useLocation();
  const kottage = location.state?.kottage as Kottage;
  const theme = useTheme();
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Initialize analytics tracking for this property
  const analytics = usePropertyAnalytics(kottage?.id || '', document.referrer);
  
  console.log("Kottage in ViewKottages:", kottage);

  // Helper function to get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi />;
    if (amenityLower.includes('parking')) return <LocalParking />;
    if (amenityLower.includes('pool')) return <Pool />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Restaurant />;
    if (amenityLower.includes('spa')) return <Spa />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <FitnessCenter />;
    if (amenityLower.includes('business')) return <BusinessCenter />;
    if (amenityLower.includes('room service')) return <RoomService />;
    if (amenityLower.includes('ac') || amenityLower.includes('air')) return <AcUnit />;
    if (amenityLower.includes('balcony') || amenityLower.includes('terrace')) return <Balcony />;
    if (amenityLower.includes('kitchen')) return <Kitchen />;
    if (amenityLower.includes('pet')) return <Pets />;
    return <CheckCircle />;
  };

  // Get the default room or the cheapest room for pricing display
  const getDefaultRoom = () => {
    if (!kottage?.roomTypes || kottage.roomTypes.length === 0) return null;
    return kottage.roomTypes.reduce((cheapest, room) => 
      room.pricePerNight < cheapest.pricePerNight ? room : cheapest
    );
  };

  const defaultRoom = getDefaultRoom();

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Clean Header Section */}
      <Container maxWidth="xl" sx={{ pt: 2, pb: 3 }}>
        <Box sx={{ mb: 3 }}>
          {/* Simple Header with Property Info */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                color="#1a1a1a"
                sx={{ mb: 1 }}
              >
                {kottage?.name || 'Beautiful Property'}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LocationOn sx={{ color: Colors.blue, fontSize: 20 }} />
                  <Typography variant="body1" color="text.secondary">
                    {kottage?.address?.city && kottage?.address?.state 
                      ? `${kottage.address.city}, ${kottage.address.state}`
                      : 'Jamaica'
                    }
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating 
                    value={kottage?.rating || 4.5} 
                    precision={0.1} 
                    readOnly 
                    size="small"
                    sx={{ '& .MuiRating-iconFilled': { color: '#ffd700' } }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {kottage?.rating || 4.5} • (127 reviews)
                  </Typography>
                </Box>
              </Box>

              {defaultRoom && (
                <Box display="flex" alignItems="baseline" gap={1}>
                  <Typography variant="h5" fontWeight={700} color={Colors.raspberry}>
                    ${defaultRoom.pricePerNight}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per night from
                  </Typography>
                </Box>
              )}
            </Box>

            <Box display="flex" gap={1}>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{ 
                  border: '1px solid #e0e0e0',
                  bgcolor: 'white',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                {isFavorite ? <Favorite sx={{ color: '#ff6b6b' }} /> : <FavoriteBorder />}
              </IconButton>
              <IconButton
                sx={{ 
                  border: '1px solid #e0e0e0',
                  bgcolor: 'white',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <Share />
              </IconButton>
            </Box>
          </Box>

          {/* Property Description */}
          {kottage?.description && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                maxWidth: '800px',
                lineHeight: 1.6,
                mb: 2
              }}
            >
              {kottage.description}
            </Typography>
          )}
        </Box>
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left Side - Property Details */}
          <Grid item xs={12} lg={8}>
            {/* Photo Gallery */}
            <Paper elevation={0} sx={{ borderRadius: 3, mb: 4, overflow: 'hidden' }}>
              <BigGallery />
            </Paper>

            {/* Room Types Section */}
            {kottage?.roomTypes && kottage.roomTypes.length > 0 && (
              <Paper elevation={0} sx={{ borderRadius: 3, p: 4, mb: 4 }}>
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                  <Hotel sx={{ color: Colors.blue, fontSize: 28 }} />
                  <Typography variant="h4" fontWeight={700} color={Colors.blue}>
                    Available Room Types
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {kottage.roomTypes
                    .filter(room => room.listStatus === 'listed')
                    .map((room, index) => (
                    <Grid item xs={12} md={6} key={room.id}>
                      <Fade in timeout={500 + index * 100}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            border: '2px solid',
                            borderColor: selectedRoom?.id === room.id ? Colors.blue : 'transparent',
                            borderRadius: 3,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: selectedRoom?.id === room.id 
                              ? `linear-gradient(135deg, ${alpha(Colors.blue, 0.05)} 0%, ${alpha(Colors.raspberry, 0.05)} 100%)`
                              : 'white',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                              borderColor: alpha(Colors.blue, 0.3)
                            }
                          }}
                          onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                        >
                          {/* Room Image */}
                          {room.images && room.images.length > 0 ? (
                            <CardMedia
                              component="img"
                              height="200"
                              image={room.images[0]}
                              alt={room.name}
                              sx={{ 
                                borderRadius: '12px 12px 0 0',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: 200,
                                bgcolor: alpha(Colors.blue, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '12px 12px 0 0'
                              }}
                            >
                              <ImageIcon sx={{ fontSize: 48, color: alpha(Colors.blue, 0.4) }} />
                            </Box>
                          )}

                          <CardContent sx={{ p: 3 }}>
                            {/* Room Header */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                              <Box>
                                <Typography variant="h6" fontWeight={700} color={Colors.blue}>
                                  {room.name}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                                  <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Up to {room.maxOccupancy} guests
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box textAlign="right">
                                <Typography 
                                  variant="h5" 
                                  fontWeight={800}
                                  sx={{ 
                                    color: Colors.raspberry,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  ${room.pricePerNight}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  per night
                                </Typography>
                              </Box>
                            </Box>

                            {/* Room Description */}
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {room.description || 'Comfortable and well-appointed room with modern amenities.'}
                            </Typography>

                            {/* Room Amenities */}
                            {room.amenities && room.amenities.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                  Amenities:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                  {room.amenities.slice(0, 4).map((amenity, idx) => (
                                    <Chip
                                      key={idx}
                                      icon={getAmenityIcon(amenity)}
                                      label={amenity}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: '0.75rem',
                                        height: 24,
                                        borderColor: alpha(Colors.blue, 0.3),
                                        color: Colors.blue,
                                        '& .MuiChip-icon': { 
                                          fontSize: 14,
                                          color: Colors.blue
                                        }
                                      }}
                                    />
                                  ))}
                                  {room.amenities.length > 4 && (
                                    <Chip
                                      label={`+${room.amenities.length - 4} more`}
                                      size="small"
                                      sx={{
                                        fontSize: '0.75rem',
                                        height: 24,
                                        bgcolor: alpha(Colors.raspberry, 0.1),
                                        color: Colors.raspberry
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            )}

                            {/* Availability Badge */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Chip
                                icon={<CheckCircle />}
                                label={`${room.quantityAvailable} available`}
                                size="small"
                                sx={{
                                  bgcolor: alpha('#4caf50', 0.1),
                                  color: '#4caf50',
                                  fontWeight: 600,
                                  '& .MuiChip-icon': { color: '#4caf50' }
                                }}
                              />
                              
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  background: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
                                  boxShadow: 'none',
                                  '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                  }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRoom(room);
                                }}
                              >
                                Select Room
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Property Navigation */}
            <Paper elevation={0} sx={{ borderRadius: 3, mb: 4 }}>
              <PropertyNav />
            </Paper>

            {/* About Property */}
            <Paper elevation={0} sx={{ borderRadius: 3, mb: 4 }}>
              <AboutProperty />
            </Paper>

            {/* Policies */}
            <Paper elevation={0} sx={{ borderRadius: 3, mb: 4 }}>
              <Policy />
            </Paper>

            {/* Reviews */}
            <Paper elevation={0} sx={{ borderRadius: 3, mb: 4 }}>
              <Reviews />
            </Paper>
          </Grid>

          {/* Right Side - Booking Widget */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <CreateReservation kottage={kottage} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ViewKottages;
