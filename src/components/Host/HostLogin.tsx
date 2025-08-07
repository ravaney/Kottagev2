import React, { useState, useEffect } from 'react';
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
  Divider,
  Paper,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useFirebaseUser } from '../../hooks';
import { useUserClaims } from '../../hooks/useUserClaims';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { Colors } from '../constants';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

export default function HostLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleError, setRoleError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: loginMutation, error, isPending } = useLogin();
  const { data: user } = useFirebaseUser();
  const { claims } = useUserClaims();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isPending && user) {
        // Check if user has host role
        if (claims && (claims.role === 'host' || claims.userType === 'host')) {
          const redirectTo = location.state?.from?.pathname || '/dashboard';
          const redirectState = location.state?.from?.state;
          navigate(redirectTo, { replace: true, state: redirectState });
        } else if (claims) {
          // User has claims but not host role
          setRoleError(
            'Access denied. This account does not have host privileges. Please contact support if you believe this is an error.'
          );
          // Sign out the user since they don't have correct role
          await signOut(auth);
        }
        // If claims is null/undefined, we're still waiting for claims to load
      }
    };

    checkUserRole();
  }, [user, isPending, navigate, location, claims]);

  const handleSignIn = async () => {
    setRoleError(''); // Clear any previous role errors
    try {
      await loginMutation({ email, password });
      // Note: Role verification will happen in the useEffect after login
    } catch (error) {
      console.error('Host login failed:', error);
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
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
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
                alt="Blu Kottage Host Portal"
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
                Host Portal
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage your properties and bookings
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
                  Professional property management dashboard
                </Typography>
              </Box>
            </Box>

            {/* Login Form */}
            <Box
              component="form"
              onSubmit={e => {
                e.preventDefault();
                handleSignIn();
              }}
            >
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isPending}
                sx={{
                  mb: 2,
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
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
                placeholder="Enter your business email"
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isPending}
                sx={{
                  mb: 3,
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
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
                placeholder="Enter your password"
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error.message}
                </Alert>
              )}

              {roleError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {roleError}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isPending}
                sx={{
                  backgroundColor: Colors.blue,
                  '&:hover': { backgroundColor: Colors.raspberry },
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                {isPending ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ mr: 1, color: 'white' }}
                    />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Host Dashboard'
                )}
              </Button>
            </Box>

            {/* Forgot Password */}
            <Box textAlign="center" mb={3}>
              <Link
                to="/forgot-password"
                style={{
                  color: Colors.blue,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Forgot your password?
              </Link>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Footer Links */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                New to hosting?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: Colors.blue,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Create Host Account
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Looking to book a stay?{' '}
                <Link
                  to="/Login"
                  style={{
                    color: Colors.blue,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Guest Login
                </Link>
              </Typography>
            </Box>

            {/* Business Info */}
            <Box mt={4} textAlign="center">
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Need help with your account?
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={Colors.blue}
                >
                  Contact Host Support: support@blukottage.com | +1-876-XXX-XXXX
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
