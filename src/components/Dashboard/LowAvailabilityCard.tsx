import React from 'react';
import { Paper, Box, Typography, Alert, AlertTitle, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Colors } from '../constants';

interface AvailabilityAlert {
  id: string;
  propertyName: string;
  roomType: string;
  availableUnits: number;
  totalUnits: number;
  dates: string;
}

interface LowAvailabilityCardProps {
  alerts: AvailabilityAlert[];
}

export default function LowAvailabilityCard({ alerts }: LowAvailabilityCardProps) {
  // Sort alerts by availability percentage
  const sortedAlerts = [...alerts].sort((a, b) => 
    (a.availableUnits / a.totalUnits) - (b.availableUnits / b.totalUnits)
  );
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <WarningAmberIcon sx={{ color: Colors.raspberry, fontSize: 24 }} />
        <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
          Low Availability Alerts
        </Typography>
      </Box>
      
      {sortedAlerts.length > 0 ? (
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {sortedAlerts.map(alert => (
            <Alert 
              key={alert.id} 
              severity={alert.availableUnits === 0 ? "error" : "warning"}
              sx={{ mb: 1.5, '& .MuiAlert-message': { width: '100%' } }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <Box>
                  <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
                    {alert.propertyName}
                  </AlertTitle>
                  <Typography variant="body2">
                    {alert.roomType}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {alert.dates}
                  </Typography>
                </Box>
                <Chip 
                  label={`${alert.availableUnits}/${alert.totalUnits} left`} 
                  size="small" 
                  color={alert.availableUnits === 0 ? "error" : "warning"}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Alert>
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            No low availability alerts at this time
          </Typography>
        </Box>
      )}
    </Paper>
  );
}