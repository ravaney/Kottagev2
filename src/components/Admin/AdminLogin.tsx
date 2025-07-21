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
  Paper
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useUserClaims, useRoleChecker } from '../../hooks/useUserClaims';
import { Colors } from '../constants';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: loginMutation, isPending } = useLogin();
  const { user, claims, loading: claimsLoading } = useUserClaims();
  const roleChecker = useRoleChecker();

  // Check if user is already authenticated and has admin access
  useEffect(() => {
    if (!claimsLoading && user && claims) {
      console.log('Admin Login - Checking user claims:', claims);
      
      if (roleChecker.canAccessAdminPortal()) {
        // User is authenticated and has admin access, redirect to intended page or dashboard
        const redirectTo = location.state?.from?.pathname || '/dashboard';
        navigate(redirectTo, { replace: true });
      } else if (claims) {
        // User is authenticated but doesn't have admin access
        setError('Access denied. You do not have administrative privileges. Please contact your system administrator.');
      }
    }
  }, [user, claims, claimsLoading, roleChecker, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await loginMutation({ email, password });
      // The useEffect above will handle the redirect after login
    } catch (error: any) {
      console.error('Admin login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  // Show loading spinner while checking claims
  if (claimsLoading && user) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ color: Colors.blue, mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Verifying administrator credentials...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Box
                component="img"
                src="/logoType.png"
                alt="Yaad Admin Portal"
                sx={{
                  height: 60,
                  mb: 2
                }}
              />
              <Typography
                variant="h4"
                fontWeight={700}
                color="#d32f2f"
                gutterBottom
              >
                Admin Portal
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Administrative access for Yaad platform management
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 2,
                  backgroundColor: '#ffebee',
                  borderRadius: 2,
                  border: '1px solid #ffcdd2'
                }}
              >
                <AdminPanelSettingsIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
                <Typography variant="body2" color="#d32f2f" fontWeight={600}>
                  Administrator credentials required
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Administrator Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isPending}
                sx={{
                  backgroundColor: '#d32f2f',
                  '&:hover': { backgroundColor: '#c62828' },
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                {isPending ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Admin Portal'
                )}
              </Button>
            </form>

            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Having trouble signing in?{' '}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: '#d32f2f', fontWeight: 600 }}
                >
                  Contact System Administrator
                </Typography>
              </Typography>
            </Box>

            <Box mt={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                This is a highly restricted access portal for authorized administrators only.
                All access attempts are logged and monitored.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
