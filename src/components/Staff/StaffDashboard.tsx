import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

// Mock data for tasks
const pendingTasks = [
  { id: 1, title: 'Verify new property listing', property: 'Sunset Villa', priority: 'high', dueDate: 'Today' },
  { id: 2, title: 'Review booking request', property: 'Mountain Cabin', priority: 'medium', dueDate: 'Tomorrow' },
  { id: 3, title: 'Update property photos', property: 'Beach House', priority: 'low', dueDate: 'Next week' },
  { id: 4, title: 'Respond to customer inquiry', property: 'City Loft', priority: 'high', dueDate: 'Today' },
];

export default function StaffDashboard() {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#1976d2';
    }
  };

  const handleTaskClick = (taskTitle: string) => {
    // Navigate based on task type
    if (taskTitle.toLowerCase().includes('verify') || taskTitle.toLowerCase().includes('property')) {
      navigate('/properties');
    } else if (taskTitle.toLowerCase().includes('booking') || taskTitle.toLowerCase().includes('review')) {
      navigate('/reservation-support');
    } else if (taskTitle.toLowerCase().includes('customer') || taskTitle.toLowerCase().includes('inquiry')) {
      navigate('/guests');
    } else {
      // Default to reservation support for other tasks
      navigate('/reservation-support');
    }
  };

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Typography>
            </Breadcrumbs>
          </Box>
          <IconButton color="inherit" size="small">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Welcome Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Welcome to the Staff Portal
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Manage property listings, handle bookings, and provide excellent customer service.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="textSecondary">
                Today's Date: {new Date().toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Dashboard Content */}
        <Grid container spacing={3}>
          {/* Pending Tasks */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ 
              height: '100%',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f9f9f9'
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Pending Tasks
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {pendingTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem 
                      alignItems="flex-start"
                      button
                      onClick={() => handleTaskClick(task.title)}
                      sx={{ 
                        px: 2, 
                        py: 1.5,
                        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        cursor: 'pointer'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={600}>
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="textSecondary" component="span">
                              {task.property} • Due: {task.dueDate}
                            </Typography>
                            <Chip 
                              label={task.priority} 
                              size="small" 
                              sx={{ 
                                ml: 1, 
                                height: 20, 
                                fontSize: '0.7rem',
                                backgroundColor: `${getPriorityColor(task.priority)}15`,
                                color: getPriorityColor(task.priority),
                                fontWeight: 600
                              }} 
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pendingTasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ p: 2, textAlign: 'right', borderTop: '1px solid #e0e0e0' }}>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => navigate('/reservation-support')}
                  sx={{ 
                    color: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  View All Tasks
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ 
              height: '100%',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
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
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EventNoteIcon />}
                      onClick={() => navigate('/reservation-support')}
                      sx={{
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#1565c0' },
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Reservation Support
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<HomeWorkIcon />}
                      onClick={() => navigate('/properties')}
                      sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Verify Properties
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate('/guests')}
                      sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Manage Users
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
