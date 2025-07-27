import React, { useState } from 'react';
import { 
  Paper, Box, Typography, Button, Chip, Tabs, Tab, 
  List, ListItem, Divider, IconButton, Menu, MenuItem 
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import HandymanIcon from '@mui/icons-material/Handyman';
import { Colors } from '../../constants';

interface MaintenanceRequest {
  id: string;
  propertyName: string;
  type: 'cleaning' | 'repair' | 'other';
  description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  scheduledFor?: string;
  assignedTo?: string;
}

interface MaintenanceRequestsCardProps {
  requests: MaintenanceRequest[];
  onNewRequest: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function MaintenanceRequestsCard({ 
  requests, 
  onNewRequest, 
  onUpdateStatus 
}: MaintenanceRequestsCardProps) {
  const [tabValue, setTabValue] = useState<number>(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, requestId: string) => {
    setMenuAnchor(event.currentTarget);
    setActiveRequestId(requestId);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setActiveRequestId(null);
  };
  
  const handleStatusChange = (status: string) => {
    if (activeRequestId) {
      onUpdateStatus(activeRequestId, status);
      handleMenuClose();
    }
  };
  
  // Filter requests based on tab
  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return request.status === 'pending' || request.status === 'scheduled';
    if (tabValue === 2) return request.status === 'completed';
    return false;
  });
  
  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'cleaning': return <CleaningServicesIcon sx={{ fontSize: 20, color: '#4caf50' }} />;
      case 'repair': return <HandymanIcon sx={{ fontSize: 20, color: '#ff9800' }} />;
      default: return <BuildIcon sx={{ fontSize: 20, color: Colors.blue }} />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip size="small" label="Pending" color="warning" sx={{ height: 24 }} />;
      case 'scheduled':
        return <Chip size="small" label="Scheduled" color="info" sx={{ height: 24 }} />;
      case 'completed':
        return <Chip size="small" label="Completed" color="success" sx={{ height: 24 }} />;
      case 'cancelled':
        return <Chip size="small" label="Cancelled" color="default" sx={{ height: 24 }} />;
      default:
        return null;
    }
  };
  
  const getPriorityChip = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Chip size="small" label="High" sx={{ height: 20, backgroundColor: '#ffebee', color: '#d32f2f', fontSize: '0.65rem' }} />;
      case 'medium':
        return <Chip size="small" label="Medium" sx={{ height: 20, backgroundColor: '#fff8e1', color: '#ff8f00', fontSize: '0.65rem' }} />;
      case 'low':
        return <Chip size="small" label="Low" sx={{ height: 20, backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.65rem' }} />;
      default:
        return null;
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <BuildIcon sx={{ color: Colors.blue, fontSize: 24 }} />
          <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
            Maintenance Requests
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<AddIcon />}
          onClick={onNewRequest}
          sx={{ backgroundColor: Colors.blue }}
        >
          New Request
        </Button>
      </Box>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ 
          mb: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            minHeight: 36,
            py: 0
          }
        }}
      >
        <Tab label={`All (${requests.length})`} />
        <Tab label={`Active (${requests.filter(r => r.status === 'pending' || r.status === 'scheduled').length})`} />
        <Tab label={`Completed (${requests.filter(r => r.status === 'completed').length})`} />
      </Tabs>
      
      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <React.Fragment key={request.id}>
              {index > 0 && <Divider />}
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <Box sx={{ width: '100%' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" alignItems="center" gap={1}>
                      {getRequestIcon(request.type)}
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {request.propertyName}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                          {getPriorityChip(request.priority)}
                          <Typography variant="caption" color="text.secondary">
                            Created: {request.createdAt}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusChip(request.status)}
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, request.id)}
                        sx={{ p: 0.5 }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1, ml: 4 }}>
                    {request.description}
                  </Typography>
                  
                  {request.scheduledFor && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
                      Scheduled for: {request.scheduledFor}
                      {request.assignedTo && ` • Assigned to: ${request.assignedTo}`}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No maintenance requests found
            </Typography>
          </Box>
        )}
      </List>
      
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('pending')}>Mark as Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange('scheduled')}>Mark as Scheduled</MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>Mark as Completed</MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>Cancel Request</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
      </Menu>
    </Paper>
  );
}