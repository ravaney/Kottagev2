import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
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
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import Grid from "@mui/material/GridLegacy";
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
  Schedule as ScheduleIcon,
  LocalOffer as LocalOfferIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  CalendarToday as CalendarTodayIcon,
  FilterAlt as FilterAltIcon,
  Today as TodayIcon,
  Block as BlockIcon,
  Save as SaveIcon,
  Percent as PercentIcon
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
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [promotionForm, setPromotionForm] = useState({
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    startDate: '',
    endDate: '',
    isActive: true,
    minNights: '',
    maxNights: '',
    daysOfWeek: [] as number[],
    blackoutDates: [] as string[]
  });
  
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

  // Promotion handlers
  const handleEditPromotion = useCallback((promotion: any) => {
    setEditingPromotion(promotion);
    setPromotionForm({
      name: promotion.name || '',
      description: promotion.description || '',
      discountType: promotion.discountType || 'percentage',
      discountValue: promotion.discountValue?.toString() || '',
      startDate: promotion.startDate || '',
      endDate: promotion.endDate || '',
      isActive: promotion.isActive !== undefined ? promotion.isActive : true,
      minNights: promotion.minNights?.toString() || '',
      maxNights: promotion.maxNights?.toString() || '',
      daysOfWeek: promotion.daysOfWeek || [],
      blackoutDates: promotion.blackoutDates || []
    });
    setPromotionDialogOpen(true);
  }, []);

  const handleTogglePromotion = useCallback(async (promotion: any) => {
    if (!property) return;
    
    setIsUpdating(true);
    const updatedPromotions = property.promotions?.map(p => 
      p.id === promotion.id 
        ? { ...p, isActive: !p.isActive }
        : p
    ) || [];

    const updatedProperty = {
      ...property,
      promotions: updatedPromotions
    };

    updateProperty.mutate(updatedProperty, {
      onSuccess: () => {
        setIsUpdating(false);
      },
      onError: (error) => {
        console.error('Error updating promotion status:', error);
        setIsUpdating(false);
      }
    });
  }, [property, updateProperty]);

  const handleDeletePromotion = useCallback(async (promotionId: string) => {
    if (!property) return;
    
    setIsUpdating(true);
    const updatedPromotions = property.promotions?.filter(p => p.id !== promotionId) || [];

    const updatedProperty = {
      ...property,
      promotions: updatedPromotions
    };

    updateProperty.mutate(updatedProperty, {
      onSuccess: () => {
        setIsUpdating(false);
      },
      onError: (error) => {
        console.error('Error deleting promotion:', error);
        setIsUpdating(false);
      }
    });
  }, [property, updateProperty]);

  const handleSavePromotion = useCallback(async () => {
    if (!property) return;
    
    setIsUpdating(true);
    const newPromotion = {
      id: editingPromotion?.id || `promo_${Date.now()}`,
      name: promotionForm.name,
      description: promotionForm.description,
      discountType: promotionForm.discountType,
      discountValue: parseFloat(promotionForm.discountValue),
      startDate: promotionForm.startDate,
      endDate: promotionForm.endDate,
      isActive: promotionForm.isActive,
      minNights: promotionForm.minNights ? parseInt(promotionForm.minNights) : undefined,
      maxNights: promotionForm.maxNights ? parseInt(promotionForm.maxNights) : undefined,
      daysOfWeek: promotionForm.daysOfWeek,
      blackoutDates: promotionForm.blackoutDates
    };

    let updatedPromotions;
    if (editingPromotion) {
      updatedPromotions = property.promotions?.map(p => 
        p.id === editingPromotion.id ? newPromotion : p
      ) || [];
    } else {
      updatedPromotions = [...(property.promotions || []), newPromotion];
    }

    const updatedProperty = {
      ...property,
      promotions: updatedPromotions
    };

    updateProperty.mutate(updatedProperty, {
      onSuccess: () => {
        setIsUpdating(false);
        setPromotionDialogOpen(false);
        setEditingPromotion(null);
        setPromotionForm({
          name: '',
          description: '',
          discountType: 'percentage',
          discountValue: '',
          startDate: '',
          endDate: '',
          isActive: true,
          minNights: '',
          maxNights: '',
          daysOfWeek: [],
          blackoutDates: []
        });
      },
      onError: (error) => {
        console.error('Error saving promotion:', error);
        setIsUpdating(false);
      }
    });
  }, [property, updateProperty, promotionForm, editingPromotion]);

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

          {/* Promotions Section */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color={Colors.blue} sx={{ mb: 3 }}>
              🎯 Promotions & Discounts
            </Typography>
            
            {/* Add Promotion Button */}
            <Box sx={{ mb: 3 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setPromotionDialogOpen(true)}
                sx={{ 
                  backgroundColor: Colors.blue,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Create New Promotion
              </Button>
            </Box>

            {/* Promotions List */}
            {property?.promotions && property.promotions.length > 0 ? (
              <Grid container spacing={2}>
                {property.promotions.map((promotion: any, index: number) => (
                  <Grid item xs={12} md={6} lg={4} key={promotion.id || index}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        height: '100%',
                        border: promotion.isActive ? `2px solid #4caf50` : '1px solid #e0e0e0',
                        opacity: promotion.isActive ? 1 : 0.7
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {promotion.name}
                          </Typography>
                          <Chip
                            label={promotion.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              backgroundColor: promotion.isActive ? '#4caf50' : '#bdbdbd',
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {promotion.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: Colors.blue }}>
                            Discount: {promotion.discountType === 'percentage' 
                              ? `${promotion.discountValue}%` 
                              : `$${promotion.discountValue}`}
                          </Typography>
                          
                          {promotion.startDate && promotion.endDate && (
                            <Typography variant="caption" color="text.secondary">
                              Valid: {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>

                        {(promotion.minNights || promotion.maxNights) && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Night restrictions: {promotion.minNights ? `Min ${promotion.minNights}` : ''} 
                            {promotion.minNights && promotion.maxNights ? ' / ' : ''}
                            {promotion.maxNights ? `Max ${promotion.maxNights}` : ''}
                          </Typography>
                        )}

                        {promotion.daysOfWeek && promotion.daysOfWeek.length > 0 && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Valid days:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {promotion.daysOfWeek.map((day: number) => (
                                <Chip
                                  key={day}
                                  label={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>

                      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditPromotion(promotion)}
                          sx={{ color: Colors.blue }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={promotion.isActive ? <PauseCircleIcon /> : <CheckCircleIcon />}
                          onClick={() => handleTogglePromotion(promotion)}
                          sx={{ color: promotion.isActive ? '#f57c00' : '#4caf50' }}
                        >
                          {promotion.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeletePromotion(promotion.id)}
                          sx={{ color: '#d32f2f' }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                <LocalOfferIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No promotions created yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create promotions to attract more bookings with special discounts and offers
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setPromotionDialogOpen(true)}
                  sx={{ 
                    backgroundColor: Colors.blue,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Create Your First Promotion
                </Button>
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

        {/* Promotion Dialog */}
        <Dialog 
          open={promotionDialogOpen} 
          onClose={() => setPromotionDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, overflow: 'hidden' }
          }}
        >
          {/* Dialog Header with Background */}
          <Box sx={{ 
            bgcolor: '#f8f9ff', 
            borderBottom: '1px solid #e0e6ff',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
            <Box sx={{ 
              bgcolor: Colors.blue, 
              color: 'white', 
              width: 40, 
              height: 40, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {editingPromotion ? <EditIcon /> : <LocalOfferIcon />}
            </Box>
            <DialogTitle sx={{ 
              color: Colors.blue, 
              fontWeight: 600, 
              p: 0,
              fontSize: '1.25rem'
            }}>
              {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
          </Box>
          
          <DialogContent sx={{ px: 3, py: 4 }}>
            <Box>
              <Grid container spacing={2}>
                {/* Section: Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={700} color={Colors.blue} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon fontSize="small" /> Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Promotion Name"
                    value={promotionForm.name}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, name: e.target.value }))}
                    variant="outlined"
                    placeholder="Summer Special, Weekend Deal, etc."
                    size="small"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={promotionForm.description}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, description: e.target.value }))}
                    variant="outlined"
                    multiline
                    rows={2}
                    placeholder="Describe your promotion to attract guests"
                    size="small"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Section: Discount Details */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color={Colors.blue} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PercentIcon fontSize="small" /> Discount Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      value={promotionForm.discountType}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                      label="Discount Type"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Discount Value ${promotionForm.discountType === 'percentage' ? '(%)' : '($)'}`}
                    value={promotionForm.discountValue}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, discountValue: e.target.value }))}
                    variant="outlined"
                    type="number"
                    size="small"
                    InputProps={{
                      startAdornment: promotionForm.discountType === 'fixed' ? <Box component="span" sx={{ mr: 1 }}>$</Box> : null,
                      endAdornment: promotionForm.discountType === 'percentage' ? <Box component="span" sx={{ ml: 1 }}>%</Box> : null,
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>

                {/* Section: Validity Period */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color={Colors.blue} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" /> Validity Period
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={promotionForm.startDate}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, startDate: e.target.value }))}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={promotionForm.endDate}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, endDate: e.target.value }))}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Section: Booking Restrictions */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color={Colors.blue} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterAltIcon fontSize="small" /> Booking Restrictions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Nights"
                    value={promotionForm.minNights}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, minNights: e.target.value }))}
                    variant="outlined"
                    type="number"
                    placeholder="Optional"
                    size="small"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Nights"
                    value={promotionForm.maxNights}
                    onChange={(e) => setPromotionForm(prev => ({ ...prev, maxNights: e.target.value }))}
                    variant="outlined"
                    type="number"
                    placeholder="Optional"
                    size="small"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>

                {/* Active Status */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    bgcolor: promotionForm.isActive ? '#e8f5e9' : '#f5f5f5',
                    border: `1px solid ${promotionForm.isActive ? '#a5d6a7' : '#e0e0e0'}`,
                    borderRadius: 2
                  }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={promotionForm.isActive}
                          onChange={(e) => setPromotionForm(prev => ({ ...prev, isActive: e.target.checked }))}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {promotionForm.isActive ? 'Promotion Active' : 'Promotion Inactive'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {promotionForm.isActive 
                              ? 'This promotion is visible and available for bookings' 
                              : 'This promotion is saved but not available for bookings'}
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
               {/* Days of Week */}
               <Grid item xs={12} sx={{ mt: 2 }}>
                 <Typography variant="subtitle2" fontWeight={700} color={Colors.blue} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <TodayIcon fontSize="small" color="action" /> Valid Days of Week
                 </Typography>
                 <Divider sx={{ mb: 2 }} />
                 <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                     {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => {
                       const isSelected = promotionForm.daysOfWeek.includes(idx);
                       return (
                         <Button
                           key={day}
                           variant={isSelected ? "contained" : "outlined"}
                           size="small"
                           sx={{ 
                             minWidth: 42, 
                             height: 36,
                             fontSize: '0.85rem', 
                             borderRadius: 2,
                             backgroundColor: isSelected ? Colors.blue : 'transparent',
                             color: isSelected ? 'white' : Colors.blue,
                             boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                             '&:hover': {
                               backgroundColor: isSelected ? Colors.blue : 'rgba(0, 0, 0, 0.04)'
                             }
                           }}
                           onClick={() => {
                             setPromotionForm(prev => {
                               const days = prev.daysOfWeek.includes(idx)
                                 ? prev.daysOfWeek.filter(d => d !== idx)
                                 : [...prev.daysOfWeek, idx];
                               return { ...prev, daysOfWeek: days };
                             });
                           }}
                         >
                           {day}
                         </Button>
                       );
                     })}
                   </Box>
                   <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                     {promotionForm.daysOfWeek.length === 0 
                       ? 'No days selected - promotion will be valid every day' 
                       : promotionForm.daysOfWeek.length === 7 
                         ? 'All days selected - promotion will be valid every day'
                         : `Promotion will only be valid on selected days`}
                   </Typography>
                 </Paper>
               </Grid>
               
               {/* Blackout Dates */}
               <Grid item xs={12} sx={{ mt: 1 }}>
                 <Typography variant="subtitle2" fontWeight={700} color={Colors.blue} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <BlockIcon fontSize="small" color="action" /> Blackout Dates
                 </Typography>
                 <Divider sx={{ mb: 2 }} />
                 <TextField
                   fullWidth
                   label="Blackout Dates (comma-separated YYYY-MM-DD)"
                   value={promotionForm.blackoutDates.join(', ')}
                   onChange={e => {
                     const dates = e.target.value
                       .split(',')
                       .map(d => d.trim())
                       .filter(d => d.length > 0);
                     setPromotionForm(prev => ({ ...prev, blackoutDates: dates }));
                   }}
                   variant="outlined"
                   placeholder="e.g. 2025-07-04, 2025-08-15"
                   helperText="Enter dates when this promotion should not be available"
                   size="small"
                   InputProps={{ sx: { borderRadius: 2 } }}
                 />
               </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f8f9ff', borderTop: '1px solid #e0e6ff' }}>
            <Button
              onClick={() => setPromotionDialogOpen(false)}
              startIcon={<CancelIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePromotion}
              variant="contained"
              disabled={isUpdating || !promotionForm.name || !promotionForm.discountValue}
              startIcon={isUpdating ? <CircularProgress size={16} /> : <SaveIcon />}
              sx={{ 
                backgroundColor: Colors.blue,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: '#0056b3'
                }
              }}
            >
              {isUpdating ? 'Saving...' : (editingPromotion ? 'Update Promotion' : 'Create Promotion')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
