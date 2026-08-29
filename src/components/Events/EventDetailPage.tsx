import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  ArrowBack,
  CalendarMonth,
  ConfirmationNumber,
  LocationOn,
  Public,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import {
  getEventClosedActionMessage,
  getEventImageUrls,
  getEventLocationLabel,
  getEventPrimaryImage,
  getEventPriceLabel,
  getEventStatusLabel,
  getEventTicketTierPriceLabel,
  isEventClosedForGuestActions,
  useEventById,
} from '../../hooks/eventHooks';
import { applyDocumentMeta } from '../../utils/documentMeta';
import PillButton from '../common/PillButton';
import EventActionBar from './EventActionBar';
import {
  BeachIcon,
  LiveMusicIcon,
  WellnessIcon,
} from '../../icons/travel-icons/src';
import { Colors } from '../constants';

const formatDateRange = (startDate: string, endDate: string) =>
  `${format(parseISO(startDate), 'EEEE, MMMM d • h:mm a')} → ${format(
    parseISO(endDate),
    'EEEE, MMMM d • h:mm a'
  )}`;

const formatTierAvailability = (remaining: number) =>
  remaining > 0
    ? `${remaining} remaining`
    : 'Availability announced by organizer';

const detailHeroPillSx = {
  height: 34,
  px: 1.75,
  py: 0,
  color: 'white',
  borderColor: 'rgba(255,255,255,0.15)',
};

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { data: event, isLoading } = useEventById(eventId);
  const eventImages = React.useMemo(
    () => (event ? getEventImageUrls(event) : []),
    [event]
  );
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [event?.id]);

  React.useEffect(() => {
    if (isLoading) return;

    if (event) {
      applyDocumentMeta({
        title: `${event.title} | Events | Blue Kottage`,
        description:
          event.summary ||
          'View event details, ticket tiers, coupons, and planning information on Blue Kottage.',
      });
      return;
    }

    if (eventId) {
      applyDocumentMeta({
        title: 'Event Not Found | Blue Kottage',
        description:
          'This event may have been removed or is not currently published on Blue Kottage.',
      });
    }
  }, [event, eventId, isLoading]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Typography color="text.secondary">Loading event details...</Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          px: 3,
        }}
      >
        <Card sx={{ maxWidth: 520, width: '100%', borderRadius: 4 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Event not found
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              This event may have been removed or is not currently published.
            </Typography>
            <Button component={RouterLink} to="/Events" variant="contained">
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const activeImage =
    eventImages[activeImageIndex] || getEventPrimaryImage(event);
  const eventActionsClosed = isEventClosedForGuestActions(event);
  const eventClosedMessage = getEventClosedActionMessage(event);
  const statusIsOpen = event.status === 'published';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f8fb', pb: 10 }}>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 460, md: 560 },
          color: 'white',
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: '#101827',
        }}
      >
        {activeImage ? (
          <Box
            component="img"
            src={activeImage}
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
              'linear-gradient(90deg, rgba(10,15,25,0.92) 0%, rgba(10,15,25,0.78) 38%, rgba(10,15,25,0.28) 100%)',
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            py: { xs: 5, md: 7 },
          }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Button
              component={RouterLink}
              to="/Events"
              startIcon={<ArrowBack />}
              sx={{ color: 'white', mb: 3, textTransform: 'none' }}
            >
              Back to Events
            </Button>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2.5 }}
            >
              <Chip
                sx={{
                  ...detailHeroPillSx,
                  backgroundColor: 'rgba(217,70,239,0.28)',
                }}
                label={event.category}
                icon={<LiveMusicIcon />}
              />
              {event.badge ? (
                <Chip
                  sx={{
                    ...detailHeroPillSx,
                    backgroundColor: 'rgba(255,255,255,0.16)',
                  }}
                  label={event.badge}
                  icon={<WellnessIcon color={Colors.raspberry} />}
                />
              ) : null}
              <Chip
                sx={{
                  ...detailHeroPillSx,
                  backgroundColor: statusIsOpen
                    ? 'rgba(16,185,129,0.24)'
                    : 'rgba(239,68,68,0.28)',
                }}
                label={getEventStatusLabel(event.status)}
              />
            </Stack>

            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              {event.title}
            </Typography>

            <Typography
              sx={{
                fontSize: '1.08rem',
                color: 'rgba(255,255,255,0.82)',
                mb: 3,
                maxWidth: 720,
              }}
            >
              {event.summary}
            </Typography>

            <Stack spacing={1.2} sx={{ maxWidth: 760 }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <CalendarMonth />
                <Typography>
                  {formatDateRange(event.startDate, event.endDate)}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center">
                <LocationOn />
                <Typography>
                  {event.venue.name}, {event.venue.address},{' '}
                  {getEventLocationLabel(event)}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center">
                <ConfirmationNumber />
                <Typography>{getEventPriceLabel(event)}</Typography>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center">
                <Public />
                <Typography>Hosted by {event.organizer}</Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                mt: 4,
                display: 'inline-block',
                width: '100%',
                maxWidth: 760,
                p: 2,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <EventActionBar event={event} />
            </Box>
          </Box>
        </Container>
      </Box>

      {eventImages.length > 1 ? (
        <Container
          maxWidth="xl"
          sx={{ mt: { xs: -2, md: -3 }, position: 'relative', zIndex: 2 }}
        >
          <Card
            sx={{
              borderRadius: 5,
              border: '1px solid rgba(16,39,57,0.08)',
              boxShadow: '0 14px 36px rgba(16,39,57,0.08)',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Event gallery
              </Typography>
              <Stack
                direction="row"
                spacing={1.2}
                useFlexGap
                sx={{ overflowX: 'auto', pb: 0.5 }}
              >
                {eventImages.map((imageUrl, index) => (
                  <Box
                    key={`${imageUrl}-${index}`}
                    onClick={() => setActiveImageIndex(index)}
                    sx={{
                      position: 'relative',
                      flex: '0 0 auto',
                      width: { xs: 108, sm: 148 },
                      height: { xs: 88, sm: 108 },
                      borderRadius: 3,
                      overflow: 'hidden',
                      border:
                        index === activeImageIndex
                          ? '2px solid #111827'
                          : '1px solid rgba(16,39,57,0.08)',
                      cursor: 'pointer',
                      boxShadow:
                        index === activeImageIndex
                          ? '0 10px 20px rgba(15,23,42,0.12)'
                          : 'none',
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={`${event.title} gallery ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Container>
      ) : null}

      <Container maxWidth="xl" sx={{ pt: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                mb: 4,
                p: { xs: 0, md: 0.5 },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                About this event
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
                {event.description}
              </Typography>
            </Box>

            <Card
              sx={{
                borderRadius: 5,
                mb: 3,
                border: '1px solid rgba(16,39,57,0.08)',
                boxShadow: '0 10px 28px rgba(16,39,57,0.05)',
              }}
            >
              <CardContent sx={{ p: 3.2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  What guests can expect
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {event.perks.map(perk => (
                    <Chip
                      key={perk}
                      sx={{
                        backgroundColor: 'rgba(16,39,57,0.02)',
                      }}
                      label={perk}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {event.lineup.length ? (
              <Card
                sx={{
                  borderRadius: 5,
                  border: '1px solid rgba(16,39,57,0.08)',
                  boxShadow: '0 10px 28px rgba(16,39,57,0.05)',
                }}
              >
                <CardContent sx={{ p: 3.2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    Lineup / speakers
                  </Typography>
                  <Stack spacing={1}>
                    {event.lineup.map(item => (
                      <Typography key={item} sx={{ color: 'text.secondary' }}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ) : null}
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
              <Card
                sx={{
                  borderRadius: 5,
                  mb: 3,
                  border: '1px solid rgba(16,39,57,0.08)',
                  boxShadow: '0 14px 36px rgba(16,39,57,0.08)',
                }}
              >
                <CardContent sx={{ p: 3.2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                  >
                    <Box>
                      <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Starting from
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {getEventPriceLabel(event)}
                      </Typography>
                    </Box>

                    <Chip
                      sx={
                        eventActionsClosed
                          ? {
                              color: '#475569',
                              backgroundColor: '#e2e8f0',
                              borderColor: '#cbd5e1',
                            }
                          : {
                              color: '#166534',
                              backgroundColor: '#dcfce7',
                              borderColor: '#bbf7d0',
                            }
                      }
                      label={
                        eventActionsClosed
                          ? getEventStatusLabel(event.status)
                          : 'Available'
                      }
                    />
                  </Stack>

                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    Ticket tiers
                  </Typography>

                  <Stack spacing={2}>
                    {event.ticketTiers.map(tier => (
                      <Box
                        key={tier.id}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid rgba(16,39,57,0.08)',
                          backgroundColor: 'rgba(16,39,57,0.03)',
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            {tier.name}
                          </Typography>
                          <Typography sx={{ fontWeight: 800 }}>
                            {getEventTicketTierPriceLabel(tier)}
                          </Typography>
                        </Stack>

                        <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                          {formatTierAvailability(tier.remaining)}
                        </Typography>

                        <Stack spacing={0.5}>
                          {tier.perks.map(perk => (
                            <Typography
                              key={perk}
                              variant="body2"
                              sx={{ color: 'text.secondary' }}
                            >
                              {perk}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {event.coupon ? (
                <Card
                  sx={{
                    borderRadius: 5,
                    mb: 3,
                    border: '1px solid rgba(16,39,57,0.08)',
                    boxShadow: '0 10px 28px rgba(16,39,57,0.05)',
                  }}
                >
                  <CardContent sx={{ p: 3.2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                      Coupon offer
                    </Typography>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                      {event.coupon.code}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                      {event.coupon.discountText}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {event.coupon.description}
                    </Typography>
                  </CardContent>
                </Card>
              ) : null}

              <Card
                sx={{
                  borderRadius: 5,
                  border: '1px solid rgba(16,39,57,0.08)',
                  boxShadow: '0 10px 28px rgba(16,39,57,0.05)',
                }}
              >
                <CardContent sx={{ p: 3.2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                    Event details
                  </Typography>

                  <Stack spacing={1.4}>
                    <Typography variant="body2">
                      <strong>Venue:</strong> {event.venue.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {event.venue.address}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Organizer:</strong> {event.organizer}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tags:</strong> {event.tags.join(', ')}
                    </Typography>
                  </Stack>

                  {event.ticketUrl || event.website ? (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Stack direction="row" spacing={1.2}>
                        {event.ticketUrl ? (
                          eventActionsClosed ? (
                            <PillButton disabled>
                              {eventClosedMessage}
                            </PillButton>
                          ) : (
                            <PillButton
                              href={event.ticketUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Ticket Link
                            </PillButton>
                          )
                        ) : null}

                        {event.website ? (
                          <PillButton
                            href={event.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Event Website
                          </PillButton>
                        ) : null}
                      </Stack>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
