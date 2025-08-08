import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateAccount } from '../../hooks';
import { useFilePicker } from 'use-file-picker';
import { IAddress, IInitUser } from '../../../public/QuickType';
import { Colors } from '../constants';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HotelIcon from '@mui/icons-material/Hotel';

export default function GuestSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [image, setImage] = useState<File[]>();
  const [address, setAddress] = useState<IAddress>({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'Jamaica',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(true);

  const navigate = useNavigate();
  const {
    mutateAsync: createAccountMutation,
    error,
    isPending,
  } = useCreateAccount();

  const [openFileSelector] = useFilePicker({
    multiple: false,
    accept: 'image/*',
    onFilesSuccessfulySelected: ({ plainFiles }: any) => {
      setImage(plainFiles);
    },
  });

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    try {
      await createAccountMutation({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
        image,
        dob,
        userType: 'customer', // Mark as guest account
        role: 'guest', // Set role to guest
      } as IInitUser);
      navigate('/');
    } catch (error) {
      console.error('Guest account creation failed:', error);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Box
                component="img"
                src="/logoType.png"
                alt="Yaad Guest Registration"
                sx={{
                  height: 60,
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                fontWeight={700}
                color="#2c3e50"
                gutterBottom
              >
                Join Yaad
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Discover amazing stays across Jamaica
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  mb: 3,
                }}
              >
                <HotelIcon sx={{ color: Colors.blue, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Guest Registration - Start your journey
                </Typography>
              </Box>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.message}
              </Alert>
            )}

            {/* Profile Image Upload */}
            <Box textAlign="center" mb={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Profile Photo (Optional)
              </Typography>
              {image && image.length > 0 ? (
                <Box>
                  <Avatar
                    src={URL.createObjectURL(image[0])}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      border: '3px solid #667eea',
                      mb: 1,
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={openFileSelector}
                    startIcon={<PhotoCameraIcon />}
                    size="small"
                    sx={{ color: Colors.blue, borderColor: Colors.blue }}
                  >
                    Change Photo
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      backgroundColor: '#f0f0f0',
                      mb: 1,
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 40, color: '#ccc' }} />
                  </Avatar>
                  <Button
                    variant="outlined"
                    onClick={openFileSelector}
                    startIcon={<PhotoCameraIcon />}
                    size="small"
                    sx={{ color: Colors.blue, borderColor: Colors.blue }}
                  >
                    Add Photo
                  </Button>
                </Box>
              )}
            </Box>

            {/* Form Fields */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Your last name"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="+1-876-XXX-XXXX"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={address.address1}
                  onChange={e =>
                    setAddress({ ...address, address1: e.target.value })
                  }
                  placeholder="Street address (optional)"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={address.city}
                  onChange={e =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  placeholder="City"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parish"
                  value={address.state}
                  onChange={e =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  placeholder="Parish"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  error={confirmPassword !== '' && password !== confirmPassword}
                  helperText={
                    confirmPassword !== '' && password !== confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: Colors.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.blue,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Terms and Conditions */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={e => setAgreeToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link to="/terms" style={{ color: Colors.blue }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" style={{ color: Colors.blue }}>
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={receiveMarketing}
                    onChange={e => setReceiveMarketing(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I would like to receive travel tips and special offers
                  </Typography>
                }
              />
            </Box>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateAccount}
              disabled={
                isPending ||
                !agreeToTerms ||
                password !== confirmPassword ||
                !email ||
                !password
              }
              sx={{
                backgroundColor: Colors.blue,
                '&:hover': { backgroundColor: Colors.raspberry },
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                mb: 3,
              }}
            >
              {isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Creating Account...
                </>
              ) : (
                'Create Guest Account'
              )}
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* Footer Links */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/Login"
                  style={{
                    color: Colors.blue,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Want to become a host instead?{' '}
                <Link
                  to="/host-signup"
                  style={{
                    color: Colors.blue,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Host Registration
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
