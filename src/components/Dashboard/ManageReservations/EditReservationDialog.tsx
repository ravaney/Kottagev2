import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, IconButton, Box, FormControl, InputLabel, Select, MenuItem,
  TextField, Alert, Fade
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Colors } from '../../constants';

interface Reservation {
  id: string;
  guest: string;
  property: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

interface EditReservationDialogProps {
  open: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (data: { checkIn: Date | null; checkOut: Date | null; guests: number }) => void;
}

export default function EditReservationDialog({ 
  open, 
  reservation, 
  onClose, 
  onSave 
}: EditReservationDialogProps) {
  const [editedCheckIn, setEditedCheckIn] = React.useState<string>('');
  const [editedCheckOut, setEditedCheckOut] = React.useState<string>('');
  const [editedGuests, setEditedGuests] = React.useState<number>(0);
  const [newPrice, setNewPrice] = React.useState<number>(0);
  const [priceDifference, setPriceDifference] = React.useState<number>(0);
  const [success, setSuccess] = React.useState<boolean>(false);
  
  // Update state when reservation changes
  React.useEffect(() => {
    if (reservation) {
      setEditedCheckIn(reservation.checkIn);
      setEditedCheckOut(reservation.checkOut);
      setEditedGuests(reservation.guests);
      setNewPrice(reservation.totalPrice);
      setPriceDifference(0);
      setSuccess(false);
    }
  }, [reservation]);
  
  // Calculate new price when dates or guests change
  React.useEffect(() => {
    if (!reservation) return;
    
    // Simple price calculation based on length of stay and number of guests
    const checkInDate = new Date(editedCheckIn);
    const checkOutDate = new Date(editedCheckOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Base rate of $100 per night plus $50 per guest
    const calculatedPrice = nights * 100 + editedGuests * 50;
    setNewPrice(calculatedPrice);
    setPriceDifference(calculatedPrice - reservation.totalPrice);
  }, [editedCheckIn, editedCheckOut, editedGuests, reservation]);
  
  const handleSave = () => {
    onSave({
      checkIn: new Date(editedCheckIn),
      checkOut: new Date(editedCheckOut),
      guests: editedGuests
    });
    
    // Show success message
    setSuccess(true);
    
    // Close dialog after a delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!reservation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        backgroundColor: success ? 'success.light' : Colors.blue, 
        color: success ? 'success.dark' : 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.3s'
      }}>
        {success ? 'Reservation Updated' : 'Edit Reservation'}
        <IconButton 
          size="small" 
          onClick={onClose}
          sx={{ color: success ? 'success.dark' : 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {success ? (
          <Fade in={success}>
            <Box display="flex" alignItems="center" gap={2} py={3}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  Success!
                </Typography>
                <Typography variant="body1">
                  The reservation has been successfully updated.
                </Typography>
                {priceDifference !== 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {priceDifference > 0 
                      ? `An additional charge of $${priceDifference.toLocaleString()} will be processed.` 
                      : `A refund of $${Math.abs(priceDifference).toLocaleString()} will be processed.`
                    }
                  </Typography>
                )}
              </Box>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600}>
                {reservation.property} - {reservation.guest}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                mb: 2
              }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Original Reservation Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Check-in</Typography>
                    <Typography variant="body2">{new Date(reservation.checkIn).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Check-out</Typography>
                    <Typography variant="body2">{new Date(reservation.checkOut).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Guests</Typography>
                    <Typography variant="body2">{reservation.guests}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                New Reservation Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check-in Date"
                type="date"
                value={editedCheckIn}
                onChange={(e) => setEditedCheckIn(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check-out Date"
                type="date"
                value={editedCheckOut}
                onChange={(e) => setEditedCheckOut(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: editedCheckIn }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="guests-label">Number of Guests</InputLabel>
                <Select
                  labelId="guests-label"
                  value={editedGuests}
                  label="Number of Guests"
                  onChange={(e) => setEditedGuests(Number(e.target.value))}
                  size="small"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <MenuItem key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                border: '1px dashed #ccc'
              }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Price Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">Original Price:</Typography>
                  <Typography variant="body2">${reservation.totalPrice.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="body2">New Price:</Typography>
                  <Typography variant="body2" fontWeight={600}>${newPrice.toLocaleString()}</Typography>
                </Box>
                {priceDifference !== 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 1, 
                    pt: 1, 
                    borderTop: '1px dashed #ccc'
                  }}>
                    {priceDifference > 0 ? (
                      <>
                        <Typography variant="body2" color="error" fontWeight={600}>
                          Additional Charge:
                        </Typography>
                        <Typography variant="body2" color="error" fontWeight={600}>
                          ${priceDifference.toLocaleString()}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" color="success.main" fontWeight={600}>
                          Refund Amount:
                        </Typography>
                        <Typography variant="body2" color="success.main" fontWeight={600}>
                          ${Math.abs(priceDifference).toLocaleString()}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      {!success && (
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ backgroundColor: Colors.blue }}
          >
            Confirm
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}