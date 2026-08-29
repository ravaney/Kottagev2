import React from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth, useEventWallet } from '../../hooks';
import {
  EventRecord,
  getEventClosedActionMessage,
  getEventPrimaryImage,
  getEventTicketTierPriceLabel,
  isEventClosedForGuestActions,
} from '../../hooks/eventHooks';

interface BuyTicketsDialogProps {
  event: EventRecord;
  open: boolean;
  onClose: () => void;
}

export default function BuyTicketsDialog({
  event,
  open,
  onClose,
}: BuyTicketsDialogProps) {
  const { firebaseUser, appUser } = useAuth();
  const { saveTicketOrder } = useEventWallet();
  const defaultTierId = event.ticketTiers[0]?.id || '';
  const [selectedTierId, setSelectedTierId] = React.useState(defaultTierId);
  const [quantity, setQuantity] = React.useState(1);
  const [guestName, setGuestName] = React.useState('');
  const [guestEmail, setGuestEmail] = React.useState('');
  const [confirmationCode, setConfirmationCode] = React.useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setSelectedTierId(event.ticketTiers[0]?.id || '');
      setQuantity(1);
      setGuestName(
        appUser?.firstName && appUser?.lastName
          ? `${appUser.firstName} ${appUser.lastName}`
          : firebaseUser?.displayName || ''
      );
      setGuestEmail(firebaseUser?.email || appUser?.email || '');
      setConfirmationCode(null);
      setErrorMessage(null);
    }
  }, [
    appUser?.email,
    appUser?.firstName,
    appUser?.lastName,
    event.ticketTiers,
    firebaseUser?.displayName,
    firebaseUser?.email,
    open,
  ]);

  const selectedTier =
    event.ticketTiers.find(tier => tier.id === selectedTierId) ||
    event.ticketTiers[0];
  const total = selectedTier ? selectedTier.price * quantity : 0;
  const eventActionsClosed = isEventClosedForGuestActions(event);
  const eventClosedMessage = getEventClosedActionMessage(event);
  const heroImage = getEventPrimaryImage(event);

  const priceLabel = selectedTier
    ? getEventTicketTierPriceLabel(selectedTier)
    : 'Price unavailable';

  const totalLabel = selectedTier
    ? selectedTier.price > 0
      ? `$${total}`
      : getEventTicketTierPriceLabel(selectedTier) === 'Free'
        ? 'Free'
        : 'To be confirmed'
    : 'To be confirmed';

  const handleReserve = async () => {
    if (eventActionsClosed) {
      setErrorMessage(eventClosedMessage);
      return;
    }

    if (!selectedTier) {
      return;
    }

    if (!firebaseUser) {
      setErrorMessage('Sign in to save ticket reservations to your account.');
      return;
    }

    const confirmation = `EV-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    const ticketId = `${event.id}-${confirmation}`;
    try {
      await saveTicketOrder({
        confirmation,
        eventId: event.id,
        eventTitle: event.title,
        ticketId,
        tierId: selectedTier.id,
        tierName: selectedTier.name,
        quantity,
        total,
        guestName,
        guestEmail,
        reservedAt: new Date().toISOString(),
      });

      setConfirmationCode(confirmation);
      setErrorMessage(null);
    } catch (error) {
      console.error('Unable to save ticket reservation', error);
      setErrorMessage('We could not save this reservation right now.');
    }
  };

  const handleClose = () => {
    setConfirmationCode(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          overflow: 'hidden',
          borderRadius: { xs: 3, md: 4 },
          boxShadow: '0 30px 80px rgba(0,0,0,0.16)',
          backgroundColor: 'white',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.02fr 0.98fr' },
          minHeight: { md: 720 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 280, md: '100%' },
            backgroundColor: '#d6d3d1',
          }}
        >
          {heroImage ? (
            <Box
              component="img"
              src={heroImage}
              alt={event.title}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: { xs: 280, md: 720 },
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : null}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.04) 100%)',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              px: 2,
              py: 1,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.28)',
              backgroundColor: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(12px)',
              color: 'white',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Reserve tickets
          </Box>

          <Box
            sx={{
              position: 'absolute',
              insetInline: 0,
              bottom: 0,
              p: { xs: 3, md: 4 },
              color: 'white',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.64)',
              }}
            >
              {event.category} · {event.venue.parish}
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
              }}
            >
              {event.title}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: 500,
                fontSize: '0.98rem',
                lineHeight: 1.9,
                color: 'rgba(255,255,255,0.82)',
              }}
            >
              {event.description || event.summary}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  p: 2,
                  borderRadius: 2.5,
                  border: '1px solid rgba(255,255,255,0.14)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.58)',
                  }}
                >
                  Location
                </Typography>
                <Typography
                  sx={{ mt: 1, fontSize: '0.95rem', fontWeight: 600 }}
                >
                  {event.venue.name}, {event.venue.parish}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  p: 2,
                  borderRadius: 2.5,
                  border: '1px solid rgba(255,255,255,0.14)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.58)',
                  }}
                >
                  Starting from
                </Typography>
                <Typography
                  sx={{ mt: 1, fontSize: '0.95rem', fontWeight: 600 }}
                >
                  {event.ticketTiers[0]
                    ? getEventTicketTierPriceLabel(event.ticketTiers[0])
                    : 'Unavailable'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fcfbf8',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              minWidth: 44,
              width: 44,
              height: 44,
              borderRadius: 999,
              border: '1px solid #e7e5e4',
              backgroundColor: 'white',
              color: '#78716c',
              fontSize: '1.25rem',
              lineHeight: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              '&:hover': {
                backgroundColor: 'white',
                color: '#1c1917',
              },
            }}
          >
            ×
          </Button>

          <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 8, md: 4 }, pb: 3 }}>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#a8a29e',
              }}
            >
              Ticket selection
            </Typography>

            <Typography
              sx={{
                mt: 1.25,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                color: '#1c1917',
              }}
            >
              See tickets
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: 480,
                fontSize: '0.98rem',
                lineHeight: 1.9,
                color: '#57534e',
              }}
            >
              Choose your pass, confirm quantity, and reserve your place before
              checkout goes live.
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 3, md: 4 } }}>
            {confirmationCode ? (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
                Tickets reserved under confirmation{' '}
                <strong>{confirmationCode}</strong>.
              </Alert>
            ) : null}

            {eventActionsClosed ? (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
                {eventClosedMessage}
              </Alert>
            ) : null}

            {!firebaseUser ? (
              <Alert
                severity="info"
                sx={{ mb: 2, borderRadius: 3 }}
                action={
                  <Button
                    component={RouterLink}
                    to="/Login"
                    color="inherit"
                    size="small"
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Sign In
                  </Button>
                }
              >
                Sign in to save event ticket reservations to your account.
              </Alert>
            ) : null}

            {errorMessage ? (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                {errorMessage}
              </Alert>
            ) : null}

            {selectedTier ? (
              <Box
                sx={{
                  mb: 3,
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: 'white',
                  border: '1px solid #e7e5e4',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.04)',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#a8a29e',
                      }}
                    >
                      Selected pass
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: '#1c1917',
                      }}
                    >
                      {selectedTier.name}
                    </Typography>
                    <Typography
                      sx={{ mt: 1, color: '#78716c', lineHeight: 1.8 }}
                    >
                      {selectedTier.remaining > 0
                        ? `${selectedTier.remaining} tickets currently shown as available`
                        : 'Availability will be confirmed by the organizer'}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      px: 2,
                      py: 1,
                      borderRadius: 999,
                      backgroundColor: '#1c1917',
                      color: 'white',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {priceLabel}
                  </Box>
                </Stack>

                <Stack spacing={1} sx={{ mt: 2 }}>
                  {selectedTier.perks.map(perk => (
                    <Stack
                      key={perk}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          display: 'grid',
                          placeItems: 'center',
                          backgroundColor: '#ecfdf5',
                          color: '#047857',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </Box>
                      <Typography variant="body2" sx={{ color: '#57534e' }}>
                        {perk}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Box>

          <Box sx={{ px: { xs: 3, md: 4 }, pb: 4, flex: 1 }}>
            <Stack
              spacing={2.25}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: 'white',
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
            >
              <TextField
                select
                label="Ticket Type"
                value={selectedTierId}
                onChange={event => setSelectedTierId(event.target.value)}
                fullWidth
                disabled={eventActionsClosed}
              >
                {event.ticketTiers.map(tier => (
                  <MenuItem key={tier.id} value={tier.id}>
                    {tier.name} — {getEventTicketTierPriceLabel(tier)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Quantity"
                value={quantity}
                onChange={event => setQuantity(Number(event.target.value))}
                fullWidth
                disabled={eventActionsClosed}
              >
                {[1, 2, 3, 4, 5, 6].map(amount => (
                  <MenuItem key={amount} value={amount}>
                    {amount} {amount === 1 ? 'ticket' : 'tickets'}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.25}>
                {firebaseUser || appUser ? (
                  <>
                    <Box flex={1}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Guest Name
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          py: 1,
                          px: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          background: '#fafafa',
                        }}
                      >
                        {guestName}
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Guest Email
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          py: 1,
                          px: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          background: '#fafafa',
                        }}
                      >
                        {guestEmail}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <TextField
                      label="Guest Name"
                      value={guestName}
                      onChange={event => setGuestName(event.target.value)}
                      fullWidth
                      placeholder="Who is attending?"
                      disabled={eventActionsClosed}
                    />
                    <TextField
                      label="Guest Email"
                      type="email"
                      value={guestEmail}
                      onChange={event => setGuestEmail(event.target.value)}
                      fullWidth
                      placeholder="Where should confirmations go?"
                      disabled={eventActionsClosed}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 'auto',
              borderTop: '1px solid #e7e5e4',
              backgroundColor: 'white',
              px: { xs: 3, md: 4 },
              py: 3,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#a8a29e',
                  }}
                >
                  Estimated total
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    color: '#1c1917',
                  }}
                >
                  {totalLabel}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography sx={{ color: '#57534e', fontWeight: 600 }}>
                  {quantity} × {selectedTier?.name || 'Selected pass'}
                </Typography>
                <Typography
                  sx={{ mt: 0.5, color: '#a8a29e', fontSize: '0.88rem' }}
                >
                  Taxes calculated at checkout
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Button
                onClick={handleClose}
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#57534e',
                }}
              >
                Close
              </Button>

              <Button
                variant="contained"
                onClick={handleReserve}
                disabled={
                  eventActionsClosed ||
                  !selectedTier ||
                  !guestName.trim() ||
                  !guestEmail.trim() ||
                  !firebaseUser
                }
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.25,
                  textTransform: 'none',
                  fontWeight: 700,
                  backgroundColor: '#1c1917',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#292524',
                    boxShadow: 'none',
                  },
                }}
              >
                {confirmationCode ? 'Reserved' : 'Continue to checkout'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
