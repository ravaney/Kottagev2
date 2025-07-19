import React, { useState } from 'react';
import { Paper, Box, Typography, Button, Chip, Switch, FormControlLabel, List, ListItem, Divider } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Colors } from '../constants';

interface CalendarSource {
  id: string;
  name: string;
  type: 'airbnb' | 'booking' | 'google' | 'other';
  connected: boolean;
  lastSync: string;
  autoSync: boolean;
  properties: string[];
  status: 'ok' | 'error' | 'syncing';
}

interface CalendarSyncCardProps {
  sources: CalendarSource[];
  onConnect: (type: string) => void;
  onToggleAutoSync: (id: string, autoSync: boolean) => void;
  onSyncNow: (id: string) => void;
}

export default function CalendarSyncCard({ 
  sources, 
  onConnect, 
  onToggleAutoSync, 
  onSyncNow 
}: CalendarSyncCardProps) {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  
  const toggleExpand = (sourceId: string) => {
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
  };
  
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'airbnb': return '🏠';
      case 'booking': return '🏨';
      case 'google': return '📅';
      default: return '📆';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'error': return <ErrorIcon sx={{ color: '#f44336', fontSize: 16 }} />;
      case 'syncing': return <SyncIcon sx={{ color: '#ff9800', fontSize: 16, animation: 'spin 2s linear infinite' }} />;
      default: return null;
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <EventIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Calendar Sync
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<SyncIcon />}
          sx={{ borderColor: Colors.blue, color: Colors.blue }}
        >
          Sync All
        </Button>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Connect your external calendars to automatically sync availability.
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onConnect('airbnb')}
            startIcon={<span>🏠</span>}
          >
            Connect Airbnb
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onConnect('booking')}
            startIcon={<span>🏨</span>}
          >
            Connect Booking.com
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => onConnect('google')}
            startIcon={<span>📅</span>}
          >
            Connect Google
          </Button>
        </Box>
      </Box>
      
      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {sources.map((source, index) => (
          <React.Fragment key={source.id}>
            {index > 0 && <Divider />}
            <ListItem sx={{ px: 0, py: 1, display: 'block' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <span style={{ fontSize: '1.2rem' }}>{getSourceIcon(source.type)}</span>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {source.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last sync: {source.lastSync}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusIcon(source.status)}
                  <Button 
                    size="small" 
                    variant="text" 
                    onClick={() => onSyncNow(source.id)}
                    disabled={source.status === 'syncing'}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    {source.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="text" 
                    onClick={() => toggleExpand(source.id)}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    {expandedSource === source.id ? 'Hide' : 'Details'}
                  </Button>
                </Box>
              </Box>
              
              {expandedSource === source.id && (
                <Box sx={{ mt: 1, ml: 4, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        size="small" 
                        checked={source.autoSync} 
                        onChange={(e) => onToggleAutoSync(source.id, e.target.checked)} 
                      />
                    }
                    label={<Typography variant="body2">Auto-sync</Typography>}
                  />
                  <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
                    Synced Properties:
                  </Typography>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {source.properties.map(property => (
                      <Chip 
                        key={property} 
                        label={property} 
                        size="small" 
                        sx={{ fontSize: '0.7rem' }} 
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}