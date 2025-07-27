import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import Grid from "@mui/material/GridLegacy"
import {
  TrendingUp,
  Visibility,
  BookmarkAdd,
  Star,
  Assessment,
  Search,
  People,
  MonetizationOn,
  Share,
  QuestionAnswer,
  Timeline
} from '@mui/icons-material';
import { usePropertyAnalytics, formatAnalyticsMetric, getTrendIndicator, calculateGrowthRate } from '../../../hooks/useAnalytics';
import { Colors } from '../../constants';

interface PropertyAnalyticsDashboardProps {
  propertyId: string;
  propertyName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  growth?: number;
  color?: string;
  isLoading?: boolean;
}> = ({ title, value, subtitle, icon, growth, color = Colors.blue, isLoading }) => {
  const trendIndicator = growth !== undefined ? getTrendIndicator(growth) : null;

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" component="div" sx={{ color: color, fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
        
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Typography variant="h4" component="div" fontWeight={700} mb={1}>
              {value}
            </Typography>
            
            {trendIndicator && (
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={`${growth! > 0 ? '+' : ''}${growth!.toFixed(1)}%`}
                  size="small"
                  color={trendIndicator.color as any}
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  vs last period
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PopularityScoreCard: React.FC<{ score: number; isLoading?: boolean }> = ({ score, isLoading }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#4caf50'; // Green
    if (score >= 0.6) return '#ff9800'; // Orange
    if (score >= 0.4) return '#f44336'; // Red
    return '#9e9e9e'; // Grey
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div" fontWeight={600}>
            Popularity Score
          </Typography>
          <Assessment sx={{ color: getScoreColor(score) }} />
        </Box>
        
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Box textAlign="center" mb={2}>
              <Typography variant="h2" component="div" fontWeight={700} sx={{ color: getScoreColor(score) }}>
                {Math.round(score * 100)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of 100
              </Typography>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={score * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(score),
                  borderRadius: 4
                }
              }}
            />
            
            <Box mt={2} textAlign="center">
              <Chip
                label={getScoreLabel(score)}
                sx={{
                  backgroundColor: getScoreColor(score),
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default function PropertyAnalyticsDashboard({ propertyId, propertyName }: PropertyAnalyticsDashboardProps) {
  const { data: analytics, isLoading, error } = usePropertyAnalytics(propertyId);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Failed to load analytics data. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} color={Colors.blue} gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {propertyName}
        </Typography>
      </Box>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Views"
            value={analytics ? formatAnalyticsMetric(analytics.views.total, 'number') : '-'}
            subtitle="Property page visits"
            icon={<Visibility />}
            growth={analytics ? calculateGrowthRate(analytics.views.lastWeek, analytics.views.lastMonth - analytics.views.lastWeek) : undefined}
            isLoading={isLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Bookings"
            value={analytics ? formatAnalyticsMetric(analytics.bookings.total, 'number') : '-'}
            subtitle="Confirmed reservations"
            icon={<BookmarkAdd />}
            growth={analytics ? calculateGrowthRate(analytics.bookings.lastWeek, analytics.bookings.lastMonth - analytics.bookings.lastWeek) : undefined}
            color="#4caf50"
            isLoading={isLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={analytics ? formatAnalyticsMetric(analytics.bookings.revenue, 'currency') : '-'}
            subtitle="Gross booking value"
            icon={<MonetizationOn />}
            color="#ff9800"
            isLoading={isLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <PopularityScoreCard
            score={analytics?.popularityScore || 0}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Detailed Analytics Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Performance" icon={<Timeline />} />
          <Tab label="Search & Discovery" icon={<Search />} />
          <Tab label="Guest Engagement" icon={<People />} />
          <Tab label="Reviews & Ratings" icon={<Star />} />
          <Tab label="Competition" icon={<Assessment />} />
        </Tabs>

        {/* Performance Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Conversion Metrics" />
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Booking Conversion Rate
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.bookings.conversionRate, 'percentage') : '-'}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(analytics?.bookings.conversionRate || 0) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average Booking Value
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.bookings.averageBookingValue, 'currency') : '-'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Recent Activity" />
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Views This Week
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.views.lastWeek, 'number') : '-'}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Bookings This Week
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.bookings.lastWeek, 'number') : '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Views Today
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.views.today, 'number') : '-'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Search & Discovery Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Search Impressions"
                value={analytics ? formatAnalyticsMetric(analytics.searches.impressions, 'number') : '-'}
                subtitle="Times shown in search results"
                icon={<Search />}
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Click-Through Rate"
                value={analytics ? formatAnalyticsMetric(analytics.searches.clickThroughRate, 'percentage') : '-'}
                subtitle="Clicks / Impressions"
                icon={<TrendingUp />}
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Search Clicks"
                value={analytics ? formatAnalyticsMetric(analytics.searches.total, 'number') : '-'}
                subtitle="Clicks from search results"
                icon={<Visibility />}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Guest Engagement Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Engagement Metrics" />
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average Time on Page
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? `${Math.round(analytics.engagement.avgTimeOnPage)}s` : '-'}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Photo View Rate
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.engagement.photoViewRate, 'percentage') : '-'}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Inquiry Rate
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.engagement.inquiryRate, 'percentage') : '-'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="User Actions" />
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Wishlist Rate
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.engagement.wishlistRate, 'percentage') : '-'}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Share Rate
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {analytics ? formatAnalyticsMetric(analytics.engagement.shareRate, 'percentage') : '-'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <MetricCard
                title="Average Rating"
                value={analytics ? formatAnalyticsMetric(analytics.reviews.averageRating, 'rating') : '-'}
                subtitle="Out of 5 stars"
                icon={<Star />}
                color="#ffc107"
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <MetricCard
                title="Total Reviews"
                value={analytics ? formatAnalyticsMetric(analytics.reviews.count, 'number') : '-'}
                subtitle="All time reviews"
                icon={<QuestionAnswer />}
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <MetricCard
                title="Recent Reviews"
                value={analytics ? formatAnalyticsMetric(analytics.reviews.recentReviews, 'number') : '-'}
                subtitle="Last 30 days"
                icon={<Timeline />}
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <MetricCard
                title="Response Rate"
                value={analytics ? formatAnalyticsMetric(analytics.reviews.responseRate, 'percentage') : '-'}
                subtitle="Your review responses"
                icon={<QuestionAnswer />}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Competition Tab */}
        <TabPanel value={activeTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Market Position"
                value={analytics ? `${analytics.competition.marketPosition}%` : '-'}
                subtitle="Percentile in market"
                icon={<Assessment />}
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Price Competitiveness"
                value={analytics ? formatAnalyticsMetric(analytics.competition.priceCompetitiveness, 'percentage') : '-'}
                subtitle="Vs similar properties"
                icon={<MonetizationOn />}
                isLoading={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Availability Score"
                value={analytics ? formatAnalyticsMetric(analytics.competition.availabilityScore, 'percentage') : '-'}
                subtitle="Vs competitors"
                icon={<Timeline />}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Tips and Recommendations */}
      {analytics && (
        <Card>
          <CardHeader title="Recommendations to Improve Performance" />
          <CardContent>
            <Grid container spacing={2}>
              {analytics.searches.clickThroughRate < 0.05 && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    Your click-through rate is below average. Consider updating your property photos and description to make your listing more appealing in search results.
                  </Alert>
                </Grid>
              )}
              
              {analytics.bookings.conversionRate < 0.02 && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    Your booking conversion rate could be improved. Consider reviewing your pricing, availability, and property amenities.
                  </Alert>
                </Grid>
              )}
              
              {analytics.reviews.responseRate < 0.8 && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    Responding to guest reviews can improve your visibility and guest confidence. Aim for 80%+ response rate.
                  </Alert>
                </Grid>
              )}
              
              {analytics.popularityScore > 0.8 && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Excellent work! Your property is performing very well. Keep maintaining your high standards.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
