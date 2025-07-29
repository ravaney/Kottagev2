import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  styled,
} from '@mui/material';
import Grid from "@mui/material/GridLegacy";
import {
  PhotoLibrary as PhotoLibraryIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  Collections as CollectionsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Colors } from '../constants';
import { Kottage, RoomType, useUpdateProperty, useAddPropertyImages, useUploadRoomImages } from '../../hooks/propertyHooks';
import ImagePicker from '../ImagePicker';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface PhotoManagementDialogProps {
  open: boolean;
  property: Kottage | null;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`photo-tabpanel-${index}`}
      aria-labelledby={`photo-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PhotoManagementDialog({
  open,
  property,
  onClose,
}: PhotoManagementDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPropertyImages, setSelectedPropertyImages] = useState<File[]>([]);
  const [selectedRoomImages, setSelectedRoomImages] = useState<{ [roomId: string]: File[] }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { mutate: updateProperty } = useUpdateProperty();
  const { mutate: uploadPropertyImages } = useAddPropertyImages();
  const { mutate: uploadRoomImages } = useUploadRoomImages();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedPropertyImages([]);
      setSelectedRoomImages({});
      setTabValue(0);
    }
  }, [open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Property Images Functions
  const handlePropertyImageUpload = async () => {
    if (!property || selectedPropertyImages.length === 0) return;

    setIsUploading(true);
    try {
      await uploadPropertyImages({
        images: selectedPropertyImages,
        propertyId: property.id
      });
      setSelectedPropertyImages([]);
      onClose(); // Close dialog and let parent refresh data
    } catch (error) {
      console.error('Error uploading property images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePropertyImage = async (imageUrl: string) => {
    if (!property) return;

    setIsDeleting(imageUrl);
    try {
      // Remove image from property's images array
      const updatedImages = property.images?.filter(img => img !== imageUrl) || [];
      
      const updatedProperty = {
        ...property,
        images: updatedImages
      };

      await updateProperty(updatedProperty);
    } catch (error) {
      console.error('Error deleting property image:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Room Images Functions
  const handleRoomImageUpload = (roomId: string, files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setSelectedRoomImages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), ...newFiles]
    }));
  };

  const removeSelectedRoomImage = (roomId: string, index: number) => {
    setSelectedRoomImages(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.filter((_, i) => i !== index) || []
    }));
  };

  const handleUploadRoomImages = async (roomId: string) => {
    if (!property || !selectedRoomImages[roomId]?.length) return;

    setIsUploading(true);
    try {
      await uploadRoomImages({
        images: selectedRoomImages[roomId],
        propertyId: property.id,
        roomId: roomId
      });
      
      // Clear selected images for this room
      setSelectedRoomImages(prev => ({
        ...prev,
        [roomId]: []
      }));
      
      onClose(); // Close dialog and let parent refresh data
    } catch (error) {
      console.error('Error uploading room images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRoomImage = async (roomId: string, imageUrl: string) => {
    if (!property) return;

    setIsDeleting(imageUrl);
    try {
      // Update room images
      const updatedRoomTypes = property.roomTypes?.map(room => 
        room.id === roomId 
          ? { ...room, images: room.images?.filter(img => img !== imageUrl) || [] }
          : room
      ) || [];

      const updatedProperty = {
        ...property,
        roomTypes: updatedRoomTypes
      };

      await updateProperty(updatedProperty);
    } catch (error) {
      console.error('Error deleting room image:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (!property) return null;

  const propertyImages = property.images || [];
  const roomTypes = property.roomTypes || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoLibraryIcon sx={{ color: Colors.blue }} />
            <Typography variant="h5" fontWeight={600} color={Colors.blue}>
              Photo Management
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage all photos for {property.name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '70vh' }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1000
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="photo management tabs">
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CollectionsIcon fontSize="small" />
                  Property Gallery
                  <Chip label={propertyImages.length} size="small" color="primary" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FolderIcon fontSize="small" />
                  Room Photos
                  <Chip 
                    label={roomTypes.reduce((total, room) => total + (room.images?.length || 0), 0)} 
                    size="small" 
                    color="secondary" 
                  />
                </Box>
              } 
            />
          </Tabs>
        </Box>

        {/* Scrollable Content Area */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {/* Property Gallery Tab */}
          <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
              Property Gallery Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These images showcase your property's exterior, common areas, and overall ambiance to potential guests.
            </Typography>

            {/* Upload New Property Images */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Upload New Images
                </Typography>
                
                <ImagePicker
                  selectedImages={selectedPropertyImages}
                  setSelectedImages={setSelectedPropertyImages}
                />

                {selectedPropertyImages.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPropertyImages.length} image(s) ready to upload
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                      onClick={handlePropertyImageUpload}
                      disabled={isUploading}
                      sx={{ backgroundColor: Colors.blue }}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Current Property Images */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Current Property Images ({propertyImages.length})
                </Typography>

                {propertyImages.length > 0 ? (
                  <ImageList cols={3} gap={16} sx={{ maxHeight: 400 }}>
                    {propertyImages.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePropertyImage(image)}
                              disabled={isDeleting === image}
                              sx={{
                                color: '#f44336',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  color: '#d32f2f',
                                  transform: 'scale(1.1)',
                                },
                                '&:active': {
                                  transform: 'scale(0.95)',
                                },
                                transition: 'all 0.2s ease-in-out',
                                m: 1,
                                width: 32,
                                height: 32,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }}
                            >
                              {isDeleting === image ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <DeleteIcon fontSize="small" />
                              )}
                            </IconButton>
                          }
                          actionPosition="right"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Paper 
                    sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      backgroundColor: '#f5f5f5',
                      border: '2px dashed #ddd'
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, color: '#bbb', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No property images uploaded
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload images to showcase your property to potential guests
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Room Photos Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
              Room Photos Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage photos for each room type to help guests understand what they're booking.
            </Typography>

            {roomTypes.length > 0 ? (
              <Grid container spacing={3}>
                {roomTypes.map((room, roomIndex) => (
                  <Grid item xs={12} md={6} key={room.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
                          {room.name || `Room Type ${roomIndex + 1}`}
                        </Typography>

                        {/* Upload Section */}
                        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                            Upload New Room Photos
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              size="small"
                            >
                              Select Photos
                              <VisuallyHiddenInput
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoomImageUpload(room.id, e.target.files)}
                              />
                            </Button>
                            <Typography variant="caption" color="text.secondary">
                              JPG, PNG, WEBP supported
                            </Typography>
                          </Box>

                          {/* Selected Images Preview */}
                          {selectedRoomImages[room.id] && selectedRoomImages[room.id].length > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                Selected Images ({selectedRoomImages[room.id].length}):
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {selectedRoomImages[room.id].map((file, index) => (
                                  <Box key={index} sx={{ position: 'relative' }}>
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${index + 1}`}
                                      style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                        border: '2px solid #e0e0e0'
                                      }}
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() => removeSelectedRoomImage(room.id, index)}
                                      sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        color: '#f44336',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '2px solid #f0f0f0',
                                        width: 24,
                                        height: 24,
                                        '&:hover': {
                                          backgroundColor: 'rgba(255, 255, 255, 1)',
                                          color: '#d32f2f',
                                          transform: 'scale(1.1)',
                                        },
                                        '&:active': {
                                          transform: 'scale(0.9)',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                      }}
                                    >
                                      <CloseIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                ))}
                              </Box>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                                onClick={() => handleUploadRoomImages(room.id)}
                                disabled={isUploading}
                                sx={{ backgroundColor: Colors.blue }}
                              >
                                {isUploading ? 'Uploading...' : 'Upload Photos'}
                              </Button>
                            </Box>
                          )}
                        </Box>

                        {/* Current Room Images */}
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                          Current Room Photos ({room.images?.length || 0})
                        </Typography>

                        {room.images && room.images.length > 0 ? (
                          <ImageList cols={4} gap={12} sx={{ maxHeight: 300 }}>
                            {room.images.map((image, index) => (
                              <ImageListItem key={index}>
                                <img
                                  src={image}
                                  alt={`Room image ${index + 1}`}
                                  loading="lazy"
                                  style={{
                                    width: '100%',
                                    height: 150,
                                    objectFit: 'cover',
                                    borderRadius: 4
                                  }}
                                />
                                <ImageListItemBar
                                  position="top"
                                  actionIcon={
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteRoomImage(room.id, image)}
                                      disabled={isDeleting === image}
                                      sx={{
                                        color: '#f44336',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(4px)',
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                          color: '#d32f2f',
                                          transform: 'scale(1.1)',
                                        },
                                        '&:active': {
                                          transform: 'scale(0.95)',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                        m: 1,
                                        width: 28,
                                        height: 28,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                      }}
                                    >
                                      {isDeleting === image ? (
                                        <CircularProgress size={14} color="inherit" />
                                      ) : (
                                        <DeleteIcon fontSize="small" />
                                      )}
                                    </IconButton>
                                  }
                                  actionPosition="right"
                                />
                              </ImageListItem>
                            ))}
                          </ImageList>
                        ) : (
                          <Paper 
                            sx={{ 
                              p: 3, 
                              textAlign: 'center', 
                              backgroundColor: '#f5f5f5',
                              border: '2px dashed #ddd'
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 32, color: '#bbb', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              No photos uploaded for this room type
                            </Typography>
                          </Paper>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info" icon={<WarningIcon />}>
                <Typography variant="body2">
                  No room types configured for this property. Add room types in the property editor to manage room-specific photos.
                </Typography>
              </Alert>
            )}
          </Box>
        </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
