import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  alpha,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,

} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  ArrowBack, 
  CheckCircle, 
  LocalOffer,
  InfoOutlined,
  PeopleAlt,
  Favorite,
  FavoriteBorder,
  CalendarToday,
  LocationOn
} from '@mui/icons-material';
import { Colors } from '../../constants';
import { Kottage, RoomType, useAuth, useCreateReservation, useUpdateProperty } from '../../../hooks';
import { useBlockedDates } from '../../../hooks/useBlockedDates';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';
import { calculateNights, hasBlockedDatesInRange, getMaxCheckoutDate, handleConfirmPayment } from './reservationUtilities';

const BookRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { 
    kottage?: Kottage; 
    room?: RoomType;
    checkInDate?: Date;
    checkOutDate?: Date;
    guests?: number;
    totalPrice?: number;
    nights?: number;
    pricePerNight?: number;
  } || {};
  const { kottage, room, checkInDate, checkOutDate, guests: passedGuests, totalPrice: passedTotalPrice, nights: passedNights, pricePerNight: passedPricePerNight } = state;
  const { appUser, uid } = useAuth ();
  const updateProperty = useUpdateProperty();
  // Reservation state - Initialize with passed values
  const [startDate, setStartDate] = useState<Date | undefined>(checkInDate);
  const [endDate, setEndDate] = useState<Date | undefined>(checkOutDate);
  const [guests, setGuests] = useState<number>(passedGuests || 1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showPricing, setShowPricing] = useState<boolean>(false);
  
  // Payment state
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  
  // Use the reservation hook
  const { mutateAsync:createReservation, isPending: isProcessing, error } = useCreateReservation();

  // Blocked dates hook
  const propertyId = kottage?.id ?? '';
  const roomTypeId = room?.id ?? '';
  const { data: blockedDates = [], isLoading: blockedDatesLoading, refetch: refetchBlockedDates } = useBlockedDates(propertyId, roomTypeId);



  // Redirect back if no data
  useEffect(() => {
    if (!kottage || !room) {
      navigate(`/Kottages/${kottage?.id || ''}`);
    }
  }, [kottage, room, navigate]);
  
  // Handle reservation error
  useEffect(() => {
    if (error) {
      setPaymentError(error.message || 'Failed to create reservation. Please try again.');
    }
  }, [error]);
  
  // Adjust guest count when room selection changes
  useEffect(() => {
    if (room && guests > room.maxOccupancy) {
      setGuests(room.maxOccupancy);
    }
  }, [room, guests]);
  
  if (!kottage || !room) {
    return null;
  }

  const nights = calculateNights(startDate, endDate);
  
  // Calculate promotional pricing if available - always recalculate to ensure accuracy
  const roomForPricing = room;
  const promotionalPricing = roomForPricing ? calculatePromotionalPrice(
    roomForPricing,
    startDate?.toISOString(),
    endDate?.toISOString(),
    nights,
    kottage?.promotions
  ) : null;
  
  // Use promotional price if available, otherwise use regular price
  // If dates match what was passed from RoomTypes and we have a passed promotional price, use it for consistency
  const datesMatchPassed = checkInDate && checkOutDate && startDate && endDate && 
    checkInDate.getTime() === startDate.getTime() && 
    checkOutDate.getTime() === endDate.getTime() &&
    nights === passedNights;
    
  const basePrice = datesMatchPassed && passedPricePerNight ? 
    passedPricePerNight : 
    (promotionalPricing?.finalPrice || room?.pricePerNight || 300);
  

  const maxGuestsAllowed = room?.maxOccupancy || 4;
  
  const subtotal = nights * basePrice;
  const cleaningFee = 75;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;
  
  // Calculate total savings if promotion is applied
  const totalSavings = promotionalPricing?.isPromotionApplied ? nights * promotionalPricing.savings : 0;

  // Check if current date selection is valid
  const isDateRangeValid = !hasBlockedDatesInRange(startDate!, endDate!, blockedDates);
  
  // Get maximum allowed checkout date based on checkin selection
  const maxCheckoutDate = startDate ? getMaxCheckoutDate(startDate, blockedDates) : undefined;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: Colors.blue }}
      >
        Back to Property
      </Button>
      
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
        }}
      >
        {/* Hero Section with Image */}
        {room.images && room.images.length > 0 && (
          <Box 
            sx={{ 
              height: { xs: 250, sm: 350, md: 400 },
              width: '100%',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                zIndex: 1
              }
            }}
          >
            <img 
              src={room.images[0]} 
              alt={room.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                p: { xs: 3, md: 4 },
                zIndex: 2,
                color: 'white'
              }}
            >
              <Typography variant="h3" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {room.name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                {kottage.name}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: { md: '1 1 58%' }, p: { xs: 3, md: 4 } }}>
            {/* Room Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: Colors.blue }}>
                Room Details
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {room.description || 'Comfortable and well-appointed room with modern amenities.'}
              </Typography>
            
              {/* Room Promotion */}
              {room.promotion && room.promotion.isActive && (
                <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#4caf50', 0.05), borderRadius: 2, border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
                  <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                    <LocalOffer sx={{ fontSize: 16, color: '#4caf50' }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#4caf50' }}>
                      {room.promotion.name}
                    </Typography>
                  </Box>
                  {room.promotion.description && (
                    <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.8rem' }}>
                      {room.promotion.description}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.75rem', mt: 0.5 }}>
                    Valid until {new Date(room.promotion.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
              
              {/* Property-level Promotion */}
              {!room.promotion && kottage?.promotions && kottage.promotions.length > 0 && kottage.promotions.some(p => p.isActive) && (
                <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#4caf50', 0.05), borderRadius: 2, border: `1px solid ${alpha('#4caf50', 0.2)}` }}>
                  {kottage.promotions.filter(p => p.isActive).map((promotion, idx) => (
                    <Box key={idx} sx={{ mb: idx < (kottage.promotions?.filter(p => p.isActive).length ?? 0) - 1 ? 2 : 0 }}>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                        <LocalOffer sx={{ fontSize: 16, color: '#4caf50' }} />
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#4caf50' }}>
                          {promotion.name}
                        </Typography>
                      </Box>
                      {promotion.description && (
                        <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.8rem' }}>
                          {promotion.description}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.75rem', mt: 0.5 }}>
                        Valid until {new Date(promotion.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Booking Form */}
          <Box sx={{ flex: { md: '1 1 42%' } }}>
            <Box sx={{ 
              p: { xs: 3, md: 4 }, 
              height: '100%',
              borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
              borderTop: { xs: '1px solid #e0e0e0', md: 'none' },
              bgcolor: '#fafafa'
            }}>
              <Box sx={{ 
                maxWidth: 500, 
                mx: 'auto'
              }}>
                {/* Header Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: Colors.raspberry,
                          fontWeight: 700,
                          mb: 0.5,
                          fontSize: '1.4rem'
                        }}
                      >
                        {room.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {kottage?.name}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <IconButton
                      onClick={() => setIsFavorite(!isFavorite)}
                      sx={{ 
                        color: isFavorite ? Colors.raspberry : 'grey.400',
                        '&:hover': { transform: 'scale(1.1)' },
                        transition: 'all 0.2s'
                      }}
                    >
                      {isFavorite ? <Favorite fontSize="large" /> : <FavoriteBorder fontSize="large" />}
                    </IconButton>
                  </Box>

                  {/* Price Display */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      ${basePrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      per night
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Date Selection */}
                <Box sx={{ mb: 3, width: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 20, color: Colors.raspberry }} />
                    Select Dates
                    {blockedDatesLoading && (
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <DatePicker
                      label="Check-in"
                      value={startDate}
                      onChange={(newValue: Date | null) => {
                        setStartDate(newValue || undefined);
                        if (newValue && endDate && newValue >= endDate) {
                          setEndDate(undefined);
                        }
                        setShowPricing(true);
                      }}
                      shouldDisableDate={(date) => {
                        const dateStr = date ? date.toISOString().split('T')[0] : '';
                        const isBlocked = blockedDates.includes(dateStr);
                        return isBlocked;
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: Colors.raspberry,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: Colors.raspberry,
                        },
                      }}
                    />

                    <DatePicker
                      label="Check-out"
                      value={endDate}
                      onChange={(newValue: Date | null) => {
                        setEndDate(newValue || undefined);
                        setShowPricing(true);
                      }}
                      minDate={startDate}
                      maxDate={maxCheckoutDate}
                      shouldDisableDate={(date) => {
                        const dateStr = date ? date.toISOString().split('T')[0] : '';
                        const isBlocked = blockedDates.includes(dateStr);
                        
                        // Also disable if this would create an invalid range with current checkin
                        let wouldCreateInvalidRange = false;
                        if (startDate && date) {
                          wouldCreateInvalidRange = hasBlockedDatesInRange(startDate, date, blockedDates);
                        }
                        return isBlocked || wouldCreateInvalidRange;
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&:hover fieldset': {
                            borderColor: Colors.raspberry,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: Colors.raspberry,
                        },
                      }}
                    />
                  </Box>
                  
                  {/* Date Range Helper Text */}
                  {startDate && maxCheckoutDate && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                      💡 Maximum checkout date: {maxCheckoutDate.toLocaleDateString()} 
                      {maxCheckoutDate < new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) && ' (due to blocked dates)'}
                    </Typography>
                  )}
                </Box>

                {/* Date Range Validation Warning */}
                {startDate && endDate && !isDateRangeValid && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Invalid Date Range
                    </Typography>
                    <Typography variant="body2">
                      Your selected dates include blocked dates. Please choose a different range that doesn't include blocked dates.
                    </Typography>
                  </Alert>
                )}

                {/* Guests Selection */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Guests"
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Math.min(maxGuestsAllowed, parseInt(e.target.value) || 1)))}
                    InputProps={{
                      inputProps: { min: 1, max: maxGuestsAllowed },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleAlt sx={{ color: Colors.raspberry }} />
                        </InputAdornment>
                      ),
                    }}
                    helperText={`Maximum ${maxGuestsAllowed} guests for ${room.name}`}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: Colors.raspberry,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: Colors.raspberry,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: Colors.raspberry,
                      },
                    }}
                  />
                </Box>

                {/* Pricing Breakdown */}
                {showPricing && startDate && endDate && isDateRangeValid && (
                  <Fade in={showPricing}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        mb: 3, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        width: '100%'
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Price Breakdown
                      </Typography>
                      
                      {/* Show promotional pricing if applicable */}
                      {promotionalPricing?.isPromotionApplied ? (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                              ${promotionalPricing.originalPrice} × {nights} nights
                            </Typography>
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                              ${nights * promotionalPricing.originalPrice}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                              ${basePrice} × {nights} nights (Promotional Rate)
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                              ${subtotal}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                              Total Savings
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                              -${totalSavings.toFixed(2)}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">${basePrice} × {nights} nights</Typography>
                          <Typography variant="body2">${subtotal}</Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Cleaning fee</Typography>
                        <Typography variant="body2">${cleaningFee}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2">Service fee</Typography>
                        <Typography variant="body2">${serviceFee.toFixed(2)}</Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: Colors.raspberry }}>
                          ${total.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      {/* Promotion Information */}
                      {promotionalPricing?.isPromotionApplied && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha('#4caf50', 0.1), borderRadius: 1, border: `1px solid ${alpha('#4caf50', 0.3)}` }}>
                          {roomForPricing?.promotion ? (
                            <>
                              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem' }}>
                                🎉 {roomForPricing.promotion.name} Applied!
                              </Typography>
                              {roomForPricing.promotion.description && (
                                <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.8rem', mt: 0.5 }}>
                                  {roomForPricing.promotion.description}
                                </Typography>
                              )}
                            </>
                          ) : kottage?.promotions?.some(p => p.isActive) && (
                            <>
                              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem' }}>
                                🎉 {kottage.promotions.find(p => p.isActive)?.name} Applied!
                              </Typography>
                              {kottage.promotions.find(p => p.isActive)?.description && (
                                <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '0.8rem', mt: 0.5 }}>
                                  {kottage.promotions.find(p => p.isActive)?.description}
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      )}
                    </Paper>
                  </Fade>
                )}

                {/* Reservation Summary */}
                {showPricing && startDate && endDate && isDateRangeValid && (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      backgroundColor: '#f0f8ff', 
                      borderRadius: 2,
                      border: '1px solid #e3f2fd',
                      width: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: Colors.blue }}>
                      Reservation Summary
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Check-in:</strong> {startDate?.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Check-out:</strong> {endDate?.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Guests:</strong> {guests}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Room:</strong> {room.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Nights:</strong> {nights}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color={Colors.raspberry}>
                          <strong>Total:</strong> ${total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      By confirming, you agree to the booking terms and conditions.
                    </Typography>
                  </Paper>
                )}

                {/* Action Buttons */}
                <Box sx={{ mb: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={!startDate || !endDate || nights <= 0 || !isDateRangeValid || isProcessing}
                    onClick={async () => {
                      if (!startDate || !endDate || !room || !kottage) return;

                      await handleConfirmPayment({
                        startDate,
                        endDate,
                        room,
                        kottage,
                        uid: String(uid),
                        appUser,
                        total,
                        guests,
                        createReservation,
                        updateProperty,
                        refetchBlockedDates,
                        setPaymentSuccess,
                        setPaymentError
                      });
                    }}
                    sx={{
                      backgroundColor: Colors.raspberry,
                      color: 'white',
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': {
                        backgroundColor: Colors.raspberry,
                        filter: 'brightness(1.1)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                      },
                      '&:disabled': {
                        backgroundColor: 'grey.300',
                        color: 'grey.500'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isProcessing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        Processing...
                      </Box>
                    ) : !startDate || !endDate || nights <= 0 
                      ? 'Select Valid Dates to Book' 
                      : !isDateRangeValid
                      ? 'Selected Range Contains Blocked Dates'
                      : `Confirm Reservation - ${nights} night${nights > 1 ? 's' : ''}`
                    }
                  </Button>
                </Box>

                {/* Additional Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Free cancellation up to{' '}
                      <Typography component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        14 days before check-in
                      </Typography>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <InfoOutlined sx={{ color: 'info.main', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      You won't be charged yet
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Contact & Property Info */}
                <Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: Colors.raspberry,
                      color: Colors.raspberry,
                      borderRadius: 2,
                      py: 1,
                      mb: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: Colors.raspberry,
                        backgroundColor: `${Colors.raspberry}10`,
                      }
                    }}
                  >
                    Contact Host
                  </Button>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: 'center',
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    Property #{kottage.id}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      {/* Success Dialog */}
      {paymentSuccess && (
        <Dialog
          open={paymentSuccess}
          onClose={() => navigate(`/Kottages/${kottage.id}`)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reservation Confirmed!</DialogTitle>
          <DialogContent>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your reservation has been successfully confirmed!
            </Alert>
            <DialogContentText sx={{ mb: 2 }}>
              Thank you for booking with us. Your reservation details have been sent to your email.
            </DialogContentText>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Reservation Details:
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Property:</strong> {kottage.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Room:</strong> {room.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Check-in:</strong> {startDate?.toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Check-out:</strong> {endDate?.toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Guests:</strong> {guests}
              </Typography>
              <Typography variant="body2">
                <strong>Total Amount:</strong> ${total.toFixed(2)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => navigate(`/Kottages/${kottage.id}`)}
              sx={{ 
                bgcolor: Colors.blue, 
                '&:hover': { bgcolor: "darkblue" },
                py: 1
              }}
            >
              Return to Property
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Error Alert */}
      {paymentError && (
        <Alert 
          severity="error" 
          onClose={() => setPaymentError('')}
          sx={{ 
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: 400
          }}
        >
          {paymentError}
        </Alert>
      )}
    </Container>
  );
};

export default BookRoom;