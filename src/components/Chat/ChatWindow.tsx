import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  Divider,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '../../contexts/ChatContext';
import { auth } from '../../firebase';
import { Colors } from '../constants';

const ChatWindow: React.FC = () => {
  const { currentChat, messages, sendMessage, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    sendMessage(newMessage);
    setNewMessage('');
  };

  if (!currentChat) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        height="100%" 
        sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 3 }}
      >
        <Typography variant="h6" color="textSecondary">
          Select a conversation or start a new one
        </Typography>
      </Box>
    );
  }

  // Find the other participant (not the current user)
  const otherParticipantId = currentChat.participants.find(
    id => id !== currentUser?.uid
  ) || '';
  const otherParticipantName = currentChat.participantNames[otherParticipantId] || 'User';

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Chat Header */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: Colors.blue, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Avatar sx={{ bgcolor: Colors.raspberry }}>
          {otherParticipantName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">{otherParticipantName}</Typography>
          {currentChat.propertyName && (
            <Typography variant="caption">
              Re: {currentChat.propertyName}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Divider />
      
      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: '#f5f5f5'
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={30} />
          </Box>
        ) : messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="textSecondary">No messages yet. Start a conversation!</Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser?.uid;
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1,
                    maxWidth: '80%'
                  }}
                >
                  {!isCurrentUser && (
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: Colors.raspberry 
                      }}
                    >
                      {message.senderName.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isCurrentUser ? Colors.blue : 'white',
                        color: isCurrentUser ? 'white' : 'inherit'
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Paper>
                    <Typography 
                      variant="caption" 
                      color="textSecondary"
                      sx={{ 
                        display: 'block', 
                        mt: 0.5,
                        textAlign: isCurrentUser ? 'right' : 'left'
                      }}
                    >
                      {message.timestamp && formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message Input */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
          size="small"
          autoComplete="off"
        />
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={newMessage.trim() === ''}
          sx={{ bgcolor: Colors.blue, color: 'white', '&:hover': { bgcolor: Colors.raspberry } }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWindow;