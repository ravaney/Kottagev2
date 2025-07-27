import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Typography, 
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import { Colors } from '../constants';
import { auth, database } from '../../firebase';
import { ref, push, set, update } from 'firebase/database';

interface ContactHostButtonProps {
  hostId: string;
  hostName: string;
  propertyId: string;
  propertyName: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const ContactHostButton: React.FC<ContactHostButtonProps> = ({
  hostId,
  hostName,
  propertyId,
  propertyName,
  variant = 'contained',
  size = 'medium',
  fullWidth = false
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { startNewChat, sendMessage } = useChat();
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage('');
  };

  const handleSend = async () => {
    if (message.trim() === '') return;
    
    setLoading(true);
    try {
      // Check if user is logged in
      if (!auth.currentUser) {
        // Redirect to login
        alert('Please log in to contact the host');
        navigate('/Login', { state: { returnUrl: window.location.pathname } });
        return;
      }
      
      // Create a direct message in the database
      const timestamp = Date.now();
      const chatId = await startNewChat(hostId, hostName, propertyId, propertyName);
      console.log('Chat created with ID:', chatId);
      
      // Create the message directly in the database
      const messageData = {
        text: message,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'User',
        timestamp,
        read: false
      };
      
      // Add message directly to the database
      const messagesRef = ref(database, `messages/${chatId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, messageData);
      console.log('Message saved directly to database');
      
      // Update chat metadata for both participants
      const participants = [auth.currentUser.uid, hostId];
      for (const participantId of participants) {
        const userChatRef = ref(database, `userChats/${participantId}/${chatId}`);
        const updates: Record<string, any> = {
          lastMessage: message,
          lastMessageTimestamp: timestamp
        };
        
        if (participantId !== auth.currentUser.uid) {
          updates.unreadCount = { [participantId]: 1 };
        } else {
          updates.unreadCount = { [auth.currentUser.uid]: 0 };
        }
        
        await update(userChatRef, updates);
        console.log(`Updated chat metadata for ${participantId}`);
      }
      
      // Close dialog
      handleClose();
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Could not start chat. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': { 
            bgcolor: 'rgba(255,255,255,0.3)',
            transform: 'scale(1.05)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        <ChatIcon />
      </IconButton>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: Colors.blue, color: 'white' }}>
          Contact Host about {propertyName}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Send a message to {hostName} about {propertyName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Ask any questions you have about the property, amenities, or booking details.
            </Typography>
          </Box>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            placeholder="Hi, I'm interested in your property and have a few questions..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            variant="contained" 
            disabled={message.trim() === '' || loading}
            sx={{ 
              bgcolor: Colors.blue,
              '&:hover': { bgcolor: Colors.raspberry }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContactHostButton;