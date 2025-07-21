import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useUserClaims, useRoleChecker } from '../../hooks/useUserClaims';
import { Colors } from '../constants';
import AdminLogin from './AdminLogin';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
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
            Loading admin portal...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // If no user is authenticated, show admin login
  if (!user) {
    return <AdminLogin />;
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
            Verifying administrator credentials...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Check if user has admin access
  if (!roleChecker.canAccessAdminPortal()) {
    console.log('Admin access denied - User claims:', claims);
    console.log('Can access admin portal:', roleChecker.canAccessAdminPortal());
    console.log('Is employee:', roleChecker.isEmployee());
    console.log('Is admin:', roleChecker.isAdmin());
    console.log('Is super admin:', roleChecker.isSuperAdmin());
    console.log('User role:', claims?.role);
    console.log('User type:', claims?.userType);
    
    return <AdminLogin />;
  }

  // User is authenticated and has admin access
  return <>{children}</>;
}
