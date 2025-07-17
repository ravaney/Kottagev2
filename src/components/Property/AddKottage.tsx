import { PrimaryButton, Stack } from "@fluentui/react";
import { TextField, CircularProgress, Paper, Typography, Box, Grid, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Kottage, useAddProperty } from "../../hooks/propertyHooks";
import ImagePicker from "../ImagePicker";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { IAddress } from "../../../public/QuickType";
import { Colors } from "../constants";
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@mui/icons-material/Save';
type Props = {};

function AddKottage({}: Props) {
  const [kottage, setKottage] = useState({} as Kottage);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const {firebaseUser} = useAuth();
  const navigate = useNavigate();

  const gap = { childrenGap: 10 };
  const addPropertyMutation = useAddProperty();
  
  const isFormValid = () => {
    return (
      kottage.name?.trim() &&
      kottage.address?.address1?.trim() &&
      kottage.address?.city?.trim() &&
      kottage.address?.state?.trim() &&
      kottage.address?.country?.trim() &&
      kottage.phone?.trim()&&
      kottage.amenities 
    );
  };

  const handleAddKottage = async () => {
    try {
      if (!firebaseUser?.uid) {
        throw new Error("User must be authenticated to add a property");
      }
      const property = { 
        ...kottage, 
        ownerId: firebaseUser.uid,
        id: Date.now().toString(),
        isListed: false
      };
      await addPropertyMutation.mutateAsync({ property, Files: selectedImages });
      // Navigate to property management page on success
      navigate('/MyAccount/MyKottages');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 4 }}>
          <HomeIcon sx={{ fontSize: 40, color: Colors.blue }} />
          <Box>
            <Typography variant="h4" fontWeight={700} color={Colors.blue}>
              Add New Property
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details to list your property
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <ImagePicker
            setSelectedImages={setSelectedImages}
            selectedImages={selectedImages}
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2, color: Colors.blue, fontWeight: 600 }}>
          Basic Information
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Property Name *"
              value={kottage.name || ''}
              onChange={(e) =>
                setKottage((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter a catchy name for your property"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={kottage.description || ''}
              onChange={(e) =>
                setKottage((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe your property's unique features and amenities"
            />
          </Grid>
          <Grid item xs={12} md={6}>
          
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1 *"
              value={kottage.address?.address1 || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  address: { ...prev.address, address1: e.target.value } as IAddress
                }))
              }
              placeholder="Street address"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2"
              value={kottage.address?.address2 || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  address: { ...prev.address, address2: e.target.value } as IAddress
                }))
              }
              placeholder="Apartment, suite, etc. (optional)"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City *"
              value={kottage.address?.city || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value } as IAddress
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State *"
              value={kottage.address?.state || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value } as IAddress
                }))
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={kottage.address?.zip || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  address: { ...prev.address, zip: e.target.value } as IAddress
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country *"
              value={kottage.address?.country || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  address: { ...prev.address, country: e.target.value } as IAddress
                }))
              }
              required
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2, color: Colors.blue, fontWeight: 600 }}>
          Property Details
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Phone *"
              value={kottage.phone || ''}
              onChange={(e) =>
                setKottage((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Your contact number for guests"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amenities (comma separated)"
              value={kottage.amenities?.join(', ') || ''}
              onChange={(e) =>
                setKottage((prev) => ({ 
                  ...prev, 
                  amenities: e.target.value.split(',').map(item => item.trim())
                }))
              }
              placeholder="e.g., Wi-Fi, Pool, Parking"
            />
          </Grid>

        </Grid>
        <Typography variant="h6" sx={{ mb: 2, color: Colors.blue, fontWeight: 600 }}>
          Contact Information
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Phone *"
              value={kottage.phone || ''}
              onChange={(e) =>
                setKottage((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Your contact number for guests"
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/MyAccount/MyKottages')}
            disabled={addPropertyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={addPropertyMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleAddKottage}
            disabled={addPropertyMutation.isPending || !isFormValid()}
            sx={{
              backgroundColor: Colors.blue,
              '&:hover': { backgroundColor: Colors.raspberry },
              minWidth: 150
            }}
          >
            {addPropertyMutation.isPending ? 'Creating...' : 'Create Property'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddKottage;
