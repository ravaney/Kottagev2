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
  CircularProgress,
} from '@mui/material';
import { Kottage, useUpdateProperty } from '../../hooks/propertyHooks';
import { Colors } from '../constants';
import { IAddress } from '../../../public/QuickType';
import MuiPhoneNumber from 'mui-phone-number';

interface EditPropertyDialogProps {
  open: boolean;
  property: Kottage | null;
  onClose: () => void;
}

export default function EditPropertyDialog({
  open,
  property,
  onClose,
  
}: EditPropertyDialogProps) {
  const [propertyData, setPropertyData] = useState<Partial<Kottage>>({});
  const { mutate: updateProperty, isPending: isLoading } = useUpdateProperty();

  useEffect(() => {
    if (property) {
      setPropertyData(property);
    }
  }, [property, open]);

  const handleSave = async () => {
    if (propertyData && property) {
      updateProperty({ ...property, ...propertyData } as Kottage, {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          console.error('Error updating property:', error);
        },
      });
    }
  };

  const handleClose = () => {
    setPropertyData({});
    onClose();
  };

  const isValid = propertyData.name?.trim(); // Only name is mandatory

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
                onChange={(e) =>
                  setPropertyData((prev) => ({ ...prev, name: e.target.value }))
                }
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
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <MuiPhoneNumber
                label="Phone"
                value={propertyData.phone || ''}
                 defaultCountry={'us'}
                onChange={(value) =>

                  setPropertyData((prev) => ({
                    ...prev,
                    phone: value as string,
                  }))
                }
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
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      address1: e.target.value,
                    } as IAddress,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={propertyData.address?.address2 || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      address2: e.target.value,
                    } as IAddress,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={propertyData.address?.city || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      city: e.target.value,
                    } as IAddress,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                value={propertyData.address?.state || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      state: e.target.value,
                    } as IAddress,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={propertyData.address?.zip || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      zip: e.target.value,
                    } as IAddress,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={propertyData.address?.country || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      country: e.target.value,
                    } as IAddress,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: Colors.blue }}>
                Property Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Price per Night"
                type="number"
                value={propertyData.price || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Amenities (comma separated)"
                value={propertyData.amenities || ''}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    amenities: e.target.value
                      .split(',')
                      .map((item) => item.trim()),
                  }))
                }
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
