import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { Colors } from '../../constants';
import { Chat } from '../../Chat';
import { ChatProvider } from '../../../contexts/ChatContext';
import { auth } from '../../../firebase';

export default function Messages() {
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <ChatProvider>
          <Chat />
        </ChatProvider>
      </Paper>
    </Box>
  );
}