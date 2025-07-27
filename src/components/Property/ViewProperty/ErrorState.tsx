import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message?: string;
  variant?: 'fullscreen' | 'inline';
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  variant = 'fullscreen',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  const containerSx = variant === 'fullscreen' 
    ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }
    : { display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 };

  return (
    <Box sx={containerSx}>
      <Box textAlign="center">
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        {onRetry && (
          <Button variant="contained" color="primary" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};
