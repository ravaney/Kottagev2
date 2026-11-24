import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminSectionHeader from './AdminSectionHeader';

export default function AdminSettings() {
  return <Box sx={{ p: 3 }}>
    <AdminSectionHeader title="Settings" description="Manage platform configuration and preferences." eyebrow="ADMINISTRATION / SETTINGS" icon="settings" />
    <Typography color="text.secondary">Settings (Coming Soon)</Typography>
  </Box>;
}
