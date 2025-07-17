import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Alert } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Colors } from '../constants';

export default function ActionCenter() {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Payment Overdue',
      message: 'Villa Velha reservation payment is 2 days overdue',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Booking Request',
      message: 'Beach House has a new booking request for next month',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Property Listed',
      message: 'Mountain Cabin has been successfully listed',
      time: '1 day ago'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'info': return <InfoIcon sx={{ color: Colors.blue }} />;
      case 'success': return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      default: return <NotificationsIcon />;
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <NotificationsIcon sx={{ color: Colors.blue, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} color={Colors.blue}>
            Action Center
          </Typography>
          <Chip label="3 New" color="error" size="small" />
        </Box>
        
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <ListItemIcon>
                {getIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}