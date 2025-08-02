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
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  ArrowBack,
  CalendarToday,
  LocationOn,
  PeopleAlt,
} from '@mui/icons-material';
import { Colors } from '../../constants';
import PromotionBanner from './PromotionBanner';
import BookingInfo from '../BookingInfo';
import RoomPromotion from './RoomPromotion';
import {
  Kottage,
  RoomType,
  useAuth,
  useCreateReservation,
  useUpdateProperty,
} from '../../../hooks';
import { useBlockedDates } from '../../../hooks/useBlockedDates';
import { calculatePromotionalPrice } from '../../../utils/promotionUtils';
import {
  calculateNights,
  hasBlockedDatesInRange,
  getMaxCheckoutDate,
  handleConfirmPayment,
} from './reservationUtilities';
import ReservationSummary from './ReservationSummary';

const BookRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state =
    (location.state as {
      kottage?: Kottage;
      room?: RoomType;
      checkInDate?: Date;
      checkOutDate?: Date;
      guests?: number;
      nights?: number;
      pricePerNight?: number;
    }) || {};
  const {
    kottage,
    room,
    checkInDate,
    checkOutDate,
    guests: passedGuests,
    nights: passedNights,
    pricePerNight: passedPricePerNight,
  } = state;
  const { appUser, uid } = useAuth();
  const updateProperty = useUpdateProperty();
  // Reservation state - Initialize with passed values
  const [startDate, setStartDate] = useState<Date | undefined>(checkInDate);
  const [endDate, setEndDate] = useState<Date | undefined>(checkOutDate);
  const [guests, setGuests] = useState<number>(passedGuests || 1);

  // Payment state
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');

  // Use the reservation hook
  const {
    mutateAsync: createReservation,
    isPending: isProcessing,
    error,
  } = useCreateReservation();

  // Blocked dates hook
  const propertyId = kottage?.id ?? '';
  const roomTypeId = room?.id ?? '';
  const {
    data: blockedDates = [],
    isLoading: blockedDatesLoading,
    refetch: refetchBlockedDates,
  } = useBlockedDates(propertyId, roomTypeId);

  // Redirect back if no data
  useEffect(() => {
    if (!kottage || !room) {
      navigate(`/Kottages/${kottage?.id || ''}`);
    }
  }, [kottage, room, navigate]);

  // Handle reservation error
  useEffect(() => {
    if (error) {
      setPaymentError(
        error.message || 'Failed to create reservation. Please try again.'
      );
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
  const promotionalPricing = roomForPricing
    ? calculatePromotionalPrice(
        roomForPricing,
        startDate?.toISOString(),
        endDate?.toISOString(),
        nights,
        kottage?.promotions
      )
    : null;

  // Use promotional price if available, otherwise use regular price
  // If dates match what was passed from RoomTypes and we have a passed promotional price, use it for consistency
  const datesMatchPassed =
    checkInDate &&
    checkOutDate &&
    startDate &&
    endDate &&
    checkInDate.getTime() === startDate.getTime() &&
    checkOutDate.getTime() === endDate.getTime() &&
    nights === passedNights;

  const basePrice =
    datesMatchPassed && passedPricePerNight
      ? passedPricePerNight
      : promotionalPricing?.finalPrice || room?.pricePerNight || 300;

  const maxGuestsAllowed = room?.maxOccupancy || 4;

  const subtotal = nights * basePrice;
  const cleaningFee = 75;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;

  // Calculate total savings if promotion is applied
  const totalSavings = promotionalPricing?.isPromotionApplied
    ? nights * promotionalPricing.savings
    : 0;

  // Check if current date selection is valid
  const isDateRangeValid = !hasBlockedDatesInRange(
    startDate!,
    endDate!,
    blockedDates
  );

  // Get maximum allowed checkout date based on checkin selection
  const maxCheckoutDate = startDate
    ? getMaxCheckoutDate(startDate, blockedDates)
    : undefined;

  return (
    <Container
      maxWidth="xl"
      sx={{ height: '100vh', overflow: 'hidden', py: 2 }}
    >
      {/* Logo Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
          alignItems: 'flex-end',
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ color: Colors.blue }}
        >
          Back to Property
        </Button>
        <img
          src="blue logo.png"
          alt="Yaad Kottage"
          style={{
            height: '40px',
            objectFit: 'contain',
          }}
        />
        <div />
      </Box>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          height: 'calc(100vh - 80px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            height: '100%',
          }}
        >
          {/* Main Content */}
          <Box
            sx={{
              flex: { md: '1 1 58%' },
              p: { xs: 3, md: 4 },
              justifyContent: 'space-between',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Room Details */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 2, color: Colors.blue }}
              >
                Room Details
              </Typography>
              {/* Hero Section with Image */}
              {room.images && room.images.length > 0 && (
                <Box
                  sx={{
                    height: { xs: 200, sm: 250, md: 350 },
                    width: '100%',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                      zIndex: 1,
                    },
                  }}
                >
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
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
                      color: 'white',
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        color: Colors.raspberry,
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      }}
                    >
                      {room.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        opacity: 0.9,
                        mb: 1,
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    >
                      <LocationOn
                        sx={{ fontSize: 16, color: Colors.raspberry }}
                      />
                      {kottage.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: Colors.raspberry }}
                      >
                        $
                        {basePrice.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                      <Typography variant="body2">per night</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>
                {room.description ||
                  'Comfortable and well-appointed room with modern amenities.'}
              </Typography>

              {/* Room Promotion */}
              <RoomPromotion promotion={room.promotion} />

              {/* Property-level Promotion */}
              {!room.promotion && kottage?.promotions && (
                <PromotionBanner promotions={kottage.promotions} />
              )}
            </Box>
            <Box>
              <BookingInfo propertyId={kottage.id} />
            </Box>
          </Box>

          {/* Booking Form */}
          <Box
            sx={{
              flex: { md: '1 1 42%' },
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#fafafa',
              p: { xs: 3, md: 4 },
              borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
              borderTop: { xs: '1px solid #e0e0e0', md: 'none' },
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img
                  src="blueyaad.png"
                  alt="Yaad Kottage"
                  style={{
                    height: '30px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              {/* Date Selection */}
              <Box sx={{ mb: 2, width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '1.1rem',
                  }}
                >
                  <CalendarToday
                    sx={{ fontSize: 20, color: Colors.raspberry }}
                  />
                  Select Dates
                  {blockedDatesLoading && (
                    <CircularProgress size={16} sx={{ ml: 1 }} />
                  )}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <DatePicker
                    label="Check-in"
                    value={startDate}
                    onChange={(newValue: Date | null) => {
                      setStartDate(newValue || undefined);
                      if (newValue && endDate && newValue >= endDate) {
                        setEndDate(undefined);
                      }
                    }}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        size: 'small',
                        helperText: 'Select your arrival date',
                      },
                    }}
                    shouldDisableDate={(date: Date | null) => {
                      const dateStr: string = date
                        ? date.toISOString().split('T')[0]
                        : '';
                      const isBlocked: boolean = blockedDates.includes(dateStr);
                      return isBlocked;
                    }}
                    sx={{
                      width: '40%',
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
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        helperText: 'Select your departure date',
                      },
                    }}
                    minDate={startDate ? startDate : new Date()}
                    maxDate={maxCheckoutDate}
                    shouldDisableDate={(date: Date | null) => {
                      const dateStr = date
                        ? date.toISOString().split('T')[0]
                        : '';
                      const isBlocked = blockedDates.includes(dateStr);

                      // Also disable if this would create an invalid range with current checkin
                      let wouldCreateInvalidRange = false;
                      if (startDate && date) {
                        wouldCreateInvalidRange = hasBlockedDatesInRange(
                          startDate,
                          date,
                          blockedDates
                        );
                      }
                      return isBlocked || wouldCreateInvalidRange;
                    }}
                    sx={{
                      width: '40%',
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
                  {/* Guests Selection */}
                  <Box>
                    <TextField
                      size="small"
                      label="Guests"
                      type="number"
                      value={guests}
                      onChange={e =>
                        setGuests(
                          Math.max(
                            1,
                            Math.min(
                              maxGuestsAllowed,
                              parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      InputProps={{
                        inputProps: { min: 1, max: maxGuestsAllowed },
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleAlt sx={{ color: Colors.raspberry }} />
                          </InputAdornment>
                        ),
                      }}
                      helperText={`Maximum ${maxGuestsAllowed}`}
                      sx={{
                        width: '100%',
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
                </Box>

                {/* Date Range Helper Text */}
                {startDate && maxCheckoutDate && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      color: 'text.secondary',
                      textAlign: 'center',
                    }}
                  >
                    💡 Maximum checkout date:{' '}
                    {maxCheckoutDate.toLocaleDateString()}
                    {maxCheckoutDate <
                      new Date(
                        startDate.getTime() + 30 * 24 * 60 * 60 * 1000
                      ) && ' (due to blocked dates)'}
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
                    Your selected dates include blocked dates. Please choose a
                    different range that doesn't include blocked dates.
                  </Typography>
                </Alert>
              )}

              {/* Combined Reservation & Pricing Summary */}
              {startDate && endDate && isDateRangeValid && (
                <ReservationSummary
                  startDate={startDate}
                  endDate={endDate}
                  guests={guests}
                  roomName={room.name}
                  nights={nights}
                  basePrice={basePrice}
                  subtotal={subtotal}
                  cleaningFee={cleaningFee}
                  serviceFee={serviceFee}
                  total={total}
                  promotionalPricing={promotionalPricing}
                  totalSavings={totalSavings}
                  roomForPricing={roomForPricing}
                  kottage={kottage}
                />
              )}
            </Box>
            {/* Action Buttons */}

            <Button
              fullWidth
              variant="contained"
              disabled={
                !startDate ||
                !endDate ||
                nights <= 0 ||
                !isDateRangeValid ||
                isProcessing
              }
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
                  setPaymentError,
                  navigate,
                });
              }}
              sx={{
                backgroundColor: Colors.raspberry,
                color: 'white',
                py: 1,
                borderRadius: 2,
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
                  color: 'grey.500',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isProcessing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  Processing...
                </Box>
              ) : !startDate || !endDate || nights <= 0 ? (
                'Select Valid Dates to Book'
              ) : !isDateRangeValid ? (
                'Selected Range Contains Blocked Dates'
              ) : (
                `Confirm Reservation - ${nights} night${nights > 1 ? 's' : ''}`
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

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
            maxWidth: 400,
          }}
        >
          {paymentError}
        </Alert>
      )}
    </Container>
  );
};

export default BookRoom;
