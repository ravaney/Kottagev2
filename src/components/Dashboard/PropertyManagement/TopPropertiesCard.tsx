import React, { useState } from 'react';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton, List, ListItem, LinearProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Colors } from '../../constants';

interface PropertyPerformance {
  id: string;
  name: string;
  income: number;
  rating: number;
  occupancyRate: number;
}

interface TopPropertiesCardProps {
  properties: PropertyPerformance[];
}

export default function TopPropertiesCard({ properties }: TopPropertiesCardProps) {
  const [metric, setMetric] = useState<string>('income');
  
  const handleMetricChange = (event: React.MouseEvent<HTMLElement>, newMetric: string | null) => {
    if (newMetric !== null) {
      setMetric(newMetric);
    }
  };
  
  // Sort properties based on selected metric
  const sortedProperties = [...properties].sort((a, b) => {
    switch (metric) {
      case 'income':
        return b.income - a.income;
      case 'rating':
        return b.rating - a.rating;
      case 'occupancy':
        return b.occupancyRate - a.occupancyRate;
      default:
        return b.income - a.income;
    }
  }).slice(0, 5); // Top 5 properties
  
  // Get max value for the selected metric
  const getMaxValue = () => {
    switch (metric) {
      case 'income':
        return Math.max(...properties.map(p => p.income));
      case 'rating':
        return 5; // Assuming 5-star rating system
      case 'occupancy':
        return 100; // Percentage
      default:
        return 100;
    }
  };
  
  // Format value based on metric
  const formatValue = (property: PropertyPerformance) => {
    switch (metric) {
      case 'income':
        return `$${property.income.toLocaleString()}`;
      case 'rating':
        return `${property.rating.toFixed(1)}★`;
      case 'occupancy':
        return `${property.occupancyRate}%`;
      default:
        return '';
    }
  };
  
  // Get color based on metric
  const getColor = (property: PropertyPerformance) => {
    switch (metric) {
      case 'income':
        return Colors.blue;
      case 'rating':
        return '#ff9800';
      case 'occupancy':
        return '#4caf50';
      default:
        return Colors.blue;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <StarIcon sx={{ color: Colors.blue, fontSize: 24 }} />
        <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
          Top Performing Properties
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          size="small"
          value={metric}
          exclusive
          onChange={handleMetricChange}
          aria-label="metric"
          sx={{ 
            width: '100%',
            '& .MuiToggleButton-root': { 
              py: 0.3, 
              px: 1, 
              textTransform: 'none',
              fontSize: '0.7rem',
              flex: 1
            },
            '& .Mui-selected': {
              backgroundColor: `${Colors.blue}15 !important`,
              color: Colors.blue,
              fontWeight: 600
            }
          }}
        >
          <ToggleButton value="income" aria-label="income">
            Income
          </ToggleButton>
          <ToggleButton value="rating" aria-label="rating">
            Rating
          </ToggleButton>
          <ToggleButton value="occupancy" aria-label="occupancy">
            Occupancy
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <List sx={{ p: 0 }}>
        {sortedProperties.map((property, index) => (
          <ListItem key={property.id} sx={{ px: 0, py: 1 }}>
            <Box sx={{ width: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {index + 1}. {property.name}
                </Typography>
                <Typography variant="body2" fontWeight={600} color={getColor(property)}>
                  {formatValue(property)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(metric === 'rating' ? property.rating / 5 : property[metric as keyof PropertyPerformance] as number / getMaxValue()) * 100} 
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: `${getColor(property)}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getColor(property)
                  }
                }} 
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}