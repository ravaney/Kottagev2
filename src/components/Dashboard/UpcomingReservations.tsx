import React from 'react';
import { Paper, Box, Typography, List, ListItem, Card, CardContent, Chip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Colors } from '../constants';
import { Reservation } from '../../hooks/reservationHooks';



interface UpcomingReservationsProps {
  reservations: Reservation[];
}

export default function UpcomingReservations({ reservations }: UpcomingReservationsProps) {
  return (
    <Paper elevation={3} sx={{ p: 2 ,mb:1}}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
        <BookmarkIcon sx={{ color: Colors.raspberry, fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600} color={Colors.blue}>
          Upcoming Reservations
        </Typography>
      </Box>
      <List sx={{  overflow: 'auto' }}>
        {reservations.map((reservation) => (
          <ListItem key={reservation.reservationId} sx={{ px: 0, py: 1 }}>
            <Card sx={{ width: '100%', mb: 1 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" fontWeight={600} color={Colors.blue}>
                  {reservation.guests.map(guest => guest.name).join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reservation.property.name}
                </Typography>
                <Typography variant="caption" display="block">
                  {reservation.checkIn} - {reservation.checkOut}
                </Typography>
                <Chip 
                  label={reservation.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    backgroundColor: Colors.raspberry, 
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}