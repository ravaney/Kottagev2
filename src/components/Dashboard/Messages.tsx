import React from 'react';
import { Box, Paper, Typography, List, ListItem, Avatar, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { Colors } from '../constants';

export default function Messages() {
  const messages = [
    {
      id: 1,
      sender: 'John Doe',
      subject: 'Question about Villa Velha',
      preview: 'Hi, I have a question about the check-in process...',
      time: '10 min ago',
      unread: true
    },
    {
      id: 2,
      sender: 'Jane Smith',
      subject: 'Beach House Booking',
      preview: 'Thank you for confirming my reservation. Looking forward...',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      sender: 'Mike Johnson',
      subject: 'Mountain Cabin Review',
      preview: 'Had an amazing stay at your property. Would love to...',
      time: '1 day ago',
      unread: false
    }
  ];

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <MessageIcon sx={{ color: Colors.blue, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} color={Colors.blue}>
            Messages
          </Typography>
          <Chip label="2 Unread" color="primary" size="small" />
        </Box>
        
        <List>
          {messages.map((message) => (
            <ListItem 
              key={message.id} 
              sx={{ 
                mb: 2, 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 2,
                backgroundColor: message.unread ? '#f5f5f5' : 'transparent'
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: Colors.raspberry }}>
                  {message.sender.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={message.unread ? 700 : 500}>
                      {message.sender}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {message.time}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" fontWeight={message.unread ? 600 : 400} sx={{ mb: 0.5 }}>
                      {message.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {message.preview}
                    </Typography>
                  </Box>
                }
              />
              {message.unread && (
                <Box sx={{ ml: 2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: Colors.blue }} />
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}