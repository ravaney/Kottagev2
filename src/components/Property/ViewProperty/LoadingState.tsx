import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

interface LoadingStateProps {
  message?: string;
  variant?: 'fullscreen' | 'inline';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  variant = 'fullscreen',
}) => {
  const containerSx = variant === 'fullscreen' 
    ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }
    : { display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 };

  return (
    <Box sx={containerSx}>
      <Box textAlign="center">
        <CircularProgress sx={{ mb: 2, color: '#1976d2' }} />
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};
