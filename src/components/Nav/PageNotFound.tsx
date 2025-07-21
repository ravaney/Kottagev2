import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Stack as MuiStack } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";

type Props = {};

export default function PageNotFound({}: Props) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's a previous page in history
    setCanGoBack(window.history.length > 1);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Navigate back if possible, otherwise go home
          if (canGoBack) {
            navigate(-1);
          } else {
            navigate('/');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, canGoBack]);

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh"
      gap={3}
      sx={{ p: 3 }}
    >
      <Typography variant="h1" color="error" fontWeight="bold" sx={{ fontSize: { xs: '4rem', md: '6rem' } }}>
        404
      </Typography>
      <Typography variant="h4" color="text.primary" gutterBottom sx={{ textAlign: 'center' }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: '500px' }}>
        The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </Typography>
      
      <Box display="flex" alignItems="center" gap={2} mt={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          {canGoBack 
            ? `Going back in ${countdown} second${countdown !== 1 ? 's' : ''}...`
            : `Redirecting to home in ${countdown} second${countdown !== 1 ? 's' : ''}...`
          }
        </Typography>
      </Box>
      
      <MuiStack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ minWidth: '150px' }}
        >
          {canGoBack ? 'Go Back' : 'Go Home'}
        </Button>
        
        {canGoBack && (
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{ minWidth: '150px' }}
          >
            Go Home
          </Button>
        )}
      </MuiStack>

      <Typography variant="caption" color="text.disabled" sx={{ mt: 4 }}>
        If you believe this is an error, please contact support.
      </Typography>
    </Box>
  );
}
