import React, { useState } from 'react';
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
  Paper,
  Divider
} from '@mui/material';
import { RoomType, useAddPropertyImages } from '../../hooks/propertyHooks';
import { Colors } from '../constants';
import RoomIcon from '@mui/icons-material/Room';
import NumbersIcon from '@mui/icons-material/Numbers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import ImagePicker from '../ImagePicker';

interface RoomConfigDialogProps {
  open: boolean;
  editingRoom: RoomType | null;
  onClose: () => void;
  onSave: (room: Partial<RoomType>) => Promise<void>;
  isLoading: boolean;
}

export default function RoomConfigDialog({ 
  open, 
  editingRoom, 
  onClose, 
  onSave, 
  isLoading 
}: RoomConfigDialogProps) {
  const addPropertyImages = useAddPropertyImages();
  const [roomData, setRoomData] = useState<Partial<RoomType>>({
    name: editingRoom?.name || '',
    quantityAvailable: editingRoom?.quantityAvailable || 1,
    pricePerNight: editingRoom?.pricePerNight || 0,
    description: editingRoom?.description || '',
    images: editingRoom?.images || [],
    maxOccupancy: editingRoom?.maxOccupancy || 1
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  React.useEffect(() => {
    if (editingRoom) {
      setRoomData({
        name: editingRoom.name,
        quantityAvailable: editingRoom.quantityAvailable,
        pricePerNight: editingRoom.pricePerNight,
        description: editingRoom.description,
        images: editingRoom.images || [],
        maxOccupancy: editingRoom.maxOccupancy || 1
        
      });
    } else {
      setRoomData({ name: '', quantityAvailable: 1, pricePerNight: 0, description: '', images: [], maxOccupancy: 1 });
    }
    setSelectedImages([]);
  }, [editingRoom, open]);

  const handleSave = async () => {
    try {
      let imageUrls: string[] = [];
      
      // Upload room images if any are selected
      if (selectedImages.length > 0) {
        imageUrls = await addPropertyImages.mutateAsync({
          images: selectedImages,
          propertyId: `room_${roomData.name || 'temp'}_${Date.now()}`
        });
      }
      
      // Add image URLs to room data
      const roomWithImages = {
        ...roomData,
        images: [...(roomData.images || []), ...imageUrls]
      };
      
      await onSave(roomWithImages);
    } catch (error) {
      console.error('Failed to upload room images:', error);
      // Still save room data even if image upload fails
      await onSave(roomData);
    }
  };

  const handleClose = () => {
    setRoomData({ name: '', quantityAvailable: 1, pricePerNight: 0, description: '', images: [], maxOccupancy: 1 });
    setSelectedImages([]);
    onClose();
  };

  const isValid = roomData.name && roomData.quantityAvailable && roomData.pricePerNight;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${Colors.blue}15 0%, ${Colors.raspberry}15 100%)`,
          p: 3,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <RoomIcon sx={{ color: Colors.blue, fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} color={Colors.blue}>
              {editingRoom ? 'Edit Room Configuration' : 'Add Room Configuration'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure room details and pricing
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '2px solid #f0f0f0',
                borderRadius: 2,
                '&:focus-within': {
                  borderColor: Colors.blue
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <RoomIcon sx={{ color: Colors.blue, fontSize: 20 }} />
                <Typography variant="h6" color={Colors.blue} fontWeight={600}>
                  Room Information
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Room Name"
                value={roomData.name || ''}
                onChange={(e) => setRoomData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Master Bedroom, Guest Room, Studio"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '2px solid #f0f0f0',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <NumbersIcon sx={{ color: Colors.blue, fontSize: 20 }} />
                <Typography variant="h6" color={Colors.blue} fontWeight={600}>
                  Quantity & Pricing
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Number of Rooms"
                    type="number"
                    value={roomData.quantityAvailable || 1}
                    onChange={(e) => setRoomData(prev => ({ ...prev, quantityAvailable: parseInt(e.target.value) || 1 }))}
                    inputProps={{ min: 1 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price per Night"
                    type="number"
                    value={roomData.pricePerNight || 0}
                    onChange={(e) => setRoomData(prev => ({ ...prev, pricePerNight: parseFloat(e.target.value) || 0 }))}
                    InputProps={{
                      startAdornment: <AttachMoneyIcon sx={{ color: Colors.raspberry, mr: 1 }} />
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '2px solid #f0f0f0',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <ImageIcon sx={{ color: Colors.blue, fontSize: 20 }} />
                <Typography variant="h6" color={Colors.blue} fontWeight={600}>
                  Room Images
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Optional)
                </Typography>
              </Box>
              <ImagePicker
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: '2px solid #f0f0f0',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <DescriptionIcon sx={{ color: Colors.blue, fontSize: 20 }} />
                <Typography variant="h6" color={Colors.blue} fontWeight={600}>
                  Description
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Optional)
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={roomData.description || ''}
                onChange={(e) => setRoomData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the room features, amenities, and unique characteristics..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={isLoading}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!isValid || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ 
            backgroundColor: Colors.blue,
            '&:hover': { backgroundColor: Colors.raspberry },
            borderRadius: 2,
            px: 4,
            py: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {isLoading ? (editingRoom ? 'Updating...' : 'Adding...') : (editingRoom ? 'Update Room' : 'Add Room')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}