import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Tab,
  Tabs,
  IconButton,
  Divider,
  OutlinedInput,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Grid from "@mui/material/GridLegacy";
import { Kottage, useUpdateProperty, useUploadApprovalDocuments, useUploadRoomImages, useAddPropertyImages, ApprovalDocument, RoomType } from '../../hooks/propertyHooks';
import { Colors } from '../constants';
import { IAddress } from '../../../public/QuickType';
import ImagePicker from '../ImagePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// Amenity Icons
import WifiIcon from '@mui/icons-material/Wifi';
import PoolIcon from '@mui/icons-material/Pool';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HotTubIcon from '@mui/icons-material/HotTub';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import YardIcon from '@mui/icons-material/Yard';
import BalconyIcon from '@mui/icons-material/Balcony';
import PetsIcon from '@mui/icons-material/Pets';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import SecurityIcon from '@mui/icons-material/Security';
import TvIcon from '@mui/icons-material/Tv';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ShowerIcon from '@mui/icons-material/Shower';
import CoffeeMakerIcon from '@mui/icons-material/Coffee';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ChairIcon from '@mui/icons-material/Chair';
import CountertopsIcon from '@mui/icons-material/Countertops';
import WeekendIcon from '@mui/icons-material/Weekend';
import BedIcon from '@mui/icons-material/Bed';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import ImageIcon from '@mui/icons-material/Image';
import { styled } from '@mui/material/styles';

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
  const [tabValue, setTabValue] = useState(0);
  const [propertyData, setPropertyData] = useState<Partial<Kottage>>({});
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newDocuments, setNewDocuments] = useState<File[]>([]);
  const [documentTypes, setDocumentTypes] = useState<ApprovalDocument['type'][]>([]);
  const [roomNewImages, setRoomNewImages] = useState<{ [roomIndex: number]: File[] }>({});
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  
  const { mutate: updateProperty, isPending: isLoading } = useUpdateProperty();
  const { mutate: uploadDocuments, isPending: isUploadingDocs } = useUploadApprovalDocuments();
  const { mutate: uploadRoomImages, isPending: isUploadingRoomImages } = useUploadRoomImages();
  const { mutate: uploadPropertyImages, isPending: isUploadingPropertyImages } = useAddPropertyImages();

  // Track if any operation is in progress
  const isAnyOperationInProgress = isLoading || isUploadingDocs || isUploadingRoomImages || isUploadingPropertyImages;

  const propertyTypeOptions = [
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'resort', label: 'Resort' },
    { value: 'other', label: 'Other' }
  ];

  const documentTypeOptions: { value: ApprovalDocument['type']; label: string }[] = [
    { value: 'title_deed', label: 'Title Deed' },
    { value: 'utility_bill', label: 'Utility Bill' },
    { value: 'property_tax', label: 'Property Tax' },
    { value: 'lease_agreement', label: 'Lease Agreement' },
    { value: 'authorization_letter', label: 'Authorization Letter' },
    { value: 'other', label: 'Other Document' }
  ];

  const amenitiesOptions = [
    { value: 'WiFi', label: 'WiFi', icon: <WifiIcon /> },
    { value: 'Pool', label: 'Swimming Pool', icon: <PoolIcon /> },
    { value: 'Kitchen', label: 'Full Kitchen', icon: <KitchenIcon /> },
    { value: 'Parking', label: 'Free Parking', icon: <LocalParkingIcon /> },
    { value: 'Beach Access', label: 'Beach Access', icon: <BeachAccessIcon /> },
    { value: 'Hot Tub', label: 'Hot Tub/Jacuzzi', icon: <HotTubIcon /> },
    { value: 'Air Conditioning', label: 'Air Conditioning', icon: <AcUnitIcon /> },
    { value: 'Gym', label: 'Fitness Center', icon: <FitnessCenter /> },
    { value: 'Garden', label: 'Garden/Yard', icon: <YardIcon /> },
    { value: 'Balcony', label: 'Balcony/Patio', icon: <BalconyIcon /> },
    { value: 'Pet Friendly', label: 'Pet Friendly', icon: <PetsIcon /> },
    { value: 'Washing Machine', label: 'Washing Machine', icon: <LocalLaundryServiceIcon /> },
    { value: 'Dryer', label: 'Dryer', icon: <DryCleaningIcon /> },
    { value: 'Fireplace', label: 'Fireplace', icon: <FireplaceIcon /> },
    { value: 'BBQ Grill', label: 'BBQ Grill', icon: <OutdoorGrillIcon /> },
    { value: 'Security System', label: 'Security System', icon: <SecurityIcon /> },
    { value: 'TV', label: 'Smart TV', icon: <TvIcon /> },
    { value: 'Bathtub', label: 'Bathtub', icon: <BathtubIcon /> },
    { value: 'Shower', label: 'Private Shower', icon: <ShowerIcon /> },
    { value: 'Coffee Maker', label: 'Coffee Maker', icon: <CoffeeMakerIcon /> },
    { value: 'Microwave', label: 'Microwave', icon: <MicrowaveIcon /> },
    { value: 'Dining Area', label: 'Dining Area', icon: <LocalDiningIcon /> },
    { value: 'Work Desk', label: 'Work Desk', icon: <ChairIcon /> },
    { value: 'Granite Counters', label: 'Granite Countertops', icon: <CountertopsIcon /> },
    { value: 'Living Room', label: 'Living Room', icon: <WeekendIcon /> },
    { value: 'King Bed', label: 'King Size Bed', icon: <BedIcon /> },
    { value: 'Queen Bed', label: 'Queen Size Bed', icon: <BedIcon /> },
    { value: 'Premium', label: 'Premium Property', icon: <StarIcon /> }
  ];

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'under_review': return '#2196f3';
      case 'rejected': return '#f44336';
      case 'requires_documents': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <VerifiedIcon sx={{ color: '#4caf50' }} />;
      case 'pending': return <PendingIcon sx={{ color: '#ff9800' }} />;
      case 'under_review': return <PendingIcon sx={{ color: '#2196f3' }} />;
      case 'rejected': return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'requires_documents': return <CloudUploadIcon sx={{ color: '#9c27b0' }} />;
      default: return <PendingIcon sx={{ color: '#757575' }} />;
    }
  };

  useEffect(() => {
    if (property) {
      setPropertyData({
        ...property,
        address: {
          ...property.address,
          country: "Jamaica"
        }
      });
      setRoomTypes(property.roomTypes || []);
    }
  }, [property, open]);

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewDocuments(prev => [...prev, ...files]);
    setDocumentTypes(prev => [...prev, ...files.map(() => 'other' as ApprovalDocument['type'])]);
  };

  // Room image handling functions
  const handleRoomImageUpload = (roomIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setRoomNewImages(prev => ({
      ...prev,
      [roomIndex]: [...(prev[roomIndex] || []), ...files]
    }));
  };

  const removeNewRoomImage = (roomIndex: number, imageIndex: number) => {
    setRoomNewImages(prev => ({
      ...prev,
      [roomIndex]: prev[roomIndex]?.filter((_, i) => i !== imageIndex) || []
    }));
  };

  const removeExistingRoomImage = (roomIndex: number, imageIndex: number) => {
    setRoomTypes(prev => prev.map((room, i) => 
      i === roomIndex 
        ? { ...room, images: room.images?.filter((_, imgIndex) => imgIndex !== imageIndex) || [] }
        : room
    ));
  };

  const removeDocument = (index: number) => {
    setNewDocuments(prev => prev.filter((_, i) => i !== index));
    setDocumentTypes(prev => prev.filter((_, i) => i !== index));
  };

  const updateDocumentType = (index: number, type: ApprovalDocument['type']) => {
    setDocumentTypes(prev => prev.map((t, i) => i === index ? type : t));
  };

  // Room type management functions
  const addRoomType = () => {
    const newRoom: RoomType = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      description: '',
      maxOccupancy: 1,
      pricePerNight: 0,
      quantityAvailable: 1,
      amenities: [],
      images: [],
      listStatus: 'listed'
    };
    setRoomTypes(prev => [...prev, newRoom]);
  };

  const removeRoomType = (index: number) => {
    setRoomTypes(prev => prev.filter((_, i) => i !== index));
    // Clean up any new images for this room type
    setRoomNewImages(prev => {
      const updated = { ...prev };
      delete updated[index];
      // Reindex remaining room images
      const reindexed: { [key: number]: File[] } = {};
      Object.keys(updated).forEach(key => {
        const numKey = parseInt(key);
        if (numKey > index) {
          reindexed[numKey - 1] = updated[numKey];
        } else {
          reindexed[numKey] = updated[numKey];
        }
      });
      return reindexed;
    });
  };

  const updateRoomType = (index: number, field: keyof RoomType, value: any) => {
    setRoomTypes(prev => prev.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    ));
  };

  const handleAmenitiesChange = (event: any) => {
    const value = event.target.value;
    setPropertyData(prev => ({
      ...prev,
      amenities: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleRoomAmenitiesChange = (index: number, event: any) => {
    const value = event.target.value;
    updateRoomType(index, 'amenities', typeof value === 'string' ? value.split(',') : value);
  };

  const handleUploadDocuments = () => {
    if (property && newDocuments.length > 0) {
      uploadDocuments({
        propertyId: property.id,
        documents: newDocuments,
        documentTypes
      }, {
        onSuccess: () => {
          setNewDocuments([]);
          setDocumentTypes([]);
          alert('Documents uploaded successfully!');
        },
        onError: (error) => {
          console.error('Error uploading documents:', error);
          alert('Failed to upload documents. Please try again.');
        }
      });
    }
  };

  const handleSave = async () => {
    if (propertyData && property) {
      try {
        // Upload general property images first if any exist
        let generalImageUrls: string[] = [];
        if (propertyImages.length > 0) {
          generalImageUrls = await new Promise<string[]>((resolve, reject) => {
            uploadPropertyImages({
              images: propertyImages,
              propertyId: property.id
            }, {
              onSuccess: (urls) => resolve(urls),
              onError: (error) => reject(error)
            });
          });
        }

        // Upload all room images and get their Firebase URLs
        const updatedRoomTypes: RoomType[] = await Promise.all(
          roomTypes.map(async (room, index) => {
            let uploadedImageUrls: string[] = [];
            
            // Upload new images for this room if any exist
            if (roomNewImages[index] && roomNewImages[index].length > 0) {
              uploadedImageUrls = await new Promise<string[]>((resolve, reject) => {
                uploadRoomImages({
                  images: roomNewImages[index],
                  propertyId: property.id,
                  roomId: room.id
                }, {
                  onSuccess: (urls) => resolve(urls),
                  onError: (error) => reject(error)
                });
              });
            }

            return {
              ...room,
              listStatus: (room.listStatus || 'listed') as 'listed' | 'unlisted',
              // Merge existing images with newly uploaded ones
              images: [
                ...(room.images || []),
                ...uploadedImageUrls
              ]
            };
          })
        );

        const updatedProperty = { 
          ...property, 
          ...propertyData,
          roomTypes: updatedRoomTypes,
          // Merge existing property images with newly uploaded ones
          images: [
            ...(property.images || []),
            ...generalImageUrls
          ]
        } as Kottage;
        
        updateProperty(updatedProperty, {
          onSuccess: () => {
            handleClose();
          },
          onError: (error) => {
            console.error('Error updating property:', error);
          },
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Failed to upload images. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setPropertyData({});
    setRoomTypes([]);
    setRoomNewImages({});
    setPropertyImages([]);
    onClose();
  };

  const isValid = propertyData.name?.trim(); // Only name is mandatory

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600}>
            Edit Property: {property?.name}
          </Typography>
          {property?.approval && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getApprovalStatusIcon(property.approval.status)}
              <Chip 
                label={property.approval.status.replace('_', ' ').toUpperCase()}
                sx={{ 
                  backgroundColor: `${getApprovalStatusColor(property.approval.status)}15`,
                  color: getApprovalStatusColor(property.approval.status),
                  fontWeight: 600
                }}
              />
            </Box>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Approval Status Alert */}
        {property?.approval && (
          <Box sx={{ mb: 3 }}>
            {property.approval.status === 'requires_documents' && (
              <Alert severity="warning">
                <AlertTitle>Documents Required</AlertTitle>
                Please upload the required documents to proceed with approval.
              </Alert>
            )}
            {property.approval.status === 'rejected' && (
              <Alert severity="error">
                <AlertTitle>Property Rejected</AlertTitle>
                {property.approval.rejectionReason && (
                  <Typography variant="body2">
                    Reason: {property.approval.rejectionReason}
                  </Typography>
                )}
              </Alert>
            )}
            {property.approval.status === 'approved' && (
              <Alert severity="success">
                <AlertTitle>Property Approved</AlertTitle>
                Your property has been approved and is ready for listing.
              </Alert>
            )}
          </Box>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Basic Information" />
            <Tab label="Property Details" />
            <Tab label="Property Images" />
            <Tab label="Room Types" />
            <Tab label="Approval Documents" />
          </Tabs>
        </Box>

        {/* Tab 0: Basic Information */}
        {tabValue === 0 && (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Property Name"
                  value={propertyData.name || ''}
                  onChange={(e) =>
                    setPropertyData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  size="small"
                  sx={{ mb: 2 }}
                  disabled={isAnyOperationInProgress}
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
                  size="small"
                  sx={{ mb: 2 }}
                  disabled={isAnyOperationInProgress}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={propertyData.propertyType || ''}
                    onChange={(e) =>
                      setPropertyData((prev) => ({ ...prev, propertyType: e.target.value as any }))
                    }
                    label="Property Type"
                    disabled={isAnyOperationInProgress}
                  >
                    {propertyTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  value={propertyData.phone || ''}
                  onChange={(e) => setPropertyData((prev) => ({ ...prev, phone: e.target.value }))}
                  size="small"
                  disabled={isAnyOperationInProgress}
                 
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
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
                  size="small"
                  disabled={isAnyOperationInProgress}
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
                  size="small"
                  disabled={isAnyOperationInProgress}
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
                  size="small"
                  disabled={isAnyOperationInProgress}
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
                  size="small"
                  disabled={isAnyOperationInProgress}
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
                  size="small"
                  disabled={isAnyOperationInProgress}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value="Jamaica"
                  disabled={true} // Always disabled as only Jamaica is supported
                  helperText="Currently only Jamaica is supported"
                  size="small"
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        country: "Jamaica",
                      } as IAddress,
                    }))
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 1: Property Details */}
        {tabValue === 1 && (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
                  Property Specifications
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Max Guests"
                  type="number"
                  value={propertyData.maxGuests || ''}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      maxGuests: parseInt(e.target.value) || 0,
                    }))
                  }
                  inputProps={{ min: 1 }}
                  size="small"
                  disabled={isAnyOperationInProgress}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={propertyData.bedrooms || ''}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      bedrooms: parseInt(e.target.value) || 0,
                    }))
                  }
                  inputProps={{ min: 0 }}
                  size="small"
                  disabled={isAnyOperationInProgress}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={propertyData.bathrooms || ''}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      bathrooms: parseInt(e.target.value) || 0,
                    }))
                  }
                  inputProps={{ min: 0 }}
                  size="small"
                  disabled={isAnyOperationInProgress}
                />
              </Grid>


              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Square Footage"
                  type="number"
                  value={propertyData.squareFootage || ''}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      squareFootage: parseInt(e.target.value) || 0,
                    }))
                  }
                  inputProps={{ min: 0 }}
                  size="small"
                  disabled={isAnyOperationInProgress}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    value={propertyData.amenities || []}
                    onChange={handleAmenitiesChange}
                    input={<OutlinedInput label="Amenities" />}
                    disabled={isAnyOperationInProgress}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const amenity = amenitiesOptions.find(a => a.value === value);
                          return (
                            <Chip 
                              key={value} 
                              label={amenity?.label || value}
                              size="small"
                              icon={amenity?.icon}
                              sx={{ height: 24 }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {amenitiesOptions.map((amenity) => (
                      <MenuItem key={amenity.value} value={amenity.value}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {amenity.icon}
                        </ListItemIcon>
                        <ListItemText primary={amenity.label} />
                        {propertyData.amenities?.includes(amenity.value) && (
                          <CheckIcon sx={{ ml: 1, color: 'primary.main' }} />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 2: Property Images */}
        {tabValue === 2 && (
          <Box sx={{ pt: 1 }}>
            <Typography variant="h6" sx={{ mb: 3, color: Colors.blue }}>
              Property Gallery
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add general property images that showcase your property's exterior, common areas, and overall ambiance.
              These images will be displayed in the main property gallery.
            </Typography>
            
            <ImagePicker
              selectedImages={propertyImages}
              setSelectedImages={setPropertyImages}
            />
            
            {propertyImages.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {propertyImages.length} image{propertyImages.length > 1 ? 's' : ''} selected for upload.
                  These will be added to your property's main gallery.
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Tab 3: Room Types */}
        {tabValue === 3 && (
          <Box sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: Colors.blue }}>
                Room Types & Pricing
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addRoomType}
                sx={{ backgroundColor: Colors.blue }}
                disabled={isAnyOperationInProgress}
              >
                Add Room Type
              </Button>
            </Box>

            {roomTypes.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No room types configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add room types to define different accommodation options and pricing for your property.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addRoomType}
                    sx={{ backgroundColor: Colors.blue }}
                    disabled={isAnyOperationInProgress}
                  >
                    Add Your First Room Type
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {roomTypes.map((room, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 2
                        }}>
                          <Typography variant="h6" color={Colors.blue}>
                            Room Type {index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeRoomType(index)}
                            size="small"
                            disabled={isAnyOperationInProgress}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          {/* Basic Information */}
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Room Name"
                              value={room.name || ''}
                              onChange={(e) => updateRoomType(index, 'name', e.target.value)}
                              placeholder="e.g., Deluxe Suite, Standard Room"
                              size="small"
                              disabled={isAnyOperationInProgress}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Max Occupancy"
                              type="number"
                              value={room.maxOccupancy || ''}
                              onChange={(e) => updateRoomType(index, 'maxOccupancy', parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1 }}
                              size="small"
                              disabled={isAnyOperationInProgress}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Description"
                              multiline
                              minRows={2}
                              maxRows={6}
                              value={room.description || ''}
                              onChange={(e) => updateRoomType(index, 'description', e.target.value)}
                              placeholder="Describe the room features and layout"
                              size="small"
                              disabled={isAnyOperationInProgress}
                            />
                          </Grid>

                          {/* Pricing & Availability */}
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Price per Night ($)"
                              type="number"
                              value={room.pricePerNight || ''}
                              onChange={(e) => updateRoomType(index, 'pricePerNight', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                              size="small"
                              disabled={isAnyOperationInProgress}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Quantity Available"
                              type="number"
                              value={room.quantityAvailable || ''}
                              onChange={(e) => updateRoomType(index, 'quantityAvailable', parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1 }}
                              size="small"
                              disabled={isAnyOperationInProgress}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Listing Status</InputLabel>
                              <Select
                                value={room.listStatus || 'listed'}
                                onChange={(e) => updateRoomType(index, 'listStatus', e.target.value)}
                                label="Listing Status"
                                disabled={isAnyOperationInProgress}
                              >
                                <MenuItem value="listed">Listed</MenuItem>
                                <MenuItem value="unlisted">Unlisted</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Room Amenities */}
                          <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Room Amenities</InputLabel>
                              <Select
                                multiple
                                value={room.amenities || []}
                                onChange={(e) => handleRoomAmenitiesChange(index, e)}
                                input={<OutlinedInput label="Room Amenities" />}
                                disabled={isAnyOperationInProgress}
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => {
                                      const amenity = amenitiesOptions.find(a => a.value === value);
                                      return (
                                        <Chip 
                                          key={value} 
                                          label={amenity?.label || value}
                                          size="small"
                                          icon={amenity?.icon}
                                          sx={{ height: 24 }}
                                        />
                                      );
                                    })}
                                  </Box>
                                )}
                              >
                                {amenitiesOptions.map((amenity) => (
                                  <MenuItem key={amenity.value} value={amenity.value}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      {amenity.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={amenity.label} />
                                    {room.amenities?.includes(amenity.value) && (
                                      <CheckIcon sx={{ ml: 1, color: 'primary.main' }} />
                                    )}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Room Images Section */}
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, color: Colors.blue, fontWeight: 600 }}>
                              Room Images
                            </Typography>
                            
                            {/* Upload Button */}
                            <Box sx={{ mb: 2 }}>
                              <Button
                                component="label"
                                variant="outlined"
                                startIcon={<ImageIcon />}
                                size="small"
                                disabled={isAnyOperationInProgress}
                              >
                                Add Room Photos
                                <VisuallyHiddenInput
                                  type="file"
                                  multiple
                                  accept=".jpg,.jpeg,.png,.webp"
                                  onChange={(e) => handleRoomImageUpload(index, e)}
                                />
                              </Button>
                              <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                                JPG, PNG, WEBP
                              </Typography>
                            </Box>

                            {/* Existing Images */}
                            {room.images && room.images.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Current Images ({room.images.length})
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 1,
                                  justifyContent: 'flex-start'
                                }}>
                                  {room.images.map((image, imgIndex) => (
                                    <Box 
                                      key={imgIndex}
                                      sx={{ 
                                        width: { xs: 'calc(50% - 4px)', sm: 'calc(33.33% - 6px)', md: 'calc(25% - 6px)' },
                                        minWidth: 120,
                                        position: 'relative'
                                      }}
                                    >
                                      <Card variant="outlined" sx={{ position: 'relative' }}>
                                        <Box
                                          component="img"
                                          src={image}
                                          alt={`Room image ${imgIndex + 1}`}
                                          sx={{
                                            width: '100%',
                                            height: 100,
                                            objectFit: 'cover',
                                            display: 'block'
                                          }}
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={() => removeExistingRoomImage(index, imgIndex)}
                                          disabled={isAnyOperationInProgress}
                                          sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                            color: 'white',
                                            '&:hover': {
                                              backgroundColor: 'rgba(255, 0, 0, 0.9)',
                                            },
                                            width: 24,
                                            height: 24
                                          }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Card>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {/* New Images Preview */}
                            {roomNewImages[index] && roomNewImages[index].length > 0 && (
                              <Box>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  New Images to Upload ({roomNewImages[index].length})
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 1,
                                  justifyContent: 'flex-start'
                                }}>
                                  {roomNewImages[index].map((file, imgIndex) => (
                                    <Box 
                                      key={imgIndex}
                                      sx={{ 
                                        width: { xs: 'calc(50% - 4px)', sm: 'calc(33.33% - 6px)', md: 'calc(25% - 6px)' },
                                        minWidth: 120,
                                        position: 'relative'
                                      }}
                                    >
                                      <Card variant="outlined" sx={{ position: 'relative' }}>
                                        <Box
                                          component="img"
                                          src={URL.createObjectURL(file)}
                                          alt={`New room image ${imgIndex + 1}`}
                                          sx={{
                                            width: '100%',
                                            height: 100,
                                            objectFit: 'cover',
                                            display: 'block'
                                          }}
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={() => removeNewRoomImage(index, imgIndex)}
                                          disabled={isAnyOperationInProgress}
                                          sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                            color: 'white',
                                            '&:hover': {
                                              backgroundColor: 'rgba(255, 0, 0, 0.9)',
                                            },
                                            width: 24,
                                            height: 24
                                          }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                        <Box sx={{ p: 0.5, backgroundColor: 'rgba(0,0,0,0.05)' }}>
                                          <Typography variant="caption" noWrap sx={{ fontSize: '0.7rem' }}>
                                            {file.name}
                                          </Typography>
                                        </Box>
                                      </Card>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Tab 4: Approval Documents */}
        {tabValue === 4 && (
          <Box sx={{ pt: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: Colors.blue }}>
              Approval Documents
            </Typography>

            {/* Current Documents */}
            {property?.approval?.submittedDocuments && property.approval.submittedDocuments.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Current Documents
                </Typography>
                {Object.values(property.approval.submittedDocuments).map((doc: ApprovalDocument) => (
                  <Card key={doc.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Type: {documentTypeOptions.find(opt => opt.value === doc.type)?.label || doc.type}
                          </Typography>
                        </Box>
                        <Chip 
                          label={doc.status.toUpperCase()}
                          size="small"
                          color={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'warning'}
                        />
                      </Box>
                      {doc.rejectionReason && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {doc.rejectionReason}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Upload New Documents */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Upload Additional Documents
                </Typography>
                
                <Box sx={{ textAlign: 'center', py: 2, mb: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={isAnyOperationInProgress}
                  >
                    Choose Files
                    <VisuallyHiddenInput
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleDocumentUpload}
                    />
                  </Button>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX
                  </Typography>
                </Box>

                {newDocuments.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      New Documents to Upload ({newDocuments.length})
                    </Typography>
                    {newDocuments.map((file, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 1 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2" fontWeight={600}>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Document Type</InputLabel>
                                <Select
                                  value={documentTypes[index] || 'other'}
                                  onChange={(e) => updateDocumentType(index, e.target.value as ApprovalDocument['type'])}
                                  label="Document Type"
                                  disabled={isAnyOperationInProgress}
                                >
                                  {documentTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => removeDocument(index)}
                                disabled={isAnyOperationInProgress}
                              >
                                Remove
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleUploadDocuments}
                        disabled={isUploadingDocs || isAnyOperationInProgress}
                        startIcon={isUploadingDocs ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        sx={{ backgroundColor: Colors.blue }}
                      >
                        {isUploadingDocs ? 'Uploading...' : 'Upload Documents'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading || isUploadingRoomImages}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValid || isAnyOperationInProgress}
          startIcon={isAnyOperationInProgress ? <CircularProgress size={20} /> : null}
          sx={{ backgroundColor: Colors.blue }}
        >
          {isAnyOperationInProgress ? 
            (isUploadingPropertyImages ? 'Uploading Property Images...' : 
             isUploadingRoomImages ? 'Uploading Room Images...' : 
             'Updating Property...') : 
            'Update Property'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
