import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useUpdateProperty } from '../../../hooks/propertyHooks';

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HistoryIcon from '@mui/icons-material/History';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Colors } from '../../constants';
import {
  ReservationStatus,
  useGetMyReservations,
  Reservation as ApiReservation,
} from '../../../hooks/reservationHooks';
import EditReservationDialog from './EditReservationDialog';
import { useUserClaims } from '../../../hooks/useUserClaims';

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
  const updateProperty = useUpdateProperty();
  const updateReservation =
    require('../../../hooks/reservationHooks').useUpdateReservation();
  const { claims } = useUserClaims();

  // Get user role from claims
  const userRole = claims?.role || 'guest';
  const isGuest = userRole === 'guest';
  const isHost = userRole === 'host';
  const isStaff =
    userRole === 'staff' || userRole === 'admin' || userRole === 'super_admin';
  // Check-in action
  const handleCheckIn = async (reservation: Reservation) => {
    try {
      await updateReservation.mutateAsync({
        id: reservation.id,
        status: ReservationStatus.CheckedIn,
      });
      refetch();
    } catch (e) {
      console.error('Failed to check in:', e);
    }
  };

  // Check-out action
  const handleCheckOut = async (reservation: Reservation) => {
    try {
      // First find the API reservation to get room details
      const apiRes = apiReservations.find(
        r => r.reservationId === reservation.id
      );
      if (apiRes) {
        // Update reservation status
        await updateReservation.mutateAsync({
          id: reservation.id,
          status: ReservationStatus.CheckedOut,
        });

        // Update room quantityAvailable
        const propertyId = apiRes.property.id;
        const roomId = apiRes.rooms?.[0];
        if (roomId) {
          // Get the current property data to ensure we have the latest
          const property = apiRes.property;
          // Make sure we're working with a copy of the room types array
          const roomTypes = [...((property as any).roomTypes || [])];

          // Find the room type that matches our room ID
          const roomTypeIndex = roomTypes.findIndex(
            (rt: any) => rt.id === roomId
          );

          if (roomTypeIndex !== -1) {
            // Create a new array with the updated room type
            const updatedRoomTypes = roomTypes.map((rt: any, index: number) => {
              if (index === roomTypeIndex) {
                // Create a new object for the room type with incremented availability
                return {
                  ...rt,
                  quantityAvailable: (rt.quantityAvailable || 0) + 1,
                };
              }
              return rt; // Return other room types unchanged
            });

            // Update the property with all room types
            await updateProperty.mutateAsync({
              id: propertyId,
              roomTypes: updatedRoomTypes,
            });
          } else {
            console.error('Room type not found in property data');
          }
        }
      }
      refetch();
    } catch (e) {
      console.error('Failed to check out:', e);
    }
  };
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get reservations data from API
  const {
    data: apiReservations = [],
    isLoading,
    refetch,
  } = useGetMyReservations();

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
        newValue: String(value),
      })),
    })),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case ReservationStatus.Confirmed:
        return 'success';
      case ReservationStatus.Pending:
        return 'warning';
      case ReservationStatus.Cancelled:
        return 'error';
      case ReservationStatus.Completed:
        return 'info';
      default:
        return 'default';
    }
  };

  const handleRowClick = (reservationId: string) => {
    setExpandedRow(expandedRow === reservationId ? null : reservationId);
  };

  const handleEditClick = (
    event: React.MouseEvent,
    reservation: Reservation
  ) => {
    event.stopPropagation(); // Prevent row expansion when clicking edit
    setSelectedReservation(reservation);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedReservation(null);
  };

  const handleSaveChanges = async (data: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
  }) => {
    if (!selectedReservation?.id) return;
    try {
      await updateReservation.mutateAsync({
        id: selectedReservation.id,
        checkIn: data.checkIn
          ? data.checkIn.toISOString()
          : selectedReservation.checkIn,
        checkOut: data.checkOut
          ? data.checkOut.toISOString()
          : selectedReservation.checkOut,
        guests: data.guests,
      });
      refetch();
    } catch (e) {
      console.error('Failed to update reservation:', e);
    }
    // Don't close the dialog immediately - the EditReservationDialog will handle showing success and closing
  };

  const handleStatusFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
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
    .filter(
      reservation =>
        statusFilter === 'all' || reservation.status === statusFilter
    )
    .filter(
      reservation =>
        reservation.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.property
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Add loading state display
  // --- Manage Checkouts Section ---
  const today = new Date();
  const checkoutsToManage = apiReservations.filter(res => {
    const checkOutDate = new Date(res.checkOut);
    return (
      (res.status === ReservationStatus.Confirmed ||
        res.status === ReservationStatus.Pending) &&
      checkOutDate <= today
    );
  });

  const handleConfirmCheckout = async (reservation: ApiReservation) => {
    setCheckoutLoading(reservation.reservationId);
    try {
      // First update the reservation status
      await updateReservation.mutateAsync({
        id: reservation.reservationId,
        status: ReservationStatus.Completed,
      });

      // Then update room quantityAvailable
      const propertyId = reservation.property.id;
      const roomId = reservation.rooms?.[0];
      if (!roomId) throw new Error('No room found for this reservation.');

      // Get property data with room types
      const property = reservation.property;
      const roomTypes = (property as any).roomTypes || [];

      // Find the room and increment its availability
      const updatedRoomTypes = roomTypes.map((rt: any) =>
        rt.id === roomId
          ? { ...rt, quantityAvailable: (rt.quantityAvailable || 0) + 1 }
          : rt
      );

      // Update the property with the new room availability
      await updateProperty.mutateAsync({
        id: propertyId,
        roomTypes: updatedRoomTypes,
      });

      refetch();
    } catch (e) {
      console.error('Failed to confirm checkout:', e);
    }
    setCheckoutLoading(null);
  };
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

    return filteredReservations.map(reservation => (
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
            <Typography variant="body2">{reservation.property}</Typography>
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                #{reservation.id}
              </Typography>
              <IconButton size="small">
                {expandedRow === reservation.id ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
            <Collapse
              in={expandedRow === reservation.id}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#fafafa',
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
                  Reservation Details
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                  }}
                >
                  {/* Guest Information */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: '33.33%' } }}>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon
                          sx={{ fontSize: 18, color: Colors.raspberry }}
                        />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Guest Information
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Name: {reservation.guest}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <EmailIcon
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography variant="body2">
                          {reservation.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <PhoneIcon
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography variant="body2">
                          {reservation.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Booking Details */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: '33.33%' } }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        Booking Details
                      </Typography>
                      <Typography variant="body2">
                        Property: {reservation.property}
                      </Typography>
                      <Typography variant="body2">
                        Guests: {reservation.guests}
                      </Typography>
                      <Typography variant="body2">
                        Total Amount: ${reservation.totalPrice.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Duration:{' '}
                        {Math.ceil(
                          (new Date(reservation.checkOut).getTime() -
                            new Date(reservation.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        nights
                      </Typography>
                    </Box>

                    {reservation.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          Notes
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                        >
                          {reservation.notes}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Change History - Now on the right side */}
                  <Box sx={{ flex: 1, width: { xs: '100%', md: '33.33%' } }}>
                    {reservation.changeHistory &&
                      reservation.changeHistory.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <HistoryIcon
                              sx={{ fontSize: 18, color: Colors.blue }}
                            />
                            <Typography variant="subtitle2" fontWeight={600}>
                              Change History
                            </Typography>
                          </Box>

                          <Timeline
                            position="right"
                            sx={{
                              p: 0,
                              m: 0,
                              '& .MuiTimelineItem-root': { minHeight: 'auto' },
                              '& .MuiTimelineContent-root': { py: 0.5 },
                            }}
                          >
                            {reservation.changeHistory.map((record, index) => (
                              <TimelineItem key={index}>
                                <TimelineOppositeContent sx={{ flex: 0.2 }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {record.date}
                                  </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                  <TimelineDot
                                    color="primary"
                                    sx={{ my: 0.5 }}
                                  />
                                  {index <
                                    reservation.changeHistory!.length - 1 && (
                                    <TimelineConnector />
                                  )}
                                </TimelineSeparator>
                                <TimelineContent>
                                  <Typography variant="body2" fontWeight={500}>
                                    {record.user}
                                  </Typography>
                                  {record.changes.map((change, changeIndex) => (
                                    <Box key={changeIndex} sx={{ mt: 0.5 }}>
                                      <Typography
                                        variant="caption"
                                        display="block"
                                      >
                                        Changed <strong>{change.field}</strong>{' '}
                                        from{' '}
                                        <span
                                          style={{
                                            textDecoration: 'line-through',
                                          }}
                                        >
                                          {change.oldValue}
                                        </span>{' '}
                                        to <strong>{change.newValue}</strong>
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

                <Box
                  sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
                >
                  {(() => {
                    const checkInDate = new Date(reservation.checkIn);
                    const checkOutDate = new Date(reservation.checkOut);
                    const now = new Date();
                    const today = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate()
                    );

                    // No actions for completed, cancelled, checked-out, no-show, rejected/declined, or on hold statuses
                    const noActionStatuses = [
                      ReservationStatus.Completed,
                      ReservationStatus.Cancelled,
                      ReservationStatus.CheckedOut,
                      ReservationStatus.NoShow,
                    ];

                    if (noActionStatuses.includes(reservation.status)) {
                      return null;
                    }

                    // Role-based action restrictions
                    // Guests can only Edit and Cancel their own reservations before check-in
                    if (isGuest) {
                      if (
                        (reservation.status === ReservationStatus.Pending ||
                          reservation.status === ReservationStatus.Confirmed) &&
                        now < checkInDate
                      ) {
                        return (
                          <>
                            {/* Edit button for guests */}
                            <IconButton
                              size="small"
                              onClick={e => handleEditClick(e, reservation)}
                              sx={{
                                color: Colors.blue,
                                backgroundColor: 'white',
                                mr: 1,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>

                            {/* Cancel button for guests */}
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={async () => {
                                await updateReservation.mutateAsync({
                                  id: reservation.id,
                                  status: ReservationStatus.Cancelled,
                                });
                                // Update room quantityAvailable on cancel
                                const apiRes = apiReservations.find(
                                  r => r.reservationId === reservation.id
                                );
                                if (apiRes) {
                                  const propertyId = apiRes.property.id;
                                  const roomId = apiRes.rooms?.[0];
                                  if (roomId) {
                                    const property = apiRes.property;
                                    const roomTypes =
                                      (property as any).roomTypes || [];
                                    const updatedRoomTypes = roomTypes.map(
                                      (rt: any) =>
                                        rt.id === roomId
                                          ? {
                                              ...rt,
                                              quantityAvailable:
                                                (rt.quantityAvailable || 0) + 1,
                                            }
                                          : rt
                                    );
                                    await updateProperty.mutateAsync({
                                      id: propertyId,
                                      roomTypes: updatedRoomTypes,
                                    });
                                  }
                                }
                                refetch();
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        );
                      }
                      return null; // No other actions for guests
                    }

                    // Host and Staff actions (full management capabilities)
                    if (isHost || isStaff) {
                      // "Check-in" button for Confirmed reservations when the check-in date is today or earlier and before checkout
                      if (
                        reservation.status === ReservationStatus.Confirmed &&
                        checkInDate <= today &&
                        now < checkOutDate
                      ) {
                        return (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleCheckIn(reservation)}
                              sx={{ mr: 1 }}
                            >
                              Check-in
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={async () => {
                                await updateReservation.mutateAsync({
                                  id: reservation.id,
                                  status: ReservationStatus.NoShow,
                                });
                                // Update room quantityAvailable on no-show
                                const apiRes = apiReservations.find(
                                  r => r.reservationId === reservation.id
                                );
                                if (apiRes) {
                                  const propertyId = apiRes.property.id;
                                  const roomId = apiRes.rooms?.[0];
                                  if (roomId) {
                                    const property = apiRes.property;
                                    const roomTypes =
                                      (property as any).roomTypes || [];
                                    const updatedRoomTypes = roomTypes.map(
                                      (rt: any) =>
                                        rt.id === roomId
                                          ? {
                                              ...rt,
                                              quantityAvailable:
                                                (rt.quantityAvailable || 0) + 1,
                                            }
                                          : rt
                                    );
                                    await updateProperty.mutateAsync({
                                      id: propertyId,
                                      roomTypes: updatedRoomTypes,
                                    });
                                  }
                                }
                                refetch();
                              }}
                            >
                              No-show
                            </Button>
                          </>
                        );
                      }

                      // "Check-out" button for any Checked-in reservations
                      if (reservation.status === ReservationStatus.CheckedIn) {
                        return (
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            onClick={() => handleCheckOut(reservation)}
                            sx={{ mr: 1 }}
                          >
                            Check-out
                          </Button>
                        );
                      }

                      // "Edit" and "Cancel" buttons for Pending or Confirmed reservations
                      if (
                        reservation.status === ReservationStatus.Pending ||
                        (reservation.status === ReservationStatus.Confirmed &&
                          now < checkInDate)
                      ) {
                        return (
                          <>
                            {/* Edit button */}
                            <IconButton
                              size="small"
                              onClick={e => handleEditClick(e, reservation)}
                              sx={{
                                color: Colors.blue,
                                backgroundColor: 'white',
                                mr: 1,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>

                            {/* Cancel button */}
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={async () => {
                                await updateReservation.mutateAsync({
                                  id: reservation.id,
                                  status: ReservationStatus.Cancelled,
                                });
                                // Update room quantityAvailable on cancel
                                const apiRes = apiReservations.find(
                                  r => r.reservationId === reservation.id
                                );
                                if (apiRes) {
                                  const propertyId = apiRes.property.id;
                                  const roomId = apiRes.rooms?.[0];
                                  if (roomId) {
                                    const property = apiRes.property;
                                    const roomTypes =
                                      (property as any).roomTypes || [];
                                    const updatedRoomTypes = roomTypes.map(
                                      (rt: any) =>
                                        rt.id === roomId
                                          ? {
                                              ...rt,
                                              quantityAvailable:
                                                (rt.quantityAvailable || 0) + 1,
                                            }
                                          : rt
                                    );
                                    await updateProperty.mutateAsync({
                                      id: propertyId,
                                      roomTypes: updatedRoomTypes,
                                    });
                                  }
                                }
                                refetch();
                              }}
                            >
                              Cancel
                            </Button>

                            {/* Show Approve button only for Pending reservations and only for Staff */}
                            {reservation.status === ReservationStatus.Pending &&
                              isStaff && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={async () => {
                                    // Find the full API reservation to get all required fields
                                    const apiRes = apiReservations.find(
                                      r => r.reservationId === reservation.id
                                    );
                                    await updateReservation.mutateAsync({
                                      id: reservation.id,
                                      status: ReservationStatus.Confirmed,
                                      propertyId: apiRes?.property?.id,
                                      roomTypeId: apiRes?.rooms?.[0],
                                      checkIn: apiRes?.checkIn,
                                      checkOut: apiRes?.checkOut,
                                    });
                                    refetch();
                                  }}
                                  sx={{ ml: 1 }}
                                >
                                  Approve
                                </Button>
                              )}
                          </>
                        );
                      }
                    }

                    // Fallback case - no actions available
                    return null;
                  })()}
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarMonthIcon sx={{ color: Colors.blue, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} color={Colors.blue}>
              Manage Reservations
            </Typography>
            <IconButton
              aria-label="Refresh"
              onClick={() => refetch()}
              sx={{ ml: 1 }}
            >
              <AutorenewIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              width: { xs: '100%', lg: 'auto' },
              flexWrap: 'wrap',
            }}
          >
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
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              <ToggleButton value="all" aria-label="all">
                All
              </ToggleButton>
              <ToggleButton
                value={ReservationStatus.Confirmed}
                aria-label="confirmed"
                sx={{
                  color: 'success.main',
                  '&.Mui-selected': {
                    bgcolor: 'success.light',
                    color: 'success.dark',
                  },
                }}
              >
                Confirmed
              </ToggleButton>
              <ToggleButton
                value={ReservationStatus.Pending}
                aria-label="pending"
                sx={{
                  color: 'warning.main',
                  '&.Mui-selected': {
                    bgcolor: 'warning.light',
                    color: 'warning.dark',
                  },
                }}
              >
                Pending
              </ToggleButton>
              <ToggleButton
                value={ReservationStatus.Completed}
                aria-label="completed"
                sx={{
                  color: 'info.main',
                  '&.Mui-selected': {
                    bgcolor: 'info.light',
                    color: 'info.dark',
                  },
                }}
              >
                Completed
              </ToggleButton>
              <ToggleButton
                value={ReservationStatus.Cancelled}
                aria-label="cancelled"
                sx={{
                  color: 'error.main',
                  '&.Mui-selected': {
                    bgcolor: 'error.light',
                    color: 'error.dark',
                  },
                }}
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
                <TableCell>
                  <Typography fontWeight={600}>Guest</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>Property</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>Check-in</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>Check-out</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>Amount</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>Reservation ID</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderContent()}</TableBody>
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
