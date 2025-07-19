import React, { useState } from 'react';
import { Paper, Box, Typography, Grid, Chip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Colors } from '../constants';

interface PropertyStatus {
  id: string;
  name: string;
  status: 'vacant' | 'booked' | 'maintenance';
  lastUpdated: string;
}

interface InventorySummaryCardProps {
  properties: PropertyStatus[];
}

export default function InventorySummaryCard({ properties }: InventorySummaryCardProps) {
  const [filter, setFilter] = useState<'all' | 'vacant' | 'booked' | 'maintenance'>('all');
  
  // Count properties by status
  const vacant = properties.filter(p => p.status === 'vacant').length;
  const booked = properties.filter(p => p.status === 'booked').length;
  const maintenance = properties.filter(p => p.status === 'maintenance').length;
  
  // Filter properties based on selected filter
  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.status === filter);
  
  // Get status color and label
  const getStatusChip = (status: 'vacant' | 'booked' | 'maintenance') => {
    switch (status) {
      case 'vacant':
        return <Chip size="small" label="Vacant" sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 500 }} />;
      case 'booked':
        return <Chip size="small" label="Booked" sx={{ backgroundColor: Colors.blue, color: 'white', fontWeight: 500 }} />;
      case 'maintenance':
        return <Chip size="small" label="Maintenance" sx={{ backgroundColor: '#ff9800', color: 'white', fontWeight: 500 }} />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 1 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <InventoryIcon sx={{ color: Colors.blue, fontSize: 24 }} />
        <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
          Inventory Summary {filter !== 'all' && `- ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 1, 
              backgroundColor: filter === 'vacant' ? '#4caf5020' : '#e8f5e9', 
              borderRadius: 1,
              cursor: 'pointer',
              border: filter === 'vacant' ? '1px solid #4caf50' : 'none',
              transition: 'all 0.2s'
            }}
            onClick={() => setFilter(filter === 'vacant' ? 'all' : 'vacant')}
          >
            <Typography variant="h5" fontWeight={700} color="#4caf50">
              {vacant}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vacant
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 1, 
              backgroundColor: filter === 'booked' ? `${Colors.blue}20` : '#e3f2fd', 
              borderRadius: 1,
              cursor: 'pointer',
              border: filter === 'booked' ? `1px solid ${Colors.blue}` : 'none',
              transition: 'all 0.2s'
            }}
            onClick={() => setFilter(filter === 'booked' ? 'all' : 'booked')}
          >
            <Typography variant="h5" fontWeight={700} color={Colors.blue}>
              {booked}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Booked
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 1, 
              backgroundColor: filter === 'maintenance' ? '#ff980020' : '#fff3e0', 
              borderRadius: 1,
              cursor: 'pointer',
              border: filter === 'maintenance' ? '1px solid #ff9800' : 'none',
              transition: 'all 0.2s'
            }}
            onClick={() => setFilter(filter === 'maintenance' ? 'all' : 'maintenance')}
          >
            <Typography variant="h5" fontWeight={700} color="#ff9800">
              {maintenance}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maintenance
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Property Status
        </Typography>
        {filter !== 'all' && (
          <Chip 
            label="Clear Filter" 
            size="small" 
            onClick={() => setFilter('all')} 
            sx={{ fontSize: '0.7rem' }}
          />
        )}
      </Box>
      
      <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <Box 
              key={property.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1,
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                {property.name}
              </Typography>
              {getStatusChip(property.status)}
            </Box>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No properties with this status
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}