import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  ArrowBack,
  PhotoLibrary,
  AttachMoney,
  Upload,
  AddBusiness,
  Home as HomeIcon,
  Description,
  Image,
  Bed,
  Add,
  Delete,
  Hotel,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../constants';
import {
  useAddProperty,
  useAddPropertyImages,
  RoomType,
  Kottage,
  ApprovalDocument,
} from '../../../hooks/propertyHooks';
import { isSubdomain } from '../../../utils/subdomainRouter';

const steps = [
  'Basic Information',
  'Property Details',
  'Pricing & Rooms',
  'Images & Documents',
];

const amenitiesList = [
  'WiFi',
  'Pool',
  'Kitchen',
  'Parking',
  'Beach Access',
  'Hot Tub',
  'Air Conditioning',
  'Gym',
  'Garden',
  'Balcony',
  'Pet Friendly',
  'Washing Machine',
  'Dryer',
  'Fireplace',
  'BBQ Grill',
  'Security System',
];

const propertyTypes = [
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'resort', label: 'Resort' },
  { value: 'other', label: 'Other' },
];

const documentTypes = [
  {
    id: 'title_deed',
    label: 'Title Deed',
    description: 'Legal proof of property ownership',
    required: true,
  },
  {
    id: 'utility_bill',
    label: 'Recent Utility Bill',
    description: "With property address and host's name",
    required: true,
  },
  {
    id: 'property_tax',
    label: 'Property Tax Receipt',
    description: 'Current year tax payment proof',
    required: true,
  },
  {
    id: 'lease_agreement',
    label: 'Lease Agreement',
    description: 'If subletting is allowed',
    required: false,
  },
  {
    id: 'authorization_letter',
    label: 'Notarized Letter of Authorization',
    description: 'If property is managed by someone else',
    required: false,
  },
  {
    id: 'other',
    label: 'Other Documents',
    description: 'Additional supporting documents',
    required: false,
  },
];

export default function AddProperty() {
  const navigate = useNavigate();
  const addPropertyMutation = useAddProperty();
  const addPropertyImagesMutation = useAddPropertyImages();

  const [activeStep, setActiveStep] = React.useState(0);
  const [propertyData, setPropertyData] = React.useState<Partial<Kottage>>({
    name: '',
    description: '',
    phone: '',
    address: {
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: 'Jamaica',
    },
    propertyType: 'villa',
    amenities: [],
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    isListed: false,
    rating: 0,
    roomTypes: [],
    images: [],
  });

  const [images, setImages] = React.useState<File[]>([]);
  const [documents, setDocuments] = React.useState<
    { file: File; type: string }[]
  >([]);
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  const [roomImages, setRoomImages] = React.useState<{
    [roomId: string]: File[];
  }>({});
  const [selectedDocumentTypes, setSelectedDocumentTypes] = React.useState<
    string[]
  >([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({
    property: false,
    images: false,
    roomImages: false,
    documents: false,
  });

  const handleBack = () => {
    // Use the existing subdomain detection utility
    if (isSubdomain('host')) {
      navigate('/dashboard/properties');
    } else {
      navigate('/MyAccount/Dashboard/properties');
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPropertyData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setPropertyData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAmenitiesChange = (event: any) => {
    const value = event.target.value;
    setPropertyData(prev => ({
      ...prev,
      amenities: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const handleDocumentUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType?: string
  ) => {
    const files = Array.from(event.target.files || []);

    if (documentType) {
      // If specific document type is provided, associate all files with that type
      const newDocuments = files.map(file => ({ file, type: documentType }));
      setDocuments(prev => [...prev, ...newDocuments]);
    } else {
      // For general upload, let user select types later or use the first selected type
      const defaultType = selectedDocumentTypes[0] || 'other';
      const newDocuments = files.map(file => ({ file, type: defaultType }));
      setDocuments(prev => [...prev, ...newDocuments]);
    }
  };

  const updateDocumentType = (documentIndex: number, newType: string) => {
    setDocuments(prev =>
      prev.map((doc, index) =>
        index === documentIndex ? { ...doc, type: newType } : doc
      )
    );
  };

  const removeDocument = (documentIndex: number) => {
    setDocuments(prev => prev.filter((_, index) => index !== documentIndex));
  };

  const handleDocumentTypeToggle = (documentTypeId: string) => {
    setSelectedDocumentTypes(prev =>
      prev.includes(documentTypeId)
        ? prev.filter(id => id !== documentTypeId)
        : [...prev, documentTypeId]
    );
  };

  const addRoom = () => {
    const newRoom: RoomType = {
      id: Date.now().toString(),
      name: '',
      description: '',
      maxOccupancy: 2,
      pricePerNight: 100,
      quantityAvailable: 1,
      amenities: [],
      images: [],
      listStatus: 'listed',
    };
    setRooms(prev => [...prev, newRoom]);
    setRoomImages(prev => ({ ...prev, [newRoom.id]: [] }));
  };

  const updateRoom = (roomId: string, field: keyof RoomType, value: any) => {
    setRooms(prev =>
      prev.map(room =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    setRoomImages(prev => {
      const { [roomId]: deleted, ...rest } = prev;
      return rest;
    });
  };

  const handleRoomAmenitiesChange = (roomId: string, amenities: string[]) => {
    updateRoom(roomId, 'amenities', amenities);
  };

  const handleRoomImageUpload = (
    roomId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    setRoomImages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), ...files],
    }));
  };

  const removeRoomImage = (roomId: string, imageIndex: number) => {
    setRoomImages(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.filter((_, index) => index !== imageIndex) || [],
    }));
  };

  // Validation functions for each step
  const validateStep0 = (): boolean => {
    return !!(
      propertyData.name?.trim() &&
      propertyData.description?.trim() &&
      propertyData.phone?.trim() &&
      propertyData.propertyType
    );
  };

  const validateStep1 = (): boolean => {
    return !!(
      propertyData.address?.address1?.trim() &&
      propertyData.address?.city?.trim() &&
      propertyData.address?.state?.trim() &&
      propertyData.maxGuests &&
      propertyData.bedrooms &&
      propertyData.bathrooms
    );
  };

  const validateStep2 = (): boolean => {
    // Check if at least one room is added with valid pricing
    const hasValidRooms =
      rooms.length > 0 &&
      rooms.every(
        room =>
          room.name?.trim() &&
          room.description?.trim() &&
          room.maxOccupancy > 0 &&
          room.pricePerNight > 0 &&
          room.quantityAvailable > 0
      );
    return hasValidRooms;
  };

  const validateStep3 = (): boolean => {
    const hasImages = images.length > 0;
    // Check that required document types are covered
    const requiredTypes = documentTypes
      .filter(doc => doc.required)
      .map(doc => doc.id);
    const uploadedTypes = documents.map(doc => doc.type);
    const hasAllRequiredDocs = requiredTypes.every(type =>
      uploadedTypes.includes(type)
    );
    const hasDocuments = documents.length > 0;
    return hasImages && hasDocuments && hasAllRequiredDocs;
  };

  const validateCurrentStep = (): boolean => {
    switch (activeStep) {
      case 0:
        return validateStep0();
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return true;
    }
  };

  const getStepErrors = (): string[] => {
    const errors: string[] = [];

    switch (activeStep) {
      case 0:
        if (!propertyData.name?.trim())
          errors.push('Property name is required');
        if (!propertyData.description?.trim())
          errors.push('Property description is required');
        if (!propertyData.phone?.trim())
          errors.push('Phone number is required');
        if (!propertyData.propertyType)
          errors.push('Property type is required');
        break;
      case 1:
        if (!propertyData.address?.address1?.trim())
          errors.push('Street address is required');
        if (!propertyData.address?.city?.trim())
          errors.push('City is required');
        if (!propertyData.address?.state?.trim())
          errors.push('Parish/State is required');
        if (!propertyData.maxGuests || propertyData.maxGuests < 1)
          errors.push('Max guests must be at least 1');
        if (!propertyData.bedrooms || propertyData.bedrooms < 1)
          errors.push('Bedrooms must be at least 1');
        if (!propertyData.bathrooms || propertyData.bathrooms < 0.5)
          errors.push('Bathrooms must be at least 0.5');
        break;
      case 2:
        if (rooms.length === 0) {
          errors.push('At least one room must be added');
        } else {
          rooms.forEach((room, index) => {
            if (!room.name?.trim())
              errors.push(`Room ${index + 1}: Name is required`);
            if (!room.description?.trim())
              errors.push(`Room ${index + 1}: Description is required`);
            if (!room.maxOccupancy || room.maxOccupancy < 1)
              errors.push(
                `Room ${index + 1}: Max occupancy must be at least 1`
              );
            if (!room.pricePerNight || room.pricePerNight <= 0)
              errors.push(`Room ${index + 1}: Price must be greater than 0`);
            if (!room.quantityAvailable || room.quantityAvailable < 1)
              errors.push(`Room ${index + 1}: Quantity must be at least 1`);
          });
        }
        break;
      case 3:
        if (images.length === 0)
          errors.push('At least one property image is required');
        if (documents.length === 0)
          errors.push('At least one document must be uploaded');

        // Check for required document types
        const requiredTypes = documentTypes
          .filter(doc => doc.required)
          .map(doc => doc.id);
        const uploadedTypes = documents.map(doc => doc.type);
        const missingRequiredTypes = requiredTypes.filter(
          type => !uploadedTypes.includes(type)
        );

        missingRequiredTypes.forEach(type => {
          const docType = documentTypes.find(doc => doc.id === type);
          if (docType) {
            errors.push(`Required document missing: ${docType.label}`);
          }
        });
        break;
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (
      !validateStep0() ||
      !validateStep1() ||
      !validateStep2() ||
      !validateStep3()
    ) {
      console.error('Please fill out all required fields before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload room images and get their URLs
      setUploadProgress(prev => ({ ...prev, roomImages: true }));
      const roomsWithImages = await Promise.all(
        rooms.map(async room => {
          const roomImageFiles = roomImages[room.id] || [];
          if (roomImageFiles.length === 0) {
            return room;
          }

          // Upload each room image and get download URLs
          const {
            getStorage,
            ref: storageRef,
            uploadBytesResumable,
            getDownloadURL,
          } = await import('firebase/storage');
          const roomImageUrls = await Promise.all(
            roomImageFiles.map(async imageFile => {
              const fileRef = storageRef(
                getStorage(),
                `roomImages/${room.id}/${imageFile.name}`
              );
              const snapshot = await uploadBytesResumable(fileRef, imageFile);
              return await getDownloadURL(snapshot.ref);
            })
          );

          return {
            ...room,
            images: roomImageUrls,
          };
        })
      );
      setUploadProgress(prev => ({ ...prev, roomImages: false }));

      // Step 2: Create the property
      setUploadProgress(prev => ({ ...prev, property: true }));
      const propertyWithRooms = {
        ...propertyData,
        roomTypes: roomsWithImages,
      };

      const propertyId = await addPropertyMutation.mutateAsync({
        property: propertyWithRooms as Omit<
          Kottage,
          'id' | 'createdAt' | 'approval'
        >,
        approvalDocuments: documents.map(doc => doc.file),
      });
      setUploadProgress(prev => ({ ...prev, property: false }));

      // Step 3: Upload main property images
      if (images.length > 0) {
        setUploadProgress(prev => ({ ...prev, images: true }));
        await addPropertyImagesMutation.mutateAsync({
          images: images,
          propertyId: propertyId,
        });
        setUploadProgress(prev => ({ ...prev, images: false }));
      }

      // Step 4: Upload and categorize documents
      if (documents.length > 0) {
        setUploadProgress(prev => ({ ...prev, documents: true }));
        const {
          getStorage,
          ref: storageRef,
          uploadBytesResumable,
          getDownloadURL,
        } = await import('firebase/storage');
        const { ref: dbRef, update } = await import('firebase/database');
        const { database } = await import('../../../firebase');

        const approvalDocuments = await Promise.all(
          documents.map(async ({ file, type }, index) => {
            const fileRef = storageRef(
              getStorage(),
              `approvalDocuments/${propertyId}/${file.name}`
            );
            const snapshot = await uploadBytesResumable(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Create ApprovalDocument object
            const approvalDocument = {
              id: `doc_${index}_${Date.now()}`,
              name: file.name,
              type: type,
              url: downloadURL,
              uploadedAt: new Date().toISOString(),
              status: 'pending' as const,
            };

            return approvalDocument;
          })
        );

        // Save all documents as an array to the approval.submittedDocuments path
        const documentsObject = approvalDocuments.reduce((acc, doc) => {
          acc[doc.id] = doc;
          return acc;
        }, {} as Record<string, any>);

        await update(dbRef(database, `properties/${propertyId}/approval`), {
          submittedDocuments: documentsObject,
        });

        setUploadProgress(prev => ({ ...prev, documents: false }));
      }

      // Navigate back to properties list
      if (isSubdomain('host')) {
        navigate('/dashboard/properties');
      } else {
        navigate('/MyAccount/Dashboard/properties');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      setUploadProgress({
        property: false,
        images: false,
        roomImages: false,
        documents: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color={Colors.blue}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <HomeIcon />
              Basic Property Information
            </Typography>

            <Box
              sx={{
                p: 3,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                mb: 3,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Name"
                    value={propertyData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={propertyData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={propertyData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={propertyData.propertyType}
                      onChange={e =>
                        handleInputChange('propertyType', e.target.value)
                      }
                      label="Property Type"
                    >
                      {propertyTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color={Colors.blue}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <HomeIcon />
              Property Details & Location
            </Typography>

            {/* Address Information */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 2 }}
              >
                Address Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={propertyData.address?.address1}
                    onChange={e =>
                      handleInputChange('address.address1', e.target.value)
                    }
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={propertyData.address?.city}
                    onChange={e =>
                      handleInputChange('address.city', e.target.value)
                    }
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Parish/State"
                    value={propertyData.address?.state}
                    onChange={e =>
                      handleInputChange('address.state', e.target.value)
                    }
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={propertyData.address?.zip}
                    onChange={e =>
                      handleInputChange('address.zip', e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={propertyData.address?.country}
                    onChange={e =>
                      handleInputChange('address.country', e.target.value)
                    }
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Property Features */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#fff3cd',
                borderRadius: 2,
                border: '1px solid #ffeaa7',
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 2 }}
              >
                Property Features
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Guests"
                    value={propertyData.maxGuests}
                    onChange={e =>
                      handleInputChange('maxGuests', parseInt(e.target.value))
                    }
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bedrooms"
                    value={propertyData.bedrooms}
                    onChange={e =>
                      handleInputChange('bedrooms', parseInt(e.target.value))
                    }
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bathrooms"
                    value={propertyData.bathrooms}
                    onChange={e =>
                      handleInputChange('bathrooms', parseFloat(e.target.value))
                    }
                    inputProps={{ min: 0.5, step: 0.5 }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color={Colors.blue}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <Hotel />
              Rooms & Pricing
            </Typography>

            {/* Base Property Pricing */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                  <AttachMoney sx={{ color: Colors.blue }} />
                  <Typography variant="h6" fontWeight={600}>
                    Base Property Information
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={propertyData.isListed}
                          onChange={e =>
                            handleInputChange('isListed', e.target.checked)
                          }
                        />
                      }
                      label="List property publicly"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Property Amenities</InputLabel>
                      <Select
                        multiple
                        value={propertyData.amenities || []}
                        onChange={handleAmenitiesChange}
                        input={<OutlinedInput label="Property Amenities" />}
                        renderValue={selected => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map(value => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {amenitiesList.map(amenity => (
                          <MenuItem key={amenity} value={amenity}>
                            {amenity}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Room Management */}
            <Card elevation={2}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Bed sx={{ color: Colors.raspberry }} />
                    <Typography variant="h6" fontWeight={600}>
                      Room Types
                    </Typography>
                    <Chip label={rooms.length} color="secondary" size="small" />
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={addRoom}
                    sx={{
                      backgroundColor: Colors.blue,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Add Room
                  </Button>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Define different room types with individual pricing and
                  amenities. This allows guests to choose specific rooms when
                  booking.
                </Typography>

                {rooms.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      border: '2px dashed #e0e0e0',
                    }}
                  >
                    <Hotel
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Rooms Added Yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Start by adding your first room type. You can specify
                      different pricing and amenities for each room.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addRoom}
                      sx={{
                        backgroundColor: Colors.blue,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Add Your First Room
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {rooms.map((room, index) => (
                      <Grid item xs={12} key={room.id}>
                        <Card
                          variant="outlined"
                          sx={{ backgroundColor: '#fafafa' }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ mb: 2 }}
                            >
                              <Typography variant="subtitle1" fontWeight={600}>
                                Room {index + 1}
                              </Typography>
                              <Button
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => deleteRoom(room.id)}
                                size="small"
                                sx={{ textTransform: 'none' }}
                              >
                                Remove
                              </Button>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Room Name"
                                  value={room.name}
                                  onChange={e =>
                                    updateRoom(room.id, 'name', e.target.value)
                                  }
                                  size="small"
                                  placeholder="e.g., Ocean View Suite"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Room Description"
                                  value={room.description}
                                  onChange={e =>
                                    updateRoom(
                                      room.id,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                  multiline
                                  rows={2}
                                  placeholder="Describe the room features, view, and special amenities..."
                                />
                              </Grid>

                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Max Occupancy"
                                  value={room.maxOccupancy}
                                  onChange={e =>
                                    updateRoom(
                                      room.id,
                                      'maxOccupancy',
                                      parseInt(e.target.value)
                                    )
                                  }
                                  inputProps={{ min: 1 }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Quantity Available"
                                  value={room.quantityAvailable}
                                  onChange={e =>
                                    updateRoom(
                                      room.id,
                                      'quantityAvailable',
                                      parseInt(e.target.value)
                                    )
                                  }
                                  inputProps={{ min: 1 }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Price per Night (JMD)"
                                  value={room.pricePerNight}
                                  onChange={e =>
                                    updateRoom(
                                      room.id,
                                      'pricePerNight',
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  inputProps={{ min: 0 }}
                                  size="small"
                                  InputProps={{
                                    startAdornment: <AttachMoney />,
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Listing Status</InputLabel>
                                  <Select
                                    value={room.listStatus}
                                    onChange={e =>
                                      updateRoom(
                                        room.id,
                                        'listStatus',
                                        e.target.value as 'listed' | 'unlisted'
                                      )
                                    }
                                    label="Listing Status"
                                  >
                                    <MenuItem value="listed">Listed</MenuItem>
                                    <MenuItem value="unlisted">
                                      Unlisted
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Room Amenities</InputLabel>
                                  <Select
                                    multiple
                                    value={room.amenities}
                                    onChange={e =>
                                      handleRoomAmenitiesChange(
                                        room.id,
                                        e.target.value as string[]
                                      )
                                    }
                                    input={
                                      <OutlinedInput label="Room Amenities" />
                                    }
                                    renderValue={selected => (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: 0.5,
                                        }}
                                      >
                                        {selected.map(value => (
                                          <Chip
                                            key={value}
                                            label={value}
                                            size="small"
                                          />
                                        ))}
                                      </Box>
                                    )}
                                  >
                                    {amenitiesList.map(amenity => (
                                      <MenuItem key={amenity} value={amenity}>
                                        {amenity}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>

                              {/* Room Images Section */}
                              <Grid item xs={12}>
                                <Box
                                  sx={{
                                    p: 2,
                                    backgroundColor: '#f0f8ff',
                                    borderRadius: 2,
                                    border: '1px solid #e3f2fd',
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mb: 2 }}
                                  >
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <Image
                                        sx={{
                                          color: Colors.blue,
                                          fontSize: 20,
                                        }}
                                      />
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                      >
                                        Room Images
                                      </Typography>
                                      <Chip
                                        label={roomImages[room.id]?.length || 0}
                                        size="small"
                                        color="primary"
                                      />
                                    </Box>
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      startIcon={<PhotoLibrary />}
                                      size="small"
                                      sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                      }}
                                    >
                                      Add Images
                                      <input
                                        hidden
                                        accept="image/*"
                                        multiple
                                        type="file"
                                        onChange={e =>
                                          handleRoomImageUpload(room.id, e)
                                        }
                                      />
                                    </Button>
                                  </Box>

                                  {roomImages[room.id] &&
                                  roomImages[room.id].length > 0 ? (
                                    <Grid container spacing={1}>
                                      {roomImages[room.id].map(
                                        (image, imageIndex) => (
                                          <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={imageIndex}
                                          >
                                            <Box
                                              sx={{
                                                position: 'relative',
                                                backgroundColor: 'white',
                                                borderRadius: 1,
                                                border: '1px solid #e0e0e0',
                                                p: 1,
                                              }}
                                            >
                                              <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                              >
                                                <Image
                                                  sx={{
                                                    fontSize: 16,
                                                    color: Colors.blue,
                                                  }}
                                                />
                                                <Box
                                                  sx={{
                                                    flexGrow: 1,
                                                    minWidth: 0,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="caption"
                                                    fontWeight={500}
                                                    sx={{
                                                      display: 'block',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap',
                                                    }}
                                                  >
                                                    {image.name}
                                                  </Typography>
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                  >
                                                    {(
                                                      image.size /
                                                      1024 /
                                                      1024
                                                    ).toFixed(2)}{' '}
                                                    MB
                                                  </Typography>
                                                </Box>
                                                <Button
                                                  size="small"
                                                  color="error"
                                                  onClick={() =>
                                                    removeRoomImage(
                                                      room.id,
                                                      imageIndex
                                                    )
                                                  }
                                                  sx={{
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                    '& .MuiButton-startIcon': {
                                                      m: 0,
                                                    },
                                                  }}
                                                >
                                                  <Delete
                                                    sx={{ fontSize: 16 }}
                                                  />
                                                </Button>
                                              </Box>
                                            </Box>
                                          </Grid>
                                        )
                                      )}
                                    </Grid>
                                  ) : (
                                    <Box
                                      sx={{
                                        textAlign: 'center',
                                        py: 2,
                                        color: 'text.secondary',
                                      }}
                                    >
                                      <Image
                                        sx={{
                                          fontSize: 32,
                                          mb: 1,
                                          opacity: 0.5,
                                        }}
                                      />
                                      <Typography
                                        variant="caption"
                                        display="block"
                                      >
                                        No images added yet
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        display="block"
                                      >
                                        Add images to showcase this room type
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              color={Colors.blue}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <PhotoLibrary />
              Images & Documents
            </Typography>

            <Grid container spacing={3}>
              {/* Property Images Card */}
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 2 }}
                    >
                      <Image sx={{ color: Colors.blue }} />
                      <Typography variant="h6" fontWeight={600}>
                        Property Images
                      </Typography>
                      <Chip
                        label={images.length}
                        color="primary"
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Upload high-quality images of your property. The first
                      image will be used as the main photo.
                    </Typography>

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoLibrary />}
                      fullWidth
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                      }}
                    >
                      Upload Images
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                    </Button>

                    {images.length > 0 && (
                      <List dense>
                        {images.slice(0, 3).map((image, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon>
                              <Image
                                sx={{ fontSize: 20, color: Colors.blue }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight={500}>
                                  {image.name}
                                </Typography>
                              }
                              secondary={`${(image.size / 1024 / 1024).toFixed(
                                2
                              )} MB`}
                            />
                          </ListItem>
                        ))}
                        {images.length > 3 && (
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontStyle="italic"
                                >
                                  +{images.length - 3} more images...
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Approval Documents Card */}
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 2 }}
                    >
                      <Description sx={{ color: Colors.raspberry }} />
                      <Typography variant="h6" fontWeight={600}>
                        Documents
                      </Typography>
                      <Chip
                        label={selectedDocumentTypes.length}
                        color="secondary"
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Select the document types you will provide and upload the
                      relevant files.
                    </Typography>

                    {/* Document Type Selection & Upload */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        Required Documents
                      </Typography>
                      {documentTypes
                        .filter(doc => doc.required)
                        .map(docType => {
                          const hasThisType = documents.some(
                            doc => doc.type === docType.id
                          );
                          return (
                            <Box
                              key={docType.id}
                              sx={{
                                mb: 2,
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{ mb: 1 }}
                              >
                                <Typography variant="body2" fontWeight={500}>
                                  {docType.label}
                                </Typography>
                                {hasThisType && (
                                  <CheckCircle
                                    sx={{ fontSize: 16, color: 'success.main' }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 2 }}
                              >
                                {docType.description}
                              </Typography>
                              <Button
                                variant="outlined"
                                component="label"
                                startIcon={<Upload />}
                                size="small"
                                sx={{
                                  textTransform: 'none',
                                  borderRadius: 2,
                                }}
                              >
                                {hasThisType
                                  ? 'Add More Files'
                                  : 'Upload Files'}
                                <input
                                  hidden
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  multiple
                                  type="file"
                                  onChange={e =>
                                    handleDocumentUpload(e, docType.id)
                                  }
                                />
                              </Button>
                            </Box>
                          );
                        })}

                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                        sx={{ mt: 3 }}
                      >
                        Optional Documents
                      </Typography>
                      {documentTypes
                        .filter(doc => !doc.required)
                        .map(docType => {
                          const hasThisType = documents.some(
                            doc => doc.type === docType.id
                          );
                          return (
                            <Box
                              key={docType.id}
                              sx={{
                                mb: 2,
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                backgroundColor: '#f8f9fa',
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{ mb: 1 }}
                              >
                                <Typography variant="body2" fontWeight={500}>
                                  {docType.label}
                                </Typography>
                                {hasThisType && (
                                  <CheckCircle
                                    sx={{ fontSize: 16, color: 'success.main' }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 2 }}
                              >
                                {docType.description}
                              </Typography>
                              <Button
                                variant="outlined"
                                component="label"
                                startIcon={<Upload />}
                                size="small"
                                sx={{
                                  textTransform: 'none',
                                  borderRadius: 2,
                                }}
                              >
                                {hasThisType
                                  ? 'Add More Files'
                                  : 'Upload Files'}
                                <input
                                  hidden
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  multiple
                                  type="file"
                                  onChange={e =>
                                    handleDocumentUpload(e, docType.id)
                                  }
                                />
                              </Button>
                            </Box>
                          );
                        })}
                    </Box>

                    {documents.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          gutterBottom
                        >
                          Uploaded Documents ({documents.length})
                        </Typography>
                        <List dense>
                          {documents.map((document, index) => {
                            const docType = documentTypes.find(
                              dt => dt.id === document.type
                            );
                            return (
                              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                <ListItemIcon>
                                  <Description
                                    sx={{
                                      fontSize: 20,
                                      color: Colors.raspberry,
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <Typography
                                        variant="body2"
                                        fontWeight={500}
                                      >
                                        {document.file.name}
                                      </Typography>
                                      <Chip
                                        label={docType?.label || document.type}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </Box>
                                  }
                                  secondary={`${(
                                    document.file.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)} MB • ${document.file.type}`}
                                />
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => removeDocument(index)}
                                  sx={{ minWidth: 'auto', p: 0.5 }}
                                >
                                  <Delete sx={{ fontSize: 16 }} />
                                </Button>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: '#d4edda',
                  borderRadius: 2,
                  border: '1px solid #c3e6cb',
                  mt: 2,
                }}
              >
                <Typography variant="caption" color="#155724">
                  <strong>Note:</strong> All property information will be
                  reviewed before listing. High-quality images and complete
                  documentation help speed up the approval process.
                </Typography>
              </Box>
            </Grid>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', pt: 3, pb: 3 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          gutterBottom
          color={Colors.blue}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AddBusiness />
          Add New Kottage
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create a new property listing for your accommodation
        </Typography>

        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Back to Properties
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 3 }}>
          {/* Progress Stepper */}
          <Box
            sx={{
              p: 3,
              backgroundColor: '#f8f9fa',
              borderRadius: '12px 12px 0 0',
              border: '1px solid #e0e0e0',
              borderBottom: 'none',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color={Colors.blue}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <HomeIcon />
              Property Creation Progress
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 3 }}>
            {renderStepContent(activeStep)}

            {/* Upload Progress Indicator */}
            {isSubmitting && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Creating your property listing...
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {uploadProgress.roomImages && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 1 }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="caption">
                        Uploading room images...
                      </Typography>
                    </Box>
                  )}
                  {uploadProgress.property && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 1 }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="caption">
                        Creating property record...
                      </Typography>
                    </Box>
                  )}
                  {uploadProgress.images && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 1 }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="caption">
                        Uploading property images...
                      </Typography>
                    </Box>
                  )}
                  {uploadProgress.documents && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 1 }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="caption">
                        Uploading approval documents...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Alert>
            )}

            {/* Validation Errors */}
            {!validateCurrentStep() && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Please complete the following required fields:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {getStepErrors().map((error, index) => (
                    <Typography key={index} component="li" variant="body2">
                      {error}
                    </Typography>
                  ))}
                </Box>
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={handlePrevious}
                disabled={activeStep === 0}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Previous
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      addPropertyMutation.isPending ||
                      addPropertyImagesMutation.isPending ||
                      !validateStep0() ||
                      !validateStep1() ||
                      !validateStep2() ||
                      !validateStep3()
                    }
                    sx={{
                      backgroundColor: Colors.blue,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        {uploadProgress.roomImages &&
                          'Uploading Room Images...'}
                        {uploadProgress.property && 'Creating Property...'}
                        {uploadProgress.images &&
                          'Uploading Property Images...'}
                        {uploadProgress.documents && 'Uploading Documents...'}
                        {!Object.values(uploadProgress).some(Boolean) &&
                          'Processing...'}
                      </>
                    ) : (
                      'Create Property'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!validateCurrentStep()}
                    sx={{
                      backgroundColor: Colors.blue,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Error Display */}
        {(addPropertyMutation.isError || addPropertyImagesMutation.isError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {addPropertyMutation.isError && 'Error creating property. '}
            {addPropertyImagesMutation.isError && 'Error uploading images. '}
            Please try again.
          </Alert>
        )}
      </Container>
    </Box>
  );
}
