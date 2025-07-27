import React from 'react';
import { Box, Typography, Paper, Divider, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import InsightsIcon from '@mui/icons-material/Insights';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HomeIcon from '@mui/icons-material/Home';
import { Colors } from '../../constants';
import { useMyProperties } from '../../../hooks/propertyHooks';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import InventorySummaryCard from './InventorySummaryCard';
import TopPropertiesCard from './TopPropertiesCard';
import PayoutSummaryCard from './PayoutSummaryCard';
import TaxFeeBreakdownCard from './TaxFeeBreakdownCard';
import RecentReviewsCard from './RecentReviewsCard';
import RatingSummaryCard from './RatingSummaryCard';
import AIForecastingCard from './AIForecastingCard';
import BookingTrendsCard from './BookingTrendsCard';
import CalendarSyncCard from './CalendarSyncCard';
import CancellationTrendsCard from './CancellationTrendsCard';
import PropertyConfig from './PropertyConfig';

export default function PropertyManagement() {
  const { data: properties, isLoading } = useMyProperties();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = React.useState<string>('properties');
  
  // Check if we're on the add property route or manage property route
  const isAddPropertyRoute = location.pathname.includes('/add-property');
  const isManagePropertyRoute = location.pathname.includes('/manage/');
  
  // If we're on nested routes (add property or manage property), just show the outlet
  if (isAddPropertyRoute || isManagePropertyRoute) {
    return <Outlet />;
  }

  const handleAddProperty = () => {
    navigate('/MyAccount/Dashboard/properties/add-property');
  };
  

  
  const handleSectionChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveSection(newValue);
    // Scroll to the section
    const element = document.getElementById(newValue);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, width: '70%', pr: 2 }}>
        {/* Navigation Tabs */}
        <Paper elevation={1} sx={{ mb: 3, position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
          <Tabs 
            value={activeSection} 
            onChange={handleSectionChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 48,
                fontSize: '0.9rem'
              }
            }}
          >
            <Tab icon={<HomeIcon />} iconPosition="start" label="My Properties" value="properties" />
            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="Financial Insights" value="financial" />
            <Tab icon={<StarIcon />} iconPosition="start" label="Reputation" value="reputation" />
            <Tab icon={<InsightsIcon />} iconPosition="start" label="Analytics" value="analytics" />
            <Tab icon={<PsychologyIcon />} iconPosition="start" label="Power Features" value="power" />
          </Tabs>
        </Paper>
        
        {/* My Properties Section */}
        <PropertyConfig
          properties={properties}
          isLoading={isLoading}
          onAddProperty={handleAddProperty}
          lowAvailabilityAlerts={[]}
        />
        
        <Divider sx={{ my: 4 }} />
        
        {/* Financial Insights Section */}
        <Box id="financial" mb={5}>
          <Typography variant="h5" fontWeight={600} color={Colors.blue} sx={{ mb: 2 }}>
            🧾 Financial Insights
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PayoutSummaryCard
                data={{
                  pending: 3250,
                  processed: 12480,
                  nextPayout: 'Jun 15, 2023',
                  paymentMethods: [
                    { id: '1', type: 'paypal', name: 'PayPal', isDefault: true },
                    { id: '2', type: 'bank', name: 'Bank Account', isDefault: false },
                  ],
                  recentPayouts: [
                    { id: '1', amount: 1250, date: 'Jun 1, 2023', method: 'PayPal', status: 'processed' },
                    { id: '2', amount: 3250, date: 'Jun 15, 2023', method: 'PayPal', status: 'pending' },
                    { id: '3', amount: 980, date: 'May 15, 2023', method: 'Bank Account', status: 'processed' },
                  ]
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TaxFeeBreakdownCard
                monthly={{
                  platformFee: 450,
                  taxesWithheld: 320,
                  serviceFee: 180,
                  cleaningFee: 250,
                  otherFees: 80,
                  netIncome: 2920
                }}
                yearly={{
                  platformFee: 5400,
                  taxesWithheld: 3840,
                  serviceFee: 2160,
                  cleaningFee: 3000,
                  otherFees: 960,
                  netIncome: 35040
                }}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Reputation Management Section */}
        <Box id="reputation" mb={5}>
          <Typography variant="h5" fontWeight={600} color={Colors.blue} sx={{ mb: 2 }}>
            ⭐ Reputation Management
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RecentReviewsCard
                reviews={[
                  {
                    id: '1',
                    guestName: 'Emma Wilson',
                    guestAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    propertyName: 'Beach House',
                    rating: 4.5,
                    comment: 'Beautiful property with amazing views! The beach access was perfect and the house was very clean. Would definitely stay again.',
                    date: 'Jun 10, 2023',
                    flagged: false
                  },
                  {
                    id: '2',
                    guestName: 'Michael Brown',
                    guestAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    propertyName: 'Mountain Cabin',
                    rating: 2.5,
                    comment: 'The location was nice but the property wasn\'t very clean. There were issues with the bathroom and the cleanliness was below our expectations.',
                    date: 'Jun 5, 2023',
                    flagged: true,
                    keywords: ['cleanliness', 'bathroom']
                  },
                  {
                    id: '3',
                    guestName: 'Sarah Johnson',
                    guestAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                    propertyName: 'City Apartment',
                    rating: 5.0,
                    comment: 'Perfect location in the heart of the city! The apartment was spotless and had everything we needed. The host was very responsive and helpful.',
                    date: 'May 28, 2023',
                    flagged: false
                  }
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RatingSummaryCard
                properties={[
                  {
                    id: '1',
                    name: 'Beach House',
                    averageRating: 4.7,
                    reviewCount: 42,
                    ratingBreakdown: {
                      5: 30,
                      4: 8,
                      3: 2,
                      2: 1,
                      1: 1
                    }
                  },
                  {
                    id: '2',
                    name: 'Mountain Cabin',
                    averageRating: 4.2,
                    reviewCount: 28,
                    ratingBreakdown: {
                      5: 15,
                      4: 8,
                      3: 3,
                      2: 1,
                      1: 1
                    }
                  },
                  {
                    id: '3',
                    name: 'City Apartment',
                    averageRating: 4.9,
                    reviewCount: 36,
                    ratingBreakdown: {
                      5: 32,
                      4: 4,
                      3: 0,
                      2: 0,
                      1: 0
                    }
                  }
                ]}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Analytics Tools Section */}
        <Box id="analytics" mb={5}>
          <Typography variant="h5" fontWeight={600} color={Colors.blue} sx={{ mb: 2 }}>
            📊 Analytics Tools
          </Typography>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <BookingTrendsCard
                dailyData={[
                  { date: 'Mon', bookings: 3, revenue: 450 },
                  { date: 'Tue', bookings: 2, revenue: 300 },
                  { date: 'Wed', bookings: 5, revenue: 750 },
                  { date: 'Thu', bookings: 4, revenue: 600 },
                  { date: 'Fri', bookings: 7, revenue: 1050 },
                  { date: 'Sat', bookings: 9, revenue: 1350 },
                  { date: 'Sun', bookings: 6, revenue: 900 }
                ]}
                weeklyData={[
                  { date: 'Week 1', bookings: 24, revenue: 3600 },
                  { date: 'Week 2', bookings: 18, revenue: 2700 },
                  { date: 'Week 3', bookings: 32, revenue: 4800 },
                  { date: 'Week 4', bookings: 28, revenue: 4200 }
                ]}
                monthlyData={[
                  { date: 'Jan', bookings: 85, revenue: 12750 },
                  { date: 'Feb', bookings: 78, revenue: 11700 },
                  { date: 'Mar', bookings: 92, revenue: 13800 },
                  { date: 'Apr', bookings: 110, revenue: 16500 },
                  { date: 'May', bookings: 125, revenue: 18750 },
                  { date: 'Jun', bookings: 102, revenue: 15300 }
                ]}
                ytdData={[
                  { date: '2020', bookings: 592, revenue: 88800 },
                  { date: '2021', bookings: 687, revenue: 103050 },
                  { date: '2022', bookings: 823, revenue: 123450 },
                  { date: '2023', bookings: 592, revenue: 88800 },
                  { date: '2024 (YTD)', bookings: 412, revenue: 61800 }
                ]}
                guestOrigins={[
                  { country: 'United States', state: 'California', count: 45, percentage: 30 },
                  { country: 'United States', state: 'New York', count: 32, percentage: 21 },
                  { country: 'Canada', count: 18, percentage: 12 },
                  { country: 'United Kingdom', count: 15, percentage: 10 },
                  { country: 'Germany', count: 12, percentage: 8 },
                  { country: 'Australia', count: 10, percentage: 7 },
                  { country: 'France', count: 8, percentage: 5 },
                  { country: 'Other', count: 10, percentage: 7 }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <CancellationTrendsCard
                monthlyData={[
                  { period: 'Jan', count: 5, refundAmount: 750 },
                  { period: 'Feb', count: 3, refundAmount: 450 },
                  { period: 'Mar', count: 7, refundAmount: 1050 },
                  { period: 'Apr', count: 4, refundAmount: 600 },
                  { period: 'May', count: 6, refundAmount: 900 },
                  { period: 'Jun', count: 2, refundAmount: 300 }
                ]}
                reasons={[
                  { reason: 'Change of plans', count: 12, percentage: 44 },
                  { reason: 'Found better option', count: 6, percentage: 22 },
                  { reason: 'Emergency', count: 4, percentage: 15 },
                  { reason: 'Weather concerns', count: 3, percentage: 11 },
                  { reason: 'Other', count: 2, percentage: 8 }
                ]}
                timings={[
                  { timing: '> 7 days before', count: 15, percentage: 56 },
                  { timing: '3-7 days before', count: 8, percentage: 30 },
                  { timing: '< 3 days before', count: 4, percentage: 14 }
                ]}
                refundStats={{
                  totalRefunded: 4050,
                  partialRefunds: 18,
                  noRefunds: 9,
                  averageRefundPercentage: 75
                }}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Power Features Section */}
        <Box id="power" mb={5}>
          <Typography variant="h5" fontWeight={600} color={Colors.blue} sx={{ mb: 2 }}>
            🧠 Power Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AIForecastingCard
                occupancyForecast={[
                  { date: 'Jan', actual: 75, predicted: 75 },
                  { date: 'Feb', actual: 82, predicted: 80 },
                  { date: 'Mar', actual: 88, predicted: 85 },
                  { date: 'Apr', actual: 92, predicted: 90 },
                  { date: 'May', actual: 95, predicted: 93 },
                  { date: 'Jun', actual: 98, predicted: 97, lowerBound: 92, upperBound: 100 },
                  { date: 'Jul', actual: 99, predicted: 98, lowerBound: 93, upperBound: 100 },
                  { date: 'Aug', actual: 96, predicted: 96, lowerBound: 90, upperBound: 100 },
                  { date: 'Sep', actual: 90, predicted: 90, lowerBound: 85, upperBound: 95 }
                ]}
                earningsForecast={[
                  { date: 'Jan', actual: 12500, predicted: 12500 },
                  { date: 'Feb', actual: 13200, predicted: 13000 },
                  { date: 'Mar', actual: 14500, predicted: 14000 },
                  { date: 'Apr', actual: 15800, predicted: 15500 },
                  { date: 'May', actual: 16900, predicted: 16500 },
                  { date: 'Jun', actual: 20000, predicted: 18000, lowerBound: 17000, upperBound: 19000 },
                  { date: 'Jul', actual: 10000, predicted: 19500, lowerBound: 18000, upperBound: 21000 },
                  { date: 'Aug', actual: 16000, predicted: 20000, lowerBound: 18500, upperBound: 21500 },
                  { date: 'Sep', actual: 9000, predicted: 17500, lowerBound: 16000, upperBound: 19000 }
                ]}
                confidenceLevel={85}
                lastUpdated="Jun 15, 2023"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CalendarSyncCard
                sources={[
                  {
                    id: '1',
                    name: 'Airbnb Calendar',
                    type: 'airbnb',
                    connected: true,
                    lastSync: 'Jun 15, 2023 10:30 AM',
                    autoSync: true,
                    properties: ['Beach House', 'Mountain Cabin', 'City Apartment'],
                    status: 'ok'
                  },
                  {
                    id: '2',
                    name: 'Booking.com',
                    type: 'booking',
                    connected: true,
                    lastSync: 'Jun 14, 2023 09:15 AM',
                    autoSync: true,
                    properties: ['Beach House', 'Lake Cottage'],
                    status: 'error'
                  },
                  {
                    id: '3',
                    name: 'Google Calendar',
                    type: 'google',
                    connected: true,
                    lastSync: 'Jun 15, 2023 11:45 AM',
                    autoSync: false,
                    properties: ['Personal Calendar'],
                    status: 'ok'
                  }
                ]}
                onConnect={(type) => console.log(`Connect ${type}`)}
                onToggleAutoSync={(id, autoSync) => console.log(`Toggle auto sync for ${id}: ${autoSync}`)}
                onSyncNow={(id) => console.log(`Sync now for ${id}`)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      
      {/* Sidebar */}
      <Box sx={{ 
        width: '30%', 
        position: 'sticky',
        top: 80,
        height: '100%',
        overflow: 'auto',
        pl: 2,
        borderLeft: '1px solid #f0f0f0'
      }}>
        
        
        <TopPropertiesCard
          properties={[
            { id: '1', name: 'Beach House', income: 12500, rating: 4.8, occupancyRate: 92 },
            { id: '2', name: 'Mountain Cabin', income: 9800, rating: 4.5, occupancyRate: 85 },
            { id: '3', name: 'City Apartment', income: 8200, rating: 4.9, occupancyRate: 78 },
            { id: '4', name: 'Lake Cottage', income: 7500, rating: 4.2, occupancyRate: 88 },
            { id: '5', name: 'Forest Retreat', income: 6900, rating: 4.7, occupancyRate: 72 },
          ]}
        />
        
        <Box sx={{ mt: 3 }}>
          <InventorySummaryCard
            properties={[
              { id: '1', name: 'Beach House', status: 'vacant', lastUpdated: '2023-06-15' },
              { id: '2', name: 'Mountain Cabin', status: 'booked', lastUpdated: '2023-06-14' },
              { id: '3', name: 'City Apartment', status: 'maintenance', lastUpdated: '2023-06-13' },
              { id: '4', name: 'Lake Cottage', status: 'vacant', lastUpdated: '2023-06-12' },
              { id: '5', name: 'Forest Retreat', status: 'booked', lastUpdated: '2023-06-11' },
              { id: '6', name: 'Desert Oasis', status: 'vacant', lastUpdated: '2023-06-10' },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}