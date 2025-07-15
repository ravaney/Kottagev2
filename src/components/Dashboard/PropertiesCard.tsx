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
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <RiHotelLine style={{ color: Colors.blue, fontSize: 36 }} />
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography variant="h4" fontWeight={700} color={Colors.blue} sx={{ lineHeight: 1 }}>
                {totalProperties}
              </Typography>
              <Typography variant="body2" color="black" sx={{ fontWeight: 400, lineHeight: 1.2 }}>
                Properties
              </Typography>
            </Box>
          </Box>
          <Link to="/MyAccount/MyKottages" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color={Colors.raspberry} sx={{ cursor: 'pointer', fontWeight: 600 }}>
              View All
            </Typography>
          </Link>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight={600} color="green">
                {status.vacant}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Vacant
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight={600} color={Colors.raspberry}>
                {status.occupied}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Occupied
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight={600} color="orange">
                {status.unlisted}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unlisted
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
}