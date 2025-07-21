import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  BarChart as BarChartIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Colors } from '../constants';
import { Kottage, useUpdateProperty, useDeleteProperty, useMyProperties, RoomType } from '../../hooks/propertyHooks';
import { useNavigate, useParams } from 'react-router-dom';
import EditPropertyDialog from './EditPropertyDialog';

export default function ManageProperty() {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Toggle room listing status
  const toggleRoomListingStatus = async (roomId: string, currentStatus: 'listed' | 'unlisted') => {
    if (!property) return;
    
    setIsUpdating(true);
    const newStatus = currentStatus === 'listed' ? 'unlisted' : 'listed';
    
    const updatedRoomTypes = property.roomTypes?.map(room => 
      room.id === roomId 
        ? { ...room, listStatus: newStatus as "listed" | "unlisted" }
        : { ...room, listStatus: (room.listStatus || 'listed') as "listed" | "unlisted" }
    ) || [];

    const updatedProperty = {
      ...property,
      roomTypes: updatedRoomTypes
    };

    updateProperty.mutate(updatedProperty, {
      onSuccess: () => {
        setIsUpdating(false);
      },
      onError: (error) => {
        console.error('Error updating room status:', error);
        setIsUpdating(false);
      }
    });
  };
  
  // Fetch all properties and find the specific one
  const { data: properties, isLoading, error } = useMyProperties();
  
  const property = useMemo(() => {
    return properties?.find(p => p.id === propertyId);
  }, [properties, propertyId]);
  
  const handleBack = useCallback(() => {
    navigate('/MyAccount/Dashboard/properties');
  }, [navigate]);

  const handleViewProperty = useCallback(() => {
    if (property) {
      navigate(`/Kottages/${property.id}`, {
        state: { kottage: property }
      });
    }
  }, [navigate, property]);

  const handleEditProperty = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const handleToggleListing = useCallback(async () => {
    if (!property) return;
    
    setIsUpdating(true);
    try {
      await updateProperty.mutateAsync({
        ...property,
        isListed: !property.isListed
      });
    } catch (error) {
      console.error('Failed to update listing status:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [property, updateProperty]);

  const handleViewAnalytics = useCallback(() => {
    if (property) {
      navigate(`/MyAccount/Dashboard/analytics/${property.id}`, {
        state: { propertyName: property.name }
      });
    }
  }, [navigate, property]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!property) return;
    
    try {
      await deleteProperty.mutateAsync(property.id);
      setDeleteDialogOpen(false);
      navigate('/MyAccount/Dashboard/properties');
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  }, [property, deleteProperty, navigate]);

  const handleDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const getStatusChip = useCallback((property: Kottage) => {
    if (!property.isListed) {
      return <Chip label="Unlisted" color="warning" size="small" />;
    }
    
    const approvalStatus = property.approval?.status;
    switch (approvalStatus) {
      case 'approved':
        return <Chip label="Live" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending Review" color="warning" size="small" />;
      case 'under_review':
        return <Chip label="Under Review" color="info" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      case 'requires_documents':
        return <Chip label="Documents Required" color="warning" size="small" />;
      default:
        return <Chip label="Draft" color="default" size="small" />;
    }
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', backgroundColor: 'white', pt: 3, pb: 3 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} sx={{ color: Colors.blue }} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{ width: '100%', backgroundColor: 'white', pt: 3, pb: 3 }}>
        <Container maxWidth="lg">
          <Paper sx={{ borderRadius: 3, p: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              Property not found or error loading property data.
            </Alert>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBack}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Back to Properties
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', pt: 3, pb: 3 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Typography variant="h6" gutterBottom color={Colors.blue} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Property Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage all aspects of your property listing
        </Typography>
        
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back to Properties
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 3 }}>
          {/* Property Overview Header */}
          <Box sx={{ 
            p: 3, 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px 12px 0 0', 
            border: '1px solid #e0e0e0',
            borderBottom: 'none'
          }}>
            <Typography variant="h6" gutterBottom color={Colors.blue} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SettingsIcon />
              Property Overview
            </Typography>
            
            {/* Property Details Card */}
            <Card elevation={0} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      component="img"
                      src={property.images ? Object.values(property.images)[0] as string : "https://via.placeholder.com/300x200?text=Property"}
                      alt={property.name}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h5" fontWeight={600} color={Colors.blue}>
                        {property.name}
                      </Typography>
                      {getStatusChip(property)}
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      📍 {property.address?.city}, {property.address?.country}
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      {property.roomTypes && property.roomTypes.length > 0 && (
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                              {property.roomTypes.reduce((total: number, room: RoomType) => total + (room.quantityAvailable || 0), 0)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total Rooms
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.maxGuests && (
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                              {property.maxGuests}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Max Guests
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.price && (
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                              ${property.price}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Per Night
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    {property.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        p: 2, 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: 1,
                        borderLeft: '4px solid ' + Colors.blue
                      }}>
                        {property.description.substring(0, 200)}
                        {property.description.length > 200 && '...'}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Room Types Section */}
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" gutterBottom color={Colors.blue}>
                🏠 Room Types & Availability
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Edit Rooms
              </Button>
            </Box>
            
            {property.roomTypes && property.roomTypes.length > 0 ? (
              <Grid container spacing={2}>
                {property.roomTypes.map((room: RoomType, index: number) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card 
                      elevation={1} 
                      sx={{ 
                        height: '100%',
                        opacity: room.listStatus === 'unlisted' ? 0.7 : 1,
                        border: room.listStatus === 'unlisted' ? '2px dashed #ff9800' : 'none'
                      }}
                    >
                      {/* Room Image */}
                      {room.images && room.images.length > 0 && (
                        <Box sx={{ position: 'relative', height: 200 }}>
                          <Box
                            component="img"
                            src={room.images[0]}
                            alt={room.name || `Room ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: '4px 4px 0 0'
                            }}
                          />
                          {room.images.length > 1 && (
                            <Chip
                              label={`+${room.images.length - 1} more`}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </Box>
                      )}
                      
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                            {room.name || `Room ${index + 1}`}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => toggleRoomListingStatus(room.id, room.listStatus || 'listed')}
                                disabled={isUpdating}
                                sx={{
                                  backgroundColor: room.listStatus === 'unlisted' ? '#ff9800' : '#4caf50',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: room.listStatus === 'unlisted' ? '#f57c00' : '#388e3c',
                                  },
                                  width: 28,
                                  height: 28
                                }}
                              >
                                {room.listStatus === 'unlisted' ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                              <Chip 
                                label={room.listStatus === 'unlisted' ? 'Unlisted' : `${room.quantityAvailable || 0} Available`}
                                size="small"
                                color={
                                  room.listStatus === 'unlisted' 
                                    ? 'warning' 
                                    : room.quantityAvailable && room.quantityAvailable > 0 
                                      ? 'success' 
                                      : 'error'
                                }
                              />
                            </Box>
                            {room.listStatus === 'unlisted' && (
                              <Chip 
                                label="Not Visible to Guests"
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </Box>
                        
                        {room.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {room.description.substring(0, 100)}
                            {room.description.length > 100 && '...'}
                          </Typography>
                        )}
                        
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                              <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                                {room.maxOccupancy || 0}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Max Guests
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                              <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                                ${room.pricePerNight || 0}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Per Night
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {room.amenities && room.amenities.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                              Amenities:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {room.amenities.slice(0, 3).map((amenity, i) => (
                                <Chip
                                  key={i}
                                  label={amenity}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                              {room.amenities.length > 3 && (
                                <Chip
                                  label={`+${room.amenities.length - 3} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                        )}

                        {/* Show placeholder if no images */}
                        {(!room.images || room.images.length === 0) && (
                          <Box 
                            sx={{ 
                              mt: 2, 
                              p: 2, 
                              textAlign: 'center', 
                              backgroundColor: '#f5f5f5', 
                              borderRadius: 1,
                              border: '2px dashed #ddd'
                            }}
                          >
                            <PhotoLibraryIcon sx={{ color: '#bbb', fontSize: 32, mb: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              No room images uploaded
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card elevation={1}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No room types configured for this property
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditDialogOpen(true)}
                    sx={{ 
                      backgroundColor: Colors.blue,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Add Room Types
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Action Cards Section */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={Colors.blue} sx={{ mb: 3 }}>
              🛠️ Management Actions
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* View Property */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      elevation: 6,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={handleViewProperty}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <VisibilityIcon sx={{ fontSize: 48, color: Colors.blue, mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      View Property
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      See how your property appears to guests
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Edit Property */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      elevation: 6,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={handleEditProperty}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <EditIcon sx={{ fontSize: 48, color: Colors.blue, mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Edit Property
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update property details, photos, and settings
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Toggle Listing */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      elevation: 6,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={handleToggleListing}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    {property.isListed ? (
                      <PauseCircleIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                    ) : (
                      <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    )}
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      {isUpdating ? 'Updating...' : (property.isListed ? 'Unlist Property' : 'List Property')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.isListed ? 'Remove from public listings' : 'Make available for booking'}
                    </Typography>
                    {isUpdating && <CircularProgress size={20} sx={{ mt: 1, color: Colors.blue }} />}
                  </CardContent>
                </Card>
              </Grid>

              {/* View Analytics */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      elevation: 6,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={handleViewAnalytics}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <BarChartIcon sx={{ fontSize: 48, color: Colors.blue, mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      View Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check performance, bookings, and revenue
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Manage Photos */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    cursor: 'not-allowed',
                    opacity: 0.6,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <PhotoLibraryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} mb={1} color="text.secondary">
                      Manage Photos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🚧 Coming Soon
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Availability & Pricing */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    cursor: 'not-allowed',
                    opacity: 0.6,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} mb={1} color="text.secondary">
                      Availability & Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🚧 Coming Soon
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Danger Zone */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#fff5f5', 
              borderRadius: 2,
              border: '2px solid #ffebee',
              borderLeft: '6px solid #f44336'
            }}>
              <Typography variant="h6" fontWeight={600} color="error.main" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon />
                Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                ⚠️ These actions are permanent and cannot be undone. Please proceed with caution.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Delete Property Permanently
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Edit Property Dialog */}
        <EditPropertyDialog
          open={editDialogOpen}
          property={property}
          onClose={handleEditDialogClose}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleDialogClose}
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ color: Colors.blue, fontWeight: 600 }}>
            🗑️ Delete Property
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "<strong>{property.name}</strong>"? This action cannot be undone and will permanently remove all property data, bookings, and reviews.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleDialogClose}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={deleteProperty.isPending}
              startIcon={deleteProperty.isPending ? <CircularProgress size={16} /> : <DeleteIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {deleteProperty.isPending ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
