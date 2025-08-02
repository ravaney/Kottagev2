import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  CalendarToday,
  LocationOn,
  Person,
  Home,
  Receipt,
} from '@mui/icons-material';
import { Colors } from '../../constants';

interface BookingConfirmationData {
  reservationId: string;
  roomName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  nights: number;
  total: number;
}

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as BookingConfirmationData;

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const formatMoney = (amount: number) =>
    amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: 3,
        }}
      >
        {/* Success Icon */}
        <Box sx={{ mb: 3 }}>
          <CheckCircle
            sx={{
              fontSize: 80,
              color: '#4caf50',
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ color: Colors.blue, mb: 1 }}
          >
            Booking Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your reservation has been successfully created
          </Typography>
        </Box>

        {/* Reservation Details */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            textAlign: 'left',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ mb: 2 }}
          >
            <Receipt sx={{ color: Colors.raspberry }} />
            <Typography variant="h6" fontWeight={600}>
              Reservation Details
            </Typography>
          </Box>

          <Chip
            label={`Reservation #${bookingData.reservationId}`}
            sx={{
              mb: 3,
              backgroundColor: Colors.blue,
              color: 'white',
              fontWeight: 600,
            }}
          />

          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Home sx={{ color: Colors.blue }} />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {bookingData.roomName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  at {bookingData.propertyName}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <CalendarToday sx={{ color: Colors.blue }} />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(bookingData.checkInDate).toLocaleDateString()} - {new Date(bookingData.checkOutDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookingData.nights} night{bookingData.nights > 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Person sx={{ color: Colors.blue }} />
              <Typography variant="body1" fontWeight={600}>
                {bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Total Paid
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: Colors.raspberry }}
            >
              {formatMoney(bookingData.total)}
            </Typography>
          </Box>
        </Paper>

        {/* Next Steps */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            What's Next?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            • A confirmation email has been sent to your email address
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            • You can view and manage your booking in your dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            • Contact the property host if you have any questions
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/MyAccount/Dashboard/reservations')}
            sx={{
              backgroundColor: Colors.blue,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View My Bookings
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              borderColor: Colors.blue,
              color: Colors.blue,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;