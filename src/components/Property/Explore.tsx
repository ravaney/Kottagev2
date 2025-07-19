import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Skeleton,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Zoom,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { useGetAllProperties, useGetFeaturedRegionProperties } from '../../hooks/propertyListingHooks';
import PropertyCard from '../PropertyCard';
import { Colors } from '../constants';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NightlifeIcon from '@mui/icons-material/Nightlife';

const featuredRegions = [
  { 
    name: 'Kingston', 
    image: '/images/kingston.jpg',
    tagline: 'The cultural heart of Jamaica',
    description: 'Experience the vibrant capital city with its rich history, museums, and bustling markets.',
    categories: ['Culture', 'History', 'Nightlife']
  },
  { 
    name: 'Montego Bay', 
    image: '/images/mobay.png',
    tagline: 'Where paradise meets luxury',
    description: 'Discover pristine beaches, world-class resorts, and vibrant nightlife in Jamaica\'s tourism capital.',
    categories: ['Beaches', 'Resorts', 'Shopping']
  },
  { 
    name: 'Ocho Rios', 
    image: '/images/ocho-rios.jpg',
    tagline: 'Adventure awaits in paradise',
    description: 'Climb the famous Dunn\'s River Falls and explore lush rainforests in this adventure-filled destination.',
    categories: ['Waterfalls', 'Adventure', 'Nature']
  },
  { 
    name: 'Negril', 
    image: '/images/negril.jpg',
    tagline: 'Seven miles of pure bliss',
    description: 'Relax on the famous seven-mile beach and witness breathtaking sunsets at the iconic cliff resorts.',
    categories: ['Beaches', 'Sunsets', 'Relaxation']
  },
  { 
    name: 'Portland', 
    image: '/images/portland.png',
    tagline: 'Nature\'s untouched paradise',
    description: 'Explore the lush landscapes, waterfalls, and pristine beaches of Portland.',
    categories: ['Nature', 'Waterfalls', 'Beaches']
  }

];


// Activities for each region
const regionActivities = {
  'Montego Bay': [
    { id: '1', name: 'Doctor\'s Cave Beach', image: '/images/doctors-cave.png', description: 'Crystal clear waters and white sand beach', type: 'beach' },
    { id: '2', name: 'Hip Strip', image: '/images/hip-strip.jpg', description: 'Shopping and vibrant nightlife', type: 'attraction' },
    { id: '3', name: 'Scotchies', image: '/images/scotchies.jpg', description: 'Famous authentic jerk chicken', type: 'restaurant' },
    { id: '4', name: 'Rose Hall', image: '/images/rose-hall.jpg', description: 'Historic mansion with a haunting past', type: 'attraction' },
    { id: '5', name: 'Montego Bay Marine Park', image: '/images/marine-park.jpg', description: 'Snorkeling and diving paradise', type: 'activity' },
    { id: '6', name: 'Martha Brae River Rafting', image: '/images/martha-brae.jpg', description: 'Peaceful bamboo raft rides', type: 'activity' }
  ]
};

export default function Explore() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [selectedRegion, setSelectedRegion] = useState(featuredRegions[4]); // Default to Montego Bay
  const [activeTab, setActiveTab] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Using the region from our selected data
  const { data: regionProperties = [], isLoading } = useGetFeaturedRegionProperties(selectedRegion.name);
  
  // Handle scroll to hide the scroll hint
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Trigger animations after component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleRegionChange = (region: typeof featuredRegions[0]) => {
    setSelectedRegion(region);
    setActiveTab(0);
    
    // Scroll to top of content section
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const getIconForCategory = (category: string) => {
    switch(category.toLowerCase()) {
      case 'beaches': return <BeachAccessIcon />;
      case 'restaurants': return <RestaurantIcon />;
      case 'activity': return <LocalActivityIcon />;
      case 'nightlife': return <NightlifeIcon />;
      case 'attraction': return <ExploreIcon />;
      default: return <LocationOnIcon />;
    }
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Full-screen hero section with background image */}
      <Box 
        sx={{ 
          height: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${selectedRegion.image || '/images/mobay.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)',
            transition: 'all 0.8s ease-in-out',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'
            }
          }}
        />
        
        {/* Content overlay */}
        <Container maxWidth="xl" sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
              pt: { xs: 8, md: 0 }
            }}
          >
            <Fade in={animateIn} timeout={1000}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.9)'
                  }}
                >
                  Explore
                </Typography>
                
                <Typography 
                  variant={isMobile ? "h2" : "h1"} 
                  fontWeight={800} 
                  sx={{ 
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' }
                  }}
                >
                  {selectedRegion.name}
                </Typography>
                
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight={600}
                  sx={{ 
                    mb: 3,
                    maxWidth: '800px',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                  }}
                >
                  {selectedRegion.tagline}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4,
                    maxWidth: '600px',
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {selectedRegion.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                  {selectedRegion.categories.map((category) => (
                    <Chip 
                      key={category}
                      label={category}
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                      }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    onClick={scrollToContent}
                    sx={{
                      backgroundColor: Colors.raspberry,
                      '&:hover': { backgroundColor: Colors.blue },
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600
                    }}
                  >
                    Discover {selectedRegion.name}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': { 
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    View Properties
                  </Button>
                </Box>
              </Box>
            </Fade>
            
            {/* Scroll down indicator */}
            <Fade in={showScrollHint} timeout={1000}>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 40, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={scrollToContent}
              >
                <Typography variant="button" sx={{ display: 'block', mb: 1 }}>
                  Scroll to explore
                </Typography>
                <IconButton 
                  sx={{ 
                    color: 'white',
                    animation: 'bounce 2s infinite'
                  }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
                <style>{`
                  @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                  }
                `}</style>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
      
      {/* Region selector */}
      <Box 
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #eaeaea',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="xl">
          <Box 
            sx={{ 
              display: 'flex', 
              overflowX: 'auto',
              py: 2,
              gap: 2,
              '&::-webkit-scrollbar': {
                height: '4px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: Colors.blue,
                borderRadius: '2px'
              }
            }}
          >
            {featuredRegions.map((region) => (
              <Button
                key={region.name}
                variant={selectedRegion.name === region.name ? "contained" : "outlined"}
                onClick={() => handleRegionChange(region)}
                startIcon={<LocationOnIcon />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  backgroundColor: selectedRegion.name === region.name ? Colors.blue : 'transparent',
                  borderColor: Colors.blue,
                  color: selectedRegion.name === region.name ? 'white' : Colors.blue,
                  '&:hover': {
                    backgroundColor: selectedRegion.name === region.name ? Colors.blue : 'rgba(0, 114, 229, 0.1)',
                  },
                  whiteSpace: 'nowrap',
                  minWidth: 'max-content'
                }}
              >
                {region.name}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>
      
      {/* Main content */}
      <Box ref={contentRef}>
        <Container maxWidth="xl" sx={{ py: 6 }}>
          {/* Magazine-style tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 3
                },
                '& .Mui-selected': {
                  color: Colors.blue
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: Colors.blue,
                  height: 3
                }
              }}
            >
              <Tab icon={<ExploreIcon />} iconPosition="start" label="Overview" />
              <Tab icon={<LocalActivityIcon />} iconPosition="start" label="Things to Do" />
              <Tab icon={<RestaurantIcon />} iconPosition="start" label="Dining" />
              <Tab icon={<HotelIcon />} iconPosition="start" label="Stay" />
              <Tab icon={<NightlifeIcon />} iconPosition="start" label="Nightlife" />
              <Tab icon={<DirectionsCarIcon />} iconPosition="start" label="Getting Around" />
            </Tabs>
          </Box>
          
          {/* Tab content */}
          <Box sx={{ mb: 6 }}>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <Box>
                <Grid container spacing={4}>
                  {/* Main feature */}
                  <Grid item xs={12} md={8}>
                    <Card sx={{ 
                      borderRadius: 3, 
                      overflow: 'hidden',
                      height: '100%',
                      boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
                    }}>
                      <CardMedia
                        component="img"
                        height={400}
                        image={selectedRegion.image}
                        alt={selectedRegion.name}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Welcome to {selectedRegion.name}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {selectedRegion.description}
                        </Typography>
                        <Typography variant="body1">
                          Known for its {selectedRegion.categories.join(', ')}, {selectedRegion.name} offers visitors 
                          an authentic Jamaican experience with a perfect blend of natural beauty, cultural richness, 
                          and warm hospitality.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Highlights */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 3
                    }}>
                      <Typography variant="h5" fontWeight={700} color={Colors.blue}>
                        Highlights
                      </Typography>
                      
                      {regionActivities['Montego Bay']?.slice(0, 3).map((activity) => (
                        <Card key={activity.id} sx={{ 
                          display: 'flex',
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                          }
                        }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 120 }}
                            image={activity.image}
                            alt={activity.name}
                          />
                          <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                              {getIconForCategory(activity.type)}
                              <Typography variant="subtitle1" fontWeight={600}>
                                {activity.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => setActiveTab(1)}
                        sx={{
                          borderColor: Colors.blue,
                          color: Colors.blue,
                          borderRadius: 2,
                          py: 1,
                          mt: 'auto',
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 114, 229, 0.05)',
                          }
                        }}
                      >
                        View All Activities
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Things to Do Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h4" fontWeight={700} color={Colors.blue} gutterBottom>
                  Things to Do in {selectedRegion.name}
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ maxWidth: 800, mb: 4 }}>
                  From pristine beaches to historic sites, {selectedRegion.name} offers a wide range of activities 
                  for every type of traveler. Explore the top attractions and experiences in the area.
                </Typography>
                
                <Grid container spacing={3}>
                  {regionActivities['Montego Bay']?.map((activity) => (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                      <Card sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                        }
                      }}>
                        <CardMedia
                          component="img"
                          height={200}
                          image={activity.image}
                          alt={activity.name}
                        />
                        <CardContent sx={{ p: 3 }}>
                          <Chip 
                            label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            size="small"
                            icon={getIconForCategory(activity.type)}
                            sx={{ 
                              mb: 1.5,
                              fontWeight: 500,
                              backgroundColor: 'rgba(0, 114, 229, 0.1)',
                              color: Colors.blue
                            }}
                          />
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {activity.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Stay Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h4" fontWeight={700} color={Colors.blue} gutterBottom>
                  Places to Stay in {selectedRegion.name}
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ maxWidth: 800, mb: 4 }}>
                  Find your perfect accommodation in {selectedRegion.name}, from luxury resorts to cozy villas.
                </Typography>
                
                <Grid container spacing={3}>
                  {isLoading ? (
                    Array.from(new Array(6)).map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
                      </Grid>
                    ))
                  ) : regionProperties.length > 0 ? (
                    regionProperties.map((property) => (
                      <Grid item xs={12} sm={6} md={4} key={property.id}>
                        <PropertyCard property={property} />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6">No properties found in {selectedRegion.name}.</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Check back soon as we add more properties to this region.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
            
            {/* Placeholder for other tabs */}
            {(activeTab === 2 || activeTab === 4 || activeTab === 5) && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary">
                  Coming soon! We're working on this section.
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}