import React from 'react';
import { Paper, CardContent, Box, Typography, Grid } from '@mui/material';
import { RiHotelLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Colors } from '../constants';

interface PropertyStatus {
  vacant: number;
  occupied: number;
  unlisted: number;
}

interface PropertiesCardProps {
  totalProperties: number;
  status: PropertyStatus;
}

export default function PropertiesCard({ totalProperties, status }: PropertiesCardProps) {
  const occupancyRate = Math.round((status.occupied / totalProperties) * 100);
  
  return (
    <Paper elevation={3} sx={{ p: 1.5, borderRadius: '4px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <RiHotelLine style={{ color: Colors.blue, fontSize: 20 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} color={Colors.blue} sx={{ lineHeight: 1 }}>
              {totalProperties}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Properties
            </Typography>
          </Box>
        </Box>
        <Link to="/MyAccount/MyKottages" style={{ textDecoration: 'none' }}>
          <Typography variant="caption" color={Colors.raspberry} sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.7rem' }}>
            View →
          </Typography>
        </Link>
      </Box>
      
      <Box sx={{ backgroundColor: '#f8f9fa', borderRadius: 1, p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem' }}>
            OCCUPANCY
          </Typography>
          <Typography variant="caption" fontWeight={700} color={Colors.blue}>
            {occupancyRate}%
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-around">
          <Box textAlign="center">
            <Typography variant="caption" fontWeight={700} color="#28a745">
              {status.vacant}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>
              Vacant
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" fontWeight={700} color={Colors.raspberry}>
              {status.occupied}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>
              Busy
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" fontWeight={700} color="#ffc107">
              {status.unlisted}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>
              Unlisted
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}