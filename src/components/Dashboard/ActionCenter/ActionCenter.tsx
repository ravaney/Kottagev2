import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Colors } from '../../constants';
import MaintenanceRequestsCard from './MaintenanceRequestsCard';

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
      <Paper elevation={3} sx={{ p: 2 }}>
         <MaintenanceRequestsCard
              requests={[
                {
                  id: '1',
                  propertyName: 'Beach House',
                  type: 'cleaning',
                  description: 'Regular cleaning service needed after guest checkout on June 20.',
                  status: 'scheduled',
                  priority: 'medium',
                  createdAt: 'Jun 15, 2023',
                  scheduledFor: 'Jun 20, 2023',
                  assignedTo: 'Cleaning Service Inc.'
                },
                {
                  id: '2',
                  propertyName: 'Mountain Cabin',
                  type: 'repair',
                  description: 'Leaking faucet in master bathroom needs repair.',
                  status: 'pending',
                  priority: 'high',
                  createdAt: 'Jun 14, 2023'
                },
                {
                  id: '3',
                  propertyName: 'City Apartment',
                  type: 'other',
                  description: 'Replace light bulbs in living room and bedroom.',
                  status: 'completed',
                  priority: 'low',
                  createdAt: 'Jun 10, 2023',
                  scheduledFor: 'Jun 12, 2023',
                  assignedTo: 'John (Maintenance)'
                }
              ]}
              onNewRequest={() => console.log('New request')}
              onUpdateStatus={(id, status) => console.log(`Update status for ${id}: ${status}`)}
            />
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