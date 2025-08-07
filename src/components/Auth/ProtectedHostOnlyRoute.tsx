import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserClaims } from '../../hooks/useUserClaims';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedHostOnlyRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const ProtectedHostOnlyRoute: React.FC<ProtectedHostOnlyRouteProps> = ({
  children,
  fallbackPath = '/MyAccount/Dashboard',
}) => {
  const { firebaseUser } = useAuth();
  const { claims, refreshClaims, loading: claimsLoading } = useUserClaims();
  const [isVerifying, setIsVerifying] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyHostAccess = async () => {
      if (!firebaseUser) {
        // Not logged in, redirect to login
        navigate('/Login');
        return;
      }

      if (claimsLoading) {
        return; // Still loading claims
      }

      // Only refresh claims once per user session
      if (!hasRefreshed) {
        try {
          await refreshClaims();
          setHasRefreshed(true);
        } catch (error) {
          console.error('Error refreshing claims:', error);
          setHasRefreshed(true); // Prevent further refresh attempts
        }
      }

      // Check if user is specifically a host (not guest)
      const isHost =
        claims &&
        (claims.role === 'host' ||
          claims.userType === 'host' ||
          claims.role === 'admin' ||
          claims.role === 'super_admin');

      if (isHost) {
        setIsVerifying(false);
        setAccessDenied(false);
      } else if (claims) {
        // We have claims but user is not a host
        setAccessDenied(true);
        setIsVerifying(false);
      }
      // If no claims yet, keep verifying
    };

    verifyHostAccess();
  }, [
    firebaseUser,
    claims,
    claimsLoading,
    hasRefreshed,
    navigate,
    refreshClaims,
  ]);

  // Reset state when user changes
  useEffect(() => {
    setHasRefreshed(false);
    setIsVerifying(true);
    setAccessDenied(false);
  }, [firebaseUser?.uid]);

  const handleGoToDashboard = () => {
    navigate(fallbackPath);
  };

  if (isVerifying) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Verifying host permissions...
        </Typography>
      </Box>
    );
  }

  if (accessDenied) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={3}
        maxWidth="600px"
        margin="0 auto"
        padding={3}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Host Access Required
          </Typography>
          <Typography variant="body1" gutterBottom>
            This section is only available to hosts. You currently have guest
            access.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To become a host and list properties, please upgrade your account or
            contact support.
          </Typography>
        </Alert>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleGoToDashboard}
            size="large"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/host/signup')}
            size="large"
          >
            Become a Host
          </Button>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedHostOnlyRoute;
