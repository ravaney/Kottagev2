import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import CottageRoundedIcon from '@mui/icons-material/CottageRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { alpha } from '@mui/material/styles';

import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { useChat } from '../../contexts/ChatContext';
import { Colors } from '../constants';

const ChatWorkspace = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    chats,
    currentChat,
    setCurrentChat,
    currentUserId,
    totalUnreadMessages,
  } = useChat();
  const [mobileView, setMobileView] = React.useState<'list' | 'chat'>('list');

  React.useEffect(() => {
    if (!chats.length) {
      if (currentChat) {
        setCurrentChat(null);
      }
      setMobileView('list');
      return;
    }

    const currentChatStillExists = currentChat
      ? chats.some(chat => chat.id === currentChat.id)
      : false;

    if (currentChat && !currentChatStillExists) {
      setCurrentChat(null);
      setMobileView('list');
    }
  }, [chats, currentChat, setCurrentChat]);

  React.useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (!currentChat) {
      setMobileView('list');
    }
  }, [currentChat, isMobile]);

  React.useEffect(() => {
    return () => {
      setCurrentChat(null);
    };
  }, [setCurrentChat]);

  const unreadConversations = chats.filter(
    chat => (chat.unreadCount?.[currentUserId] || 0) > 0
  ).length;

  const propertyThreads = chats.filter(
    chat => !!chat.propertyId || !!chat.propertyName
  ).length;

  const showListPane = !isMobile || mobileView === 'list';
  const showChatPane = !isMobile || mobileView === 'chat';

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg, #f7fbfd 0%, #ffffff 180px, #ffffff 100%)',
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, md: 1.75 },
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          background:
            'linear-gradient(180deg, rgba(0,123,167,0.07) 0%, rgba(0,123,167,0.02) 100%)',
          flexShrink: 0,
        }}
      >
        <Stack spacing={1.2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Typography variant="h6" fontWeight={700} color="#102133">
              Inbox
            </Typography>

            <Chip
              icon={<MailOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 28,
                py: 0,
                fontWeight: 700,
                color: totalUnreadMessages > 0 ? Colors.raspberry : '#166534',
                backgroundColor:
                  totalUnreadMessages > 0
                    ? alpha(Colors.raspberry, 0.1)
                    : 'rgba(22,101,52,0.08)',
                borderColor:
                  totalUnreadMessages > 0
                    ? alpha(Colors.raspberry, 0.18)
                    : 'rgba(22,101,52,0.14)',
              }}
              label={
                totalUnreadMessages > 0
                  ? `${totalUnreadMessages} unread`
                  : 'All caught up'
              }
            />
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              icon={<ForumRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 28,
                py: 0,
                fontWeight: 700,
                backgroundColor: alpha(Colors.cerulean, 0.08),
                color: '#102133',
                borderColor: alpha(Colors.cerulean, 0.16),
              }}
              label={chats.length + 'conversations'}
            />
            <Chip
              icon={<MarkEmailUnreadRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 28,
                py: 0,
                fontWeight: 700,
                backgroundColor: alpha(Colors.raspberry, 0.08),
                color: Colors.raspberry,
                borderColor: alpha(Colors.raspberry, 0.16),
              }}
              label={unreadConversations + 'unread threads'}
            />
            <Chip
              icon={<CottageRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 28,
                py: 0,
                fontWeight: 700,
                backgroundColor: alpha('#0f766e', 0.08),
                color: '#0f766e',
                borderColor: alpha('#0f766e', 0.16),
              }}
              label={propertyThreads + 'property chats'}
            />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: showListPane && showChatPane ? '360px minmax(0, 1fr)' : '1fr',
          },
        }}
      >
        {showListPane && (
          <Box
            sx={{
              minHeight: 0,
              overflow: 'hidden',
              borderRight: {
                xs: 'none',
                md: '1px solid rgba(15,23,42,0.08)',
              },
              backgroundColor: '#fbfdff',
            }}
          >
            <ChatList
              onConversationSelect={() => {
                if (isMobile) {
                  setMobileView('chat');
                }
              }}
            />
          </Box>
        )}

        {showChatPane && (
          <Box
            sx={{
              minHeight: 0,
              overflow: 'hidden',
              backgroundColor: '#ffffff',
            }}
          >
            <ChatWindow
              showBackButton={isMobile}
              onBack={() => setMobileView('list')}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const Chat: React.FC = () => {
  return <ChatWorkspace />;
};

export default Chat;
