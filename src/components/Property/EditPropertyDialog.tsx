import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Kottage } from '../../hooks/propertyHooks';
import { Colors } from '../constants';
import { IAddress } from '../../../public/QuickType';

interface EditPropertyDialogProps {
  open: boolean;
  property: Kottage | null;
  onClose: () => void;
  onSave: (property: Kottage) => Promise<void>;
  isLoading: boolean;
}

export default function EditPropertyDialog({ 
  open, 
  property, 
  onClose, 
  onSave, 
  isLoading 
}: EditPropertyDialogProps) {
  const [propertyData, setPropertyData] = useState<Partial<Kottage>>({});

  useEffect(() => {
    if (property) {
      setPropertyData(property);
    }
  }, [property, open]);

  const handleSave = async () => {
    if (propertyData && property) {
      await onSave({ ...property, ...propertyData } as Kottage);
    }
  };

  const handleClose = () => {
    setPropertyData({});
    onClose();
  };

  const isValid = propertyData.name?.trim() && 
                  propertyData.address?.address1?.trim() &&
                  propertyData.address?.city?.trim() &&
                  propertyData.address?.state?.trim() &&
                  propertyData.address?.country?.trim() &&
                  propertyData.guests && 
                  propertyData.rooms && 
                  propertyData.phone?.trim();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Property</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Name"
                value={propertyData.name || ''}
                onChange={(e) => setPropertyData(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={propertyData.description || ''}
                onChange={(e) => setPropertyData(prev => ({ ...prev, description: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={propertyData.phone || ''}
                onChange={(e) => setPropertyData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: Colors.blue }}>
                Address
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={propertyData.address?.address1 || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, address1: e.target.value } as IAddress
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={propertyData.address?.address2 || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, address2: e.target.value } as IAddress
                }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={propertyData.address?.city || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value } as IAddress
                }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                value={propertyData.address?.state || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value } as IAddress
                }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={propertyData.address?.zip || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, zip: e.target.value } as IAddress
                }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={propertyData.address?.country || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, country: e.target.value } as IAddress
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: Colors.blue }}>
                Property Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bedrooms"
                type="number"
                value={propertyData.rooms || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  rooms: parseInt(e.target.value) || 0 
                }))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bathrooms"
                type="number"
                value={propertyData.bathrooms || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  bathrooms: parseInt(e.target.value) || 0 
                }))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max Guests"
                type="number"
                value={propertyData.guests || ''}
                onChange={(e) => setPropertyData(prev => ({ 
                  ...prev, 
                  guests: parseInt(e.target.value) || 0 
                }))}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!isValid || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{ backgroundColor: Colors.blue }}
        >
          {isLoading ? 'Updating...' : 'Update Property'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}