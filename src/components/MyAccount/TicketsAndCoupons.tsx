import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  CalendarMonth,
  ConfirmationNumber,
  Launch,
  LocalActivity,
  LocalOffer,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import PageHeader from '../common/PageHeader';
import { Colors } from '../constants';
import { useEventWallet } from '../../hooks';
import { EventRecord, useEvents } from '../../hooks/eventHooks';
import TicketDrawer from './TicketDrawer';

const formatDisplayDate = (value: string) => {
  try {
    return format(parseISO(value), 'EEE, MMM d, yyyy');
  } catch (error) {
    return value;
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

const getEventById = (events: EventRecord[], eventId: string) =>
  events.find(event => event.id === eventId) || null;

export default function TicketsAndCoupons() {
  const [ticketDrawerOpen, setTicketDrawerOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<any>(null);

  function handleViewTicket(order: any, event: any) {
    setSelectedTicket({
      eventTitle: event?.title || order.eventTitle,
      eventStart: event ? formatDisplayDate(event.startDate) : '',
      eventEnd: event ? formatDisplayDate(event.endDate) : '',
      eventVenue: event?.venue?.name || '',
      eventLocation: event?.venue?.city || '',
      guestName: order.guestName,
      guestEmail: order.guestEmail,
      tierName: order.tierName,
      quantity: order.quantity,
      total: order.total,
      confirmation: order.confirmation,
      reservedAt: order.reservedAt,
      ticketId: order.ticketId || `${order.eventId}-${order.confirmation}`,
    });
    setTicketDrawerOpen(true);
  }

  const { data: events = [] } = useEvents({ upcomingOnly: false });
  const {
    ticketOrders,
    savedCouponIds,
    removeSavedCoupon,
    loading: walletLoading,
    error: walletError,
  } = useEventWallet();

  const totalReservedTickets = ticketOrders.reduce(
    (sum, order) => sum + order.quantity,
    0
  );

  const totalSavedCoupons = savedCouponIds.length;

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader
        title="Tickets & Coupons"
        subtitle="Keep your reserved event passes and saved offers in one place."
        icon={<LocalActivity sx={{ color: Colors.raspberry, fontSize: 32 }} />}
      />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <ConfirmationNumber sx={{ color: Colors.cerulean }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Reserved tickets
                  </Typography>
                </Stack>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: Colors.cerulean }}
                >
                  {totalReservedTickets}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Across {ticketOrders.length} reservation
                  {ticketOrders.length === 1 ? '' : 's'} saved to your account.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <LocalOffer sx={{ color: Colors.raspberry }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Saved coupons
                  </Typography>
                </Stack>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: Colors.raspberry }}
                >
                  {totalSavedCoupons}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Event offers you saved for quick access later.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.75 }}>
                  Ticket reservations
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Every ticket reservation saved from the event checkout flow
                  appears here.
                </Typography>
              </Box>
              <Button component={RouterLink} to="/Events" variant="outlined">
                Browse Events
              </Button>
            </Stack>

            {walletLoading ? (
              <Alert severity="info">Loading your saved event wallet...</Alert>
            ) : walletError ? (
              <Alert severity="error">{walletError}</Alert>
            ) : ticketOrders.length ? (
              <Stack spacing={2}>
                {ticketOrders.map(order => {
                  const event = getEventById(events, order.eventId);

                  return (
                    <Card
                      key={`${order.confirmation}-${order.reservedAt}`}
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                    >
                      <CardContent>
                        <Stack
                          direction={{ xs: 'column', md: 'row' }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              flexWrap="wrap"
                              sx={{ mb: 1.25 }}
                            >
                              <Chip
                                icon={<ConfirmationNumber />}
                                label={`Confirmation ${order.confirmation}`}
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                icon={<CalendarMonth />}
                                label={`Reserved ${formatDisplayDate(order.reservedAt)}`}
                                variant="outlined"
                              />
                            </Stack>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 800, mb: 0.75 }}
                            >
                              {event?.title || order.eventTitle}
                            </Typography>
                            <Typography
                              sx={{ color: 'text.secondary', mb: 1.5 }}
                            >
                              {event
                                ? `${formatDisplayDate(event.startDate)} at ${event.venue.name}, ${event.venue.city}`
                                : 'Event details are not currently available, but your reservation remains saved to your account.'}
                            </Typography>
                            <Grid container spacing={1.5}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Ticket tier
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {order.tierName}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Quantity
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {order.quantity}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Guest
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {order.guestName || 'Guest name pending'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Estimated total
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {order.total > 0
                                    ? formatCurrency(order.total)
                                    : 'Organizer will confirm'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>

                          <Stack
                            direction={{ xs: 'row', md: 'column' }}
                            spacing={1}
                            justifyContent="flex-start"
                          >
                            <Button
                              component={RouterLink}
                              to={`/Events/${order.eventId}`}
                              variant="contained"
                              endIcon={<Launch />}
                              disabled={!event}
                            >
                              View Event
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => handleViewTicket(order, event)}
                            >
                              View Ticket
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <Alert severity="info">
                No ticket reservations yet. Reserve tickets from any event
                detail page and they&apos;ll show up here.
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.75 }}>
                  Saved coupons
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Offers you saved from the events experience stay available
                  here until you remove them.
                </Typography>
              </Box>
              <Button component={RouterLink} to="/Events" variant="outlined">
                Find More Offers
              </Button>
            </Stack>

            {walletLoading ? (
              <Alert severity="info">Loading your saved event wallet...</Alert>
            ) : walletError ? (
              <Alert severity="error">{walletError}</Alert>
            ) : savedCouponIds.length ? (
              <Stack spacing={2}>
                {savedCouponIds.map(eventId => {
                  const event = getEventById(events, eventId);
                  const coupon = event?.coupon;

                  return (
                    <Card
                      key={eventId}
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                    >
                      <CardContent>
                        <Stack
                          direction={{ xs: 'column', md: 'row' }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              flexWrap="wrap"
                              sx={{ mb: 1.25 }}
                            >
                              <Chip
                                icon={<LocalOffer />}
                                label={coupon?.code || 'Coupon unavailable'}
                                color={coupon ? 'secondary' : 'default'}
                              />
                              {coupon?.discountText ? (
                                <Chip
                                  label={coupon.discountText}
                                  variant="outlined"
                                />
                              ) : null}
                            </Stack>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 800, mb: 0.75 }}
                            >
                              {event?.title || 'Saved event offer'}
                            </Typography>
                            <Typography
                              sx={{ color: 'text.secondary', mb: 1.5 }}
                            >
                              {coupon?.description ||
                                'This event is no longer exposing coupon details, but the saved reference is still in your list.'}
                            </Typography>

                            <Grid container spacing={1.5}>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Event date
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {event
                                    ? formatDisplayDate(event.startDate)
                                    : 'Unavailable'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Expires
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {coupon?.expiresAt
                                    ? formatDisplayDate(coupon.expiresAt)
                                    : 'Unavailable'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  Venue
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {event
                                    ? `${event.venue.name}, ${event.venue.city}`
                                    : 'Unavailable'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>

                          <Stack
                            direction={{ xs: 'row', md: 'column' }}
                            spacing={1}
                            justifyContent="flex-start"
                          >
                            <Button
                              component={RouterLink}
                              to={`/Events/${eventId}`}
                              variant="contained"
                              endIcon={<Launch />}
                              disabled={!event}
                            >
                              View Event
                            </Button>
                            <Button
                              variant="text"
                              color="inherit"
                              onClick={() => {
                                void removeSavedCoupon(eventId);
                              }}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <Alert severity="info">
                No saved coupons yet. Use the `Save Coupon` action on an event
                and it will appear here.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
      <TicketDrawer
        open={ticketDrawerOpen}
        onClose={() => setTicketDrawerOpen(false)}
        ticket={selectedTicket}
      />
    </Box>
  );
}
