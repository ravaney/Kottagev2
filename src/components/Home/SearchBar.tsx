import React from "react";
import {
  Button,
  TextField,
  Stack,
  MenuItem,
  InputAdornment,
  Paper,
  Typography,
  Box,
  useTheme,
  alpha
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  People,
  Search as SearchIcon
} from "@mui/icons-material";
import { useSearchProperties, SearchData } from "../../hooks/usePropertySearch";

interface SearchBarProps {
  onSearch?: (searchData: SearchData) => void;
  onResults?: (results: any[]) => void;
  initialLocation?: string;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialGuests?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onResults,
  initialLocation = "",
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1
}) => {
  const [location, setLocation] = React.useState(initialLocation);
  const [checkIn, setCheckIn] = React.useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = React.useState<Date | undefined>(initialCheckOut);
  const [guests, setGuests] = React.useState(initialGuests);
  const [searchData, setSearchData] = React.useState<SearchData>({
    location: "",
    checkIn: undefined,
    checkOut: undefined,
    guests: 1
  });
  const [shouldSearch, setShouldSearch] = React.useState(false);

  // Use the search hook
  const { 
    data: searchResults = [], 
    isLoading: isSearching
  } = useSearchProperties(searchData, undefined);

  // Update state when initial values change (for SearchPage)
  React.useEffect(() => {
    setLocation(initialLocation);
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setGuests(initialGuests);
  }, [initialLocation, initialCheckIn, initialCheckOut, initialGuests]);

  // Handle search results
  React.useEffect(() => {
    if (shouldSearch && searchResults && onResults) {
      onResults(searchResults);
      setShouldSearch(false);
    }
  }, [searchResults, shouldSearch, onResults]);

  const handleSearch = () => {
    const currentSearchData: SearchData = {
      location,
      checkIn,
      checkOut,
      guests,
    };
    
    // Update search data to trigger the hook
    setSearchData(currentSearchData);
    setShouldSearch(true);
    
    // Call the legacy onSearch callback if provided
    onSearch?.(currentSearchData);
  };

  const handleDateChange = (value: string, isCheckIn: boolean) => {
    if (!value) {
      if (isCheckIn) setCheckIn(undefined);
      else setCheckOut(undefined);
      return;
    }
    
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      if (isCheckIn) setCheckIn(date);
      else setCheckOut(date);
    }
  };

  const getMinDate = (isCheckOut: boolean = false): string => {
    const minDate = isCheckOut && checkIn ? checkIn : new Date();
    return minDate.toISOString().split('T')[0];
  };

  const theme = useTheme();

  return (
    <Paper 
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        transition: 'all 0.3s ease',
        width: 'fit-content',
        margin: '0 auto',
        '&:hover': {
          boxShadow: '0 16px 50px rgba(0,0,0,0.16)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems="stretch"
        justifyContent="center"
        sx={{ textAlign: 'center' }}
      >
      {/* Location */}
      <Box sx={{ flex: 2, minWidth: 250 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.secondary, 
            mb: 1,
            fontSize: '0.875rem'
          }}
        >
          📍 Where to?
        </Typography>
        <TextField
          fullWidth
          placeholder="Search destinations, cities, or regions..."
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              height: '56px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }
          }}
        />
      </Box>
      
      {/* Check-in Date */}
      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.secondary, 
            mb: 1,
            fontSize: '0.875rem'
          }}
        >
          📅 Check-in
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateChange(e.target.value, true)}
          size="medium"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: getMinDate()
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              height: '56px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }
          }}
        />
      </Box>
      
      {/* Check-out Date */}
      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.secondary, 
            mb: 1,
            fontSize: '0.875rem'
          }}
        >
          📅 Check-out
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateChange(e.target.value, false)}
          size="medium"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: getMinDate(true)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              height: '56px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }
          }}
        />
      </Box>
      
      {/* Guests */}
      <Box sx={{ flex: 1, minWidth: 160 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.secondary, 
            mb: 1,
            fontSize: '0.875rem'
          }}
        >
          👥 Guests
        </Typography>
        <TextField
          fullWidth
          select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <People sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              height: '56px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <MenuItem key={num} value={num}>
              {num} {num === 1 ? 'Guest' : num === 8 ? 'Guests+' : 'Guests'}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      {/* Search Button */}
      <Box sx={{ display: 'flex', alignItems: 'end', minWidth: 140 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSearch}
          disabled={isSearching}
          startIcon={<SearchIcon />}
          sx={{
            height: '56px',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1.1rem',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'translateY(0px)'
            },
            '&.Mui-disabled': {
              background: alpha(theme.palette.primary.main, 0.5),
              color: alpha(theme.palette.primary.contrastText, 0.7)
            }
          }}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </Box>
    </Stack>
    </Paper>
  );
};
