import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Colors } from '../constants';
import { useAuth } from '../../hooks';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  const { appUser } = useAuth();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box sx={{ 
      p: 3, 
      mb: 0, 
      position: 'sticky', 
      top: 60, 
      backgroundColor: 'white', 
      zIndex: 100,
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          {icon}
          <Box>
            <Typography variant="h4" fontWeight={700} color={Colors.blue} sx={{ lineHeight: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Box textAlign="right">
          <Typography variant="body2" color="text.secondary">
            {currentDate}
          </Typography>
          <Typography variant="caption" color={Colors.raspberry} fontWeight={600}>
            Welcome back{appUser?.firstName ? `, ${appUser.firstName}` : ''}!
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#e0e0e0' }} />
    </Box>
  );
}