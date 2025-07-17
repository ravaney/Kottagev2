import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Collapse, Grid, Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Colors } from '../constants';
import { ReservationStatus } from '../../hooks/reservationHooks';

export default function ManageReservations() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const reservations = [
    {
      id: '1',
      guest: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      property: 'Villa Velha',
      checkIn: '2025-01-15',
      checkOut: '2025-01-20',
      status: ReservationStatus.Completed,
      amount: '$1,200',
      totalPrice: 1200,
      guests: 2,
      notes: 'Early check-in requested'
    },
    {
      id: '2',
      guest: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0456',
      property: 'Beach House',
      checkIn: '2025-01-18',
      checkOut: '2025-01-25',
      status: ReservationStatus.Pending,
      amount: '$2,100',
      totalPrice: 2100,
      guests: 4,
      notes: 'Anniversary celebration'
    },
    {
      id: '3',
      guest: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1-555-0789',
      property: 'Mountain Cabin',
      checkIn: '2025-01-22',
      checkOut: '2025-01-28',
      status: ReservationStatus.Confirmed,
      amount: '$900',
      totalPrice: 900,
      guests: 3,
      notes: 'Business trip'
    },
    {
      id: '4',
      guest: 'Jessica Alba',
      email: 'jessica.alba@email.com',
      phone: '+1-555-0321',
      property: 'Mountain Cabin',
      checkIn: '2025-01-25',
      checkOut: '2025-01-30',
      status: ReservationStatus.Cancelled,
      amount: '$900',
      totalPrice: 900,
      guests: 2,
      notes: 'Cancelled due to emergency'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case ReservationStatus.Confirmed: return 'success';
      case ReservationStatus.Pending: return 'warning';
      case ReservationStatus.Cancelled: return 'error';
      case ReservationStatus.Completed: return 'info';
      default: return 'default';
    }
  };
  
  const handleRowClick = (reservationId: string) => {
    setExpandedRow(expandedRow === reservationId ? null : reservationId);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <CalendarMonthIcon sx={{ color: Colors.blue, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} color={Colors.blue}>
            Manage Reservations
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight={600}>Guest</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Property</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Check-in</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Check-out</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Amount</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Expand</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <TableRow 
                    hover 
                    onClick={() => handleRowClick(reservation.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {reservation.guest}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {reservation.property}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(reservation.checkIn).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(reservation.checkOut).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={reservation.status} 
                        color={getStatusColor(reservation.status) as any}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color={Colors.blue}>
                        {reservation.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        {expandedRow === reservation.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
                      <Collapse in={expandedRow === reservation.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fafafa', border: '1px solid #e0e0e0' }}>
                          <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
                            Reservation Details
                          </Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 2 }}>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                                  <PersonIcon sx={{ fontSize: 18, color: Colors.raspberry }} />
                                  <Typography variant="subtitle2" fontWeight={600}>Guest Information</Typography>
                                </Box>
                                <Typography variant="body2">Name: {reservation.guest}</Typography>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2">{reservation.email}</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                                  <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2">{reservation.phone}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Booking Details</Typography>
                                <Typography variant="body2">Property: {reservation.property}</Typography>
                                <Typography variant="body2">Guests: {reservation.guests}</Typography>
                                <Typography variant="body2">Total Amount: ${reservation.totalPrice.toLocaleString()}</Typography>
                                <Typography variant="body2">Duration: {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</Typography>
                              </Box>
                            </Grid>
                            
                            {reservation.notes && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Notes</Typography>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                  {reservation.notes}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Box display="flex" gap={2} justifyContent="flex-end">
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: Colors.blue,
                                backgroundColor: 'white',
                                border: `1px solid ${Colors.blue}`,
                                '&:hover': { backgroundColor: Colors.blue, color: 'white' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: Colors.raspberry,
                                backgroundColor: 'white',
                                border: `1px solid ${Colors.raspberry}`,
                                '&:hover': { backgroundColor: Colors.raspberry, color: 'white' }
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}