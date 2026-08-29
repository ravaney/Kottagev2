import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { SearchData } from '../../hooks/usePropertySearch';
import PopularKottages from './PopularKottages';
import {
  Typography,
  Box,
  Container,
  Paper,
  Fade,
  IconButton,
  Chip,
  Card,
  Button,
  Avatar,
  Rating,
  useTheme,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  KeyboardArrowDown,
  LocationOn,
  Star,
  Security,
  SupportAgent,
  Verified,
  Phone,
  Email,
  Schedule,
} from '@mui/icons-material';

export const Splash = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (searchData: SearchData) => {
    // Create URL parameters for search
    const params = new URLSearchParams();
    if (searchData.location) params.set('location', searchData.location);
    if (searchData.checkIn)
      params.set('checkIn', searchData.checkIn.toISOString());
    if (searchData.checkOut)
      params.set('checkOut', searchData.checkOut.toISOString());
    if (searchData.guests > 1)
      params.set('guests', searchData.guests.toString());

    // Navigate to search page with parameters
    navigate(`/search?${params.toString()}`);
  };

  const scrollToContent = () => {
    const element = document.querySelector('#content-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 'auto', md: 'calc(100vh - 70px)' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          pt: { xs: 10, md: 5.5 },
          pb: { xs: 8, md: 4.5 },
          '@media (max-height: 820px)': {
            pt: 4,
            pb: 3,
          },
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src="/swift river.jpg"
          alt="Swift River Jamaica"
          onError={e => {
            console.log('Image failed to load, trying fallback...');
            e.currentTarget.src = '/bluemountain.jpg';
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7)',
            zIndex: 0,
          }}
        />

        {/* Fallback Background (CSS) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'url(/swift river.jpg), url(/bluemountain.jpg), url(/negril.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.7)',
            zIndex: -1,
            display: 'none', // Hidden unless img fails
          }}
        />

        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, rgba(7,20,33,0.82) 0%, rgba(7,20,33,0.62) 34%, rgba(7,20,33,0.34) 68%, rgba(7,20,33,0.28) 100%)',
            zIndex: 1,
          }}
        />

        <Chip
          icon={<Star />}
          label="4.9★ Rated"
          sx={{
            display: 'none',
          }}
        />

        <Chip
          icon={<LocationOn />}
          label="200+ Locations"
          sx={{
            display: 'none',
          }}
        />

        {/* Main Content */}
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
          }}
        >
          <Fade in={isVisible} timeout={800}>
            <Box sx={{ maxWidth: '1180px', mx: 'auto' }}>
              <Box
                sx={{
                  maxWidth: { xs: '100%', md: '780px' },
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 4, md: 3.5 },
                  '@media (max-height: 820px)': {
                    mb: 2.5,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mb: 3,
                  }}
                >
                  {[
                    { label: '4.9 Rated', icon: <Star /> },
                    { label: '200+ Locations', icon: <LocationOn /> },
                    { label: 'Verified Stays', icon: <Verified /> },
                  ].map(item => (
                    <Chip
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.16)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(12px)',
                        fontWeight: 600,
                        px: 0.5,
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.25rem', sm: '3rem', md: '3.55rem' },
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                    textShadow: '0 10px 24px rgba(0,0,0,0.32)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.06,
                    maxWidth: '760px',
                    mx: { xs: 'auto', md: 0 },
                    '@media (max-height: 820px)': {
                      fontSize: '3.1rem',
                    },
                  }}
                >
                  Book boutique hotels, villas, and premium stays in Jamaica
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.92)',
                    mb: { xs: 4, md: 3.5 },
                    fontWeight: 400,
                    textShadow: '0 6px 16px rgba(0,0,0,0.28)',
                    fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.22rem' },
                    lineHeight: 1.48,
                    maxWidth: '680px',
                    mx: { xs: 'auto', md: 0 },
                    '@media (max-height: 820px)': {
                      mb: 2.75,
                    },
                  }}
                >
                  Discover Jamaica&apos;s hidden gems and reserve unforgettable
                  stays across the island, from coastal escapes to mountain
                  retreats.
                </Typography>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.25, sm: 3, md: 2.75 },
                  borderRadius: 5,
                  backgroundColor: 'rgba(255,255,255,0.94)',
                  backdropFilter: 'blur(18px)',
                  width: '100%',
                  maxWidth: '1120px',
                  ml: { xs: 'auto', md: 0 },
                  mr: { xs: 'auto', md: 'auto' },
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
                  mb: { xs: 3, md: 2.5 },
                  '@media (max-height: 820px)': {
                    p: 2.25,
                    mb: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 1.75,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#22313f',
                      fontWeight: 700,
                      mb: 0.75,
                    }}
                  >
                    Find Your Perfect Stay
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#5f6875',
                    }}
                  >
                    Search from over 200 unique properties across Jamaica.
                  </Typography>
                </Box>

                <SearchBar onSearch={handleSearch} variant="hero" />

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mt: 1.75,
                  }}
                >
                  {[
                    'Beachfront',
                    'Mountain View',
                    'City Center',
                    'Eco Lodge',
                  ].map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: 'rgba(34,49,63,0.16)',
                        color: '#5f6875',
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(255,255,255,0.55)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,123,255,0.05)',
                          borderColor: 'rgba(0,123,255,0.3)',
                          cursor: 'pointer',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(3, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(180px, 220px))',
                  },
                  gap: { xs: 1, sm: 1.25, md: 1.5 },
                  justifyContent: { xs: 'stretch', md: 'start' },
                  maxWidth: { xs: '100%', md: 'fit-content' },
                  mx: { xs: 'auto', md: 0 },
                  '@media (max-height: 820px)': {
                    gap: 1,
                  },
                }}
              >
                {[
                  { value: '50K+', label: 'Happy Guests' },
                  { value: '98%', label: 'Satisfaction Rate' },
                  { value: '24/7', label: 'Support' },
                ].map(item => (
                  <Box
                    key={item.label}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 3,
                      py: 1,
                      px: 1.25,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        fontSize: { xs: '1.05rem', sm: '1.2rem' },
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.82)',
                        display: 'block',
                        mt: 0.25,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>

        {/* Scroll Indicator */}
        <IconButton
          onClick={scrollToContent}
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 3,
            display: { xs: 'none', lg: 'flex' },
            animation: 'bounce 2s infinite',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'translateX(-50%) scale(1.1)',
            },
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateX(-50%) translateY(0)',
              },
              '40%': {
                transform: 'translateX(-50%) translateY(-10px)',
              },
              '60%': {
                transform: 'translateX(-50%) translateY(-5px)',
              },
            },
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      </Box>

      {/* Content Sections */}
      <Box id="content-section">
        <PopularKottages />

        {/* Features Section */}
        <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 700,
                color: '#333',
              }}
            >
              Why Choose Blue Kottage?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Experience the best of Jamaica with our premium accommodations and
              exceptional service
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    border: 'none',
                    boxShadow: 3,
                  }}
                >
                  <Security
                    sx={{
                      fontSize: 60,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Secure Booking
                  </Typography>
                  <Typography color="text.secondary">
                    Your payments are protected with bank-level security. Book
                    with confidence knowing your information is safe.
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    border: 'none',
                    boxShadow: 3,
                  }}
                >
                  <SupportAgent
                    sx={{
                      fontSize: 60,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    24/7 Support
                  </Typography>
                  <Typography color="text.secondary">
                    Our dedicated team is available round the clock to assist
                    you with any questions or concerns.
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    border: 'none',
                    boxShadow: 3,
                  }}
                >
                  <Verified
                    sx={{
                      fontSize: 60,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Verified Properties
                  </Typography>
                  <Typography color="text.secondary">
                    Every property is personally inspected and verified to
                    ensure it meets our high standards.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: 8, backgroundColor: 'white' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 700,
                color: '#333',
              }}
            >
              What Our Guests Say
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  name: 'Sarah Johnson',
                  location: 'New York, USA',
                  rating: 5,
                  comment:
                    "Absolutely incredible experience! The property was exactly as described and the host was amazing. Can't wait to come back to Jamaica!",
                  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                },
                {
                  name: 'Michael Chen',
                  location: 'Toronto, Canada',
                  rating: 5,
                  comment:
                    'Perfect getaway spot! The location was stunning and the amenities were top-notch. Yaad made booking so easy and secure.',
                  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                },
                {
                  name: 'Emma Wilson',
                  location: 'London, UK',
                  rating: 5,
                  comment:
                    'Best vacation rental platform for Jamaica! The customer service was exceptional and the property exceeded all expectations.',
                  avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                },
              ].map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', p: 3, boxShadow: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      sx={{ mb: 2 }}
                    />
                    <Typography
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ py: 8, backgroundColor: 'white' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 700,
                color: '#333',
              }}
            >
              How Yaad Works
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  step: '01',
                  title: 'Search & Discover',
                  description:
                    "Browse our curated collection of verified properties across Jamaica's most beautiful locations.",
                  icon: <LocationOn sx={{ fontSize: 40 }} />,
                },
                {
                  step: '02',
                  title: 'Book Securely',
                  description:
                    'Reserve your perfect stay with our secure booking system and flexible cancellation policies.',
                  icon: <Security sx={{ fontSize: 40 }} />,
                },
                {
                  step: '03',
                  title: 'Enjoy Your Stay',
                  description:
                    'Experience Jamaica like a local with our premium accommodations and 24/7 support.',
                  icon: <Star sx={{ fontSize: 40 }} />,
                },
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ textAlign: 'center', position: 'relative' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: '4rem',
                        fontWeight: 800,
                        color: alpha(theme.palette.primary.main, 0.1),
                        mb: -2,
                      }}
                    >
                      {step.step}
                    </Typography>
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        mb: 2,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Contact/CTA Section */}
        <Box sx={{ py: 8, backgroundColor: '#333', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  Ready to Experience Jamaica?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Join thousands of travelers who have discovered their perfect
                  Jamaican getaway with Yaad.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: 'white',
                      color: '#333',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    Start Searching
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Phone sx={{ fontSize: 20 }} />
                      <Typography>+1-876-555-YAAD</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Email sx={{ fontSize: 20 }} />
                      <Typography>hello@yaad.com</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Schedule sx={{ fontSize: 20 }} />
                      <Typography>24/7 Support Available</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

      </Box>
    </>
  );
};
export default Splash;
