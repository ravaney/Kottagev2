import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import {
  CalendarMonth,
  ConfirmationNumber,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  EventRecord,
  getEventImageUrls,
  getEventLocationLabel,
  getEventPrimaryImage,
  getEventPriceLabel,
  getEventStatusLabel,
} from '../../hooks/eventHooks';
import EventActionBar from './EventActionBar';

type Props = {
  event: EventRecord;
  variant?: 'user' | 'admin';
};

const formatEventRange = (event: EventRecord) =>
  `${format(parseISO(event.startDate), 'EEE, MMM d • h:mm a')} → ${format(
    parseISO(event.endDate),
    'EEE, MMM d • h:mm a'
  )}`;

const imagePillSx = {
  color: 'white',
  backgroundColor: 'rgba(255,255,255,0.16)',
  borderColor: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(8px)',
};

export default function EventCard({ event, variant = 'user' }: Props) {
  const navigate = useNavigate();
  const isUser = variant === 'user';
  const eventImages = getEventImageUrls(event);
  const primaryImage = getEventPrimaryImage(event);
  const statusIsOpen = event.status === 'published';

  return (
    <Card
      onClick={() => navigate(`/Events/${event.id}`)}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 5,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(16,39,57,0.08)',
        boxShadow: '0 12px 30px rgba(16,39,57,0.06)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 18px 36px rgba(16,39,57,0.10)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', md: 320 },
          minWidth: { md: 320 },
          minHeight: { xs: 240, md: 260 },
          backgroundColor: '#e5e7eb',
        }}
      >
        {primaryImage ? (
          <CardMedia
            component="img"
            image={primaryImage}
            alt={event.title}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.58) 100%)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'white',
          }}
        >
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip sx={imagePillSx} label={event.category} />
            {event.badge ? <Chip sx={imagePillSx} label={event.badge} /> : null}
            <Chip
              sx={{
                ...imagePillSx,
                color: statusIsOpen ? '#ecfdf5' : '#fee2e2',
                backgroundColor: statusIsOpen
                  ? 'rgba(16,185,129,0.20)'
                  : 'rgba(239,68,68,0.22)',
                borderColor: 'rgba(255,255,255,0.12)',
              }}
              label={getEventStatusLabel(event.status)}
            />
            {eventImages.length > 1 ? (
              <Chip sx={imagePillSx} label={eventImages.length + 'photos'} />
            ) : null}
          </Stack>

          <Box>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.82)',
                mb: 0.5,
              }}
            >
              {event.summary}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {event.title}
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          p: { xs: 2.5, md: 3.2 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}
          >
            {event.title}
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              mb: 2.5,
              lineHeight: 1.75,
            }}
          >
            {event.summary}
          </Typography>

          <Stack spacing={1.4} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <CalendarMonth
                fontSize="small"
                sx={{ color: 'text.secondary' }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: '#0f172a' }}
              >
                {formatEventRange(event)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.2} alignItems="center">
              <LocationOn fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {event.venue.name}, {getEventLocationLabel(event)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.2} alignItems="center">
              <ConfirmationNumber
                fontSize="small"
                sx={{ color: 'text.secondary' }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                From{' '}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: '#0f172a' }}
                >
                  {getEventPriceLabel(event)}
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            pt: 2.5,
            borderTop: '1px solid rgba(15,23,42,0.08)',
          }}
          onClick={clickEvent => clickEvent.stopPropagation()}
        >
          <EventActionBar event={event} compact={!isUser} cardLayout={isUser} />
        </Box>
      </CardContent>
    </Card>
  );
}
