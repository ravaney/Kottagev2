import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Fade } from '@mui/material';
import Grid from '@mui/material/GridLegacy';

import { KottageWithId } from '../../hooks/usePropertySearch';
import { useSearchAnalytics } from '../../services/analyticsService';
import { NoPropertiesFound } from './NoPropertiesFound';
import { Loadingproperties } from './LoadingProperties';
import { PropertyCardFull } from '../Property/PropertyCardFull';

interface SearchResultsProps {
  properties: KottageWithId[];
  searchQuery: string;
  isLoading?: boolean;
  onPropertyClick?: (property: KottageWithId) => void;
  searchCriteria?: {
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({
  properties,
  searchQuery,
  isLoading = false,
  onPropertyClick,
  searchCriteria,
}) => {
  const { trackSearchImpression, trackSearchClick } = useSearchAnalytics();

  // Track search impressions when properties are displayed
  useEffect(() => {
    if (properties && properties.length > 0 && searchQuery) {
      properties.forEach((property, index) => {
        trackSearchImpression(property.key, searchQuery, index + 1);
      });
    }
  }, [properties, searchQuery, trackSearchImpression]);

  const handlePropertyClick = (property: KottageWithId, index: number) => {
    // Track search click
    if (searchQuery) {
      trackSearchClick(property.key, searchQuery, index + 1);
    }
    // Call the original click handler
    onPropertyClick?.(property);
  };

  if (isLoading) return <Loadingproperties searchCriteria={searchCriteria} />;

  if (properties.length === 0) return <NoPropertiesFound />;

  return (
    <Box sx={{ py: 6, backgroundColor: '#f8f9fa', minHeight: '60vh' }}>
      <Container maxWidth="lg">
        {/* Search criteria summary */}
        {searchCriteria?.checkIn && searchCriteria?.checkOut && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
              Available Properties
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing properties available from{' '}
              {searchCriteria?.checkIn.toLocaleDateString()} to{' '}
              {searchCriteria?.checkOut.toLocaleDateString()}
              {searchCriteria?.guests && ` for ${searchCriteria.guests} guests`}
              {searchCriteria?.location && ` in ${searchCriteria.location}`}
            </Typography>
          </Box>
        )}
        {/* Search Results Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, color: '#333' }}
          >
            Search Results
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}{' '}
            found
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>

        {/* Property Grid */}
        <Grid container spacing={3}>
          {properties?.map((property, index) => {
            // Safety check to ensure property has required fields
            if (!property || !property.key || !property.id) {
              return null;
            }

            return (
              <Grid item xs={12} sm={6} lg={4} key={property.id}>
                <Fade in={true} timeout={500 + index * 100} appear>
                  <div>
                    <PropertyCardFull
                      kottage={property}
                      index={index}
                      handlePropertyClick={handlePropertyClick}
                      searchCriteria={searchCriteria}
                    />
                  </div>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        {/* Load More Button (if needed) */}
        {properties.length >= 6 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button variant="outlined" size="large" sx={{ px: 4 }}>
              Load More Properties
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
