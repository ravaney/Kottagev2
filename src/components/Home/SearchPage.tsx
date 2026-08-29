import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  DashboardCustomizeOutlined,
  LaptopMac,
  MapOutlined,
  Search as SearchIcon,
  ViewListOutlined,
} from '@mui/icons-material';

import { SearchBar } from './SearchBar';
import { SearchData } from '../../hooks/usePropertySearch';
import SearchResults from './SearchResults';
import SearchResultsMap from './SearchResultsMap';
import {
  useSearchProperties,
  SearchFilters,
  KottageWithId,
} from '../../hooks/usePropertySearch';

const defaultFilters: SearchFilters = {
  sortBy: 'popularity',
  sortOrder: 'desc',
};

const sortOptions: Array<{
  label: string;
  sortBy: NonNullable<SearchFilters['sortBy']>;
  sortOrder: NonNullable<SearchFilters['sortOrder']>;
}> = [
  { label: 'Recommended', sortBy: 'popularity', sortOrder: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Highest Rated', sortBy: 'rating', sortOrder: 'desc' },
];

const SearchPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const resultsScrollRef = useRef<HTMLDivElement | null>(null);

  const [searchData, setSearchData] = useState<SearchData>({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn')
      ? new Date(searchParams.get('checkIn')!)
      : undefined,
    checkOut: searchParams.get('checkOut')
      ? new Date(searchParams.get('checkOut')!)
      : undefined,
    guests: parseInt(searchParams.get('guests') || '1'),
  });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(
    defaultFilters
  );

  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useSearchProperties(searchData, searchFilters);

  const effectiveViewMode =
    !isLargeScreen && viewMode === 'split' ? 'list' : viewMode;
  const showList = effectiveViewMode === 'split' || effectiveViewMode === 'list';
  const showMap = effectiveViewMode === 'split' || effectiveViewMode === 'map';
  useEffect(() => {
    const newSearchData = {
      location: searchParams.get('location') || '',
      checkIn: searchParams.get('checkIn')
        ? new Date(searchParams.get('checkIn')!)
        : undefined,
      checkOut: searchParams.get('checkOut')
        ? new Date(searchParams.get('checkOut')!)
        : undefined,
      guests: parseInt(searchParams.get('guests') || '1'),
    };
    setSearchData(newSearchData);
  }, [searchParams]);

  useEffect(() => {
    if (!searchResults.length) {
      setSelectedPropertyId(null);
      return;
    }

    const stillExists = searchResults.some(
      property => property.key === selectedPropertyId
    );

    if (!stillExists) {
      setSelectedPropertyId(searchResults[0].key);
    }
  }, [searchResults, selectedPropertyId]);

  const performSearch = (data: SearchData) => {
    const params = new URLSearchParams();
    if (data.location) params.set('location', data.location);
    if (data.checkIn) params.set('checkIn', data.checkIn.toISOString());
    if (data.checkOut) params.set('checkOut', data.checkOut.toISOString());
    if (data.guests > 1) params.set('guests', data.guests.toString());

    setSearchParams(params);
    setSearchData(data);
  };

  const handleNewSearch = (data: SearchData) => {
    performSearch(data);
  };

  const handlePropertyClick = (property: KottageWithId) => {
    navigate(`/Kottages/${property.key}`, {
      state: {
        kottage: property,
        searchCriteria: searchData,
      },
    });
  };

  const handlePropertySelection = (propertyId: string) => {
    setSelectedPropertyId(propertyId);

    window.requestAnimationFrame(() => {
      const scrollContainer = resultsScrollRef.current;
      const propertyCard = document.getElementById(
        `search-property-${propertyId}`
      );

      if (!scrollContainer || !propertyCard) {
        return;
      }

      const containerRect = scrollContainer.getBoundingClientRect();
      const cardRect = propertyCard.getBoundingClientRect();
      const nextTop =
        scrollContainer.scrollTop +
        (cardRect.top - containerRect.top) -
        (scrollContainer.clientHeight - cardRect.height) / 2;

      scrollContainer.scrollTo({
        top: Math.max(0, nextTop),
        behavior: 'smooth',
      });
    });
  };

  const hasActiveRefinements =
    !!searchFilters.nomadVerified ||
    searchFilters.sortBy !== defaultFilters.sortBy ||
    searchFilters.sortOrder !== defaultFilters.sortOrder;

  const selectedSortValue = `${searchFilters.sortBy || defaultFilters.sortBy}:${searchFilters.sortOrder || defaultFilters.sortOrder}`;

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #f4f8fb 0%, #f9fbfd 260px, #ffffff 100%)',
      }}
    >
      <Box
        sx={{
          pt: 0,
          pb: { xs: 0.6, md: 0.8 },
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          background:
            'linear-gradient(180deg, rgba(6,28,45,0.04) 0%, rgba(6,28,45,0) 100%)',
          position: 'relative',
          flexShrink: 0,
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            width: '100%',
            px: 0,
          }}
        >
          <SearchBar
            onSearch={handleNewSearch}
            initialLocation={searchData.location}
            initialCheckIn={searchData.checkIn}
            initialCheckOut={searchData.checkOut}
            initialGuests={searchData.guests}
            refinementContent={
              <>
                <Chip
                  icon={<LaptopMac />}
                  label="Nomad Verified"
                  clickable
                  size="small"
                  color={searchFilters.nomadVerified ? 'primary' : 'default'}
                  variant={searchFilters.nomadVerified ? 'filled' : 'outlined'}
                  onClick={() =>
                    setSearchFilters(prev => ({
                      ...prev,
                      nomadVerified: prev.nomadVerified ? undefined : true,
                    }))
                  }
                  sx={{
                    borderRadius: 999,
                    fontWeight: 600,
                    height: 28,
                    pl: 0.45,
                    '& .MuiChip-label': {
                      pl: 0.95,
                      pr: 1.2,
                    },
                    '& .MuiChip-icon': {
                      ml: 0.45,
                    },
                  }}
                />

                <TextField
                  select
                  size="small"
                  value={selectedSortValue}
                  onChange={event => {
                    const [sortBy, sortOrder] = event.target.value.split(':') as [
                      NonNullable<SearchFilters['sortBy']>,
                      NonNullable<SearchFilters['sortOrder']>,
                    ];

                    setSearchFilters(prev => ({
                      ...prev,
                      sortBy,
                      sortOrder,
                    }));
                  }}
                  inputProps={{ 'aria-label': 'Sort results' }}
                  sx={{
                    minWidth: 164,
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.82)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                    },
                    '& .MuiSelect-select': {
                      py: 0.55,
                    },
                  }}
                >
                  {sortOptions.map(option => (
                    <MenuItem
                      key={option.label}
                      value={`${option.sortBy}:${option.sortOrder}`}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                {hasActiveRefinements && (
                  <Button
                    size="small"
                    onClick={() => setSearchFilters(defaultFilters)}
                    sx={{
                      minWidth: 'auto',
                      px: 0.9,
                      py: 0.25,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color: '#0f5b9c',
                    }}
                  >
                    Reset
                  </Button>
                )}
              </>
            }
          />
        </Box>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 0.7, md: 0.85 },
          pb: 0,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading ? (
          <Fade in>
            <Box>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Skeleton variant="text" width="280px" height={38} />
                <Skeleton variant="text" width="200px" height={22} />
              </Stack>

              <Grid container spacing={{ xs: 2.5, md: 3 }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} md={6} xl={4} key={index}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 14px 34px rgba(15,23,42,0.06)',
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={240}
                      />
                      <CardContent>
                        <Skeleton variant="text" width="82%" height={30} />
                        <Skeleton variant="text" width="56%" height={20} />
                        <Skeleton variant="text" width="48%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={500}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
              }}
            >
              {error ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Paper
                    sx={{
                      p: 6,
                      maxWidth: 540,
                      mx: 'auto',
                      borderRadius: 4,
                    }}
                  >
                    <SearchIcon
                      sx={{ fontSize: 72, color: '#f44336', mb: 2.5 }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ mb: 1.5, fontWeight: 700, color: '#f44336' }}
                    >
                      Search Error
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#667085', mb: 4 }}>
                      Unable to load properties right now. Please try again in a
                      moment.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </Paper>
                </Box>
              ) : searchResults.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={0.85}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    sx={{ mb: 1.4, flexShrink: 0 }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: '#162332' }}
                      >
                        {searchResults.length}{' '}
                        {searchResults.length === 1
                          ? 'Kottage found'
                          : 'Kottages found'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#667085' }}>
                        Browse boutique stays across Jamaica in list or map
                        view.
                      </Typography>
                    </Box>

                    <ToggleButtonGroup
                      exclusive
                      value={effectiveViewMode}
                      onChange={(_, nextView) => {
                        if (nextView) {
                          setViewMode(nextView);
                        }
                      }}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.88)',
                        borderRadius: 999,
                        p: 0.4,
                        border: '1px solid rgba(15,23,42,0.08)',
                        boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                        '& .MuiToggleButton-root': {
                          border: 0,
                          borderRadius: 999,
                          px: 1.4,
                          py: 0.65,
                          textTransform: 'none',
                          fontWeight: 700,
                          color: '#5f6875',
                          gap: 0.75,
                        },
                        '& .Mui-selected': {
                          backgroundColor: 'rgba(0,123,167,0.12)',
                          color: '#005a79',
                        },
                      }}
                    >
                      {isLargeScreen && (
                        <ToggleButton value="split">
                          <DashboardCustomizeOutlined sx={{ fontSize: 18 }} />
                          Split
                        </ToggleButton>
                      )}
                      <ToggleButton value="list">
                        <ViewListOutlined sx={{ fontSize: 18 }} />
                        List
                      </ToggleButton>
                      <ToggleButton value="map">
                        <MapOutlined sx={{ fontSize: 18 }} />
                        Map
                      </ToggleButton>
                      </ToggleButtonGroup>
                  </Stack>

                  <Box
                    sx={{
                      mb: 2.5,
                      borderBottom: '1px solid rgba(15,23,42,0.08)',
                      flexShrink: 0,
                    }}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      height: '100%',
                      display: 'grid',
                      gap: 3,
                      gridTemplateColumns: {
                        xs: '1fr',
                        lg: showList && showMap
                          ? 'minmax(280px, 0.25fr) minmax(0, 0.75fr)'
                          : '1fr',
                      },
                      alignItems: 'stretch',
                    }}
                  >
                    {showList && (
                      <Box
                        ref={resultsScrollRef}
                        sx={{
                          minHeight: 0,
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          pr: { xs: 0, lg: showMap ? 0.5 : 0 },
                          pb: 2,
                          scrollbarGutter: 'stable',
                        }}
                      >
                        <SearchResults
                          properties={searchResults}
                          searchQuery={searchData.location}
                          isLoading={isLoading}
                          onPropertyClick={handlePropertyClick}
                          onPropertyFocus={setSelectedPropertyId}
                          selectedPropertyId={selectedPropertyId}
                          compact={showMap}
                          searchCriteria={searchData}
                        />
                      </Box>
                    )}

                    {showMap && (
                      <Box
                        sx={{
                          minHeight: 0,
                          height: '100%',
                        }}
                      >
                        <SearchResultsMap
                          properties={searchResults}
                          selectedPropertyId={selectedPropertyId}
                          onSelectProperty={handlePropertySelection}
                          height={
                            showList && showMap
                              ? '100%'
                              : { xs: '100%', lg: '100%' }
                          }
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Paper
                    sx={{
                      p: 6,
                      maxWidth: 560,
                      mx: 'auto',
                      borderRadius: 4,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 72, color: '#cbd5e1', mb: 2.5 }} />
                    <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>
                      No stays matched this search
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#667085', mb: 4 }}>
                      Try broadening your location, clearing the Nomad filter,
                      or searching with different dates.
                    </Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSearchFilters(defaultFilters);
                          handleNewSearch({
                            location: '',
                            checkIn: undefined,
                            checkOut: undefined,
                            guests: 1,
                          });
                        }}
                      >
                        Clear Search
                      </Button>
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default SearchPage;
