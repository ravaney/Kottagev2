import React from 'react';
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import {
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { useSearchProperties, SearchData } from '../../hooks/usePropertySearch';

interface SearchBarProps {
  onSearch?: (searchData: SearchData) => void;
  onResults?: (results: any[]) => void;
  initialLocation?: string;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialGuests?: number;
  variant?: 'default' | 'hero';
  refinementContent?: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResults,
  initialLocation = '',
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  variant = 'default',
  refinementContent,
}) => {
  const [location, setLocation] = React.useState(initialLocation);
  const [checkIn, setCheckIn] = React.useState<Date | undefined>(
    initialCheckIn
  );
  const [checkOut, setCheckOut] = React.useState<Date | undefined>(
    initialCheckOut
  );
  const [guests, setGuests] = React.useState(initialGuests);
  const [searchData, setSearchData] = React.useState<SearchData>({
    location: '',
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
  });
  const [shouldSearch, setShouldSearch] = React.useState(false);
  const [dateAnchorEl, setDateAnchorEl] = React.useState<HTMLElement | null>(
    null
  );
  const [dateSelectionStep, setDateSelectionStep] = React.useState<
    'checkIn' | 'checkOut'
  >(initialCheckIn && !initialCheckOut ? 'checkOut' : 'checkIn');

  const { data: searchResults = [], isLoading: isSearching } =
    useSearchProperties(searchData, undefined);

  React.useEffect(() => {
    setLocation(initialLocation);
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setGuests(initialGuests);
    setDateSelectionStep(
      initialCheckIn && !initialCheckOut ? 'checkOut' : 'checkIn'
    );
  }, [initialLocation, initialCheckIn, initialCheckOut, initialGuests]);

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

    setSearchData(currentSearchData);
    setShouldSearch(true);
    onSearch?.(currentSearchData);
  };

  const theme = useTheme();
  const isHero = variant === 'hero';
  const isPageSearch = !isHero;
  const isDatePickerOpen = Boolean(dateAnchorEl);

  const fieldInputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: isHero ? 2.4 : 2.25,
      backgroundColor: alpha(theme.palette.background.paper, 1),
      backdropFilter: 'blur(10px)',
      height: isHero ? '46px' : '40px',
      fontSize: isHero ? '0.92rem' : '0.86rem',
      transition: 'all 0.25s ease',
      '& .MuiOutlinedInput-input': {
        paddingTop: 8,
        paddingBottom: 8,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isHero
          ? alpha(theme.palette.primary.main, 0.14)
          : 'rgba(51,65,85,0.14)',
      },
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    },
  };

  const openDatePicker = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchorEl(event.currentTarget);
    setDateSelectionStep(checkIn && !checkOut ? 'checkOut' : 'checkIn');
  };

  const closeDatePicker = () => {
    setDateAnchorEl(null);
  };

  const clearDates = () => {
    setCheckIn(undefined);
    setCheckOut(undefined);
    setDateSelectionStep('checkIn');
  };

  const handleDateSelection = (value: Date | null) => {
    if (!value) return;

    const selectedDate = startOfDay(value);
    const today = startOfDay(new Date());

    if (isBefore(selectedDate, today)) {
      return;
    }

    if (dateSelectionStep === 'checkIn' || !checkIn || (checkIn && checkOut)) {
      setCheckIn(selectedDate);
      setCheckOut(undefined);
      setDateSelectionStep('checkOut');
      return;
    }

    if (!isAfter(selectedDate, checkIn)) {
      setCheckIn(selectedDate);
      setCheckOut(undefined);
      setDateSelectionStep('checkOut');
      return;
    }

    setCheckOut(selectedDate);
    setDateSelectionStep('checkIn');
    closeDatePicker();
  };

  const getDateRangeValue = () => {
    if (checkIn && checkOut) {
      const nights = Math.max(1, differenceInCalendarDays(checkOut, checkIn));
      return `${format(checkIn, 'MMM d')} - ${format(checkOut, 'MMM d')} • ${nights} ${
        nights === 1 ? 'night' : 'nights'
      }`;
    }

    if (checkIn) {
      return `${format(checkIn, 'MMM d')} • Select checkout`;
    }

    return '';
  };

  const RangePickerDay = (props: PickersDayProps) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const currentDay = startOfDay(day as Date);

    const isRangeStart = !!checkIn && isSameDay(currentDay, checkIn);
    const isRangeEnd = !!checkOut && isSameDay(currentDay, checkOut);
    const isWithinRange =
      !!checkIn &&
      !!checkOut &&
      isAfter(currentDay, checkIn) &&
      isBefore(currentDay, checkOut);

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        selected={isRangeStart || isRangeEnd}
        disableMargin={isRangeStart || isRangeEnd || isWithinRange}
        sx={{
          ...(isWithinRange &&
            !outsideCurrentMonth && {
              backgroundColor: alpha(theme.palette.primary.main, 0.14),
              color: theme.palette.text.primary,
              borderRadius: 0,
              '&:hover, &:focus': {
                backgroundColor: alpha(theme.palette.primary.main, 0.22),
              },
            }),
          ...(isRangeStart &&
            !outsideCurrentMonth && {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: checkOut ? '50% 0 0 50%' : '50%',
              '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.dark,
              },
            }),
          ...(isRangeEnd &&
            !outsideCurrentMonth && {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: '0 50% 50% 0',
              '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.dark,
              },
            }),
        }}
      />
    );
  };

  const searchContent = (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 1, md: isHero ? 1 : 1.1 }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent={isHero ? 'center' : 'flex-start'}
      sx={{
        textAlign: 'left',
        flexWrap: 'nowrap',
      }}
    >
      <Box sx={{ flex: 1.45, minWidth: isHero ? 210 : 170 }}>
        <TextField
          fullWidth
          placeholder="Search destinations, cities, or regions..."
          value={location}
          onChange={event => setLocation(event.target.value)}
          size="medium"
          inputProps={{
            'aria-label': 'Destination',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn
                  sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
          sx={fieldInputSx}
        />
      </Box>

      <Box sx={{ flex: 1.35, minWidth: isHero ? 220 : 190 }}>
        <TextField
          fullWidth
          value={getDateRangeValue()}
          placeholder="Stay dates"
          onClick={openDatePicker}
          size="medium"
          inputProps={{
            'aria-label': 'Stay dates',
            readOnly: true,
            style: { cursor: 'pointer' },
          }}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday
                  sx={{ color: theme.palette.primary.main, fontSize: 18 }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            ...fieldInputSx,
            '& .MuiOutlinedInput-input': {
              cursor: 'pointer',
              fontWeight: checkIn ? 500 : 400,
              color: checkIn ? '#1f2937' : '#98a2b3',
            },
          }}
        />
        <Popover
          open={isDatePickerOpen}
          anchorEl={dateAnchorEl}
          onClose={closeDatePicker}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              p: 2,
              width: { xs: 'calc(100vw - 32px)', sm: 360 },
              borderRadius: 4,
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow: '0 24px 54px rgba(15,23,42,0.16)',
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            sx={{ mb: 1.5 }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#1f2a37' }}
              >
                Select stay dates
              </Typography>
              <Typography variant="body2" sx={{ color: '#667085' }}>
                {dateSelectionStep === 'checkIn'
                  ? 'Pick your check-in date'
                  : 'Pick your check-out date'}
              </Typography>
            </Box>
            {(checkIn || checkOut) && (
              <Button
                size="small"
                onClick={clearDates}
                sx={{
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#0f5b9c',
                }}
              >
                Clear
              </Button>
            )}
          </Stack>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              mb: 1.5,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                px: 1.25,
                py: 1,
                borderRadius: 3,
                backgroundColor:
                  dateSelectionStep === 'checkIn'
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'rgba(15,23,42,0.03)',
                border: `1px solid ${
                  dateSelectionStep === 'checkIn'
                    ? alpha(theme.palette.primary.main, 0.18)
                    : 'rgba(15,23,42,0.08)'
                }`,
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#667085', display: 'block', mb: 0.35 }}
              >
                Check-in
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#1f2a37' }}>
                {checkIn ? format(checkIn, 'EEE, MMM d') : 'Add date'}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                px: 1.25,
                py: 1,
                borderRadius: 3,
                backgroundColor:
                  dateSelectionStep === 'checkOut'
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'rgba(15,23,42,0.03)',
                border: `1px solid ${
                  dateSelectionStep === 'checkOut'
                    ? alpha(theme.palette.primary.main, 0.18)
                    : 'rgba(15,23,42,0.08)'
                }`,
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#667085', display: 'block', mb: 0.35 }}
              >
                Check-out
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#1f2a37' }}>
                {checkOut ? format(checkOut, 'EEE, MMM d') : 'Add date'}
              </Typography>
            </Paper>
          </Box>

          <DateCalendar
            value={checkOut || checkIn || new Date()}
            onChange={handleDateSelection}
            disablePast
            showDaysOutsideCurrentMonth
            slots={{ day: RangePickerDay }}
            sx={{
              width: '100%',
              maxWidth: '100%',
              '& .MuiPickersCalendarHeader-root': {
                px: 1,
              },
            }}
          />
        </Popover>
      </Box>

      <Box sx={{ flex: 0.68, minWidth: isHero ? 138 : 110 }}>
        <TextField
          fullWidth
          select
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          size="medium"
          inputProps={{
            'aria-label': 'Guests',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <People
                  sx={{ color: theme.palette.primary.main, fontSize: 18 }}
                />
              </InputAdornment>
            ),
          }}
          sx={fieldInputSx}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <MenuItem key={num} value={num}>
              {num} {num === 1 ? 'Guest' : num === 8 ? 'Guests+' : 'Guests'}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          minWidth: isHero ? 138 : 120,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={handleSearch}
          disabled={isSearching}
          startIcon={<SearchIcon />}
          sx={{
            height: isHero ? '46px' : '40px',
            borderRadius: isHero ? 2.4 : 2.25,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: isHero ? '0.94rem' : '0.86rem',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: isHero
              ? '0 10px 24px rgba(0,0,0,0.14)'
              : '0 10px 24px rgba(15,23,42,0.12)',
            transition: 'all 0.25s ease',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              boxShadow: '0 12px 28px rgba(15,23,42,0.18)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            '&.Mui-disabled': {
              background: alpha(theme.palette.primary.main, 0.5),
              color: alpha(theme.palette.primary.contrastText, 0.7),
            },
          }}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      {!isHero && refinementContent && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: 0.5,
            minWidth: 'fit-content',
            pl: { md: 0.15 },
            whiteSpace: 'nowrap',
          }}
        >
          <Typography
            aria-hidden
            sx={{
              display: { xs: 'none', md: 'block' },
              color: 'rgba(15,23,42,0.24)',
              fontSize: '0.95rem',
              fontWeight: 500,
              mx: 0.05,
            }}
          >
            |
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#475467',
              mr: 0.15,
              fontSize: '0.84rem',
            }}
          >
            Refine
          </Typography>
          {refinementContent}
        </Box>
      )}
    </Stack>
  );

  if (isHero) {
    return <Box sx={{ width: '100%' }}>{searchContent}</Box>;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, md: 1.15 },
        borderRadius: 0,
        backgroundColor: alpha(theme.palette.background.paper, 0.94),
        border: '1px solid rgba(51,65,85,0.12)',
        backdropFilter: 'blur(18px)',
        boxShadow: isPageSearch
          ? '0 18px 40px rgba(15,23,42,0.08)'
          : '0 12px 40px rgba(0,0,0,0.12)',
        width: '100%',
        margin: 0,
      }}
    >
      {searchContent}
    </Paper>
  );
};
