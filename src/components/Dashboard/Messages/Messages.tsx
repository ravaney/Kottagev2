import React from 'react';
import {
  Badge,
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import { Chat } from '../../Chat';
import { auth } from '../../../firebase';
import { useUserClaims } from '../../../hooks/useUserClaims';
import {
  PropertyInquiryStatus,
  useHostInquiries,
} from '../../../hooks/useHostInquiries';
import HostInquiryInbox from './HostInquiryInbox';

export default function Messages() {
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'conversations' | 'inquiries'>(
    'conversations'
  );
  const { claims } = useUserClaims();
  const hostId = auth.currentUser?.uid || null;
  const {
    inquiries,
    unreadCount,
    loading: inquiriesLoading,
    updateInquiryStatus,
    markAllAsReviewed,
  } = useHostInquiries(hostId);
  const isHost = claims?.role === 'host' || claims?.userType === 'host';

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          border: '1px solid rgba(15,23,42,0.08)',
          boxShadow: '0 18px 44px rgba(15,23,42,0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        {isHost && (
          <Box
            sx={{
              px: 2,
              borderBottom: '1px solid rgba(15,23,42,0.08)',
              backgroundColor: '#ffffff',
              flexShrink: 0,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, nextValue) => setActiveTab(nextValue)}
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontWeight: 700,
                },
              }}
            >
              <Tab value="conversations" label="Conversations" />
              <Tab
                value="inquiries"
                label={
                  <Badge
                    color="secondary"
                    badgeContent={unreadCount}
                    invisible={unreadCount === 0}
                  >
                    Lead Inquiries
                  </Badge>
                }
              />
            </Tabs>
          </Box>
        )}

        <Box sx={{ flex: 1, minHeight: 0 }}>
          {!isHost || activeTab === 'conversations' ? (
            <Chat />
          ) : (
            <HostInquiryInbox
              inquiries={inquiries}
              loading={inquiriesLoading}
              unreadCount={unreadCount}
              onMarkReviewed={(inquiryId: string) =>
                updateInquiryStatus(inquiryId, 'reviewed' as PropertyInquiryStatus)
              }
              onMarkReplied={(inquiryId: string) =>
                updateInquiryStatus(inquiryId, 'replied' as PropertyInquiryStatus)
              }
              onMarkAllReviewed={markAllAsReviewed}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}
