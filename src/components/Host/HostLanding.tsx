import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Paper,
  Chip,
  Avatar,
  Rating,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../constants';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';

const HostLanding: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BusinessCenterIcon,
      title: 'Property Management',
      description: 'Manage multiple properties from one dashboard with ease',
      color: '#1565c0',
    },
    {
      icon: TrendingUpIcon,
      title: 'Revenue Analytics',
      description: 'Track earnings, occupancy rates, and optimize pricing',
      color: '#2e7d32',
    },
    {
      icon: CalendarTodayIcon,
      title: 'Booking Management',
      description: 'Handle reservations, availability, and guest communication',
      color: '#ed6c02',
    },
    {
      icon: PaymentIcon,
      title: 'Secure Payments',
      description: 'Fast, secure payouts with transparent fee structure',
      color: '#9c27b0',
    },
    {
      icon: AnalyticsIcon,
      title: 'Performance Insights',
      description: "Detailed analytics to maximize your property's potential",
      color: '#d32f2f',
    },
    {
      icon: SupportAgentIcon,
      title: '24/7 Support',
      description: 'Dedicated host support team available around the clock',
      color: '#0288d1',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      property: 'Blue Mountain Villa',
      rating: 5,
      comment:
        'Blu Kottage transformed my vacation rental business. Revenue increased 40% in 6 months!',
      avatar: '/bluemountain.jpg',
    },
    {
      name: 'Marcus Williams',
      property: 'Negril Beach House',
      rating: 5,
      comment:
        'The analytics tools help me optimize pricing. Customer support is outstanding.',
      avatar: '/negril.jpg',
    },
    {
      name: 'Lisa Chen',
      property: 'Port Antonio Retreat',
      rating: 5,
      comment:
        'Managing multiple properties is so much easier now. Highly recommend!',
      avatar: '/Port_antonio2.jpg',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Properties' },
    { number: '95%', label: 'Average Occupancy' },
    { number: '$2.5M+', label: 'Monthly Payouts' },
    { number: '4.9★', label: 'Host Rating' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Chip
                  label="Host Portal"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h2"
                  fontWeight={700}
                  gutterBottom
                  sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                  Turn Your Property Into
                  <Typography
                    component="span"
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'block',
                    }}
                  >
                    Passive Income
                  </Typography>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
                >
                  Join Jamaica's leading vacation rental platform. Professional
                  tools, guaranteed bookings, and 24/7 support to maximize your
                  earnings.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      backgroundColor: 'white',
                      color: Colors.blue,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Hosting Today
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      navigate('/login');
                    }}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Host Login
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/Geejam1.jpg"
                alt="Luxury Jamaica Property"
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color={Colors.blue}
                    gutterBottom
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="#2c3e50"
              gutterBottom
            >
              Everything You Need to Succeed
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              maxWidth="600px"
              mx="auto"
            >
              Professional-grade tools designed specifically for Caribbean
              property hosts
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      textAlign: 'center',
                      border: 'none',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: `${feature.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 40,
                          color: feature.color,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="#2c3e50"
              gutterBottom
            >
              Trusted by Jamaica's Top Hosts
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See what our successful hosts have to say
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.property}
                      </Typography>
                      <Rating
                        value={testimonial.rating}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" fontStyle="italic">
                    "{testimonial.comment}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <GroupsIcon sx={{ fontSize: 80, mb: 3, opacity: 0.8 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Ready to Start Earning?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of successful hosts across Jamaica. List your
              property today and start generating income within 24 hours.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  backgroundColor: 'white',
                  color: '#2e7d32',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Create Host Account
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: '#2c3e50', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  component="img"
                  src="/white logo.png"
                  alt="Blu Kottage Logo"
                  sx={{ height: 40 }}
                />
                <Typography variant="h6" fontWeight={600}>
                  Host Portal
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign={{ xs: 'center', md: 'right' }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  © 2025 Blu Kottage. All rights reserved.
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  support@blukottage.com | +1-876-XXX-XXXX
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HostLanding;
