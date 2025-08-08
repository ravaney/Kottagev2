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
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateAccount } from '../../hooks';
import { IAddress, IInitUser } from '../../../public/QuickType';
import { Colors } from '../constants';
import BusinessIcon from '@mui/icons-material/Business';

const steps = [
  'Business Information',
  'Personal Details',
  'Property Location',
  'Verification',
];

const businessTypes = [
  'Vacation Rental',
  'Hotel/Resort',
  'Bed & Breakfast',
  'Property Management Company',
  'Individual Property Owner',
  'Other',
];

export default function HostSignup() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [address, setAddress] = useState<IAddress>({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'Jamaica',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToHostTerms, setAgreeToHostTerms] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(true);

  const navigate = useNavigate();
  const {
    mutateAsync: createAccountMutation,
    error,
    isPending,
  } = useCreateAccount();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreeToTerms || !agreeToHostTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    try {
      await createAccountMutation({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: personalPhone,
        address,
        image: undefined, // Handle image upload separately if needed
        dob: '', // Not required for hosts
        // Add host-specific data
        businessName,
        businessType,
        businessPhone,
        businessEmail,
        userType: 'customer',
        role: 'host',
      } as IInitUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Host account creation failed:', error);
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
              sx={{ color: Colors.blue, fontWeight: 600 }}
            >
              Tell us about your business
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Help us understand your property hosting business
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="Enter your business or property name"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={businessType}
                    label="Business Type"
                    onChange={e => setBusinessType(e.target.value)}
                  >
                    {businessTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Phone"
                  value={businessPhone}
                  onChange={e => setBusinessPhone(e.target.value)}
                  placeholder="+1-876-XXX-XXXX"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Email"
                  type="email"
                  value={businessEmail}
                  onChange={e => setBusinessEmail(e.target.value)}
                  placeholder="business@yourcompany.com"
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: Colors.blue, fontWeight: 600 }}
            >
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We need your personal details for account security and
              verification
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  required
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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Personal Phone"
                  value={personalPhone}
                  onChange={e => setPersonalPhone(e.target.value)}
                  placeholder="+1-876-XXX-XXXX"
                  required
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
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: Colors.blue, fontWeight: 600 }}
            >
              Property Location
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Where are your properties located?
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={address.address1}
                  onChange={e =>
                    setAddress({ ...address, address1: e.target.value })
                  }
                  placeholder="Property street address"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2 (Optional)"
                  value={address.address2}
                  onChange={e =>
                    setAddress({ ...address, address2: e.target.value })
                  }
                  placeholder="Apartment, suite, etc."
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
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Parish/State"
                  value={address.state}
                  onChange={e =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  placeholder="Parish"
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={address.zip}
                  onChange={e =>
                    setAddress({ ...address, zip: e.target.value })
                  }
                  placeholder="Postal code"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: Colors.blue, fontWeight: 600 }}
            >
              Agreement & Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review and accept our terms to complete your host registration
            </Typography>

            <Box
              sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Host Verification Process
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                After registration, our team will verify your account and
                properties. This typically takes 2-3 business days.
              </Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Required Documents:
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                • Government-issued ID • Business registration (if applicable) •
                Property ownership/rental agreement • Tax registration number
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
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
                    checked={agreeToHostTerms}
                    onChange={e => setAgreeToHostTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link to="/host-terms" style={{ color: Colors.blue }}>
                      Host Terms & Conditions
                    </Link>{' '}
                    and understand my responsibilities as a property host
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
                    I would like to receive marketing communications and host
                    tips
                  </Typography>
                }
              />
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Box
                component="img"
                src="/logoType.png"
                alt="Yaad Host Portal"
                sx={{
                  height: 60,
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                fontWeight={700}
                color={Colors.blue}
                gutterBottom
              >
                Become a Host
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Join Jamaica's premier vacation rental platform
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 2,
                  backgroundColor: '#e3f2fd',
                  borderRadius: 2,
                  border: '1px solid #bbdefb',
                  mb: 3,
                }}
              >
                <BusinessIcon sx={{ color: Colors.blue, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color={Colors.blue}
                  fontWeight={600}
                >
                  Professional host registration
                </Typography>
              </Box>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.message}
              </Alert>
            )}

            {/* Step Content */}
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ minWidth: 100 }}
              >
                Back
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleCreateAccount}
                    variant="contained"
                    disabled={isPending || !agreeToTerms || !agreeToHostTerms}
                    sx={{
                      backgroundColor: Colors.blue,
                      '&:hover': { backgroundColor: Colors.raspberry },
                      minWidth: 150,
                      py: 1.5,
                    }}
                  >
                    {isPending ? (
                      <>
                        <CircularProgress
                          size={20}
                          sx={{ mr: 1, color: 'white' }}
                        />
                        Creating Account...
                      </>
                    ) : (
                      'Create Host Account'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      backgroundColor: Colors.blue,
                      '&:hover': { backgroundColor: Colors.raspberry },
                      minWidth: 100,
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Footer */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have a host account?{' '}
                <Link
                  to="/login"
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
                Want to book as a guest instead?{' '}
                <Link
                  to="/guest-signup"
                  style={{
                    color: Colors.blue,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Guest Registration
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
