import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { useUserClaims } from '../../hooks/useUserClaims';
import HostLanding from './HostLanding';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Colors } from '../constants';

export default function HostRoot() {
  const navigate = useNavigate();
  const { firebaseUser, loading: authLoading } = useAuth();
  const { claims, loading: claimsLoading } = useUserClaims();

  useEffect(() => {
    // Don't do anything while auth or claims are loading
    if (authLoading || claimsLoading) {
      return;
    }

    // If user is authenticated and has host role, redirect to dashboard
    if (
      firebaseUser &&
      claims &&
      (claims.role === 'host' || claims.userType === 'host')
    ) {
      navigate('/dashboard', { replace: true });
    }
    // If user is authenticated but doesn't have host role, they shouldn't be here
    else if (
      firebaseUser &&
      claims &&
      claims.role !== 'host' &&
      claims.userType !== 'host'
    ) {
      // They'll be handled by the ProtectedHostRoute component
      // which will show them an access denied message
      navigate('/dashboard', { replace: true });
    }
    // If no user or no claims, show the landing page (handled by the render below)
  }, [firebaseUser, claims, authLoading, claimsLoading, navigate]);

  // Show loading while checking authentication
  if (authLoading || claimsLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <CircularProgress size={60} sx={{ color: Colors.blue, mb: 2 }} />
        <Typography variant="h6" color={Colors.blue}>
          Loading Host Portal...
        </Typography>
      </Box>
    );
  }

  // If user is not authenticated or doesn't have claims yet, show landing page
  if (!firebaseUser || !claims) {
    return <HostLanding />;
  }

  // This case should be rare, but if we get here, redirect to dashboard
  // and let ProtectedHostRoute handle the rest
  navigate('/dashboard', { replace: true });
  return null;
}
