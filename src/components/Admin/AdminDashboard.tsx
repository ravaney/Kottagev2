import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Avatar,
  AvatarGroup
} from '@mui/material';
import { Colors } from '../constants';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useNavigate } from 'react-router-dom';

// Mock data for the dashboard
const dashboardStats = [
  { 
    title: 'Total Properties', 
    value: '1,247', 
    change: '+12%', 
    trend: 'up',
    icon: <HomeWorkIcon sx={{ fontSize: 40 }}/>, 
    color: Colors.blue 
  },
  { 
    title: 'Active Bookings', 
    value: '89', 
    change: '+5%', 
    trend: 'up',
    icon: <EventNoteIcon sx={{ fontSize: 40 }}/>, 
    color: '#4caf50' 
  },
  { 
    title: 'Total Users', 
    value: '15,632', 
    change: '+8%', 
    trend: 'up',
    icon: <PeopleIcon sx={{ fontSize: 40 }}/>, 
    color: Colors.raspberry 
  },
  { 
    title: 'Revenue (MTD)', 
    value: '$89,450', 
    change: '-2%', 
    trend: 'down',
    icon: <BarChartIcon sx={{ fontSize: 40 }}/>, 
    color: '#ff9800' 
  }
];

const recentActivities = [
  { id: 1, action: 'New property listing approved', location: 'Montego Bay', time: '5 minutes ago', type: 'property' },
  { id: 2, action: 'Staff assigned to regional area', location: 'Kingston', time: '12 minutes ago', type: 'staff' },
  { id: 3, action: 'User account suspended', location: 'Negril', time: '1 hour ago', type: 'user' },
  { id: 4, action: 'Booking dispute resolved', location: 'Ocho Rios', time: '2 hours ago', type: 'booking' },
  { id: 5, action: 'Property verification completed', location: 'Portland', time: '3 hours ago', type: 'property' },
];

const quickActions = [
  { title: 'Review Pending Properties', count: 12, color: Colors.blue, path: '/admin/properties' },
  { title: 'Assign Staff to Regions', count: 3, color: Colors.raspberry, path: '/admin/regional-assignment' },
  { title: 'Resolve Support Tickets', count: 8, color: '#4caf50', path: '/admin/support' },
  { title: 'Process Payouts', count: 15, color: '#ff9800', path: '/admin/payouts' },
];

const regionalCoverage = [
  { region: 'Kingston & St. Andrew', coverage: 95, staff: 8, color: '#4caf50' },
  { region: 'Montego Bay & St. James', coverage: 88, staff: 6, color: '#8bc34a' },
  { region: 'Negril & Westmoreland', coverage: 72, staff: 4, color: '#ffc107' },
  { region: 'Ocho Rios & St. Ann', coverage: 85, staff: 5, color: '#4caf50' },
  { region: 'Portland & St. Mary', coverage: 65, staff: 3, color: '#ff9800' },
  { region: 'South Coast', coverage: 58, staff: 2, color: '#f44336' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color={Colors.blue} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your platform today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.trend === 'up' ? (
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    color={stat.trend === 'up' ? '#4caf50' : '#f44336'}
                    fontWeight={600}
                  >
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={700} color={stat.color} gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      border: `2px solid ${action.color}`,
                      '&:hover': {
                        backgroundColor: `${action.color}10`,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700} color={action.color}>
                          {action.count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.title}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: action.color 
                        }} 
                      />
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Platform Activity
            </Typography>
            <List dense>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: Colors.blue, fontSize: '0.8rem' }}>
                        {activity.type[0].toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {activity.location} • {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button 
              fullWidth 
              variant="text" 
              sx={{ mt: 2, color: Colors.blue }}
              onClick={() => navigate('/admin/activity')}
            >
              View All Activity
            </Button>
          </Paper>
        </Grid>

        {/* Regional Coverage */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Regional Coverage & Staff Distribution
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AssignmentIndIcon />}
                onClick={() => navigate('/admin/regional-assignment')}
                sx={{
                  borderColor: Colors.blue,
                  color: Colors.blue,
                  '&:hover': { backgroundColor: `${Colors.blue}10` }
                }}
              >
                Manage Assignments
              </Button>
            </Box>

            <Grid container spacing={3}>
              {regionalCoverage.map((region, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {region.region}
                      </Typography>
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                        {Array.from({ length: Math.min(region.staff, 3) }, (_, i) => (
                          <Avatar key={i} sx={{ bgcolor: region.color }}>
                            {i + 1}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Coverage
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {region.coverage}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={region.coverage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: region.color
                          }
                        }}
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      {region.staff} staff member{region.staff !== 1 ? 's' : ''} assigned
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
