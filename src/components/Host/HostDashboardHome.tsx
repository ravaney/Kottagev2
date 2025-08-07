import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../constants';
import { useAuth } from '../../hooks';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function HostDashboardHome() {
  const navigate = useNavigate();
  const { appUser } = useAuth();

  const dashboardCards = [
    {
      title: 'Property Management',
      description:
        'Manage your properties, add new listings, and update details',
      icon: <HolidayVillageIcon sx={{ fontSize: 40, color: Colors.blue }} />,
      path: '/dashboard/properties',
      buttonText: 'Manage Properties',
      color: '#e3f2fd',
    },
    {
      title: 'Reservations',
      description: 'View and manage guest bookings and reservations',
      icon: (
        <CalendarTodayIcon sx={{ fontSize: 40, color: Colors.raspberry }} />
      ),
      path: '/dashboard/reservations',
      buttonText: 'View Reservations',
      color: '#fce4ec',
    },
    {
      title: 'Messages',
      description: 'Communicate with guests and manage inquiries',
      icon: <MessageIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      path: '/dashboard/messages',
      buttonText: 'Check Messages',
      color: '#e8f5e8',
    },
    {
      title: 'Action Center',
      description: 'Important notifications and tasks requiring attention',
      icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      path: '/dashboard/action-center',
      buttonText: 'View Actions',
      color: '#fff3e0',
    },
  ];

  const quickStats = [
    { label: 'Total Properties', value: '3', color: Colors.blue },
    { label: 'Active Bookings', value: '12', color: Colors.raspberry },
    { label: 'This Month Revenue', value: '$4,250', color: '#2e7d32' },
    { label: 'Avg Rating', value: '4.8', color: '#ed6c02' },
  ];

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={600}
          color={Colors.blue}
          gutterBottom
        >
          Welcome back, {appUser?.firstName || 'Host'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your properties and grow your hosting business with Blu Kottage
        </Typography>
      </Box>

      {/* Host Information Alert */}
      <Alert
        severity="info"
        sx={{ mb: 4, backgroundColor: '#e3f2fd', border: '1px solid #bbdefb' }}
      >
        <Typography variant="body2">
          <strong>Host Portal:</strong> You have access to professional property
          management tools. Need help? Contact our host support team at
          support@blukottage.com
        </Typography>
      </Alert>

      {/* Quick Stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Quick Overview
        </Typography>
        <Grid container spacing={3}>
          {quickStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderLeft: `4px solid ${stat.color}`,
                }}
              >
                <Typography variant="h4" fontWeight={600} color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dashboard Navigation Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Management Tools
        </Typography>
        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      backgroundColor: card.color,
                      borderRadius: 2,
                      width: 'fit-content',
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {card.description}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(card.path)}
                    sx={{
                      backgroundColor: Colors.blue,
                      '&:hover': { backgroundColor: Colors.raspberry },
                      py: 1,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Activity */}
      <Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              {
                action: 'New booking received',
                time: '2 hours ago',
                type: 'booking',
              },
              {
                action: 'Property "Beach House" updated',
                time: '1 day ago',
                type: 'property',
              },
              {
                action: 'Guest message received',
                time: '2 days ago',
                type: 'message',
              },
              {
                action: 'Monthly payout processed',
                time: '3 days ago',
                type: 'payment',
              },
            ].map((activity, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: index < 3 ? '1px solid #e0e0e0' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={activity.type}
                    size="small"
                    sx={{
                      backgroundColor: Colors.blue,
                      color: 'white',
                      textTransform: 'capitalize',
                    }}
                  />
                  <Typography variant="body2">{activity.action}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
