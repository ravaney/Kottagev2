import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Fade,
  Chip,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  ArrowBack,
  Search as SearchIcon,
  FilterList,
  Sort,
  ViewModule,
  ViewList,
} from '@mui/icons-material';
import { SearchBar } from './SearchBar';
import { SearchData } from '../../hooks/usePropertySearch';
import SearchResults from './SearchResults';
import {
  useSearchProperties,
  SearchFilters,
  KottageWithId,
} from '../../hooks/usePropertySearch';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    sortBy: 'popularity',
    sortOrder: 'desc',
  });

  // Use the Firebase-backed search hook
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useSearchProperties(searchData, searchFilters);

  // Update search data when URL params change
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

  const performSearch = (data: SearchData) => {
    // Update URL with search parameters
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

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePropertyClick = (property: KottageWithId) => {
    // Navigate to property detail page with property data in state
    navigate(`/Kottages/${property.key}`, {
      state: {
        kottage: property,
        searchCriteria: searchData,
      },
    });
  };

  const getSearchSummary = () => {
    if (!searchData.location && !searchParams.toString()) {
      return 'Browse all properties';
    }

    let summary = '';
    if (searchData.location) {
      summary += `"${searchData.location}"`;
    }
    if (searchData.guests > 1) {
      summary += ` • ${searchData.guests} guests`;
    }
    if (searchData.checkIn && searchData.checkOut) {
      const checkIn = searchData.checkIn.toLocaleDateString();
      const checkOut = searchData.checkOut.toLocaleDateString();
      summary += ` • ${checkIn} - ${checkOut}`;
    }

    return summary || 'All properties';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Search Header */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          {/* Page Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackToHome}
              variant="outlined"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              Back to Home
            </Button>
          </Box>

          <SearchBar
            onSearch={handleNewSearch}
            initialLocation={searchData.location}
            initialCheckIn={searchData.checkIn}
            initialCheckOut={searchData.checkOut}
            initialGuests={searchData.guests}
          />

          {/* Search Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Button
              startIcon={<FilterList />}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Filters
            </Button>
            <Button
              startIcon={<Sort />}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Sort
            </Button>

            {/* View Mode Toggle */}
            <Box sx={{ display: 'flex', ml: 'auto' }}>
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                size="small"
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  borderRadius: '20px 0 0 20px',
                }}
              >
                <ViewModule />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                size="small"
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  borderRadius: '0 20px 20px 0',
                  ml: -0.5,
                }}
              >
                <ViewList />
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Search Results */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {isLoading ? (
          <Fade in={true}>
            <Box>
              {/* Loading Header */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Skeleton
                  variant="text"
                  width="300px"
                  height={40}
                  sx={{ mx: 'auto', mb: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="200px"
                  height={20}
                  sx={{ mx: 'auto' }}
                />
              </Box>

              {/* Loading Cards */}
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={250}
                      />
                      <CardContent>
                        <Skeleton variant="text" width="80%" height={30} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="40%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ) : (
          <Fade in={true} timeout={600}>
            <Box>
              {error ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Paper sx={{ p: 6, maxWidth: 500, mx: 'auto' }}>
                    <SearchIcon
                      sx={{ fontSize: 80, color: '#f44336', mb: 3 }}
                    />
                    <Typography
                      variant="h5"
                      sx={{ mb: 2, fontWeight: 600, color: '#f44336' }}
                    >
                      Search Error
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                      Unable to load properties. Please try again later.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => window.location.reload()}
                      sx={{ mt: 2 }}
                    >
                      Retry
                    </Button>
                  </Paper>
                </Box>
              ) : searchResults.length > 0 ? (
                <>
                  {/* Results Grid */}
                  <SearchResults
                    properties={searchResults}
                    searchQuery={searchData.location}
                    isLoading={isLoading}
                    onPropertyClick={handlePropertyClick}
                    searchCriteria={searchData}
                  />
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Paper sx={{ p: 6, maxWidth: 500, mx: 'auto' }}>
                    <SearchIcon sx={{ fontSize: 80, color: '#ccc', mb: 3 }} />
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      No Properties Found
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                      We couldn't find any properties matching your search
                      criteria. Try adjusting your filters or search terms.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleNewSearch({
                          location: '',
                          checkIn: undefined,
                          checkOut: undefined,
                          guests: 1,
                        })
                      }
                      sx={{ mr: 2 }}
                    >
                      Clear Search
                    </Button>
                    <Button variant="outlined" onClick={handleBackToHome}>
                      Back to Home
                    </Button>
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
