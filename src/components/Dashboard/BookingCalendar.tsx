import React from 'react';
import { Paper, Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Colors } from '../constants';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Reservation } from '../../hooks/reservationHooks';

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



interface BookingCalendarProps {
  events: Reservation[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  reservations: Reservation[];
  isMultiple: boolean;
}

export default function BookingCalendar({ events }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  // Group overlapping reservations
  const processEvents = (reservations: Reservation[]): CalendarEvent[] => {
    const calendarEvents: CalendarEvent[] = [];
    const processedIds = new Set<string>();
    
    reservations.forEach(reservation => {
      if (processedIds.has(reservation.reservationId)) return;

      const startDate = new Date(reservation.checkIn);
      const endDate = new Date(reservation.checkOut);
      
      // Find overlapping reservations
      const overlapping = reservations.filter(other => {
        if (other.reservationId === reservation.reservationId) return true;
        if (processedIds.has(other.reservationId)) return false;

        const otherStart = new Date(other.checkIn);
        const otherEnd = new Date(other.checkOut);
        
        // Check if dates overlap
        return (startDate <= otherEnd && endDate >= otherStart);
      });
      
      // Mark all overlapping as processed
      overlapping.forEach(r => processedIds.add(r.reservationId));
      
      const isMultiple = overlapping.length > 1;
      
      calendarEvents.push({
        id: reservation.reservationId,
        title: isMultiple ? 'Multiple Reservations' : (reservation.property?.name || 'Reservation'),
        start: startDate,
        end: endDate,
        reservations: overlapping,
        isMultiple
      });
    });
    
    return calendarEvents;
  };
  
  const calendarEvents = processEvents(events);
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    setSelectedEvent(event);
    setDialogOpen(true);
  };
  
  const handleSelectSlot = (slotInfo: any) => {
    console.log('Slot clicked:', slotInfo);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 2,  height:400 }}>
      {/* <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <CalendarTodayIcon sx={{ color: Colors.blue, fontSize: 24 }} />
        <Typography variant="h6" fontWeight={600} color={Colors.blue}>
          Booking Calendar
        </Typography>
      </Box> */}
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => navigateMonth('prev')} size="small">
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography variant='subtitle2' fontWeight={600} sx={{ minWidth: 120, textAlign: 'center' }}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={() => navigateMonth('next')} size="small">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ height: 320 }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          defaultView="month"
          views={['month']}
          toolbar={false}
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={() => ({
            style: {
              backgroundColor: Colors.raspberry,
              borderColor: Colors.blue,
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px'
            }
          })}
        />
        
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <DateRangeIcon sx={{ color: Colors.blue }} />
              <Typography variant="h6" fontWeight={600}>
                Booking Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <Box>
                {selectedEvent.isMultiple ? (
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      {selectedEvent.reservations.length} Overlapping Reservations
                    </Typography>
                    {selectedEvent.reservations.map((reservation, index) => (
                      <Box key={reservation.reservationId} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                          <PersonIcon sx={{ color: Colors.raspberry, fontSize: 20 }} />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {reservation.property.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {reservation.guests.length === 1 ? 'Guest' : 'Guests'}: {reservation.guests.map(g => g.name).join(', ')}
                        </Typography>
                        <Box display="flex" gap={1} sx={{ mb: 1 }}>
                          <Chip 
                            label={new Date(reservation.checkIn).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric' 
                            })}
                            size="small"
                            sx={{ backgroundColor: Colors.blue, color: 'white' }}
                          />
                          <Typography variant="caption" sx={{ alignSelf: 'center' }}>to</Typography>
                          <Chip 
                            label={new Date(reservation.checkOut).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric' 
                            })}
                            size="small"
                            sx={{ backgroundColor: Colors.raspberry, color: 'white' }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                      <PersonIcon sx={{ color: Colors.raspberry, fontSize: 20 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {selectedEvent.reservations[0].property.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Check-in Date
                      </Typography>
                      <Chip 
                        label={selectedEvent.start.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        sx={{ backgroundColor: Colors.blue, color: 'white', mb: 1 }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Check-out Date
                      </Typography>
                      <Chip 
                        label={selectedEvent.end.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        sx={{ backgroundColor: Colors.raspberry, color: 'white' }}
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Duration
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {Math.ceil((selectedEvent.end.getTime() - selectedEvent.start.getTime()) / (1000 * 60 * 60 * 24))} nights
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Paper>
  );
}