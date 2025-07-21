import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Rating,
  Card,
  CardContent,
  Box,
  Divider,
  Button,
  Chip,
  Fade,
  Paper,
} from "@mui/material";
import { 
  InfoOutlined,
  PeopleAlt,
  HelpCenter,
  Favorite,
  FavoriteBorder,
  CalendarToday,
  LocationOn,
  Star,
  CheckCircle
} from "@mui/icons-material";
import { useState } from "react";
import React from "react";
import { DatePicker, Stack } from "@fluentui/react";
import { Colors } from "../../constants";
import { Kottage } from "../../../hooks";

interface INewReservationProps {
  kottage: Kottage;
}

export default function CreateReservation({ kottage }: INewReservationProps): JSX.Element {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showPricing, setShowPricing] = useState<boolean>(false);

  const calculateNights = () => {
    if (startDate && endDate && endDate > startDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const nights = calculateNights();
  const basePrice = kottage?.price || 300;
  const subtotal = nights * basePrice;
  const cleaningFee = 75;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;

  return (
    <Card 
      elevation={3} 
      sx={{ 
        maxWidth: 400, 
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e0e0e0',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Featured Badge */}
      <Chip
        label="Featured Property"
        size="small"
        sx={{
          position: 'absolute',
          top: -10,
          left: 20,
          backgroundColor: Colors.raspberry,
          color: 'white',
          fontWeight: 'bold',
          zIndex: 1
        }}
      />
      
      <CardContent sx={{ p: 3 }}>
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
                {kottage?.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Premium Location
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

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={kottage?.rating || 4.5}
              precision={0.1}
              readOnly
              size="small"
              icon={<Star fontSize="inherit" sx={{ color: '#ffd700' }} />}
              emptyIcon={<Star fontSize="inherit" sx={{ color: 'grey.300' }} />}
            />
            <Typography variant="body2" sx={{ color: 'primary.main', cursor: 'pointer' }}>
              (14 reviews)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Date Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 20, color: Colors.raspberry }} />
            Select Dates
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DatePicker
              label="Check-in"
              value={startDate}
              onSelectDate={(newValue: Date | null | undefined) => {
                setStartDate(newValue || undefined);
                if (newValue && endDate && newValue >= endDate) {
                  setEndDate(undefined);
                }
                setShowPricing(true);
              }}
              styles={{
                root: { width: '100%' },
                wrapper: { width: '100%' },
                textField: {
                  borderRadius: '8px',
                  selectors: {
                    '&:hover .ms-TextField-fieldGroup': {
                      borderColor: Colors.raspberry
                    }
                  }
                }
              }}
            />

            <DatePicker
              label="Check-out"
              value={endDate}
              onSelectDate={(newValue: Date | null | undefined) => {
                setEndDate(newValue || undefined);
                setShowPricing(true);
              }}
              minDate={startDate}
              styles={{
                root: { width: '100%' },
                wrapper: { width: '100%' },
                textField: {
                  borderRadius: '8px',
                  selectors: {
                    '&:hover .ms-TextField-fieldGroup': {
                      borderColor: Colors.raspberry
                    }
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Guests Selection */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            InputProps={{
              inputProps: { min: 1, max: 16 },
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleAlt sx={{ color: Colors.raspberry }} />
                </InputAdornment>
              ),
            }}
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
        {showPricing && startDate && endDate && (
          <Fade in={showPricing}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 3, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Price Breakdown
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">${basePrice} × {nights} nights</Typography>
                <Typography variant="body2">${subtotal}</Typography>
              </Box>
              
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
            </Paper>
          </Fade>
        )}

        {/* Action Buttons */}
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!startDate || !endDate || nights <= 0}
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
            {!startDate || !endDate || nights <= 0 ? 'Select Valid Dates to Book' : `Reserve Now - ${nights} night${nights > 1 ? 's' : ''}`}
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
      </CardContent>
    </Card>
  );
}