import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropertyAnalyticsDashboard from './PropertyAnalyticsDashboard';

interface LocationState {
  propertyName?: string;
}

export default function PropertyAnalyticsPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  
  const propertyName = locationState?.propertyName || 'Property Analytics';

  if (!propertyId) {
    return <div>Property ID not found</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/MyAccount/Dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>
      
      <PropertyAnalyticsDashboard
        propertyId={propertyId}
        propertyName={propertyName}
      />
    </Box>
  );
}
