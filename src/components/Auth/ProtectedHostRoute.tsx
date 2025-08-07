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
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

interface ProtectedHostRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const ProtectedHostRoute: React.FC<ProtectedHostRouteProps> = ({
  children,
  fallbackPath = '/',
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
          // eslint-disable-next-line react-hooks/exhaustive-deps
          await refreshClaims();
          setHasRefreshed(true);
        } catch (error) {
          console.error('Error refreshing claims:', error);
          // Continue with verification using existing claims
          setHasRefreshed(true); // Prevent further refresh attempts
        }
      }

      // Check if user has access (host, guest, or no claims)
      const hasAccess =
        !claims || // Allow access if no claims exist (treat as guest)
        (claims &&
          (claims.role === 'host' ||
            claims.userType === 'host' ||
            claims.role === 'admin' ||
            claims.role === 'super_admin' ||
            claims.role === 'guest' ||
            claims.userType === 'customer'));

      if (hasAccess) {
        setIsVerifying(false);
      } else if (claims) {
        // We have claims but user doesn't have access
        setAccessDenied(true);
        setIsVerifying(false);
      }
    };

    verifyHostAccess();
  }, [firebaseUser, claims, claimsLoading, hasRefreshed, navigate]);

  // Reset hasRefreshed when user changes
  useEffect(() => {
    setHasRefreshed(false);
    setIsVerifying(true);
    setAccessDenied(false);
  }, [firebaseUser?.uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoHome = () => {
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
          Verifying access permissions...
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
        <Alert severity="error" sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" gutterBottom>
            You need to have an account with proper access permissions. Please
            make sure you're logged in with the correct account.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            If you believe this is an error, please contact support at
            support@blukottage.com
          </Typography>
        </Alert>

        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={handleGoHome} size="large">
            Go to Homepage
          </Button>
          <Button variant="contained" onClick={handleSignOut} size="large">
            Sign Out & Try Again
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Need to create an account?{' '}
          <Button component="a" href="/Login" variant="text" size="small">
            Guest Registration
          </Button>
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedHostRoute;
