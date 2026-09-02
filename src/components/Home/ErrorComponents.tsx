import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
type ErrorMessageProps = {
  type: 'popular' | 'curated';
};
export const ErrorComponents = ({ type }: ErrorMessageProps) => {
  if (type === 'popular') {
    return (
      <Box>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#f44336' }}>
            Unable to load popular properties
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Please try again later
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};
