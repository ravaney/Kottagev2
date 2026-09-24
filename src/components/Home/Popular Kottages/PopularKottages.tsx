import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
  alpha,
  Skeleton,
  Button,
} from '@mui/material';
import {
  usePopularProperties,
  KottageWithId,
} from '../../../hooks/usePropertySearch';
import { Colors } from '../../constants';
import { ErrorComponents } from '../ErrorComponents';
import { ShowcasePropertiesSimple } from './ShowcasePropertiesSimple';
import { GoArrowRight } from 'react-icons/go';

type Props = {};

function PopularKottages({}: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  // Use the Firebase-backed popular properties hook
  const {
    data: properties = [],
    isLoading: loading,
    error,
  } = usePopularProperties(6);

  const handlePropertyClick = (property: KottageWithId) => {
    // Navigate to property detail page with property data in state
    navigate(`/Kottages/${property.key}`, {
      state: {
        kottage: property,
        source: 'popular', // Indicate this came from popular properties
      },
    });
  };
  return (
    <Box
      id="content-section"
      sx={{
        scrollMarginTop: { xs: '64px', sm: '70px' },
        height: { xs: 'auto', sm: 'calc(100dvh - 70px)' },
        bgcolor: '#edf1f6',
        width: '100%',
        p: 5,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          height: { xs: 'auto', sm: '100%' },
          minHeight: 0,
          gridTemplateRows: {
            xs: 'auto auto',
            sm: '230px minmax(0, 1fr)',
          },
        }}
      >
        {/* Section Header */}
        <Box
          id="header"
          sx={{
            textAlign: 'center',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            height: '100%',
            minHeight: 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box
            id="col1"
            sx={{
              pb: 1,
              display: 'grid',
              alignContent: 'flex-start',
              gridTemplateRows: 'auto',
              textAlign: 'left',
              gap: 1,
            }}
          >
            <Typography sx={{ color: Colors.raspberry }} fontWeight={'500'}>
              STAYS PEOPLE LOVE
            </Typography>
            <Box
              component="img"
              src="/bk_brand/bk_popularkottages.png"
              alt="Popular Kottages"
              sx={{
                width: '60%',
              }}
            />
            <Typography
              fontWeight={'bold'}
              sx={{ color: Colors.raspberry, mt: -3 }}
            >
              ━━━
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                width: '70%',
              }}
            >
              Discover our most loved accommodations across Jamaica's stunning
              landscapes
            </Typography>

            {/* Trending Tags */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              {[
                '★ Most Booked',
                'Best Rated',
                'Trending Now',
                '❤ Guest Favorites',
              ].map(tag => (
                <Chip
                  size="small"
                  label={tag}
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                    },
                    fontSize: '0.8rem',
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              alignSelf: 'center',
            }}
          >
            <Button
              variant="text"
              sx={{
                mt: 2,
                borderBottom: '2px solid ' + Colors.raspberry,
                borderRadius: 0,
                color: 'black',
                '&:hover': {
                  backgroundColor: 'transparent',
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
              endIcon={<GoArrowRight />}
            >
              Explore All Popular Kottages
            </Button>
          </Box>
        </Box>

        {/* Property Cards Grid */}
        {error ? (
          <ErrorComponents type="popular" />
        ) : (
          <Box sx={{ height: '100%', minHeight: 0 }}>
            {loading ? (
              <Box sx={{ height: '100%', minHeight: 0 }}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" width="100%" height={250} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 2fr',
                  gap: 1,
                  height: '100%',
                  minHeight: 0,
                }}
              >
                <ShowcasePropertiesSimple
                  key={properties[0].id}
                  kottage={properties[0]}
                />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
                    height: '100%',
                    minHeight: 0,
                    gap: 1,
                  }}
                >
                  {properties.slice(1, 3).map(property => (
                    <ShowcasePropertiesSimple
                      key={property.id}
                      kottage={property}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PopularKottages;
