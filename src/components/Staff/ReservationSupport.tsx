import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Colors } from '../constants';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

// Mock data for bookings
const bookings = [
  { 
    id: 'BK-1001', 
    guest: 'John Smith', 
    property: 'Beach Villa', 
    host: 'Maria Garcia',
    checkIn: '2023-06-15', 
    checkOut: '2023-06-20', 
    status: 'confirmed',
    payment: 'completed',
    amount: '$1,250.00',
    issues: null
  },
  { 
    id: 'BK-1002', 
    guest: 'Sarah Johnson', 
    property: 'Mountain Retreat', 
    host: 'David Wilson',
    checkIn: '2023-06-18', 
    checkOut: '2023-06-25', 
    status: 'pending',
    payment: 'pending',
    amount: '$1,800.00',
    issues: null
  },
  { 
    id: 'BK-1003', 
    guest: 'Michael Brown', 
    property: 'City Apartment', 
    host: 'Jennifer Lee',
    checkIn: '2023-06-20', 
    checkOut: '2023-06-22', 
    status: 'confirmed',
    payment: 'completed',
    amount: '$450.00',
    issues: null
  },
  { 
    id: 'BK-1004', 
    guest: 'Emily Davis', 
    property: 'Lakeside Cottage', 
    host: 'Robert Taylor',
    checkIn: '2023-06-22', 
    checkOut: '2023-06-29', 
    status: 'confirmed',
    payment: 'partial',
    amount: '$2,100.00',
    issues: 'payment'
  },
  { 
    id: 'BK-1005', 
    guest: 'James Wilson', 
    property: 'Forest Cabin', 
    host: 'Patricia Moore',
    checkIn: '2023-06-25', 
    checkOut: '2023-06-28', 
    status: 'cancelled',
    payment: 'refunded',
    amount: '$750.00',
    issues: null
  },
  { 
    id: 'BK-1006', 
    guest: 'Lisa Martinez', 
    property: 'Beachfront Condo', 
    host: 'Thomas Anderson',
    checkIn: '2023-06-30', 
    checkOut: '2023-07-07', 
    status: 'confirmed',
    payment: 'completed',
    amount: '$2,800.00',
    issues: 'modification'
  },
  { 
    id: 'BK-1007', 
    guest: 'Robert Johnson', 
    property: 'Downtown Loft', 
    host: 'Elizabeth White',
    checkIn: '2023-07-01', 
    checkOut: '2023-07-03', 
    status: 'confirmed',
    payment: 'completed',
    amount: '$680.00',
    issues: 'suspicious'
  }
];

// Support ticket types
const supportTypes = [
  { id: 'guest-mod', label: 'Guest Modification', icon: <EditIcon /> },
  { id: 'guest-cancel', label: 'Guest Cancellation', icon: <CancelIcon /> },
  { id: 'guest-payment', label: 'Guest Payment Issue', icon: <PaymentIcon /> },
  { id: 'host-noshow', label: 'Host: No-Show', icon: <WarningIcon /> },
  { id: 'host-mod', label: 'Host Modification', icon: <EditIcon /> },
  { id: 'suspicious', label: 'Suspicious Activity', icon: <WarningIcon /> }
];

export default function ReservationSupport() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [supportAnchorEl, setSupportAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, bookingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(bookingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleBookingAction = (action: string) => {
    handleMenuClose();
    
    // Navigate based on action type
    switch(action) {
      case 'modify':
      case 'cancel':
        navigate('/bookings');
        break;
      case 'payment':
        navigate('/bookings');
        break;
      case 'flag':
        navigate('/bookings');
        break;
      default:
        navigate('/bookings');
    }
  };

  const handleSupportOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSupportAnchorEl(event.currentTarget);
  };

  const handleSupportClose = () => {
    setSupportAnchorEl(null);
  };

  const handleSupportTicket = (ticketType: string) => {
    handleSupportClose();
    
    // Navigate based on ticket type
    switch(ticketType) {
      case 'guest-mod':
      case 'guest-cancel':
      case 'guest-payment':
        navigate('/guests');
        break;
      case 'host-noshow':
      case 'host-mod':
        navigate('/guests');
        break;
      case 'suspicious':
        navigate('/bookings');
        break;
      default:
        navigate('/bookings');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return '#388e3c';
      case 'pending': return '#f57c00';
      case 'cancelled': return '#d32f2f';
      default: return '#1976d2';
    }
  };

  const getPaymentColor = (payment: string) => {
    switch(payment) {
      case 'completed': return '#388e3c';
      case 'pending': return '#f57c00';
      case 'partial': return '#1976d2';
      case 'refunded': return '#7b1fa2';
      default: return '#1976d2';
    }
  };

  const getIssueIcon = (issue: string | null) => {
    if (!issue) return null;
    
    switch(issue) {
      case 'payment': return <PaymentIcon fontSize="small" sx={{ color: '#f57c00' }} />;
      case 'modification': return <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />;
      case 'suspicious': return <WarningIcon fontSize="small" sx={{ color: '#d32f2f' }} />;
      default: return <HelpIcon fontSize="small" sx={{ color: '#1976d2' }} />;
    }
  };

  // Filter bookings based on tab and search term
  const filteredBookings = bookings.filter(booking => {
    // Apply tab filter
    if (tabValue === 1 && booking.status !== 'confirmed') return false;
    if (tabValue === 2 && booking.status !== 'pending') return false;
    if (tabValue === 3 && !booking.issues) return false;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.id.toLowerCase().includes(searchLower) ||
        booking.guest.toLowerCase().includes(searchLower) ||
        booking.property.toLowerCase().includes(searchLower) ||
        booking.host.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link 
                color="inherit" 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                sx={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'text.secondary'
                }}
              >
                <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Link>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <EventNoteIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Reservation Support
              </Typography>
            </Breadcrumbs>
          </Box>
          <IconButton color="inherit" size="small">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ p: 3, flexGrow: 1, backgroundColor: '#f5f5f5' }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Reservation Support & Oversight
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View and manage all bookings across the platform. Assist guests and hosts with booking issues.
          </Typography>
        </Box>

        {/* Support Actions */}
        <Paper sx={{ mb: 3, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f9f9f9'
          }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Quick Support Actions
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={handleSupportOpen}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Create Support Ticket
                </Button>
                <Menu
                  anchorEl={supportAnchorEl}
                  open={Boolean(supportAnchorEl)}
                  onClose={handleSupportClose}
                  PaperProps={{
                    sx: { width: 250, maxWidth: '100%', mt: 1 }
                  }}
                >
                  {supportTypes.map((type) => (
                    <MenuItem key={type.id} onClick={() => handleSupportTicket(type.id)}>
                      <ListItemIcon>{type.icon}</ListItemIcon>
                      <ListItemText>{type.label}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<WarningIcon />}
                  onClick={() => navigate('/bookings')}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  View Suspicious Bookings
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={() => navigate('/bookings')}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Payment Issues
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => navigate('/bookings')}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Pending Modifications
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Bookings Table */}
        <Paper sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flexGrow: 1 }}>
          {/* Table Header with Tabs and Search */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTab-root': { 
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 100
                },
                '& .MuiTabs-indicator': { backgroundColor: '#1976d2' }
              }}
            >
              <Tab label="All Bookings" />
              <Tab label="Confirmed" />
              <Tab label="Pending" />
              <Tab label="Issues" />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1, width: '300px' }}>
              <TextField
                placeholder="Search bookings..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <IconButton sx={{ border: '1px solid #e0e0e0' }}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Table Content */}
          <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Guest</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Host</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Check-in</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Check-out</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow 
                    key={booking.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      backgroundColor: booking.issues ? 'rgba(255, 152, 0, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {booking.id}
                        {booking.issues && getIssueIcon(booking.issues)}
                      </Box>
                    </TableCell>
                    <TableCell>{booking.guest}</TableCell>
                    <TableCell>{booking.property}</TableCell>
                    <TableCell>{booking.host}</TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${getStatusColor(booking.status)}15`,
                          color: getStatusColor(booking.status),
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.payment} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${getPaymentColor(booking.payment)}15`,
                          color: getPaymentColor(booking.payment),
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>{booking.amount}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, booking.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%', mt: 1 }
        }}
      >
        <MenuItem onClick={() => handleBookingAction('modify')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modify Booking</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBookingAction('cancel')}>
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancel Booking</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBookingAction('payment')}>
          <ListItemIcon>
            <PaymentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Payment Details</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleBookingAction('flag')}>
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Flag as Suspicious</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}