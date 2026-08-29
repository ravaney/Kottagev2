import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  ArrowForward,
  BusinessCenter,
  HeadsetMic,
  LaptopMac,
  Monitor,
  Verified,
  Wifi,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../hooks/usePropertySearch';
import { PropertyCardFull } from '../Property/PropertyCardFull';
import { Colors } from '../constants';
import {
  NOMAD_PASS_PRICE,
  NOMAD_WIFI_THRESHOLD,
  getNomadLocationLabel,
  getNomadPerkLabels,
  isNomadVerified,
} from '../../utils/nomadUtils';

const perkCards = [
  {
    title: 'Verified High-Speed Wi-Fi',
    body: 'Stay productive with reliable internet built for video calls and deep work.',
    icon: <Wifi sx={{ fontSize: 30, color: Colors.cerulean }} />,
  },
  {
    title: 'Coworking Access',
    body: 'Selected stays include access to partner coworking spaces for focused workdays.',
    icon: <BusinessCenter sx={{ fontSize: 30, color: Colors.cerulean }} />,
  },
  {
    title: 'Private Workspace',
    body: 'Choose properties with a dedicated desk setup so your stay works like an office.',
    icon: <LaptopMac sx={{ fontSize: 30, color: Colors.cerulean }} />,
  },
  {
    title: 'Ergonomic Setup',
    body: 'Desk-and-chair comfort matters. Nomad-ready properties can call this out clearly.',
    icon: <Monitor sx={{ fontSize: 30, color: Colors.cerulean }} />,
  },
  {
    title: 'Nomad Verified',
    body: 'Look for the badge to quickly find remote-work-friendly stays in Jamaica.',
    icon: <Verified sx={{ fontSize: 30, color: Colors.cerulean }} />,
  },
  {
    title: 'Local Concierge Help',
    body: 'Helpful local guidance, coworking directions, and practical support for your trip.',
    icon: <HeadsetMic sx={{ fontSize: 30, color: Colors.cerulean }} />,
  },
];

export default function NomadNetworkPage() {
  const navigate = useNavigate();
  const propertiesRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const { data: properties = [], isLoading, error } = useProperties();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [coworkingOnly, setCoworkingOnly] = useState(false);
  const [workspaceOnly, setWorkspaceOnly] = useState(false);
  const [fastWifiOnly, setFastWifiOnly] = useState(false);

  const nomadProperties = properties
    .filter(property => isNomadVerified(property))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const locations = [
    'All',
    ...Array.from(
      new Set(nomadProperties.map(property => getNomadLocationLabel(property)))
    ),
  ];

  const filteredProperties = nomadProperties.filter(property => {
    const matchesLocation =
      selectedLocation === 'All' ||
      getNomadLocationLabel(property) === selectedLocation;

    const matchesCoworking =
      !coworkingOnly || Boolean(property.nomad?.coworkingAccess);
    const matchesWorkspace =
      !workspaceOnly || Boolean(property.nomad?.privateWorkspace);
    const matchesWifi =
      !fastWifiOnly ||
      (property.nomad?.wifiSpeedMbps || 0) >= NOMAD_WIFI_THRESHOLD;

    return matchesLocation && matchesCoworking && matchesWorkspace && matchesWifi;
  });

  const scrollToProperties = () => {
    propertiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Box
        sx={{
          background:
            'linear-gradient(135deg, rgba(8,39,95,1) 0%, rgba(15,87,168,1) 45%, rgba(245,79,121,0.92) 100%)',
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 35%), radial-gradient(circle at bottom left, rgba(255,255,255,0.12), transparent 30%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            label="Nomad Network"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: Colors.cerulean,
              backgroundColor: 'rgba(255,255,255,0.92)',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              maxWidth: 760,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '4rem' },
            }}
          >
            Work. Travel. Stay Connected.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 760,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            Enjoy high-speed internet, coworking access, and flexible stays
            across our Nomad Verified properties in Jamaica. Add the Nomad Pass
            during checkout on eligible stays.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={scrollToPricing}
              sx={{
                backgroundColor: 'white',
                color: Colors.cerulean,
                px: 4,
                py: 1.4,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.92)',
                },
              }}
            >
              Get the Nomad Pass
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={scrollToProperties}
              sx={{
                borderColor: 'rgba(255,255,255,0.7)',
                color: 'white',
                px: 4,
                py: 1.4,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              View Nomad Properties
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {perkCards.map(card => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid rgba(8,39,95,0.08)',
                }}
              >
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          ref={pricingRef}
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 6,
            borderRadius: 4,
            border: '1px solid rgba(8,39,95,0.08)',
            background:
              'linear-gradient(135deg, rgba(227,242,253,0.85) 0%, rgba(255,255,255,1) 100%)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                Nomad Pass
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Add the Nomad Pass during checkout on eligible properties to
                unlock remote-work-friendly perks like coworking access, fast
                Wi-Fi visibility, and workspace-focused stays.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="Checkout add-on only" color="primary" />
                <Chip label="Available on Nomad Verified stays" variant="outlined" />
                <Chip label="No monthly subscription in v1" variant="outlined" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(8,39,95,0.1)',
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Add during checkout
                  </Typography>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{ color: Colors.raspberry, my: 1 }}
                  >
                    ${NOMAD_PASS_PRICE}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per eligible reservation
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Box ref={propertiesRef} sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            Where You Can Work & Stay
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Browse Nomad Verified properties across Jamaica and filter for the
            remote-work perks that matter most.
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {locations.map(location => (
              <Chip
                key={location}
                label={location}
                clickable
                color={selectedLocation === location ? 'primary' : 'default'}
                variant={selectedLocation === location ? 'filled' : 'outlined'}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
            <Chip
              label="Coworking Access"
              clickable
              color={coworkingOnly ? 'primary' : 'default'}
              variant={coworkingOnly ? 'filled' : 'outlined'}
              onClick={() => setCoworkingOnly(value => !value)}
            />
            <Chip
              label="Private Workspace"
              clickable
              color={workspaceOnly ? 'primary' : 'default'}
              variant={workspaceOnly ? 'filled' : 'outlined'}
              onClick={() => setWorkspaceOnly(value => !value)}
            />
            <Chip
              label={`${NOMAD_WIFI_THRESHOLD}+ Mbps Wi-Fi`}
              clickable
              color={fastWifiOnly ? 'primary' : 'default'}
              variant={fastWifiOnly ? 'filled' : 'outlined'}
              onClick={() => setFastWifiOnly(value => !value)}
            />
          </Stack>
        </Box>

        {isLoading ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">
            Unable to load Nomad properties right now. Please try again later.
          </Alert>
        ) : filteredProperties.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Nomad properties match these filters yet.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try another location or turn off one of the workspace filters.
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
              {filteredProperties.length} Nomad Verified propert
              {filteredProperties.length === 1 ? 'y' : 'ies'} found
            </Typography>
            <Grid container spacing={3}>
              {filteredProperties.map((property, index) => (
                <Grid item xs={12} sm={6} lg={4} key={property.key}>
                  <PropertyCardFull
                    kottage={property}
                    index={index}
                    handlePropertyClick={selectedProperty => {
                      navigate(`/Kottages/${selectedProperty.key}`, {
                        state: {
                          kottage: selectedProperty,
                          searchCriteria: {
                            location:
                              selectedLocation === 'All' ? '' : selectedLocation,
                            guests: 1,
                          },
                        },
                      });
                    }}
                    searchCriteria={{
                      location: selectedLocation === 'All' ? '' : selectedLocation,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {nomadProperties.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: 3,
              borderRadius: 3,
              border: '1px dashed rgba(8,39,95,0.15)',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              What guests will see on Nomad Verified listings
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {getNomadPerkLabels(nomadProperties[0].nomad, {
                includeWifiSpeed: true,
              })
                .slice(0, 5)
                .map(label => (
                  <Chip key={label} label={label} size="small" variant="outlined" />
                ))}
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

