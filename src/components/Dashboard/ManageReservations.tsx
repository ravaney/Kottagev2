import React, { useState } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, IconButton, Collapse, Divider, ToggleButtonGroup, ToggleButton,
  TextField, InputAdornment, 
} from '@mui/material';

import {Timeline, TimelineItem, TimelineSeparator, TimelineConnector,
  TimelineContent, TimelineDot, TimelineOppositeContent} from '@mui/lab';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HistoryIcon from '@mui/icons-material/History';
import CancelIcon from '@mui/icons-material/Cancel';
import { Colors } from '../constants';
import { ReservationStatus, useGetMyReservations, Reservation as ApiReservation } from '../../hooks/reservationHooks';
import EditReservationDialog from './EditReservationDialog';

interface ChangeRecord {
  date: string;
  user: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface Reservation {
  id: string;
  guest: string;
  email: string;
  phone: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: string;
  totalPrice: number;
  guests: number;
  notes: string;
  changeHistory?: ChangeRecord[];
}

export default function ManageReservations() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get reservations data from API
  const { data: apiReservations = [], isLoading } = useGetMyReservations();
  
  // Transform API data to match the UI format
  const reservations = apiReservations.map((res: ApiReservation) => ({
    id: res.reservationId,
    guest: res.guests?.[0]?.name || 'Unknown Guest',
    email: res.guests?.[0]?.email || '',
    phone: res.guests?.[0]?.phone || '',
    property: res.property?.name || 'Unknown Property',
    checkIn: res.checkIn,
    checkOut: res.checkOut,
    status: res.status,
    amount: `$${res.totalPrice.toLocaleString()}`,
    totalPrice: res.totalPrice,
    guests: res.guests?.length || 0,
    notes: res.notes || '',
    changeHistory: res.edits?.map(edit => ({
      date: new Date(parseInt(edit.timestamp)).toLocaleString(),
      user: edit.userId,
      changes: Object.entries(edit.changes).map(([field, value]) => ({
        field: field,
        oldValue: 'Previous Value', // We don't have the old value in the API
        newValue: String(value)
      }))
    }))
  }));
  
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
  
  const handleEditClick = (event: React.MouseEvent, reservation: Reservation) => {
    event.stopPropagation(); // Prevent row expansion when clicking edit
    setSelectedReservation(reservation);
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedReservation(null);
  };
  
  const handleSaveChanges = (data: { checkIn: Date | null; checkOut: Date | null; guests: number }) => {
    // Here you would typically update the reservation in your database
    console.log('Saving changes:', {
      reservationId: selectedReservation?.id,
      newCheckIn: data.checkIn,
      newCheckOut: data.checkOut,
      newGuests: data.guests
    });
    
    // Don't close the dialog immediately - the EditReservationDialog will handle showing success and closing
  };
  
  const handleStatusFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string,
  ) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter reservations based on selected status and search query
  const filteredReservations = reservations
    .filter(reservation => statusFilter === 'all' || reservation.status === statusFilter)
    .filter(reservation => 
      reservation.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Add loading state display
  const renderContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
            <Typography>Loading reservations...</Typography>
          </TableCell>
        </TableRow>
      );
    }
    
    if (filteredReservations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
            <Typography>No reservations found.</Typography>
          </TableCell>
        </TableRow>
      );
    }
    
    return filteredReservations.map((reservation) => (
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                #{reservation.id}
              </Typography>
              <IconButton size="small">
                {expandedRow === reservation.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
            <Collapse in={expandedRow === reservation.id} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, backgroundColor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
                  Reservation Details
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  {/* Guest Information */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: '33.33%' } }}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 18, color: Colors.raspberry }} />
                        <Typography variant="subtitle2" fontWeight={600}>Guest Information</Typography>
                      </Box>
                      <Typography variant="body2">Name: {reservation.guest}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{reservation.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{reservation.phone}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Booking Details */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: '33.33%' } }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Booking Details</Typography>
                      <Typography variant="body2">Property: {reservation.property}</Typography>
                      <Typography variant="body2">Guests: {reservation.guests}</Typography>
                      <Typography variant="body2">Total Amount: ${reservation.totalPrice.toLocaleString()}</Typography>
                      <Typography variant="body2">Duration: {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</Typography>
                    </Box>
                    
                    {reservation.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Notes</Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                          {reservation.notes}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Change History - Now on the right side */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: '33.33%' } }}>
                    {reservation.changeHistory && reservation.changeHistory.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <HistoryIcon sx={{ fontSize: 18, color: Colors.blue }} />
                          <Typography variant="subtitle2" fontWeight={600}>Change History</Typography>
                        </Box>
                        
                        <Timeline position="right" sx={{ 
                          p: 0, 
                          m: 0,
                          '& .MuiTimelineItem-root': { minHeight: 'auto' },
                          '& .MuiTimelineContent-root': { py: 0.5 }
                        }}>
                          {reservation.changeHistory.map((record, index) => (
                            <TimelineItem key={index}>
                              <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2 }}>
                                <Typography variant="caption">{record.date}</Typography>
                              </TimelineOppositeContent>
                              <TimelineSeparator>
                                <TimelineDot color="primary" sx={{ my: 0.5 }} />
                                {index < reservation.changeHistory!.length - 1 && <TimelineConnector />}
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="body2" fontWeight={500}>
                                  {record.user}
                                </Typography>
                                {record.changes.map((change, changeIndex) => (
                                  <Box key={changeIndex} sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" display="block">
                                      Changed <strong>{change.field}</strong> from <span style={{ textDecoration: 'line-through' }}>{change.oldValue}</span> to <strong>{change.newValue}</strong>
                                    </Typography>
                                  </Box>
                                ))}
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  {reservation.status !== ReservationStatus.Completed && 
                   reservation.status !== ReservationStatus.Cancelled && (
                    <>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleEditClick(e, reservation)}
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
                    </>
                  )}
                  {(reservation.status === ReservationStatus.Completed || 
                    reservation.status === ReservationStatus.Cancelled) && (
                    <Typography variant="caption" color="text.secondary" fontStyle="italic">
                      No actions available for {reservation.status.toLowerCase()} reservations
                    </Typography>
                  )}
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarMonthIcon sx={{ color: Colors.blue, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} color={Colors.blue}>
              Manage Reservations
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: 2,
            width: { xs: '100%', lg: 'auto' },
            flexWrap: 'wrap'
          }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search by ID"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 200 } }}
            />
            
            {/* Status Filter */}
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusFilterChange}
              aria-label="status filter"
              size="small"
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                overflowX: 'auto',
                '& .MuiToggleButton-root': { 
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            >
              <ToggleButton value="all" aria-label="all">
                All
              </ToggleButton>
              <ToggleButton 
                value={ReservationStatus.Confirmed} 
                aria-label="confirmed"
                sx={{ color: 'success.main', '&.Mui-selected': { bgcolor: 'success.light', color: 'success.dark' } }}
              >
                Confirmed
              </ToggleButton>
              <ToggleButton 
                value={ReservationStatus.Pending} 
                aria-label="pending"
                sx={{ color: 'warning.main', '&.Mui-selected': { bgcolor: 'warning.light', color: 'warning.dark' } }}
              >
                Pending
              </ToggleButton>
              <ToggleButton 
                value={ReservationStatus.Completed} 
                aria-label="completed"
                sx={{ color: 'info.main', '&.Mui-selected': { bgcolor: 'info.light', color: 'info.dark' } }}
              >
                Completed
              </ToggleButton>
              <ToggleButton 
                value={ReservationStatus.Cancelled} 
                aria-label="cancelled"
                sx={{ color: 'error.main', '&.Mui-selected': { bgcolor: 'error.light', color: 'error.dark' } }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
                <TableCell><Typography fontWeight={600}>Reservation ID</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Edit Reservation Dialog */}
      <EditReservationDialog
        open={editDialogOpen}
        reservation={selectedReservation}
        onClose={handleCloseEditDialog}
        onSave={handleSaveChanges}
      />
    </Box>
  );
}