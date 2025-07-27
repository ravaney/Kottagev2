import React, { useState } from 'react';
import { Paper, Box, Typography, Rating, LinearProgress, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import { Colors } from '../../constants';

interface PropertyRating {
  id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface RatingSummaryCardProps {
  properties: PropertyRating[];
}

export default function RatingSummaryCard({ properties }: RatingSummaryCardProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>(properties[0]?.id || '');
  
  const handlePropertyChange = (event: SelectChangeEvent) => {
    setSelectedProperty(event.target.value);
  };
  
  const currentProperty = properties.find(p => p.id === selectedProperty) || properties[0];
  
  // Calculate total reviews
  const totalReviews = currentProperty ? Object.values(currentProperty.ratingBreakdown).reduce((a, b) => a + b, 0) : 0;
  
  // Calculate percentage for each rating
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <GradeIcon sx={{ color: Colors.blue, fontSize: 24 }} />
        <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
          Rating Summary
        </Typography>
      </Box>
      
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="property-select-label">Select Property</InputLabel>
        <Select
          labelId="property-select-label"
          id="property-select"
          value={selectedProperty}
          label="Select Property"
          onChange={handlePropertyChange}
        >
          {properties.map(property => (
            <MenuItem key={property.id} value={property.id}>
              {property.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {currentProperty && (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <Box textAlign="center">
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Typography variant="h3" fontWeight={700} color={Colors.blue}>
                  {currentProperty.averageRating.toFixed(1)}
                </Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                    out of 5
                  </Typography>
                  <Rating 
                    value={currentProperty.averageRating} 
                    precision={0.5} 
                    size="small" 
                    readOnly 
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Based on {currentProperty.reviewCount} reviews
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            {[5, 4, 3, 2, 1].map(rating => (
              <Box key={rating} sx={{ mb: 1 }}>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ minWidth: 15 }}>
                    {rating}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getPercentage(currentProperty.ratingBreakdown[rating as keyof typeof currentProperty.ratingBreakdown])} 
                    sx={{ 
                      flex: 1,
                      height: 8, 
                      borderRadius: 1,
                      backgroundColor: '#f5f5f5',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: rating >= 4 ? '#4caf50' : 
                                        rating === 3 ? '#ff9800' : 
                                        '#f44336'
                      }
                    }} 
                  />
                  <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                    {currentProperty.ratingBreakdown[rating as keyof typeof currentProperty.ratingBreakdown]}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              {currentProperty.averageRating >= 4.5 ? 'Excellent' : 
               currentProperty.averageRating >= 4.0 ? 'Very Good' :
               currentProperty.averageRating >= 3.5 ? 'Good' :
               currentProperty.averageRating >= 3.0 ? 'Average' :
               'Needs Improvement'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentProperty.averageRating >= 4.0 ? 
                'Your property is performing well!' : 
                'Consider improvements to increase ratings.'}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}