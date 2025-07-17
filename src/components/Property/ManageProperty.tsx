import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Chip,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Kottage, RoomType, useMyProperties, useDeleteProperty, useUpdateProperty } from '../../hooks/propertyHooks';
import { Colors } from '../constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PublishIcon from '@mui/icons-material/Publish';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import RoomIcon from '@mui/icons-material/Room';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditPropertyDialog from './EditPropertyDialog';
import RoomConfigCard from './RoomConfigCard';
import RoomConfigDialog from './RoomConfigDialog';

export default function ManageProperty() {
  const { propertyName } = useParams<{ propertyName: string }>();
  const navigate = useNavigate();
  const { data: properties } = useMyProperties();
  const deleteProperty = useDeleteProperty();
  const updateProperty = useUpdateProperty();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editPropertyOpen, setEditPropertyOpen] = useState(false);

  const property = properties?.find(p => p.name === decodeURIComponent(propertyName || ''));

  const handleToggleListing = async () => {
    if (!property) return;
    try {
      await updateProperty.mutateAsync({
        ...property,
        isListed: !property.isListed
      });
    } catch (error) {
      console.error('Failed to update listing status:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!property) return;
    try {
      await deleteProperty.mutateAsync(property.id);
      setDeleteDialogOpen(false);
      navigate('/MyAccount/MyKottages');
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleSaveRoom = async (roomData: Partial<RoomType>) => {
    if (!property || !roomData.name || !roomData.quantityAvailable || !roomData.pricePerNight) return;

    setIsAddingRoom(true);
    
    try {
      let updatedRooms;
      
      if (editingRoom) {
        // Update existing room
        updatedRooms = property.roomTypes?.map(room => 
          room.id === editingRoom.id 
            ? { ...room, ...roomData }
            : room
        ) || [];
      } else {
        // Add new room
        const roomToAdd: RoomType = {
          id: Date.now().toString(),
          name: roomData.name,
          quantityAvailable: roomData.quantityAvailable,
          pricePerNight: roomData.pricePerNight,
          description: roomData.description || '',
          amenities: roomData.amenities || [],
          images: [],
          maxGuests: roomData.maxGuests || 1,
        };
        updatedRooms = [...(property.roomTypes || []), roomToAdd];
      }
      
      await updateProperty.mutateAsync({
        ...property,
        roomTypes: updatedRooms
      });
      
      setRoomDialogOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Failed to save room:', error);
    } finally {
      setIsAddingRoom(false);
    }
  };
  
  const handleEditRoom = (room: RoomType) => {
    setEditingRoom(room);
    setRoomDialogOpen(true);
  };
  
  const handleAddNewRoom = () => {
    setEditingRoom(null);
    setRoomDialogOpen(true);
  };
  
  const handleDeleteRoom = async (roomId: string) => {
    if (!property) return;
    
    try {
      const updatedRooms = property.roomTypes?.filter(room => room.id !== roomId) || [];
      await updateProperty.mutateAsync({
        ...property,
        roomTypes: updatedRooms
      });
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };
  
 

  if (!property) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Property not found</Typography>
        <Button onClick={() => navigate('/MyAccount/MyKottages')} sx={{ mt: 2 }}>
          Back to Properties
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            background: `linear-gradient(135deg, ${Colors.blue}15 0%, ${Colors.raspberry}15 100%)`,
            p: 3,
            borderBottom: '1px solid #e0e0e0',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={() => navigate('/MyAccount/MyKottages')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'white',
              color: Colors.blue,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: Colors.blue,
                color: 'white',
                transform: 'scale(1.05)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ marginLeft:5 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color={Colors.blue}>
                {property.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: Colors.raspberry }} />
                <Typography variant="body2" color="text.secondary">
                  {property.address?.country}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Chip 
            label={property.isListed ? "Listed" : "Unlisted"}
            color={property.isListed ? "success" : "warning"}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditPropertyOpen(true)}
            sx={{
              backgroundColor: Colors.blue,
              '&:hover': { backgroundColor: Colors.raspberry },
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Edit Property
          </Button>
          
          <Button
            variant="outlined"
            startIcon={property.isListed ? <VisibilityOffIcon /> : <PublishIcon />}
            onClick={handleToggleListing}
            disabled={updateProperty.isPending}
            sx={{
              color: property.isListed ? '#ff9800' : '#4caf50',
              borderColor: property.isListed ? '#ff9800' : '#4caf50',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: property.isListed ? 'rgba(255, 152, 0, 0.08)' : 'rgba(76, 175, 80, 0.08)'
              }
            }}
          >
            {updateProperty.isPending ? 'Updating...' : (property.isListed ? 'Unlist' : 'List')}
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ backgroundColor: 'white' }}
          >
            Delete Property
          </Button>


        </Box>
      </Box>
      
      <Box sx={{ p: 4 }}>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
           
            
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <BathtubIcon sx={{ color: Colors.blue }} />
              <Typography>{property.roomTypes?.reduce((total, room) => total + (room.quantityAvailable || 0), 0)} Bathrooms</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <PeopleIcon sx={{ color: Colors.blue }} />
              <Typography>Max {property.roomTypes?.reduce((total, room) => total + (room.maxGuests || 0), 0)} Guests</Typography>            </Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <PhoneIcon sx={{ color: Colors.blue }} />
              <Typography>{property.phone}</Typography>
            </Box>
          </Grid>
        </Grid>

        {property.address && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, color: Colors.blue }}>
              Address
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {property.address.address1}
              {property.address.address2 && `, ${property.address.address2}`}
              <br />
              {property.address.city}, {property.address.state} {property.address.zip}
              <br />
              {property.address.country}
            </Typography>
          </Box>
        )}

        {property.description && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, color: Colors.blue }}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {property.description}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ color: Colors.blue, fontWeight: 600 }}>
              Room Configurations
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddNewRoom}
              sx={{ color: Colors.blue, borderColor: Colors.blue }}
            >
              Add Room Type
            </Button>
          </Box>
          
          {property.roomTypes && property.roomTypes.length > 0 ? (
            <Grid container spacing={2}>
              {property.roomTypes.map((room) => (
                <Grid item xs={12} md={6} key={room.id}>
                  <RoomConfigCard 
                    room={room}
                    onEdit={handleEditRoom}
                    onDelete={handleDeleteRoom}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed #e0e0e0', borderRadius: 2 }}>
              <RoomIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No room configurations yet. Add room types to customize pricing.
              </Typography>
            </Box>
          )}
        </Box>
        </Box>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{property.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deleteProperty.isPending}
          >
            {deleteProperty.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <RoomConfigDialog
        open={roomDialogOpen}
        editingRoom={editingRoom}
        onClose={() => setRoomDialogOpen(false)}
        onSave={handleSaveRoom}
        isLoading={isAddingRoom}
      />
      
      <EditPropertyDialog
        open={editPropertyOpen}
        property={property}
        onClose={() => setEditPropertyOpen(false)}
      />
    </Box>
  );
}