import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { simulateSubdomain, getSubdomain } from '../../utils/subdomainRouter';

/**
 * A development tool to simulate subdomains for local testing
 */
export default function SubdomainSimulator() {
  const [open, setOpen] = useState(false);
  const [currentSubdomain, setCurrentSubdomain] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the current simulated subdomain on component mount
    setCurrentSubdomain(getSubdomain());
  }, []);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentSubdomain(event.target.value as string);
  };
  
  const handleApply = () => {
    simulateSubdomain(currentSubdomain);
    handleClose();
  };
  
  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <>
      <IconButton 
        onClick={handleOpen}
        sx={{ 
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.8)'
          }
        }}
      >
        <SettingsIcon />
      </IconButton>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subdomain Simulator</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This tool allows you to simulate different subdomains during local development.
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel id="subdomain-select-label">Subdomain</InputLabel>
            <Select
              labelId="subdomain-select-label"
              value={currentSubdomain || ''}
              label="Subdomain"
              onChange={handleChange as any}
            >
              <MenuItem value="">
                <em>None (main site)</em>
              </MenuItem>
              <MenuItem value="admin">admin (Admin Portal)</MenuItem>
              <MenuItem value="staff">staff (Staff Portal)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">Apply & Reload</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}