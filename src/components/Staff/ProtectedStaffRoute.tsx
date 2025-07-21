import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useUserClaims, useRoleChecker } from '../../hooks/useUserClaims';
import { Colors } from '../constants';
import StaffLogin from './StaffLogin';

interface ProtectedStaffRouteProps {
  children: React.ReactNode;
}

export default function ProtectedStaffRoute({ children }: ProtectedStaffRouteProps) {
  const { user, claims, loading } = useUserClaims();
  const roleChecker = useRoleChecker();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
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
            Loading staff portal...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // If no user is authenticated, show staff login
  if (!user) {
    return <StaffLogin />;
  }

  // If user is authenticated but we don't have claims yet, wait
  if (!claims) {
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
            Verifying staff credentials...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Check if user has staff access
  if (!roleChecker.canAccessStaffPortal()) {
    console.log('Access denied - User claims:', claims);
    console.log('Can access staff portal:', roleChecker.canAccessStaffPortal());
    console.log('Is employee:', roleChecker.isEmployee());
    console.log('User role:', claims?.role);
    console.log('User type:', claims?.userType);
    
    return <StaffLogin />;
  }

  // User is authenticated and has staff access
  return <>{children}</>;
}
