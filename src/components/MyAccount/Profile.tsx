import {
  Label,
  PrimaryButton,
  Stack,
  Text,
  TextField as FluentTextField,
  Modal,
} from '@fluentui/react';
import {
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  TextField,
  Avatar,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import React, { useState } from 'react';
import { Colors } from '../constants';
import Address from './Address';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { FaCcMastercard } from 'react-icons/fa';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import { useAuth, useUpdateProfile } from '../../hooks';
import { IAddress, IUser } from '../../../public/QuickType';
import { EmailUpdateDialog } from './EmailUpdateDialog';
import { PasswordUpdateDialog } from './PasswordUpdateDialog';
import { PhoneUpdateDialog } from './PhoneUpdateDialog';
import PageHeader from '../common/PageHeader';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

export default function Profile() {
  const { appUser, firebaseUser } = useAuth();
  const { mutateAsync: AsyncUpdateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [phoneDialog, setPhoneDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState<IUser>({
    firstName: appUser?.firstName || '',
    lastName: appUser?.lastName || '',
    email: firebaseUser?.email || '',
    uid: firebaseUser?.uid || '',
    phoneNumber: firebaseUser?.phoneNumber || '',
    dob: appUser?.dob || '',
    bio: appUser?.bio || '',
    occupation: appUser?.occupation || '',
    company: appUser?.company || '',
    address: appUser?.address || {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });
  console.log(appUser);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null); // Reset selected image
    setFormData({
      firstName: appUser?.firstName || '',
      lastName: appUser?.lastName || '',
      email: firebaseUser?.email || '',
      uid: firebaseUser?.uid || '',
      phoneNumber: firebaseUser?.phoneNumber || '',
      dob: appUser?.dob || '',
      bio: appUser?.bio || '',
      occupation: appUser?.occupation || '',
      company: appUser?.company || '',
      address: {
        address1: appUser?.address?.address1 || '',
        address2: appUser?.address?.address2 || '',
        city: appUser?.address?.city || '',
        state: appUser?.address?.state || '',
        postalCode: appUser?.address?.postalCode || '',
        country: appUser?.address?.country || '',
      },
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!firebaseUser) throw new Error('No authenticated user found');

    const storage = getStorage();
    const imageRef = storageRef(
      storage,
      `profileImages/${firebaseUser.uid}/${file.name}`
    );

    setIsUploadingImage(true);
    try {
      const snapshot = await uploadBytesResumable(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    try {
      // Get only changed values
      const originalData = {
        firstName: appUser?.firstName || '',
        lastName: appUser?.lastName || '',
        dob: appUser?.dob || '',
        bio: appUser?.bio || '',
        occupation: appUser?.occupation || '',
        company: appUser?.company || '',
        address: {
          address1: appUser?.address?.address1 || '',
          address2: appUser?.address?.address2 || '',
          city: appUser?.address?.city || '',
          state: appUser?.address?.state || '',
          zip: appUser?.address?.zip || '',
          country: appUser?.address?.country || '',
          postalCode: appUser?.address?.postalCode || '',
        },
      };

      const changedData: any = {};

      // Compare and collect only changed fields
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          const addressChanges: any = {};
          if (formData.address) {
            Object.keys(formData.address).forEach(addressKey => {
              if (
                formData.address?.[addressKey as keyof IAddress] !==
                originalData.address[addressKey as keyof IAddress]
              ) {
                addressChanges[addressKey] =
                  formData?.address?.[addressKey as keyof IAddress];
              }
            });
          }
          if (Object.keys(addressChanges).length > 0) {
            changedData.address = addressChanges;
          }
        } else if (
          formData[key as keyof typeof formData] !==
          originalData[key as keyof typeof originalData]
        ) {
          changedData[key] = formData[key as keyof typeof formData];
        }
      });

      // Only send request if there are changes or if there's a new image
      if (Object.keys(changedData).length > 0 || selectedImage) {
        if (!firebaseUser) throw new Error('No authenticated user found');

        // Prepare auth profile data (displayName, photoURL, etc.)
        const authProfileData: any = {};
        if (changedData.firstName || changedData.lastName) {
          authProfileData.displayName =
            `${formData.firstName} ${formData.lastName}`.trim();
        }

        // Handle image upload if a new image is selected
        if (selectedImage) {
          const photoURL = await handleImageUpload(selectedImage);
          authProfileData.photoURL = photoURL;
          changedData.photoURL = photoURL; // Also update in database
        }

        await AsyncUpdateProfile({
          user: firebaseUser,
          profile: authProfileData,
          userData: changedData, // Pass the changed data to update in Realtime Database
        });
        console.log('Updated auth profile:', authProfileData);
        console.log('Updated database with changed data:', changedData);

        // Clear selected image after successful update
        setSelectedImage(null);
      } else {
        console.log('No changes detected');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          address1: prev.address?.address1 || '',
          address2: prev.address?.address2 || '',
          city: prev.address?.city || '',
          state: prev.address?.state || '',
          zip: prev.address?.zip || '',
          postalCode: prev.address?.postalCode || '',
          country: prev.address?.country || '',
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader
        title="My Account"
        subtitle="Manage your personal information and settings"
        icon={<AccountBoxIcon sx={{ color: Colors.blue, fontSize: 32 }} />}
      />

      <Box sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper elevation={1} sx={{ width: '100%' }}>
              {/* Personal Information Section */}
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <PersonIcon sx={{ color: Colors.blue, fontSize: 24 }} />
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color={Colors.blue}
                    >
                      Personal Information
                    </Typography>
                  </Box>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{ color: Colors.blue, borderColor: Colors.blue }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isPending || isUploadingImage}
                        sx={{ backgroundColor: Colors.blue }}
                      >
                        {isPending
                          ? 'Saving...'
                          : isUploadingImage
                          ? 'Uploading...'
                          : 'Save'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Profile Picture Section */}
                <Box
                  sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <Avatar
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : firebaseUser?.photoURL || ''
                    }
                    sx={{
                      width: 100,
                      height: 100,
                      border: `3px solid ${Colors.blue}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    {!firebaseUser?.photoURL && !selectedImage && (
                      <PersonIcon
                        sx={{ fontSize: 50, color: 'text.secondary' }}
                      />
                    )}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 1 }}
                    >
                      Profile Picture
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {selectedImage
                        ? 'New image selected'
                        : 'Upload a profile picture to personalize your account'}
                    </Typography>
                    {isEditing && (
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<PhotoCameraIcon />}
                          size="small"
                          sx={{ color: Colors.blue, borderColor: Colors.blue }}
                          disabled={isUploadingImage}
                        >
                          {selectedImage ? 'Change Photo' : 'Upload Photo'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageSelection}
                          />
                        </Button>
                        {selectedImage && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => setSelectedImage(null)}
                            color="error"
                          >
                            Remove
                          </Button>
                        )}
                        {isUploadingImage && (
                          <Typography variant="caption" color="text.secondary">
                            Uploading...
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="First Name"
                      value={
                        isEditing
                          ? formData.firstName
                          : appUser?.firstName || ''
                      }
                      onChange={e =>
                        handleInputChange('firstName', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Last Name"
                      value={
                        isEditing ? formData.lastName : appUser?.lastName || ''
                      }
                      onChange={e =>
                        handleInputChange('lastName', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Date of Birth"
                      type="date"
                      value={
                        appUser?.dob
                          ? new Date(appUser.dob).toISOString().split('T')[0]
                          : ''
                      }
                      InputProps={{ readOnly: true }}
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Occupation"
                      value={
                        isEditing
                          ? formData.occupation
                          : appUser?.occupation || ''
                      }
                      onChange={e =>
                        handleInputChange('occupation', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                      placeholder="Your job title"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Company"
                      value={
                        isEditing ? formData.company : appUser?.company || ''
                      }
                      onChange={e =>
                        handleInputChange('company', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                      placeholder="Company name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      value={isEditing ? formData.bio : appUser?.bio || ''}
                      onChange={e => handleInputChange('bio', e.target.value)}
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Address Section */}
              <Box sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                  <LocationOnIcon sx={{ color: Colors.blue, fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                    Address Information
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address Line 1"
                      value={
                        isEditing
                          ? formData?.address?.address1
                          : appUser?.address?.address1 || ''
                      }
                      onChange={e =>
                        handleInputChange('address.address1', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                      placeholder="Street address"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Address Line 2"
                      value={
                        isEditing
                          ? formData?.address?.address2
                          : appUser?.address?.address2 || ''
                      }
                      onChange={e =>
                        handleInputChange('address.address2', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City"
                      value={
                        isEditing
                          ? formData?.address?.city
                          : appUser?.address?.city || ''
                      }
                      onChange={e =>
                        handleInputChange('address.city', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="State"
                      value={
                        isEditing
                          ? formData?.address?.state
                          : appUser?.address?.state || ''
                      }
                      onChange={e =>
                        handleInputChange('address.state', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="ZIP Code"
                      value={
                        isEditing
                          ? formData?.address?.postalCode
                          : appUser?.address?.postalCode || ''
                      }
                      onChange={e =>
                        handleInputChange('address.postalCode', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Country"
                      value={
                        isEditing
                          ? formData?.address?.country
                          : appUser?.address?.country || ''
                      }
                      onChange={e =>
                        handleInputChange('address.country', e.target.value)
                      }
                      InputProps={{ readOnly: !isEditing }}
                      variant={isEditing ? 'outlined' : 'filled'}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper elevation={1} sx={{ width: '100%', mb: 3 }}>
              {/* Security Settings Section */}
              <Box sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                  <SecurityIcon
                    sx={{ color: Colors.raspberry, fontSize: 24 }}
                  />
                  <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                    Security Settings
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Email Address
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {firebaseUser?.email}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEmailDialog(true)}
                    sx={{ color: Colors.blue, borderColor: Colors.blue }}
                  >
                    Change Email
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Phone Number
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {firebaseUser?.phoneNumber || 'Not set'}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setPhoneDialog(true)}
                    sx={{ color: Colors.blue, borderColor: Colors.blue }}
                  >
                    Change Phone
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <LockIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Password
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    ••••••••
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setPasswordDialog(true)}
                    sx={{ color: Colors.blue, borderColor: Colors.blue }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ width: '100%' }}>
              {/* Payment Methods Section */}
              <Box sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                  <PaymentIcon sx={{ color: Colors.raspberry, fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                    Payment Methods
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}
                >
                  <FaCcMastercard
                    style={{ fontSize: '32px', color: Colors.blue }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Mastercard
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •••• •••• •••• 1234
                    </Typography>
                  </Box>
                  <Chip
                    label="Primary"
                    size="small"
                    color="primary"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2, color: Colors.blue, borderColor: Colors.blue }}
                >
                  Add Payment Method
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <EmailUpdateDialog
        open={emailDialog}
        onClose={() => setEmailDialog(false)}
        currentEmail={firebaseUser?.email || ''}
      />

      <PasswordUpdateDialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        currentEmail={firebaseUser?.email || ''}
      />

      <PhoneUpdateDialog
        open={phoneDialog}
        onClose={() => setPhoneDialog(false)}
        currentPhone={firebaseUser?.phoneNumber || undefined}
      />
    </Box>
  );
}
