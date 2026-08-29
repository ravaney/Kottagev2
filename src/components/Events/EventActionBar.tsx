import React from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth,
  ConfirmationNumber,
  LocalOffer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  EventRecord,
  getEventClosedActionMessage,
  isEventClosedForGuestActions,
} from '../../hooks/eventHooks';
import { useAuth, useEventWallet } from '../../hooks';
import {
  downloadEventCalendarFile,
  getEventGoogleCalendarUrl,
} from '../../utils/calendarUtils';
import PillButton from '../common/PillButton';
import BuyTicketsDialog from './BuyTicketsDialog';

interface EventActionBarProps {
  event: EventRecord;
  compact?: boolean;
  cardLayout?: boolean;
}

export default function EventActionBar({
  event,
  compact = false,
  cardLayout = false,
}: EventActionBarProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    requiresAuth?: boolean;
  } | null>(null);
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const { savedCouponIds, toggleSavedCoupon } = useEventWallet();

  const hasSavedCoupon = savedCouponIds.includes(event.id);
  const eventActionsClosed = isEventClosedForGuestActions(event);
  const eventClosedMessage = getEventClosedActionMessage(event);
  const buttonSize = compact || cardLayout ? 'small' : 'medium';
  const secondaryActionButtonSx = {
    width: 38,
    height: 38,
    border: '1px solid',
    borderColor: 'rgba(15,23,42,0.16)',
    color: '#111827',
    backgroundColor: 'background.paper',
    '&:hover': {
      backgroundColor: 'rgba(15,23,42,0.04)',
      borderColor: 'rgba(15,23,42,0.28)',
    },
    '&.Mui-disabled': {
      borderColor: 'rgba(15,23,42,0.08)',
    },
  };

  const handleSaveCoupon = async () => {
    if (eventActionsClosed && !hasSavedCoupon) {
      setToast({ message: eventClosedMessage });
      return;
    }

    if (!event.coupon) {
      setToast({ message: 'No coupon is available for this event yet.' });
      return;
    }

    if (!firebaseUser) {
      setToast({
        message: 'Sign in to save event coupons to your account.',
        requiresAuth: true,
      });
      return;
    }

    try {
      const nextSavedCoupons = await toggleSavedCoupon(event.id);
      const couponWasSaved = nextSavedCoupons.includes(event.id);

      if (couponWasSaved && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(event.coupon.code);
        } catch (error) {
          console.warn('Unable to copy coupon code', error);
        }
      }

      setToast(
        couponWasSaved
          ? {
              message: `Coupon saved${
                event.coupon.code ? `: ${event.coupon.code}` : '.'
              }`,
            }
          : { message: 'Coupon removed from saved offers.' }
      );
    } catch (error) {
      console.error('Unable to update saved coupon', error);
      setToast({ message: 'We could not save that coupon right now.' });
    }
  };

  const handleAddToCalendar = () => {
    if (eventActionsClosed) {
      setToast({ message: eventClosedMessage });
      return;
    }

    downloadEventCalendarFile(event);
    window.open(
      getEventGoogleCalendarUrl(event),
      '_blank',
      'noopener,noreferrer'
    );
    setToast({
      message:
        'Calendar file downloaded. Google Calendar has been opened in a new tab.',
    });
  };

  return (
    <>
      <Stack
        direction={
          cardLayout ? 'row' : { xs: 'column', sm: compact ? 'column' : 'row' }
        }
        spacing={cardLayout ? 0.75 : 1.2}
        alignItems={cardLayout ? 'center' : undefined}
        sx={{ width: compact || cardLayout ? '100%' : 'auto' }}
      >
        <Tooltip
          title={
            eventActionsClosed
              ? eventClosedMessage
              : !event.ticketTiers.length
                ? 'Tickets are not available yet.'
                : ''
          }
        >
          <Box sx={{ width: compact && !cardLayout ? '100%' : 'auto' }}>
            <PillButton
              fullWidth={compact && !cardLayout}
              variant="contained"
              size={buttonSize}
              startIcon={<ConfirmationNumber />}
              onClick={() => {
                if (eventActionsClosed) {
                  setToast({ message: eventClosedMessage });
                  return;
                }

                if (!firebaseUser) {
                  setToast({
                    message:
                      'Sign in to save ticket reservations to your account.',
                    requiresAuth: true,
                  });
                  return;
                }

                setDialogOpen(true);
              }}
              disabled={eventActionsClosed || !event.ticketTiers.length}
              sx={{
                minHeight: cardLayout ? 38 : undefined,
                px: cardLayout ? 1.5 : undefined,
                whiteSpace: 'nowrap',
                backgroundColor: '#111827',
                borderColor: '#111827',
                color: '#fff',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#1f2937',
                  borderColor: '#1f2937',
                  boxShadow: 'none',
                },
              }}
            >
              Buy Tickets
            </PillButton>
          </Box>
        </Tooltip>
        <Tooltip
          title={
            eventActionsClosed && !hasSavedCoupon
              ? eventClosedMessage
              : event.coupon
                ? event.coupon.discountText
                : 'This event does not have a coupon yet'
          }
        >
          <Box sx={{ width: compact && !cardLayout ? '100%' : 'auto' }}>
            {cardLayout ? (
              <IconButton
                aria-label={hasSavedCoupon ? 'Coupon saved' : 'Save coupon'}
                size="small"
                onClick={handleSaveCoupon}
                disabled={eventActionsClosed && !hasSavedCoupon}
                sx={{
                  ...secondaryActionButtonSx,
                  color: hasSavedCoupon ? 'secondary.contrastText' : '#111827',
                  backgroundColor: hasSavedCoupon
                    ? 'secondary.main'
                    : 'background.paper',
                  '&:hover': {
                    backgroundColor: hasSavedCoupon
                      ? 'secondary.dark'
                      : 'rgba(15,23,42,0.04)',
                    borderColor: hasSavedCoupon
                      ? 'secondary.dark'
                      : 'rgba(15,23,42,0.28)',
                  },
                }}
              >
                <LocalOffer fontSize="small" />
              </IconButton>
            ) : (
              <PillButton
                fullWidth={compact}
                variant={hasSavedCoupon ? 'contained' : 'outlined'}
                color={hasSavedCoupon ? 'secondary' : 'primary'}
                size={buttonSize}
                startIcon={<LocalOffer />}
                onClick={handleSaveCoupon}
                disabled={eventActionsClosed && !hasSavedCoupon}
                sx={{
                  ...(hasSavedCoupon
                    ? {
                        backgroundColor: 'secondary.main',
                        borderColor: 'secondary.main',
                        color: 'secondary.contrastText',
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                          borderColor: 'secondary.dark',
                        },
                      }
                    : {}),
                }}
              >
                {hasSavedCoupon ? 'Coupon Saved' : 'Save Coupon'}
              </PillButton>
            )}
          </Box>
        </Tooltip>
        <Tooltip title={eventActionsClosed ? eventClosedMessage : ''}>
          <Box sx={{ width: compact && !cardLayout ? '100%' : 'auto' }}>
            {cardLayout ? (
              <IconButton
                aria-label="Add to calendar"
                size="small"
                onClick={handleAddToCalendar}
                disabled={eventActionsClosed}
                sx={secondaryActionButtonSx}
              >
                <CalendarMonth fontSize="small" />
              </IconButton>
            ) : (
              <PillButton
                fullWidth={compact}
                size={buttonSize}
                startIcon={<CalendarMonth />}
                onClick={handleAddToCalendar}
                disabled={eventActionsClosed}
              >
                Add to Calendar
              </PillButton>
            )}
          </Box>
        </Tooltip>
      </Stack>

      <BuyTicketsDialog
        event={event}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3600}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {toast?.message}
          {toast?.requiresAuth && !firebaseUser && (
            <Button
              size="small"
              color="inherit"
              onClick={() => {
                setToast(null);
                navigate('/Login');
              }}
              sx={{ ml: 1 }}
            >
              Sign In
            </Button>
          )}
        </Alert>
      </Snackbar>
    </>
  );
}
