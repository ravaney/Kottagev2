import React from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import CottageRoundedIcon from '@mui/icons-material/CottageRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { alpha } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { Colors } from '../../constants';
import { PropertyInquiry } from '../../../hooks/useHostInquiries';
import PillButton from '../../common/PillButton';

interface HostInquiryInboxProps {
  inquiries: PropertyInquiry[];
  loading: boolean;
  unreadCount: number;
  onMarkReviewed: (inquiryId: string) => Promise<void>;
  onMarkReplied: (inquiryId: string) => Promise<void>;
  onMarkAllReviewed: () => Promise<void>;
}

const getStatusLabel = (status: PropertyInquiry['status']) => {
  if (status === 'replied') {
    return 'Replied';
  }

  if (status === 'reviewed') {
    return 'Reviewed';
  }

  return 'New';
};

export default function HostInquiryInbox({
  inquiries,
  loading,
  unreadCount,
  onMarkReviewed,
  onMarkReplied,
  onMarkAllReviewed,
}: HostInquiryInboxProps) {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={420}
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
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700} color="#102133">
              Lead Inquiries
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New property questions from potential guests.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              sx={{
                height: 28,
                py: 0,
                fontWeight: 700,
                backgroundColor: alpha(Colors.cerulean, 0.08),
                color: '#102133',
                borderColor: alpha(Colors.cerulean, 0.16),
              }}
              label={inquiries.length + 'total'}
            />
            <Chip
              sx={{
                height: 28,
                py: 0,
                fontWeight: 700,
                backgroundColor: alpha(Colors.raspberry, 0.08),
                color: Colors.raspberry,
                borderColor: alpha(Colors.raspberry, 0.16),
              }}
              label={unreadCount + 'new'}
            />

            {unreadCount > 0 && (
              <PillButton
                onClick={() => {
                  void onMarkAllReviewed();
                }}
              >
                Mark all reviewed
              </PillButton>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 1.5,
        }}
      >
        {inquiries.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              alignItems: 'center',
            }}
          >
            Property inquiries from new guests will appear here.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {inquiries.map(inquiry => (
              <Paper
                key={inquiry.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${
                    inquiry.status === 'new'
                      ? alpha(Colors.raspberry, 0.22)
                      : 'rgba(15,23,42,0.08)'
                  }`,
                  boxShadow:
                    inquiry.status === 'new'
                      ? `0 16px 34px ${alpha(Colors.raspberry, 0.08)}`
                      : '0 12px 28px rgba(15,23,42,0.06)',
                }}
              >
                <Stack spacing={1.35}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        color="#102133"
                      >
                        {inquiry.guestName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(new Date(inquiry.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </Box>

                    <Chip
                      sx={{
                        fontWeight: 700,
                        backgroundColor:
                          inquiry.status === 'new'
                            ? alpha(Colors.raspberry, 0.1)
                            : inquiry.status === 'replied'
                              ? alpha('#166534', 0.1)
                              : 'rgba(15,23,42,0.06)',
                        color:
                          inquiry.status === 'new'
                            ? Colors.raspberry
                            : inquiry.status === 'replied'
                              ? '#166534'
                              : '#475569',
                        borderColor:
                          inquiry.status === 'new'
                            ? alpha(Colors.raspberry, 0.18)
                            : inquiry.status === 'replied'
                              ? alpha('#166534', 0.18)
                              : 'rgba(15,23,42,0.1)',
                      }}
                      label={getStatusLabel(inquiry.status)}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip
                      icon={<CottageRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        maxWidth: '100%',
                        backgroundColor: alpha(Colors.cerulean, 0.1),
                        color: Colors.cerulean,
                        fontWeight: 700,
                        borderColor: alpha(Colors.cerulean, 0.18),
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      label={inquiry.propertyName}
                    />
                    <Chip
                      icon={<EmailRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 600 }}
                      label={inquiry.guestEmail}
                    />
                    {inquiry.guestPhone && (
                      <Chip
                        icon={<PhoneRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{ fontWeight: 600 }}
                        label={inquiry.guestPhone}
                      />
                    )}
                  </Stack>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      backgroundColor: '#f8fafc',
                      border: '1px solid rgba(15,23,42,0.06)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#223245',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {inquiry.message}
                    </Typography>
                  </Box>

                  <Divider />

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleRoundedIcon
                        sx={{ fontSize: 18, color: '#64748b' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Initial inquiry from the property page
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                    >
                      <PillButton
                        component="a"
                        href={`mailto:${inquiry.guestEmail}?subject=${encodeURIComponent(
                          `Re: ${inquiry.propertyName}`
                        )}`}
                        onClick={() => {
                          void onMarkReplied(inquiry.id);
                        }}
                      >
                        Reply by email
                      </PillButton>
                      {inquiry.status === 'new' && (
                        <PillButton
                          startIcon={<MarkEmailReadRoundedIcon />}
                          onClick={() => {
                            void onMarkReviewed(inquiry.id);
                          }}
                          sx={{
                            color: Colors.raspberry,
                            borderColor: alpha(Colors.raspberry, 0.35),
                            '&:hover': {
                              backgroundColor: alpha(Colors.raspberry, 0.06),
                            },
                          }}
                        >
                          Mark reviewed
                        </PillButton>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
