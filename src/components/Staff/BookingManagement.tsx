import React, { useState } from 'react';
import {
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';
import { FraudDetectionService, BookingData, FraudAnalysis } from '../../utils/fraudDetection';
import { 
  useGetReservationsWithFraudAnalysis,
  useGetAllReservations,
  useUpdateReservation 
} from '../../hooks';

export default function BookingManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [fraudAnalysisDialog, setFraudAnalysisDialog] = useState(false);
  const [selectedFraudAnalysis, setSelectedFraudAnalysis] = useState<FraudAnalysis | null>(null);
  const [securityReviewDialog, setSecurityReviewDialog] = useState(false);
  const [securityAnalysis, setSecurityAnalysis] = useState<FraudAnalysis | null>(null);
  const navigate = useNavigate();
  
  // Use real data hooks
  const { data: reservationsWithFraud, isLoading, error } = useGetReservationsWithFraudAnalysis();
  const updateReservationMutation = useUpdateReservation();
  
  // Initialize fraud detection service
  const fraudService = FraudDetectionService.getInstance();

  // Transform reservations data to match the UI format
  const bookingsData = reservationsWithFraud?.map(reservation => ({
    id: reservation.reservationId,
    guest: reservation.guests?.[0]?.name || 'Unknown Guest',
    guestEmail: reservation.guests?.[0]?.email || 'No email',
    property: reservation.property?.name || 'Unknown Property',
    host: 'Property Owner', // This would come from property data in real implementation
    hostEmail: 'host@email.com', // This would come from property data
    checkIn: reservation.checkIn.split('T')[0],
    checkOut: reservation.checkOut.split('T')[0],
    status: reservation.status,
    payment: reservation.payment?.paid ? 'completed' : 'pending',
    amount: `$${reservation.totalPrice.toLocaleString()}`,
    issues: reservation.fraudFlags?.length > 0 ? 'suspicious_activity' : null,
    riskScore: reservation.riskLevel,
    bookingDate: reservation.createdAt.split('T')[0],
    guests: reservation.guests?.length || 1,
    paymentMethod: reservation.payment?.method || 'unknown',
    fraudScore: reservation.fraudScore || 0,
    fraudFlags: reservation.fraudFlags || []
  })) || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, booking: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleSecurityReview = (booking: any) => {
    // Run comprehensive fraud analysis
    const fraudData: BookingData = {
      id: booking.id,
      guest: {
        name: booking.guest,
        email: booking.guestEmail,
        registrationDate: '2023-05-01', // Mock data - in real implementation get from user record
        previousBookings: Math.floor(Math.random() * 10),
        cancellationRate: Math.random() * 0.3,
        verificationStatus: Math.random() > 0.3 ? 'verified' : 'unverified',
        paymentMethods: 1,
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        deviceFingerprint: 'device_' + Math.random().toString(36).substr(2, 9)
      },
      host: {
        name: booking.host,
        email: booking.hostEmail,
        propertyCount: Math.floor(Math.random() * 5) + 1,
        rating: 3 + Math.random() * 2,
        responseRate: 0.7 + Math.random() * 0.3
      },
      booking: {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        bookingDate: booking.bookingDate,
        amount: parseFloat(booking.amount.replace('$', '').replace(',', '')),
        currency: 'USD',
        paymentMethod: booking.paymentMethod,
        guests: booking.guests,
        duration: Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
        pricePerNight: parseFloat(booking.amount.replace('$', '').replace(',', '')) / Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
        lastMinute: new Date(booking.bookingDate).getTime() > new Date(booking.checkIn).getTime() - 24 * 60 * 60 * 1000,
        timeToCheckIn: Math.max(0, Math.floor((new Date(booking.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60)))
      },
      property: {
        id: 'prop_' + Math.random().toString(36).substr(2, 9),
        averagePrice: parseFloat(booking.amount.replace('$', '').replace(',', '')) * (0.8 + Math.random() * 0.4),
        location: 'Mock Location',
        rating: 3 + Math.random() * 2,
        reviewCount: Math.floor(Math.random() * 100) + 10
      },
      payment: {
        cardType: 'visa',
        cardCountry: 'US',
        billingCountry: 'US',
        paymentAttempts: Math.floor(Math.random() * 3) + 1,
        previousDeclines: Math.floor(Math.random() * 2)
      }
    };

    // Run fraud analysis
    const analysis = fraudService.analyzeBooking(fraudData);
    setSecurityAnalysis(analysis);
    setSecurityReviewDialog(true);
    setAnchorEl(null);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionAnchorEl(null);
  };

  const runFraudAnalysis = (booking: any) => {
    // Convert booking data to fraud detection format
    const fraudData: BookingData = {
      id: booking.id,
      guest: {
        name: booking.guest,
        email: booking.guestEmail,
        registrationDate: '2023-05-01', // Mock data
        previousBookings: Math.floor(Math.random() * 10),
        cancellationRate: Math.random() * 0.3,
        verificationStatus: Math.random() > 0.3 ? 'verified' : 'unverified',
        paymentMethods: 1,
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        deviceFingerprint: 'device_' + Math.random().toString(36).substr(2, 9)
      },
      host: {
        name: booking.host,
        email: booking.hostEmail,
        propertyCount: Math.floor(Math.random() * 5) + 1,
        rating: 3 + Math.random() * 2,
        responseRate: 0.7 + Math.random() * 0.3
      },
      booking: {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        bookingDate: booking.bookingDate,
        amount: parseFloat(booking.amount.replace('$', '').replace(',', '')),
        currency: 'USD',
        paymentMethod: booking.paymentMethod,
        guests: booking.guests,
        duration: Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
        pricePerNight: parseFloat(booking.amount.replace('$', '').replace(',', '')) / Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
        lastMinute: Math.random() > 0.7,
        timeToCheckIn: Math.random() * 72
      },
      property: {
        id: 'prop_' + booking.id,
        averagePrice: 200 + Math.random() * 300,
        location: 'Test Location',
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 100)
      },
      payment: {
        cardType: 'Visa',
        cardCountry: 'US',
        billingCountry: 'US',
        paymentAttempts: Math.floor(Math.random() * 3) + 1,
        previousDeclines: Math.floor(Math.random() * 2)
      }
    };

    return fraudService.analyzeBooking(fraudData);
  };

  const handleFraudAnalysis = (booking: any) => {
    const analysis = runFraudAnalysis(booking);
    setSelectedFraudAnalysis(analysis);
    setSelectedBooking(booking);
    setFraudAnalysisDialog(true);
  };

  const handleCloseFraudDialog = () => {
    setFraudAnalysisDialog(false);
    setSelectedFraudAnalysis(null);
  };

  const handleCloseSecurityReview = () => {
    setSecurityReviewDialog(false);
    setSecurityAnalysis(null);
  };

  const autoFlagFraudulent = () => {
    // Automatically flag bookings with high fraud scores
    const flaggedBookings = bookingsData.filter(booking => booking.fraudScore > 70);
    console.log('Auto-flagged bookings:', flaggedBookings.map(b => b.id));
    alert(`Automatically flagged ${flaggedBookings.length} potentially fraudulent bookings`);
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

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return '#388e3c';
      case 'medium': return '#f57c00';
      case 'high': return '#d32f2f';
      case 'critical': return '#7b1fa2';
      default: return '#1976d2';
    }
  };

  const getFraudScoreColor = (score: number) => {
    if (score >= 80) return '#d32f2f'; // Critical
    if (score >= 60) return '#f57c00'; // High
    if (score >= 40) return '#ff9800'; // Medium
    return '#388e3c'; // Low
  };

  const getFraudScoreLevel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const getIssueIcon = (issue: string | null) => {
    if (!issue) return null;
    
    switch(issue) {
      case 'payment_delay':
      case 'payment_partial': 
        return <PaymentIcon fontSize="small" sx={{ color: '#f57c00' }} />;
      case 'modification_request': 
        return <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />;
      case 'suspicious_activity': 
        return <WarningIcon fontSize="small" sx={{ color: '#d32f2f' }} />;
      default: 
        return <WarningIcon fontSize="small" sx={{ color: '#1976d2' }} />;
    }
  };

  // Filter bookings based on tab and search term
  const filteredBookings = bookingsData.filter(booking => {
    // Apply tab filter
    if (tabValue === 1 && !booking.issues) return false; // Issues only
    if (tabValue === 2 && booking.payment !== 'pending' && booking.payment !== 'partial') return false; // Payment issues
    if (tabValue === 3 && booking.fraudScore < 60) return false; // High fraud risk only
    if (tabValue === 4 && booking.issues !== 'modification_request') return false; // Modifications
    if (tabValue === 5 && booking.fraudScore < 80) return false; // Critical fraud risk only
    
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

  // Calculate summary statistics
  const totalBookings = bookingsData.length;
  const issueBookings = bookingsData.filter(b => b.issues).length;
  const paymentIssues = bookingsData.filter(b => b.payment === 'pending' || b.payment === 'partial').length;
  const highFraudRisk = bookingsData.filter(b => b.fraudScore >= 60).length;
  const criticalFraudRisk = bookingsData.filter(b => b.fraudScore >= 80).length;
  const totalRevenue = bookingsData.reduce((sum, b) => sum + parseFloat(b.amount.replace('$', '').replace(',', '')), 0);

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading bookings...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error Loading Bookings</Typography>
          <Typography variant="body2">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

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
                Booking Management
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
            Booking Management & Analysis
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Monitor, manage, and analyze all bookings. Handle payment issues, modifications, and suspicious activities.
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Bookings
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {totalBookings}
                    </Typography>
                  </Box>
                  <EventNoteIcon sx={{ fontSize: 40, color: '#1976d2', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Active Issues
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#f57c00">
                      {issueBookings}
                    </Typography>
                  </Box>
                  <WarningIcon sx={{ fontSize: 40, color: '#f57c00', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      High Fraud Risk
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#f57c00">
                      {highFraudRisk}
                    </Typography>
                  </Box>
                  <SecurityIcon sx={{ fontSize: 40, color: '#f57c00', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#388e3c">
                      ${totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <PaymentIcon sx={{ fontSize: 40, color: '#388e3c', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ mb: 3, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f9f9f9'
          }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Quick Actions
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<RefreshIcon />}
                  onClick={handleActionMenuOpen}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Bulk Actions
                </Button>
                <Menu
                  anchorEl={actionAnchorEl}
                  open={Boolean(actionAnchorEl)}
                  onClose={handleActionMenuClose}
                  PaperProps={{
                    sx: { width: 250, maxWidth: '100%', mt: 1 }
                  }}
                >
                  <MenuItem onClick={handleActionMenuClose}>
                    <ListItemIcon><RefreshIcon /></ListItemIcon>
                    <ListItemText>Refresh Payment Status</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleActionMenuClose(); autoFlagFraudulent(); }}>
                    <ListItemIcon><SecurityIcon /></ListItemIcon>
                    <ListItemText>Auto-Flag Fraudulent</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleActionMenuClose}>
                    <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                    <ListItemText>Approve Pending</ListItemText>
                  </MenuItem>
                </Menu>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SecurityIcon />}
                  onClick={() => setTabValue(3)}
                  sx={{
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': { borderColor: '#c62828', backgroundColor: 'rgba(211, 47, 47, 0.04)' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  High Fraud Risk ({highFraudRisk})
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={() => setTabValue(2)}
                  sx={{
                    borderColor: '#f57c00',
                    color: '#f57c00',
                    '&:hover': { borderColor: '#ef6c00', backgroundColor: 'rgba(245, 124, 0, 0.04)' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Payment Issues ({paymentIssues})
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => setTabValue(4)}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Modifications (1)
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
              <Tab label="Issues" />
              <Tab label="Payment Issues" />
              <Tab label="High Fraud Risk" />
              <Tab label="Modifications" />
              <Tab label="Critical Fraud" />
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
          <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Guest</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Property</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Dates</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Fraud Score</TableCell>
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
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {booking.guest}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {booking.guests} guests
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {booking.property}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Host: {booking.host}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {booking.checkIn} to {booking.checkOut}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Booked: {booking.bookingDate}
                        </Typography>
                      </Box>
                    </TableCell>
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
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {booking.amount}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.paymentMethod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip 
                          label={`${booking.fraudScore}%`}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getFraudScoreColor(booking.fraudScore)}15`,
                            color: getFraudScoreColor(booking.fraudScore),
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        />
                        <Typography variant="caption" color="textSecondary" display="block">
                          {getFraudScoreLevel(booking.fraudScore)} Risk
                        </Typography>
                        {booking.fraudFlags.length > 0 && (
                          <Typography variant="caption" color="error" display="block">
                            {booking.fraudFlags.length} flags
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleViewDetails(booking)}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => handleFraudAnalysis(booking)}
                          title="Fraud Analysis"
                          sx={{ 
                            color: booking.fraudScore > 60 ? '#d32f2f' : '#1976d2' 
                          }}
                        >
                          <SecurityIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuOpen(e, booking)}
                          title="More Actions"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
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

      {/* Booking Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight={600}>
            Booking Details - {selectedBooking?.id}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Guest Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {selectedBooking.guest}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedBooking.guestEmail}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Number of Guests:</strong> {selectedBooking.guests}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Property & Host
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Property:</strong> {selectedBooking.property}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Host:</strong> {selectedBooking.host}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Host Email:</strong> {selectedBooking.hostEmail}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Booking Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Check-in:</strong> {selectedBooking.checkIn}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Check-out:</strong> {selectedBooking.checkOut}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Booking Date:</strong> {selectedBooking.bookingDate}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Payment & Status
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Amount:</strong> {selectedBooking.amount}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Payment Method:</strong> {selectedBooking.paymentMethod}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Payment Status:</strong> 
                  <Chip 
                    label={selectedBooking.payment} 
                    size="small"
                    sx={{ 
                      ml: 1,
                      backgroundColor: `${getPaymentColor(selectedBooking.payment)}15`,
                      color: getPaymentColor(selectedBooking.payment),
                      fontWeight: 600
                    }}
                  />
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Risk Score:</strong> 
                  <Chip 
                    label={selectedBooking.riskScore} 
                    size="small"
                    sx={{ 
                      ml: 1,
                      backgroundColor: `${getRiskColor(selectedBooking.riskScore)}15`,
                      color: getRiskColor(selectedBooking.riskScore),
                      fontWeight: 600
                    }}
                  />
                </Typography>
              </Grid>
              {selectedBooking.issues && (
                <Grid item xs={12}>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Issue:</strong> {selectedBooking.issues.replace('_', ' ').toUpperCase()}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Take Action
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fraud Analysis Dialog */}
      <Dialog 
        open={fraudAnalysisDialog} 
        onClose={handleCloseFraudDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              Fraud Analysis - {selectedBooking?.id}
            </Typography>
            {selectedFraudAnalysis && (
              <Chip 
                label={`${selectedFraudAnalysis.riskScore}% Risk`}
                sx={{ 
                  backgroundColor: `${getFraudScoreColor(selectedFraudAnalysis.riskScore)}15`,
                  color: getFraudScoreColor(selectedFraudAnalysis.riskScore),
                  fontWeight: 600
                }}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedFraudAnalysis && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Risk Assessment
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Risk Level:</strong> {selectedFraudAnalysis.riskLevel.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Risk Score:</strong> {selectedFraudAnalysis.riskScore}/100
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Recommendation:</strong> {selectedFraudAnalysis.recommendation.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Confidence:</strong> {Math.round(selectedFraudAnalysis.confidence * 100)}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Fraud Flags ({selectedFraudAnalysis.flags.length})
                </Typography>
                {selectedFraudAnalysis.flags.length > 0 ? (
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {selectedFraudAnalysis.flags.map((flag, index) => (
                      <Alert 
                        key={index} 
                        severity={flag.severity === 'critical' ? 'error' : flag.severity === 'high' ? 'warning' : 'info'}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {flag.type.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="caption">
                          {flag.description}
                        </Typography>
                      </Alert>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No fraud flags detected
                  </Typography>
                )}
              </Grid>
              {selectedBooking && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Booking Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2">
                        <strong>Guest:</strong> {selectedBooking.guest}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {selectedBooking.guestEmail}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2">
                        <strong>Amount:</strong> {selectedBooking.amount}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Payment:</strong> {selectedBooking.paymentMethod}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2">
                        <strong>Check-in:</strong> {selectedBooking.checkIn}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Guests:</strong> {selectedBooking.guests}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2">
                        <strong>Property:</strong> {selectedBooking.property}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Host:</strong> {selectedBooking.host}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseFraudDialog}>Close</Button>
          {selectedFraudAnalysis?.recommendation === 'reject' && (
            <Button variant="contained" color="error" onClick={handleCloseFraudDialog}>
              Reject Booking
            </Button>
          )}
          {selectedFraudAnalysis?.recommendation === 'hold' && (
            <Button variant="contained" color="warning" onClick={handleCloseFraudDialog}>
              Hold for Review
            </Button>
          )}
          {selectedFraudAnalysis?.recommendation === 'review' && (
            <Button variant="contained" onClick={handleCloseFraudDialog}>
              Mark for Review
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Security Review Dialog */}
      <Dialog 
        open={securityReviewDialog} 
        onClose={handleCloseSecurityReview}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SecurityIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h5" fontWeight={700}>
                Security Review - {selectedBooking?.id}
              </Typography>
            </Box>
            {securityAnalysis && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`Risk Level: ${securityAnalysis.riskLevel.toUpperCase()}`}
                  sx={{ 
                    backgroundColor: securityAnalysis.riskLevel === 'critical' ? '#ffebee' : 
                                   securityAnalysis.riskLevel === 'high' ? '#fff3e0' : 
                                   securityAnalysis.riskLevel === 'medium' ? '#fff8e1' : '#e8f5e8',
                    color: securityAnalysis.riskLevel === 'critical' ? '#c62828' : 
                          securityAnalysis.riskLevel === 'high' ? '#ef6c00' : 
                          securityAnalysis.riskLevel === 'medium' ? '#f57c00' : '#2e7d32',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                />
                <Chip 
                  label={`${securityAnalysis.riskScore}/100`}
                  sx={{ 
                    backgroundColor: `${getFraudScoreColor(securityAnalysis.riskScore)}15`,
                    color: getFraudScoreColor(securityAnalysis.riskScore),
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {securityAnalysis && selectedBooking && (
            <Box>
              {/* Critical Risk Alert */}
              {securityAnalysis.riskLevel === 'critical' && (
                <Alert severity="error" sx={{ m: 3, mb: 0 }}>
                  <Typography variant="h6" fontWeight={600}>
                    🚨 CRITICAL SECURITY RISK DETECTED
                  </Typography>
                  <Typography variant="body2">
                    This booking has been flagged as extremely high risk. Immediate action required.
                    Recommended action: <strong>{securityAnalysis.recommendation.toUpperCase()}</strong>
                  </Typography>
                </Alert>
              )}

              <Grid container>
                {/* Left Panel - Risk Summary */}
                <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #e0e0e0' }}>
                  <Box sx={{ p: 3, bgcolor: '#fafafa', height: '100%' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      🔍 Risk Assessment
                    </Typography>
                    
                    <Card sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          Overall Risk Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography 
                            variant="h3" 
                            fontWeight={700}
                            sx={{ color: getFraudScoreColor(securityAnalysis.riskScore) }}
                          >
                            {securityAnalysis.riskScore}
                          </Typography>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              out of 100
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: getFraudScoreColor(securityAnalysis.riskScore),
                                fontWeight: 600,
                                textTransform: 'uppercase'
                              }}
                            >
                              {securityAnalysis.riskLevel} RISK
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          📊 Analysis Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Recommendation:</Typography>
                            <Chip 
                              label={securityAnalysis.recommendation.toUpperCase()}
                              size="small"
                              sx={{ 
                                backgroundColor: securityAnalysis.recommendation === 'reject' ? '#ffebee' : 
                                               securityAnalysis.recommendation === 'hold' ? '#fff3e0' : 
                                               securityAnalysis.recommendation === 'review' ? '#fff8e1' : '#e8f5e8',
                                color: securityAnalysis.recommendation === 'reject' ? '#c62828' : 
                                       securityAnalysis.recommendation === 'hold' ? '#ef6c00' : 
                                       securityAnalysis.recommendation === 'review' ? '#f57c00' : '#2e7d32',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Confidence:</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {Math.round(securityAnalysis.confidence * 100)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Flags Detected:</Typography>
                            <Typography variant="body2" fontWeight={600} color="error">
                              {securityAnalysis.flags.length}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          🎯 Recommended Actions
                        </Typography>
                        {securityAnalysis.recommendation === 'reject' && (
                          <Alert severity="error" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              REJECT BOOKING
                            </Typography>
                            <Typography variant="caption">
                              Multiple high-risk indicators detected. Do not process this booking.
                            </Typography>
                          </Alert>
                        )}
                        {securityAnalysis.recommendation === 'hold' && (
                          <Alert severity="warning" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              HOLD FOR INVESTIGATION
                            </Typography>
                            <Typography variant="caption">
                              Suspend booking and conduct manual verification.
                            </Typography>
                          </Alert>
                        )}
                        {securityAnalysis.recommendation === 'review' && (
                          <Alert severity="info" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              REQUIRES MANUAL REVIEW
                            </Typography>
                            <Typography variant="caption">
                              Schedule additional verification steps before approval.
                            </Typography>
                          </Alert>
                        )}
                        {securityAnalysis.recommendation === 'approve' && (
                          <Alert severity="success" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              SAFE TO APPROVE
                            </Typography>
                            <Typography variant="caption">
                              No significant risk factors detected.
                            </Typography>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>

                {/* Right Panel - Detailed Analysis */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      🔎 Detailed Security Analysis
                    </Typography>

                    {/* Fraud Flags Section */}
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          🚩 Security Flags ({securityAnalysis.flags.length})
                        </Typography>
                        {securityAnalysis.flags.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {securityAnalysis.flags.map((flag, index) => (
                              <Alert 
                                key={index} 
                                severity={flag.severity === 'critical' ? 'error' : 
                                         flag.severity === 'high' ? 'warning' : 
                                         flag.severity === 'medium' ? 'info' : 'success'}
                                sx={{ 
                                  '& .MuiAlert-message': { width: '100%' }
                                }}
                              >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" fontWeight={600}>
                                      {flag.type.replace(/_/g, ' ').toUpperCase()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                      {flag.description}
                                    </Typography>
                                    {flag.evidence && (
                                      <Typography variant="caption" sx={{ 
                                        mt: 1, 
                                        display: 'block',
                                        fontFamily: 'monospace',
                                        backgroundColor: '#f5f5f5',
                                        padding: '4px 8px',
                                        borderRadius: 1
                                      }}>
                                        Evidence: {JSON.stringify(flag.evidence, null, 2)}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Chip 
                                    label={flag.severity.toUpperCase()}
                                    size="small"
                                    sx={{ 
                                      ml: 2,
                                      backgroundColor: flag.severity === 'critical' ? '#ffebee' : 
                                                     flag.severity === 'high' ? '#fff3e0' : 
                                                     flag.severity === 'medium' ? '#fff8e1' : '#e8f5e8',
                                      color: flag.severity === 'critical' ? '#c62828' : 
                                            flag.severity === 'high' ? '#ef6c00' : 
                                            flag.severity === 'medium' ? '#f57c00' : '#2e7d32',
                                      fontWeight: 600
                                    }}
                                  />
                                </Box>
                              </Alert>
                            ))}
                          </Box>
                        ) : (
                          <Alert severity="success">
                            <Typography variant="body2">
                              ✅ No security flags detected - This booking appears legitimate
                            </Typography>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>

                    {/* Booking Details Section */}
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          📋 Booking Information
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Guest Details
                            </Typography>
                            <Typography variant="body2"><strong>Name:</strong> {selectedBooking.guest}</Typography>
                            <Typography variant="body2"><strong>Email:</strong> {selectedBooking.guestEmail}</Typography>
                            <Typography variant="body2"><strong>Guests:</strong> {selectedBooking.guests}</Typography>
                            <Typography variant="body2"><strong>Booking Date:</strong> {selectedBooking.bookingDate}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Booking Details
                            </Typography>
                            <Typography variant="body2"><strong>Property:</strong> {selectedBooking.property}</Typography>
                            <Typography variant="body2"><strong>Host:</strong> {selectedBooking.host}</Typography>
                            <Typography variant="body2"><strong>Check-in:</strong> {selectedBooking.checkIn}</Typography>
                            <Typography variant="body2"><strong>Check-out:</strong> {selectedBooking.checkOut}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Payment Information
                            </Typography>
                            <Typography variant="body2"><strong>Amount:</strong> {selectedBooking.amount}</Typography>
                            <Typography variant="body2"><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</Typography>
                            <Typography variant="body2"><strong>Payment Status:</strong> {selectedBooking.payment}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Risk Factors
                            </Typography>
                            <Typography variant="body2"><strong>Current Status:</strong> {selectedBooking.status}</Typography>
                            <Typography variant="body2"><strong>Issues:</strong> {selectedBooking.issues || 'None'}</Typography>
                            <Typography variant="body2"><strong>Previous Risk Score:</strong> {selectedBooking.riskScore}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Action History Section */}
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          📝 Security Review History
                        </Typography>
                        <Alert severity="info">
                          <Typography variant="body2">
                            This is the first security review for booking {selectedBooking.id}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Conducted on: {new Date().toLocaleString()}
                          </Typography>
                        </Alert>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={handleCloseSecurityReview} variant="outlined">
              Close Review
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {securityAnalysis?.recommendation === 'reject' && (
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<CancelIcon />}
                  onClick={handleCloseSecurityReview}
                >
                  Reject Booking
                </Button>
              )}
              {securityAnalysis?.recommendation === 'hold' && (
                <Button 
                  variant="contained" 
                  color="warning" 
                  startIcon={<WarningIcon />}
                  onClick={handleCloseSecurityReview}
                >
                  Hold for Investigation
                </Button>
              )}
              {securityAnalysis?.recommendation === 'review' && (
                <Button 
                  variant="contained" 
                  startIcon={<VisibilityIcon />}
                  onClick={handleCloseSecurityReview}
                >
                  Schedule Manual Review
                </Button>
              )}
              {securityAnalysis?.recommendation === 'approve' && (
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleCloseSecurityReview}
                >
                  Approve Booking
                </Button>
              )}
              <Button 
                variant="outlined" 
                startIcon={<SecurityIcon />}
                onClick={() => {
                  // Add to security watchlist
                  handleCloseSecurityReview();
                }}
              >
                Add to Watchlist
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%', mt: 1 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modify Booking</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancel Booking</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PaymentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Process Payment</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Flag as Suspicious</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSecurityReview(selectedBooking)}>
          <ListItemIcon>
            <SecurityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Security Review</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
