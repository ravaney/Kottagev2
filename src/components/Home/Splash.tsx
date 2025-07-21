import { Stack } from "@fluentui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { SearchData } from "../../hooks/usePropertySearch";
import PopularKottages from "./PopularKottages";
import { 
  Typography, 
  Box, 
  Container, 
  Paper,
  Fade,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Rating,
  Divider,
  useTheme,
  alpha
} from "@mui/material";
import { 
  KeyboardArrowDown, 
  LocationOn, 
  Star, 
  TrendingUp,
  Security,
  SupportAgent,
  Verified,
  PlayArrow,
  ArrowForward,
  Phone,
  Email,
  Schedule,
  LocalOffer,
  EmojiEvents,
  Favorite
} from "@mui/icons-material";

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
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn.toISOString());
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut.toISOString());
    if (searchData.guests > 1) params.set('guests', searchData.guests.toString());
    
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
          height: '85vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src="/swift river.jpg"
          alt="Swift River Jamaica"
          onError={(e) => {
            console.log('Image failed to load, trying fallback...');
            e.currentTarget.src = "/bluemountain.jpg";
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
            backgroundImage: 'url(/swift river.jpg), url(/bluemountain.jpg), url(/negril.jpg)',
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
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1,
          }}
        />

        {/* Floating Badges */}
        <Chip
          icon={<Star />}
          label="4.9★ Rated"
          sx={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#333',
            fontWeight: 600,
            fontSize: '0.9rem',
            zIndex: 2,
            display: { xs: 'none', md: 'flex' }
          }}
        />

        <Chip
          icon={<LocationOn />}
          label="200+ Locations"
          sx={{
            position: 'absolute',
            top: '25%',
            right: '5%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#333',
            fontWeight: 600,
            fontSize: '0.9rem',
            zIndex: 2,
            display: { xs: 'none', md: 'flex' }
          }}
        />

        {/* Main Content */}
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '100%' }}>
          <Fade in={isVisible} timeout={800}>
            <Box>
              {/* Main Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 700,
                  color: 'white',
                  mb: 2,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
                  textTransform: 'capitalize',
                  letterSpacing: '0.02em'
                }}
              >
                Welcome to Yaad
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  mb: 6,
                  fontWeight: 300,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                Discover Jamaica's hidden gems and book your perfect getaway
              </Typography>

              {/* Enhanced Search Container */}
              <Paper
                elevation={12}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  width: 'fit-content',
                  mx: 'auto',
                  mb: 4,
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#333',
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center'
                    }}
                  >
                    Find Your Perfect Stay
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      textAlign: 'center',
                      mb: 2
                    }}
                  >
                    Search from over 200 unique properties across Jamaica
                  </Typography>
                </Box>
                
                <SearchBar onSearch={handleSearch} />
                
                {/* Quick Search Tags */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  mt: 3
                }}>
                  {['Beachfront', 'Mountain View', 'City Center', 'Eco Lodge'].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#ddd',
                        color: '#666',
                        fontSize: '0.75rem',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          borderColor: '#999',
                          cursor: 'pointer'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Trust Indicators */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: { xs: 2, sm: 4 },
                flexWrap: 'wrap'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    50K+
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Happy Guests
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    98%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Satisfaction Rate
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    24/7
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Support
                  </Typography>
                </Box>
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
                color: '#333'
              }}
            >
              Why Choose Yaad?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                mb: 6, 
                color: '#666',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Experience the best of Jamaica with our premium accommodations and exceptional service
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3, border: 'none', boxShadow: 3 }}>
                  <Security sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Secure Booking
                  </Typography>
                  <Typography color="text.secondary">
                    Your payments are protected with bank-level security. Book with confidence knowing your information is safe.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3, border: 'none', boxShadow: 3 }}>
                  <SupportAgent sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    24/7 Support
                  </Typography>
                  <Typography color="text.secondary">
                    Our dedicated team is available round the clock to assist you with any questions or concerns.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3, border: 'none', boxShadow: 3 }}>
                  <Verified sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Verified Properties
                  </Typography>
                  <Typography color="text.secondary">
                    Every property is personally inspected and verified to ensure it meets our high standards.
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
                    color: '#333'
                  }}
                >
                  What Our Guests Say
                </Typography>
                
                <Grid container spacing={4}>
                  {[
                    {
                      name: "Sarah Johnson",
                      location: "New York, USA",
                      rating: 5,
                      comment: "Absolutely incredible experience! The property was exactly as described and the host was amazing. Can't wait to come back to Jamaica!",
                      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                    },
                    {
                      name: "Michael Chen",
                      location: "Toronto, Canada", 
                      rating: 5,
                      comment: "Perfect getaway spot! The location was stunning and the amenities were top-notch. Yaad made booking so easy and secure.",
                      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                    },
                    {
                      name: "Emma Wilson", 
                      location: "London, UK",
                      rating: 5,
                      comment: "Best vacation rental platform for Jamaica! The customer service was exceptional and the property exceeded all expectations.",
                      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
                    }
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
                        <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          "{testimonial.comment}"
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>

            {/* Special Offers Section */}
            <Box sx={{ py: 8, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
              <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                      Limited Time Offers
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
                      Don't miss out on these exclusive deals for your Jamaica getaway
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Chip 
                        icon={<LocalOffer />} 
                        label="Early Bird - Save 25%" 
                        sx={{ mr: 2, mb: 2, backgroundColor: '#4caf50', color: 'white' }}
                      />
                      <Chip 
                        icon={<EmojiEvents />} 
                        label="Extended Stay - 7+ nights" 
                        sx={{ mr: 2, mb: 2, backgroundColor: '#ff9800', color: 'white' }}
                      />
                      <Chip 
                        icon={<Favorite />} 
                        label="First Time Guest - 15% off" 
                        sx={{ mb: 2, backgroundColor: '#e91e63', color: 'white' }}
                      />
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem'
                      }}
                    >
                      View All Deals
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ overflow: 'hidden', boxShadow: 4 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image="/negril.jpg"
                        alt="Special Offer"
                      />
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                          Weekend Getaway Special
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          Book 2 nights, get the 3rd night 50% off
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                          Starting at $199/night
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
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
                    color: '#333'
                  }}
                >
                  How Yaad Works
                </Typography>
                
                <Grid container spacing={4}>
                  {[
                    {
                      step: "01",
                      title: "Search & Discover",
                      description: "Browse our curated collection of verified properties across Jamaica's most beautiful locations.",
                      icon: <LocationOn sx={{ fontSize: 40 }} />
                    },
                    {
                      step: "02", 
                      title: "Book Securely",
                      description: "Reserve your perfect stay with our secure booking system and flexible cancellation policies.",
                      icon: <Security sx={{ fontSize: 40 }} />
                    },
                    {
                      step: "03",
                      title: "Enjoy Your Stay",
                      description: "Experience Jamaica like a local with our premium accommodations and 24/7 support.",
                      icon: <Star sx={{ fontSize: 40 }} />
                    }
                  ].map((step, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box sx={{ textAlign: 'center', position: 'relative' }}>
                        <Typography 
                          variant="h1" 
                          sx={{ 
                            fontSize: '4rem',
                            fontWeight: 800,
                            color: alpha(theme.palette.primary.main, 0.1),
                            mb: -2
                          }}
                        >
                          {step.step}
                        </Typography>
                        <Box sx={{ 
                          color: theme.palette.primary.main, 
                          mb: 2,
                          position: 'relative',
                          zIndex: 1
                        }}>
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
                      Join thousands of travelers who have discovered their perfect Jamaican getaway with Yaad.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        size="large"
                        sx={{ 
                          backgroundColor: 'white',
                          color: '#333',
                          '&:hover': { backgroundColor: '#f5f5f5' }
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
                          '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        Learn More
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 20 }} />
                          <Typography>+1-876-555-YAAD</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 20 }} />
                          <Typography>hello@yaad.com</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Schedule sx={{ fontSize: 20 }} />
                          <Typography>24/7 Support Available</Typography>
                        </Box>
                      </Box>
                    </Box>
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
                    color: '#333'
                  }}
                >
                  What Our Guests Say
                </Typography>
                
                <Grid container spacing={4}>
                  {[
                    {
                      name: "Sarah Johnson",
                      location: "New York, USA",
                      rating: 5,
                      comment: "Absolutely incredible experience! The property was exactly as described and the host was amazing. Can't wait to come back to Jamaica!",
                      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                    },
                    {
                      name: "Michael Chen",
                      location: "Toronto, Canada", 
                      rating: 5,
                      comment: "Perfect getaway spot! The location was stunning and the amenities were top-notch. Yaad made booking so easy and secure.",
                      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                    },
                    {
                      name: "Emma Wilson", 
                      location: "London, UK",
                      rating: 5,
                      comment: "Best vacation rental platform for Jamaica! The customer service was exceptional and the property exceeded all expectations.",
                      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
                    }
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
                        <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          "{testimonial.comment}"
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>

            {/* Special Offers Section */}
            <Box sx={{ py: 8, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
              <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                      Limited Time Offers
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
                      Don't miss out on these exclusive deals for your Jamaica getaway
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Chip 
                        icon={<LocalOffer />} 
                        label="Early Bird - Save 25%" 
                        sx={{ mr: 2, mb: 2, backgroundColor: '#4caf50', color: 'white' }}
                      />
                      <Chip 
                        icon={<EmojiEvents />} 
                        label="Extended Stay - 7+ nights" 
                        sx={{ mr: 2, mb: 2, backgroundColor: '#ff9800', color: 'white' }}
                      />
                      <Chip 
                        icon={<Favorite />} 
                        label="First Time Guest - 15% off" 
                        sx={{ mb: 2, backgroundColor: '#e91e63', color: 'white' }}
                      />
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem'
                      }}
                    >
                      View All Deals
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ overflow: 'hidden', boxShadow: 4 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image="/negril.jpg"
                        alt="Special Offer"
                      />
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                          Weekend Getaway Special
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          Book 2 nights, get the 3rd night 50% off
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                          Starting at $199/night
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
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
                    color: '#333'
                  }}
                >
                  How Yaad Works
                </Typography>
                
                <Grid container spacing={4}>
                  {[
                    {
                      step: "01",
                      title: "Search & Discover",
                      description: "Browse our curated collection of verified properties across Jamaica's most beautiful locations.",
                      icon: <LocationOn sx={{ fontSize: 40 }} />
                    },
                    {
                      step: "02", 
                      title: "Book Securely",
                      description: "Reserve your perfect stay with our secure booking system and flexible cancellation policies.",
                      icon: <Security sx={{ fontSize: 40 }} />
                    },
                    {
                      step: "03",
                      title: "Enjoy Your Stay",
                      description: "Experience Jamaica like a local with our premium accommodations and 24/7 support.",
                      icon: <Star sx={{ fontSize: 40 }} />
                    }
                  ].map((step, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box sx={{ textAlign: 'center', position: 'relative' }}>
                        <Typography 
                          variant="h1" 
                          sx={{ 
                            fontSize: '4rem',
                            fontWeight: 800,
                            color: alpha(theme.palette.primary.main, 0.1),
                            mb: -2
                          }}
                        >
                          {step.step}
                        </Typography>
                        <Box sx={{ 
                          color: theme.palette.primary.main, 
                          mb: 2,
                          position: 'relative',
                          zIndex: 1
                        }}>
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
                      Join thousands of travelers who have discovered their perfect Jamaican getaway with Yaad.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        size="large"
                        sx={{ 
                          backgroundColor: 'white',
                          color: '#333',
                          '&:hover': { backgroundColor: '#f5f5f5' }
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
                          '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        Learn More
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 20 }} />
                          <Typography>+1-876-555-YAAD</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 20 }} />
                          <Typography>hello@yaad.com</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
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
