import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { alpha } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';

import { useChat } from '../../contexts/ChatContext';
import { auth } from '../../firebase';
import { Colors } from '../constants';
import PillButton from '../common/PillButton';

interface ChatWindowProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function ChatWindow({
  onBack,
  showBackButton = false,
}: ChatWindowProps) {
  const { currentChat, messages, sendMessage, loading, markChatAsRead } =
    useChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChat?.id]);

  useEffect(() => {
    if (!currentChat?.id) {
      return;
    }

    void markChatAsRead(currentChat.id);
  }, [currentChat?.id, messages.length, markChatAsRead]);

  const handleSendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (newMessage.trim() === '' || sending) {
      return;
    }

    try {
      setSending(true);
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  if (!currentChat) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          background:
            'linear-gradient(180deg, rgba(0,123,167,0.04) 0%, rgba(255,255,255,0.98) 100%)',
        }}
      >
        <Box
          sx={{
            width: 68,
            height: 68,
            borderRadius: 4,
            display: 'grid',
            placeItems: 'center',
            mb: 2,
            backgroundColor: 'rgba(0,123,167,0.1)',
            color: Colors.cerulean,
          }}
        >
          <MailOutlineRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.75 }}>
          Select a conversation
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360 }}
        >
          Review guest questions, respond to booking-related requests, and keep
          every stay conversation in one place.
        </Typography>
      </Box>
    );
  }

  const otherParticipantId =
    currentChat.participants.find(id => id !== currentUser?.uid) || '';
  const otherParticipantName =
    currentChat.participantNames[otherParticipantId] || 'User';

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 2,
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        <Stack spacing={1.35}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {showBackButton && (
              <IconButton onClick={onBack} size="small">
                <ArrowBackRoundedIcon />
              </IconButton>
            )}

            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: Colors.cerulean,
                fontWeight: 700,
              }}
            >
              {otherParticipantName.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#102133">
                {otherParticipantName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {messages.length > 0
                  ? `Last activity ${formatDistanceToNow(
                      new Date(messages[messages.length - 1].timestamp),
                      { addSuffix: true }
                    )}`
                  : 'Conversation started'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {currentChat.propertyName && (
              <Chip
                icon={<HomeWorkOutlinedIcon />}
                sx={{
                  fontWeight: 700,
                  backgroundColor: alpha(Colors.cerulean, 0.1),
                  color: Colors.cerulean,
                  borderColor: alpha(Colors.cerulean, 0.18),
                }}
                label={currentChat.propertyName}
              />
            )}
            <Chip
              icon={<ForumOutlinedIcon />}
              sx={{
                fontWeight: 700,
                backgroundColor: 'rgba(15,23,42,0.05)',
                color: '#334155',
              }}
              label={
                messages.length + `{message${messages.length === 1 ? '' : 's'}}`
              }
            />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: { xs: 1.5, md: 2.5 },
          py: 2,
          background: 'linear-gradient(180deg, #f7fbfd 0%, #f4f7fb 100%)',
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress size={30} />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              px: 3,
            }}
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3.5,
                display: 'grid',
                placeItems: 'center',
                mb: 1.5,
                backgroundColor: 'rgba(0,123,167,0.1)',
                color: Colors.cerulean,
              }}
            >
              <MailOutlineRoundedIcon />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send the first reply to start this conversation.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.4}>
            {messages.map(message => {
              const isCurrentUser = message.senderId === currentUser?.uid;

              return (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Stack
                    direction={isCurrentUser ? 'row-reverse' : 'row'}
                    spacing={1}
                    alignItems="flex-end"
                    sx={{ maxWidth: '82%' }}
                  >
                    {!isCurrentUser && (
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: Colors.raspberry,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                        }}
                      >
                        {message.senderName.charAt(0).toUpperCase()}
                      </Avatar>
                    )}

                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          px: 1.6,
                          py: 1.25,
                          borderRadius: 3,
                          backgroundColor: isCurrentUser
                            ? Colors.cerulean
                            : '#ffffff',
                          color: isCurrentUser ? '#ffffff' : '#102133',
                          border: isCurrentUser
                            ? 'none'
                            : '1px solid rgba(15,23,42,0.08)',
                          boxShadow: isCurrentUser
                            ? '0 14px 26px rgba(0,123,167,0.18)'
                            : '0 10px 24px rgba(15,23,42,0.06)',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
                        >
                          {message.text}
                        </Typography>
                      </Paper>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          mt: 0.6,
                          textAlign: isCurrentUser ? 'right' : 'left',
                          px: 0.4,
                        }}
                      >
                        {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: { xs: 1.5, md: 2 },
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        <Stack spacing={1.2}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            placeholder="Write a helpful reply to your guest..."
            value={newMessage}
            onChange={event => setNewMessage(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void handleSendMessage();
              }
            }}
            variant="outlined"
            autoComplete="off"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#f8fafc',
              },
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1.5}
          >
            <Typography variant="caption" color="text.secondary">
              Press Enter to send. Shift + Enter for a new line.
            </Typography>

            <PillButton
              type="submit"
              variant="contained"
              endIcon={sending ? undefined : <SendRoundedIcon />}
              disabled={newMessage.trim() === '' || sending}
              sx={{
                minWidth: 132,
                py: 1,
                backgroundColor: Colors.cerulean,
                borderColor: Colors.cerulean,
                color: '#fff',
                '&:hover': {
                  backgroundColor: Colors.raspberry,
                  borderColor: Colors.raspberry,
                },
              }}
            >
              {sending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                'Send'
              )}
            </PillButton>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
