import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import UpcomingIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MessageIcon from '@mui/icons-material/Message';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Colors } from '../../constants';
import {
  Reservation,
  ReservationStatus,
} from '../../../hooks/reservationHooks';
import { useNavigate } from 'react-router-dom';

interface MyReservationsProps {
  reservations: Reservation[];
  isLoading?: boolean;
  error?: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservations-tabpanel-${index}`}
      aria-labelledby={`reservations-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function MyReservations({
  reservations,
  isLoading,
  error,
}: MyReservationsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    reservation: Reservation
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedReservation(reservation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReservation(null);
  };

  const handleContactHost = () => {
    if (selectedReservation) {
      // Navigate to messages with property/host context
      navigate(`/MyAccount/Dashboard/messages`);
    }
    handleMenuClose();
  };

  const handleWriteReview = () => {
    if (selectedReservation) {
      // Navigate to review writing page
      console.log('Write review for:', selectedReservation.reservationId);
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Alert severity="error">
          Failed to load reservations. Please try again later.
        </Alert>
      </Paper>
    );
  }

  // Separate reservations into upcoming and past
  const today = new Date();
  const upcomingReservations = reservations.filter(reservation => {
    const checkInDate = new Date(reservation.checkIn);
    return (
      checkInDate >= today || reservation.status === ReservationStatus.Confirmed
    );
  });

  const pastReservations = reservations.filter(reservation => {
    const checkOutDate = new Date(reservation.checkOut);
    return (
      checkOutDate < today && reservation.status === ReservationStatus.Completed
    );
  });

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.Confirmed:
        return '#4caf50';
      case ReservationStatus.Pending:
        return '#ff9800';
      case ReservationStatus.Cancelled:
        return '#f44336';
      case ReservationStatus.Completed:
        return '#2196f3';
      case ReservationStatus.CheckedIn:
        return '#9c27b0';
      case ReservationStatus.CheckedOut:
        return '#607d8b';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
    });
  };

  const renderReservationCard = (
    reservation: Reservation,
    isPast: boolean = false
  ) => (
    <Card
      key={reservation.reservationId}
      sx={{
        mb: 2,
        border: '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              color={Colors.blue}
              gutterBottom
            >
              {reservation.property.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Reservation ID: {reservation.reservationId}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={reservation.status}
              size="small"
              sx={{
                backgroundColor: getStatusColor(reservation.status),
                color: 'white',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
            <IconButton
              size="small"
              onClick={event => handleMenuOpen(event, reservation)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ fontSize: 18, color: Colors.blue }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Check-in
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatDate(reservation.checkIn)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ fontSize: 18, color: Colors.raspberry }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Check-out
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatDate(reservation.checkOut)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Guests
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {reservation.guests.length} guest
                {reservation.guests.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoneyIcon sx={{ fontSize: 18, color: '#ed6c02' }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Total Price
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatPrice(reservation.totalPrice, reservation.currency)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {reservation.guests.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Guest Names
            </Typography>
            <Typography variant="body2">
              {reservation.guests.map(guest => guest.name).join(', ')}
            </Typography>
          </Box>
        )}

        {reservation.notes && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Notes
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {reservation.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Paper elevation={3} sx={{ mb: 2 }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <EventIcon sx={{ color: Colors.blue, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} color={Colors.blue}>
            My Reservations
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minWidth: 120,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: Colors.blue,
              height: 3,
            },
          }}
        >
          <Tab
            icon={<UpcomingIcon sx={{ fontSize: 20 }} />}
            label={`Upcoming (${upcomingReservations.length})`}
            iconPosition="start"
            sx={{
              color: activeTab === 0 ? Colors.blue : 'text.secondary',
            }}
          />
          <Tab
            icon={<HistoryIcon sx={{ fontSize: 20 }} />}
            label={`Past (${pastReservations.length})`}
            iconPosition="start"
            sx={{
              color: activeTab === 1 ? Colors.blue : 'text.secondary',
            }}
          />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        <TabPanel value={activeTab} index={0}>
          {upcomingReservations.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No upcoming reservations found. Ready to plan your next adventure?
            </Alert>
          ) : (
            <Box>
              {upcomingReservations.map(reservation =>
                renderReservationCard(reservation)
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {pastReservations.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No past reservations found. Start exploring and book your first
              stay!
            </Alert>
          ) : (
            <Box>
              {pastReservations.map(reservation =>
                renderReservationCard(reservation, true)
              )}
            </Box>
          )}
        </TabPanel>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleContactHost}>
          <MessageIcon sx={{ mr: 1, fontSize: 18 }} />
          Contact Host
        </MenuItem>
        {selectedReservation?.status === ReservationStatus.Completed && (
          <MenuItem onClick={handleWriteReview}>
            <RateReviewIcon sx={{ mr: 1, fontSize: 18 }} />
            Write Review
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}
