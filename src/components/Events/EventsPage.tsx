import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Search } from '@mui/icons-material';
import { getEventPrimaryImage, useEvents } from '../../hooks/eventHooks';
import PillButton from '../common/PillButton';
import EventCard from './EventCard';

const quickLinks = [
  'This weekend',
  'Trending now',
  'Beach events',
  'Food experiences',
  'Nightlife',
];

const categoriesPreview = [
  'Coastal Escapes',
  'Live Music',
  'Dining',
  'Wellness',
  'Culture',
  'Nightlife',
];

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: '#78716c',
        }}
      >
        {eyebrow}
      </Typography>

      <Typography
        sx={{
          mt: 1.25,
          fontSize: { xs: '2.3rem', md: '3.2rem' },
          fontWeight: 600,
          lineHeight: 0.98,
          letterSpacing: '-0.04em',
          color: '#1c1917',
        }}
      >
        {title}
      </Typography>

      {copy ? (
        <Typography
          sx={{
            mt: 2,
            maxWidth: 760,
            fontSize: '1rem',
            lineHeight: 1.95,
            color: '#57534e',
          }}
        >
          {copy}
        </Typography>
      ) : null}
    </Box>
  );
}

export default function EventsPage() {
  const {
    data: events = [],
    isLoading,
    error,
  } = useEvents({ upcomingOnly: false });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedParish, setSelectedParish] = React.useState('All');

  const categories = [
    'All',
    ...Array.from(new Set(events.map(event => event.category))),
  ];

  const parishes = [
    'All',
    ...Array.from(new Set(events.map(event => event.venue.parish))),
  ];

  const featuredEvents = events.filter(event => event.featured).slice(0, 2);

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      !searchTerm ||
      [
        event.title,
        event.summary,
        event.venue.city,
        event.venue.parish,
        event.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory;

    const matchesParish =
      selectedParish === 'All' || event.venue.parish === selectedParish;

    return matchesSearch && matchesCategory && matchesParish;
  });

  const spotlightEvents = filteredEvents.slice(0, 3);
  const browseEvents = filteredEvents.slice(3);

  const heroMainImage = featuredEvents[0]
    ? getEventPrimaryImage(featuredEvents[0])
    : '';

  const heroSecondaryImage = featuredEvents[1]
    ? getEventPrimaryImage(featuredEvents[1])
    : '';

  const month = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f1ea',
        color: '#1c1917',
        pb: 10,
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          backgroundColor: '#ece4d8',
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: '#78716c',
                    }}
                  >
                    Jamaica · {month}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      maxWidth: 760,
                      fontWeight: 600,
                      lineHeight: 0.94,
                      letterSpacing: '-0.05em',
                      color: '#1c1917',
                      fontSize: {
                        xs: '3rem',
                        sm: '4rem',
                        md: '5rem',
                        lg: '5.3rem',
                      },
                    }}
                  >
                    What&apos;s on
                    <br />
                    in Jamaica
                  </Typography>

                  <Typography
                    sx={{
                      mt: 3,
                      maxWidth: 680,
                      fontSize: '1.05rem',
                      lineHeight: 2,
                      color: '#44403c',
                    }}
                  >
                    Discover the events, festivals, and cultural moments worth
                    shaping your trip around — and see tickets the moment
                    something feels right.
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1.2}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mt: 4 }}
                >
                  {categoriesPreview.map(item => (
                    <Chip
                      key={item}
                      sx={{
                        borderColor: '#d6d3d1',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        color: '#57534e',
                        fontWeight: 500,
                      }}
                      label={item}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      overflow: 'hidden',
                      borderRadius: '28px',
                      minHeight: { xs: 260, sm: 100 },
                      height: '100%',
                      backgroundColor: '#d6d3d1',
                    }}
                  >
                    {heroMainImage ? (
                      <Box
                        component="img"
                        src={heroMainImage}
                        alt={featuredEvents[0]?.title || 'Featured event'}
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: { xs: 260, sm: 520 },
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : null}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    <Box
                      sx={{
                        overflow: 'hidden',
                        borderRadius: '28px',
                        minHeight: 180,
                        flex: 1,
                        backgroundColor: '#d6d3d1',
                      }}
                    >
                      {heroSecondaryImage ? (
                        <Box
                          component="img"
                          src={heroSecondaryImage}
                          alt={featuredEvents[1]?.title || 'Featured event'}
                          sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: 180,
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : null}
                    </Box>

                    <Box
                      sx={{
                        borderRadius: '28px',
                        backgroundColor: '#1c1917',
                        color: 'white',
                        p: 3,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: '#a8a29e',
                        }}
                      >
                        Plan around the moment
                      </Typography>

                      <Typography
                        sx={{
                          mt: 2,
                          fontSize: '1.15rem',
                          lineHeight: 1.8,
                          color: 'rgba(255,255,255,0.86)',
                        }}
                      >
                        Start with the atmosphere you want, then move naturally
                        into dates, places, and tickets without losing the
                        travel mood.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Card
          sx={{
            mt: -6,
            borderRadius: '24px',
            backgroundColor: 'rgba(255,255,255,0.88)',
            boxShadow: '0 14px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap">
              {quickLinks.map(item => (
                <PillButton
                  key={item}
                  sx={{
                    px: 2.25,
                    py: 1,
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#57534e',
                    borderColor: '#e7e5e4',
                    backgroundColor: '#fff',
                    '&:hover': {
                      borderColor: '#a8a29e',
                      backgroundColor: '#fff',
                    },
                  }}
                >
                  {item}
                </PillButton>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Container maxWidth="xl" sx={{ pt: 2, pb: 3 }}>
        <SectionHeading
          eyebrow="Featured experiences"
          title="Events worth planning a trip around"
          copy="These are the signature moments shaping the season — the kind of experiences people build weekends, road trips, and long stays around."
        />

        {featuredEvents.length > 0 ? (
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {featuredEvents.map(event => (
              <Grid item xs={12} md={6} key={event.id}>
                <EventCard event={event} variant="user" />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Container>

      <Container maxWidth="xl" sx={{ py: 1 }}>
        <SectionHeading
          eyebrow="Happening soon"
          title="Good reasons to be here this week"
          copy="A tighter, more timely selection for travelers who already know when they’re coming and want the best options fast."
        />

        {spotlightEvents.length > 0 ? (
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {spotlightEvents.map((event, index) => (
              <Grid
                item
                xs={12}
                md={index === 0 ? 12 : 6}
                lg={index === 0 ? 6 : 3}
                key={event.id}
              >
                <EventCard event={event} variant="user" />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Container>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 2,
          }}
        >
          <SectionHeading
            eyebrow="Explore more"
            title="Browse by vibe"
            copy="Whether you want nightlife, culture, beach energy, or food experiences, start with the mood you want your trip to have."
          />

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ maxWidth: { md: 460 }, justifyContent: { md: 'flex-end' } }}
          >
            {categories.map(category => (
              <PillButton
                key={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  px: 2.25,
                  py: 1,
                  fontWeight: 600,
                  color: selectedCategory === category ? '#fff' : '#57534e',
                  borderColor:
                    selectedCategory === category ? '#1c1917' : '#e7e5e4',
                  backgroundColor:
                    selectedCategory === category ? '#1c1917' : '#fff',
                  '&:hover': {
                    borderColor:
                      selectedCategory === category ? '#1c1917' : '#a8a29e',
                    backgroundColor:
                      selectedCategory === category ? '#1c1917' : '#fff',
                  },
                }}
              >
                {category}
              </PillButton>
            ))}
          </Stack>
        </Box>

        <Card
          sx={{
            mb: 5,
            borderRadius: '30px',
            backgroundColor: 'white',
            boxShadow: '0 18px 40px rgba(15,23,42,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={5}>
                <TextField
                  fullWidth
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Search destination events, experiences, or themes"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#faf8f3',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3.5}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={selectedCategory}
                  onChange={event => setSelectedCategory(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#faf8f3',
                    },
                  }}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} lg={3.5}>
                <TextField
                  fullWidth
                  select
                  label="Parish"
                  value={selectedParish}
                  onChange={event => setSelectedParish(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#faf8f3',
                    },
                  }}
                >
                  {parishes.map(parish => (
                    <MenuItem key={parish} value={parish}>
                      {parish}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card
            sx={{
              borderRadius: 5,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 12px 30px rgba(15,23,42,0.05)',
            }}
          >
            <CardContent sx={{ py: 7, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>
                Loading upcoming events...
              </Typography>
            </CardContent>
          </Card>
        ) : error ? (
          <Card
            sx={{
              borderRadius: 5,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 12px 30px rgba(15,23,42,0.05)',
            }}
          >
            <CardContent sx={{ py: 7, textAlign: 'center' }}>
              <Typography sx={{ color: 'error.main', fontWeight: 700 }}>
                We couldn&apos;t load events right now.
              </Typography>
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card
            sx={{
              borderRadius: 5,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 12px 30px rgba(15,23,42,0.05)',
            }}
          >
            <CardContent sx={{ py: 7, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                No events match those filters.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Try another category or parish to widen the list.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {browseEvents.length > 0 ? (
              <Grid container spacing={3}>
                {browseEvents.map(event => (
                  <Grid item xs={12} md={6} xl={4} key={event.id}>
                    <EventCard event={event} variant="user" />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {filteredEvents.map(event => (
                  <Grid item xs={12} md={6} xl={4} key={event.id}>
                    <EventCard event={event} variant="user" />
                  </Grid>
                ))}
              </Grid>
            )}

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <PillButton
                sx={{
                  px: 3.5,
                  py: 1.5,
                  fontWeight: 700,
                  color: '#57534e',
                  borderColor: '#d6d3d1',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    borderColor: '#78716c',
                    backgroundColor: 'transparent',
                    color: '#1c1917',
                  },
                }}
              >
                Explore more events →
              </PillButton>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
