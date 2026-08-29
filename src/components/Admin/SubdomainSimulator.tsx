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
  IconButton,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  simulateSubdomain,
  getSubdomain,
  LOCAL_DEV_SUBDOMAIN_PORTS,
  LOCAL_DEV_MAIN_PORT,
} from '../../utils/subdomainRouter';
import { ClaimsViewer } from '../Debug/ClaimsViewer';

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

  const handleChange = (event: SelectChangeEvent<string>) => {
    setCurrentSubdomain(event.target.value || null);
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
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
        }}
      >
        <SettingsIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Subdomain Simulator & Debug Tools</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This tool allows you to simulate different subdomains during local
            development. On localhost, each portal now opens on its own dev
            port so you can keep them active side by side.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Main site: {LOCAL_DEV_MAIN_PORT} | Admin:{' '}
            {LOCAL_DEV_SUBDOMAIN_PORTS.admin} | Staff:{' '}
            {LOCAL_DEV_SUBDOMAIN_PORTS.staff} | Host:{' '}
            {LOCAL_DEV_SUBDOMAIN_PORTS.host}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="subdomain-select-label">Subdomain</InputLabel>
            <Select
              labelId="subdomain-select-label"
              value={currentSubdomain || ''}
              label="Subdomain"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None (main site)</em>
              </MenuItem>
              <MenuItem value="admin">
                admin (Admin Portal, port {LOCAL_DEV_SUBDOMAIN_PORTS.admin})
              </MenuItem>
              <MenuItem value="staff">
                staff (Staff Portal, port {LOCAL_DEV_SUBDOMAIN_PORTS.staff})
              </MenuItem>
              <MenuItem value="host">
                host (Host Portal, port {LOCAL_DEV_SUBDOMAIN_PORTS.host})
              </MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          {/* Integrated Claims Viewer */}
          <Box sx={{ mt: 2 }}>
            <ClaimsViewer />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">
            Open Portal
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
