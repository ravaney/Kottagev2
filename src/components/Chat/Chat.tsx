import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { ChatProvider } from '../../contexts/ChatContext';
import { Colors } from '../constants';

interface ChatProps {
  propertyId?: string;
  propertyName?: string;
  hostId?: string;
  hostName?: string;
}

const Chat: React.FC<ChatProps> = ({ propertyId, propertyName, hostId, hostName }) => {
  return (
    <ChatProvider>
      <Box sx={{ height: '600px', width: '100%' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Chat List */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: Colors.blue, color: 'white', borderRadius: '4px 4px 0 0' }}>
                <Typography variant="h6" fontWeight={600}>Conversations</Typography>
              </Box>
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <ChatList />
              </Box>
            </Box>
          </Grid>
          
          {/* Chat Window */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <ChatWindow />
          </Grid>
        </Grid>
      </Box>
    </ChatProvider>
  );
};

export default Chat;