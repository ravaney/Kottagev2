import React from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Colors } from '../constants';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  title: string;
  start: Date;
  end: Date;
}

interface BookingCalendarProps {
  events: BookingEvent[];
}

export default function BookingCalendar({ events }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <CalendarTodayIcon sx={{ color: Colors.blue, fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600} color={Colors.blue}>
          Booking Calendar
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigateMonth('prev')} size="small">
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={600} sx={{ minWidth: 150, textAlign: 'center' }}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={() => navigateMonth('next')} size="small">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ height: 250 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view="month"
          views={['month']}
          toolbar={false}
          date={currentDate}
          onNavigate={setCurrentDate}
          eventPropGetter={() => ({
            style: {
              backgroundColor: Colors.raspberry,
              borderColor: Colors.blue,
              color: 'white',
              borderRadius: '4px',
              border: 'none'
            }
          })}
        />
      </Box>
    </Paper>
  );
}