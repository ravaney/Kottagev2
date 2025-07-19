import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { Colors } from '../constants';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

// Mock data for dashboard stats
const dashboardStats = [
  { title: 'Total Properties', value: 124, icon: <HomeWorkIcon sx={{ fontSize: 40 }}/>, color: Colors.blue },
  { title: 'Active Bookings', value: 56, icon: <EventNoteIcon sx={{ fontSize: 40 }}/>, color: '#4caf50' },
  { title: 'Registered Users', value: 2453, icon: <PeopleIcon sx={{ fontSize: 40 }}/>, color: Colors.raspberry },
  { title: 'Revenue (MTD)', value: '$45,230', icon: <BarChartIcon sx={{ fontSize: 40 }}/>, color: '#ff9800' }
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, type: 'booking', user: 'John Smith', action: 'made a reservation', property: 'Beach Villa', time: '10 minutes ago' },
  { id: 2, type: 'property', user: 'Admin', action: 'approved new listing', property: 'Mountain Retreat', time: '1 hour ago' },
  { id: 3, type: 'user', user: 'Sarah Johnson', action: 'registered new account', property: '', time: '3 hours ago' },
  { id: 4, type: 'booking', user: 'Michael Brown', action: 'cancelled reservation', property: 'City Apartment', time: '5 hours ago' },
  { id: 5, type: 'property', user: 'Admin', action: 'updated property details', property: 'Lakeside Cottage', time: '1 day ago' }
];

export default function AdminLanding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');

  const adminModules = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { id: 'properties', name: 'Properties', icon: <HomeWorkIcon />, path: '/admin/properties' },
    { id: 'bookings', name: 'Bookings', icon: <EventNoteIcon />, path: '/admin/bookings' },
    { id: 'users', name: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { id: 'analytics', name: 'Analytics', icon: <BarChartIcon />, path: '/admin/analytics' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
  ];

  const handleModuleClick = (moduleId: string, path: string) => {
    setActiveModule(moduleId);
    navigate(path);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      {/* Admin Header */}
      <Box sx={{ 
        backgroundColor: Colors.blue,
        color: 'white',
        py: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src="/blueyaad.png"
                alt="Yaad Admin"
                sx={{
                  height: 40,
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <Typography variant="h5" fontWeight={700}>
                Admin Portal
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" size="small">
                <NotificationsIcon />
              </IconButton>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                px: 2,
                py: 0.5
              }}>
                <PersonIcon />
                <Typography variant="body2" fontWeight={500}>
                  Admin User
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Admin Navigation */}
          <Grid item xs={12} md={3} lg={2}>
            <Paper sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: Colors.blue,
                color: 'white'
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Admin Navigation
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {adminModules.map((module) => (
                  <Button
                    key={module.id}
                    fullWidth
                    startIcon={module.icon}
                    onClick={() => handleModuleClick(module.id, module.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      color: activeModule === module.id ? 'white' : Colors.blue,
                      backgroundColor: activeModule === module.id ? Colors.blue : 'transparent',
                      '&:hover': {
                        backgroundColor: activeModule === module.id ? Colors.blue : 'rgba(0, 114, 229, 0.1)'
                      }
                    }}
                  >
                    {module.name}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9} lg={10}>
            {/* Welcome Banner */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              backgroundImage: `linear-gradient(135deg, ${Colors.blue} 0%, ${Colors.raspberry} 100%)`,
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Welcome to Yaad Admin Portal
                  </Typography>
                  <Typography variant="body1">
                    Manage properties, bookings, and users from one central dashboard.
                    Monitor performance and make data-driven decisions to grow your business.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src="/images/admin-illustration.png"
                    alt="Admin"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: 150,
                      display: { xs: 'none', md: 'inline-block' }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Dashboard Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {dashboardStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper sx={{ 
                    p: 3, 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color={stat.color}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        backgroundColor: `${stat.color}15`
                      }}>
                        {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Recent Activity & Quick Actions */}
            <Grid container spacing={3}>
              {/* Recent Activity */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  height: '100%',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="h6" fontWeight={600} color={Colors.blue} gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box>
                    {recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <Box sx={{ py: 1.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: '50%', 
                            backgroundColor: 
                              activity.type === 'booking' ? `${Colors.blue}15` : 
                              activity.type === 'property' ? `${Colors.raspberry}15` : 
                              '#4caf5015'
                          }}>
                            {activity.type === 'booking' ? 
                              <EventNoteIcon sx={{ color: Colors.blue }} /> : 
                              activity.type === 'property' ? 
                              <HomeWorkIcon sx={{ color: Colors.raspberry }} /> : 
                              <PeopleIcon sx={{ color: '#4caf50' }} />
                            }
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2">
                              <strong>{activity.user}</strong> {activity.action}
                              {activity.property && <> for <strong>{activity.property}</strong></>}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                        {index < recentActivities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button 
                      variant="text" 
                      color="primary"
                      sx={{ color: Colors.blue }}
                    >
                      View All Activity
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  height: '100%',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="h6" fontWeight={600} color={Colors.blue} gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<HomeWorkIcon />}
                      sx={{ 
                        backgroundColor: Colors.blue,
                        '&:hover': { backgroundColor: Colors.raspberry },
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      Add New Property
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<EventNoteIcon />}
                      sx={{ 
                        borderColor: Colors.blue,
                        color: Colors.blue,
                        '&:hover': { borderColor: Colors.raspberry, color: Colors.raspberry },
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      Manage Bookings
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<PeopleIcon />}
                      sx={{ 
                        borderColor: Colors.blue,
                        color: Colors.blue,
                        '&:hover': { borderColor: Colors.raspberry, color: Colors.raspberry },
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      User Management
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<BarChartIcon />}
                      sx={{ 
                        borderColor: Colors.blue,
                        color: Colors.blue,
                        '&:hover': { borderColor: Colors.raspberry, color: Colors.raspberry },
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      View Reports
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}