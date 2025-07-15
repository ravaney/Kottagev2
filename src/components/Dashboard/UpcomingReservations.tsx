import React from 'react';
import { Paper, Box, Typography, List, ListItem, Card, CardContent, Chip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Colors } from '../constants';

interface Reservation {
  id: number;
  guest: string;
  property: string;
  checkIn: string;
  checkOut: string;
  amount: string;
}

interface UpcomingReservationsProps {
  reservations: Reservation[];
}

export default function UpcomingReservations({ reservations }: UpcomingReservationsProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
        <BookmarkIcon sx={{ color: Colors.raspberry, fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600} color={Colors.blue}>
          Upcoming Reservations
        </Typography>
      </Box>
      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {reservations.map((reservation) => (
          <ListItem key={reservation.id} sx={{ px: 0, py: 1 }}>
            <Card sx={{ width: '100%', mb: 1 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" fontWeight={600} color={Colors.blue}>
                  {reservation.guest}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reservation.property}
                </Typography>
                <Typography variant="caption" display="block">
                  {reservation.checkIn} - {reservation.checkOut}
                </Typography>
                <Chip 
                  label={reservation.amount} 
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