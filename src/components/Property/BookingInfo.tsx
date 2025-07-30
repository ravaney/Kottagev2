import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle, InfoOutlined } from '@mui/icons-material';
import { Colors } from '../constants';

interface BookingInfoProps {
  propertyId: string;
}

const BookingInfo: React.FC<BookingInfoProps> = ({ propertyId }) => {
  return (
    <>
      {/* Additional Info */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Free cancellation up to{' '}
            <Typography
              component="span"
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              14 days before check-in
            </Typography>
          </Typography>
        </Box>
      </Box>

      {/* Contact & Property Info */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          Property #{propertyId}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderColor: Colors.raspberry,
            color: Colors.raspberry,
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: Colors.raspberry,
              backgroundColor: `${Colors.raspberry}10`,
            },
          }}
        >
          Contact Host
        </Button>
      </Box>
    </>
  );
};

export default BookingInfo;
