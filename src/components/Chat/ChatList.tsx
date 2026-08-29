import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { alpha } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

import { useChat } from '../../contexts/ChatContext';
import { Colors } from '../constants';

interface ChatListProps {
  onConversationSelect?: () => void;
}

export default function ChatList({ onConversationSelect }: ChatListProps) {
  const { chats, setCurrentChat, currentChat, loading, currentUserId } =
    useChat();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'property'>(
    'all'
  );

  const filteredChats = chats.filter(chat => {
    const otherParticipantId =
      chat.participants.find(id => id !== currentUserId) || '';
    const otherParticipantName =
      chat.participantNames[otherParticipantId] || 'User';
    const unreadForCurrentUser = chat.unreadCount?.[currentUserId] || 0;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      otherParticipantName.toLowerCase().includes(normalizedQuery) ||
      chat.propertyName?.toLowerCase().includes(normalizedQuery) ||
      chat.lastMessage?.toLowerCase().includes(normalizedQuery);

    if (!matchesQuery) {
      return false;
    }

    if (filter === 'unread') {
      return unreadForCurrentUser > 0;
    }

    if (filter === 'property') {
      return !!chat.propertyId || !!chat.propertyName;
    }

    return true;
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          backgroundColor: '#fbfdff',
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#102133">
              Conversations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredChats.length} of {chats.length} conversation
              {chats.length === 1 ? '' : 's'}
            </Typography>
          </Box>

          <TextField
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search guest, property, or message"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
              },
            }}
          />

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              clickable
              icon={<ForumOutlinedIcon />}
              label="All"
              onClick={() => setFilter('all')}
              color={filter === 'all' ? 'primary' : 'default'}
              variant={filter === 'all' ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              clickable
              icon={<DraftsOutlinedIcon />}
              label="Unread"
              onClick={() => setFilter('unread')}
              color={filter === 'unread' ? 'secondary' : 'default'}
              variant={filter === 'unread' ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 700,
                ...(filter === 'unread' && {
                  backgroundColor: Colors.raspberry,
                  color: 'white',
                }),
              }}
            />
            <Chip
              clickable
              icon={<HomeWorkOutlinedIcon />}
              label="Property"
              onClick={() => setFilter('property')}
              color={filter === 'property' ? 'primary' : 'default'}
              variant={filter === 'property' ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700 }}
            />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#fbfdff',
        }}
      >
        {filteredChats.length === 0 ? (
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
                width: 52,
                height: 52,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                mb: 1.5,
                backgroundColor: 'rgba(0,123,167,0.08)',
                color: Colors.cerulean,
              }}
            >
              <ForumOutlinedIcon />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              {chats.length === 0 ? 'No conversations yet' : 'No matches found'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {chats.length === 0
                ? 'Guest inquiries and booking conversations will appear here.'
                : 'Try a different search or switch filters to see more threads.'}
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider />} sx={{ p: 1.25 }}>
            {filteredChats.map(chat => {
              const otherParticipantId =
                chat.participants.find(id => id !== currentUserId) || '';
              const otherParticipantName =
                chat.participantNames[otherParticipantId] || 'User';
              const unreadForCurrentUser = chat.unreadCount?.[currentUserId] || 0;
              const isSelected = currentChat?.id === chat.id;

              return (
                <ButtonBase
                  key={chat.id}
                  onClick={() => {
                    setCurrentChat(chat);
                    onConversationSelect?.();
                  }}
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    borderRadius: 3,
                    px: 1.25,
                    py: 1.35,
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    backgroundColor: isSelected
                      ? alpha(Colors.cerulean, 0.09)
                      : 'transparent',
                    border: `1px solid ${
                      isSelected
                        ? alpha(Colors.cerulean, 0.22)
                        : 'transparent'
                    }`,
                    '&:hover': {
                      backgroundColor: isSelected
                        ? alpha(Colors.cerulean, 0.12)
                        : 'rgba(15,23,42,0.04)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.4} sx={{ width: '100%' }}>
                    <Badge
                      color="error"
                      overlap="circular"
                      badgeContent={unreadForCurrentUser}
                      invisible={unreadForCurrentUser === 0}
                    >
                      <Avatar
                        sx={{
                          width: 46,
                          height: 46,
                          bgcolor: isSelected ? Colors.cerulean : Colors.raspberry,
                          fontWeight: 700,
                        }}
                      >
                        {otherParticipantName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                        sx={{ mb: 0.35 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={unreadForCurrentUser > 0 ? 800 : 700}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#102133',
                          }}
                        >
                          {otherParticipantName}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flexShrink: 0, pt: 0.25 }}
                        >
                          {chat.lastMessageTimestamp
                            ? formatDistanceToNow(
                                new Date(chat.lastMessageTimestamp),
                                { addSuffix: true }
                              )
                            : ''}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.75}
                        useFlexGap
                        flexWrap="wrap"
                        sx={{ mb: 0.8 }}
                      >
                        {chat.propertyName && (
                          <Chip
                            size="small"
                            label={chat.propertyName}
                            sx={{
                              height: 22,
                              maxWidth: '100%',
                              fontWeight: 700,
                              backgroundColor: alpha(Colors.cerulean, 0.1),
                              color: Colors.cerulean,
                              '& .MuiChip-label': {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                          />
                        )}
                        {unreadForCurrentUser > 0 && (
                          <Chip
                            size="small"
                            label={`${unreadForCurrentUser} new`}
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              backgroundColor: alpha(Colors.raspberry, 0.1),
                              color: Colors.raspberry,
                            }}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          color: unreadForCurrentUser > 0 ? '#223245' : '#64748b',
                          fontWeight: unreadForCurrentUser > 0 ? 700 : 500,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.35,
                        }}
                      >
                        {chat.lastMessage || 'Start a conversation...'}
                      </Typography>
                    </Box>
                  </Stack>
                </ButtonBase>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
