import React from "react";
import PageHeader from '../../common/PageHeader';
import LuggageIcon from '@mui/icons-material/Luggage';
import { Colors } from '../../constants';
import { Box } from '@mui/material';


export default function MyBookings() {
  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader 
        title="My Bookings"
        subtitle="View and manage your reservations"
        icon={<LuggageIcon sx={{ color: Colors.blue, fontSize: 32 }} />}
      />
      <Box sx={{mt:1}}>
        <div>MyBookings Content</div>
      </Box>
    </Box>
  );
}
