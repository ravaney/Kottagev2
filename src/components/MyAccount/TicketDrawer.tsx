import React from 'react';
import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import QRCode from 'react-qr-code';

export interface TicketOrderData {
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  eventVenue: string;
  eventLocation: string;
  guestName: string;
  guestEmail: string;
  tierName: string;
  quantity: number;
  total: number;
  confirmation: string;
  reservedAt: string;
  ticketId: string;
}

interface TicketDrawerProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketOrderData | null;
}

const buildQrValue = (ticket: TicketOrderData) =>
  `${
    typeof window === 'undefined' ? '' : window.location.origin
  }/tickets/${encodeURIComponent(ticket.ticketId)}/validate`;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

function InfoTile({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        flex: 1,
        p: 1.75,
        borderRadius: '18px',
        border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e7e5e4',
        backgroundColor: dark ? 'rgba(255,255,255,0.08)' : '#fff',
        backdropFilter: dark ? 'blur(10px)' : 'none',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,0.55)' : '#a8a29e',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 1,
          fontSize: '0.92rem',
          fontWeight: 600,
          color: dark ? '#fff' : '#1c1917',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function InfoCard({
  label,
  title,
  body,
}: {
  label: string;
  title?: string;
  body: string;
}) {
  return (
    <Box
      sx={{
        borderRadius: '22px',
        border: '1px solid #e7e5e4',
        backgroundColor: '#fff',
        px: 2,
        py: 2,
        boxShadow: '0 10px 24px rgba(0,0,0,0.04)',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#a8a29e',
        }}
      >
        {label}
      </Typography>
      {title ? (
        <Typography
          sx={{
            mt: 1,
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1c1917',
          }}
        >
          {title}
        </Typography>
      ) : null}
      <Typography
        sx={{
          mt: title ? 0.5 : 1,
          fontSize: '0.92rem',
          lineHeight: 1.8,
          color: '#57534e',
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}

function GridLike({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        mt: 2.5,
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      {children}
    </Box>
  );
}

export default function TicketDrawer({
  open,
  onClose,
  ticket,
}: TicketDrawerProps) {
  if (!ticket) return null;
  console.log(ticket);
  const dateLabel =
    ticket.eventStart && ticket.eventEnd
      ? `${ticket.eventStart} – ${ticket.eventEnd}`
      : ticket.eventStart || ticket.eventEnd || 'Date to be confirmed';
  const qrValue = buildQrValue(ticket);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 520,
          backgroundColor: '#fcfbf8',
          borderLeft: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '-18px 0 50px rgba(0,0,0,0.16)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            borderBottom: '1px solid #e7e5e4',
            backgroundColor: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            px: 3,
            py: 2.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#a8a29e',
                }}
              >
                Mobile entry
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: '#1c1917',
                }}
              >
                Your ticket
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  maxWidth: 340,
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  color: '#57534e',
                }}
              >
                Open this at check-in for fast entry. Your QR code and
                confirmation details are saved here.
              </Typography>
            </Box>

            <Button
              onClick={onClose}
              sx={{
                minWidth: 44,
                width: 44,
                height: 44,
                borderRadius: 999,
                border: '1px solid #e7e5e4',
                backgroundColor: '#fff',
                color: '#78716c',
                fontSize: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                '&:hover': {
                  backgroundColor: '#fff',
                  color: '#1c1917',
                },
              }}
            >
              ×
            </Button>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
          <Box
            sx={{
              overflow: 'hidden',
              borderRadius: '28px',
              border: '1px solid rgba(0,0,0,0.05)',
              backgroundColor: '#fff',
              boxShadow: '0 16px 40px rgba(0,0,0,0.06)',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                px: 3,
                py: 3,
                color: 'white',
                background:
                  'linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#0f172a 100%)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.1,
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '18px 18px',
                }}
              />
              <Box sx={{ position: 'relative' }}>
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
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.55)',
                      }}
                    >
                      Blu Kottage Events
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.5,
                        fontSize: '2rem',
                        fontWeight: 800,
                        letterSpacing: '-0.05em',
                      }}
                    >
                      {ticket.eventTitle}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.75)',
                      }}
                    >
                      {ticket.tierName} · Qty {ticket.quantity}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: 'rgba(255,255,255,0.10)',
                      px: 1.5,
                      py: 0.75,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.90)',
                    }}
                  >
                    Confirmed
                  </Box>
                </Stack>

                <GridLike>
                  <InfoTile label="Date" value={dateLabel} dark />
                  <InfoTile
                    label="Location"
                    value={[ticket.eventVenue, ticket.eventLocation]
                      .filter(Boolean)
                      .join(', ')}
                    dark
                  />
                </GridLike>

                <Box
                  sx={{
                    mt: 2,
                    borderRadius: '20px',
                    border: '1px dashed rgba(255,255,255,0.18)',
                    px: 2,
                    py: 1.5,
                    color: 'rgba(255,255,255,0.78)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.50)',
                    }}
                  >
                    Confirmation
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                    }}
                  >
                    {ticket.confirmation}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderTop: '1px solid #e7e5e4',
                backgroundColor: '#fcfbf8',
                px: 2.5,
                py: 2.5,
              }}
            >
              <Box sx={{ mx: 'auto', maxWidth: 260 }}>
                <QRCode
                  value={qrValue}
                  size={220}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '100%',
                  }}
                />
                <Box
                  sx={{
                    mt: 2,
                    borderRadius: '18px',
                    border: '1px solid #e7e5e4',
                    backgroundColor: '#fff',
                    px: 2,
                    py: 1.5,
                    textAlign: 'center',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#a8a29e',
                    }}
                  >
                    Ticket ID
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#1c1917',
                    }}
                  >
                    {ticket.ticketId}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Stack spacing={2} sx={{ mt: 2.5 }}>
            <InfoCard
              label="Guest"
              title={ticket.guestName || 'Guest name pending'}
              body={ticket.guestEmail || 'Guest email pending'}
            />

            <InfoCard
              label="Entry notes"
              body="Bring a valid ID matching the guest name if requested by the organizer. A screenshot is usually accepted, but full screen brightness is best."
            />

            <Box
              sx={{
                borderRadius: '22px',
                border: '1px solid #e7e5e4',
                backgroundColor: '#fff',
                px: 2,
                py: 2,
                boxShadow: '0 10px 24px rgba(0,0,0,0.04)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#a8a29e',
                    }}
                  >
                    Ticket details
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: '#1c1917',
                    }}
                  >
                    {ticket.tierName}
                  </Typography>
                  <Typography
                    sx={{ mt: 0.5, fontSize: '0.9rem', color: '#78716c' }}
                  >
                    General admission · Qty {ticket.quantity}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: '#1c1917',
                  }}
                >
                  {ticket.total > 0 ? formatCurrency(ticket.total) : 'Free'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid #e7e5e4',
            backgroundColor: 'white',
            px: 3,
            py: 2.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button
              onClick={onClose}
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
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 700,
                color: 'white',
                backgroundColor: '#1c1917',
                '&:hover': {
                  backgroundColor: '#292524',
                },
              }}
            >
              Download ticket
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
