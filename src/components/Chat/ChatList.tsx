import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Badge, 
  Divider,
  Paper,
  CircularProgress,
  ButtonBase
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '../../contexts/ChatContext';
import { Colors } from '../constants';

const ChatList: React.FC = () => {
  const { chats, setCurrentChat, currentChat, loading } = useChat();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (chats.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="textSecondary">No conversations yet</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ height: '100%', overflow: 'auto' }}>
      <List disablePadding>
        {chats.map((chat, index) => {
          // Find the other participant (not the current user)
          const otherParticipantId = chat.participants.find(
            id => id !== localStorage.getItem('userId')
          ) || '';
          const otherParticipantName = chat.participantNames[otherParticipantId] || 'User';
          
          return (
            <React.Fragment key={chat.id}>
              <ListItem 
                component="li"
                disableGutters
                sx={{ 
                  py: 0,
                  px: 0,
                  backgroundColor: currentChat?.id === chat.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                }}
              >
                <ButtonBase
                  onClick={() => setCurrentChat(chat)}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    py: 2,
                    px: 3,
                    borderRadius: 1,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      badgeContent={Object.values(chat.unreadCount).reduce((sum, val) => sum + val, 0)}
                      invisible={Object.values(chat.unreadCount).reduce((sum, val) => sum + val, 0) === 0}
                      overlap="circular"
                    >
                      <Avatar sx={{ bgcolor: Colors.raspberry }}>
                        {otherParticipantName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={(chat.unreadCount[localStorage.getItem('userId') as string] ?? 0) > 0 ? 700 : 500}>
                          {otherParticipantName}
                        </Typography>
                        {chat.lastMessageTimestamp && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(chat.lastMessageTimestamp), { addSuffix: true })}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {chat.propertyName && (
                          <Typography variant="caption" color="primary" display="block">
                            Re: {chat.propertyName}
                          </Typography>
                        )}
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                            fontWeight: (chat.unreadCount[localStorage.getItem('userId') as string] > 0 ? 600 : 400)
                          }}
                        >
                          {chat.lastMessage || 'Start a conversation...'}
                        </Typography>
                      </Box>
                    }
                  />
                </ButtonBase>
              </ListItem>
              {index < chats.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default ChatList;