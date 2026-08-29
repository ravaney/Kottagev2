import React, { useEffect } from 'react';
import { Box, Fade, Stack } from '@mui/material';
import Grid from '@mui/material/GridLegacy';

import { KottageWithId } from '../../hooks/usePropertySearch';
import { useSearchAnalytics } from '../../services/analyticsService';
import { NoPropertiesFound } from './NoPropertiesFound';
import { Loadingproperties } from './LoadingProperties';
import { PropertyCardFull } from '../Property/PropertyCardFull';
import { Colors } from '../constants';

interface SearchResultsProps {
  properties: KottageWithId[];
  searchQuery: string;
  isLoading?: boolean;
  onPropertyClick?: (property: KottageWithId) => void;
  onPropertyFocus?: (propertyId: string) => void;
  selectedPropertyId?: string | null;
  compact?: boolean;
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
  onPropertyFocus,
  selectedPropertyId,
  compact = false,
  searchCriteria,
}) => {
  const { trackSearchImpression, trackSearchClick } = useSearchAnalytics();

  useEffect(() => {
    if (properties && properties.length > 0 && searchQuery) {
      properties.forEach((property, index) => {
        trackSearchImpression(property.key, searchQuery, index + 1);
      });
    }
  }, [properties, searchQuery, trackSearchImpression]);

  const handlePropertyClick = (property: KottageWithId, index: number) => {
    if (searchQuery) {
      trackSearchClick(property.key, searchQuery, index + 1);
    }
    onPropertyClick?.(property);
  };

  if (isLoading) return <Loadingproperties searchCriteria={searchCriteria} />;
  if (properties.length === 0) return <NoPropertiesFound />;

  const renderPropertyCard = (
    property: KottageWithId,
    index: number,
    useFade: boolean
  ) => {
    if (!property) {
      return null;
    }

    const propertyKey = property.key || property.id || `search-result-${index}`;

    const card = (
      <Box
        key={propertyKey}
        id={`search-property-${propertyKey}`}
        onMouseEnter={() => property.key && onPropertyFocus?.(property.key)}
        onFocus={() => property.key && onPropertyFocus?.(property.key)}
        sx={{
          borderRadius: 4,
          border: '2px solid transparent',
          transition:
            'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          width: '100%',
          maxWidth: compact ? 560 : 'none',
          flex: '0 0 auto',
          ...(selectedPropertyId === property.key && {
            borderColor: Colors.raspberry,
            boxShadow: '0 0 0 4px rgba(209,85,182,0.14)',
          }),
        }}
      >
        <PropertyCardFull
          kottage={property}
          index={index}
          compact={compact}
          handlePropertyClick={handlePropertyClick}
          searchCriteria={searchCriteria}
        />
      </Box>
    );

    if (!useFade) {
      return card;
    }

    return (
      <Fade in timeout={220 + index * 70} appear key={propertyKey}>
        {card}
      </Fade>
    );
  };

  if (compact) {
    return (
      <Stack spacing={2} sx={{ minHeight: 0, width: '100%', pb: 1 }}>
        {properties.map((property, index) =>
          renderPropertyCard(property, index, false)
        )}
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: '50vh', width: '100%' }}>
      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {properties.map((property, index) => {
          if (!property) {
            return null;
          }

          return (
            <Grid
              item
              xs={12}
              md={6}
              xl={4}
              key={property.key || property.id || `search-grid-${index}`}
              sx={{
                display: 'flex',
                justifyContent: 'stretch',
                width: '100%',
              }}
            >
              {renderPropertyCard(property, index, true)}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SearchResults;
