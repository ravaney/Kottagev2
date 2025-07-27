import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,

  Paper,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Colors } from '../constants';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUserClaims } from '../../hooks/useUserClaims';
import { useSignOut } from '../../hooks/useSignOut';

// Mock data for tasks
const pendingTasks = [
  { id: 1, title: 'Verify new property listing', property: 'Sunset Villa', priority: 'high', dueDate: 'Today' },
  { id: 2, title: 'Review booking request', property: 'Mountain Cabin', priority: 'medium', dueDate: 'Tomorrow' },
  { id: 3, title: 'Update property photos', property: 'Beach House', priority: 'low', dueDate: 'Next week' },
  { id: 4, title: 'Respond to customer inquiry', property: 'City Loft', priority: 'high', dueDate: 'Today' },
];

export default function StaffLanding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { firebaseUser, appUser } = useAuth();
  const { claims } = useUserClaims();
  const signOutMutation = useSignOut();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleMenuClose();
  };
  
  // Determine active module based on current path
  const getActiveModule = () => {
    const path = location.pathname;
    if (path.includes('/properties')) return 'properties';
    if (path.includes('/bookings')) return 'bookings';
    if (path.includes('/reservation-support')) return 'reservations';
    if (path.includes('/guests')) return 'guests';
    if (path.includes('/review-moderation')) return 'reviews';
    if (path.includes('/platform-integrity')) return 'integrity';
    if (path.includes('/payout-dispute')) return 'payouts';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };
  
  const activeModule = getActiveModule();

  const staffModules = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'properties', name: 'Properties', icon: <HomeWorkIcon />, path: '/properties' },
    { id: 'bookings', name: 'Bookings', icon: <EventNoteIcon />, path: '/bookings' },
    { id: 'reservations', name: 'Reservation Support', icon: <EventNoteIcon />, path: '/reservation-support' },
    { id: 'guests', name: 'Guests/Hosts', icon: <PeopleIcon />, path: '/guests' },
    { id: 'reviews', name: 'Review Moderation', icon: <RateReviewIcon />, path: '/review-moderation' },
    { id: 'integrity', name: 'Platform Integrity', icon: <SecurityIcon />, path: '/platform-integrity' },
    { id: 'payouts', name: 'Payout & Disputes', icon: <PaymentIcon />, path: '/payout-dispute' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const handleModuleClick = (moduleId: string, path: string) => {
    navigate(path);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#1976d2';
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Navigation */}
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        backgroundColor: '#2c3e50',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e0e0e0'
      }}>
        {/* Logo Area */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box
            component="img"
            src="/logoType.png"
            alt="Yaad Staff"
            sx={{
              height: 48,
              mb: 1
            }}
          />
          <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '0.5px' }}>
            STAFF PORTAL
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 2 }}>
          {staffModules.map((module) => (
            <Button
              key={module.id}
              fullWidth
              startIcon={module.icon}
              onClick={() => handleModuleClick(module.id, module.path)}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                color: activeModule === module.id ? 'white' : 'rgba(255,255,255,0.7)',
                backgroundColor: activeModule === module.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: activeModule === module.id ? '4px solid white' : '4px solid transparent',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {module.name}
            </Button>
          ))}
        </Box>

        {/* User Info */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Button
            fullWidth
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <PersonIcon fontSize="small" />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {appUser?.firstName ? `${appUser.firstName} ${appUser.lastName}` : firebaseUser?.email?.split('@')[0] || 'Staff User'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {claims?.role || 'Staff'} • Online
                </Typography>
              </Box>
            </Box>
            <ExpandMoreIcon fontSize="small" />
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
        {/* Content from child routes */}
        <Outlet />
      </Box>
    </Box>
  );
}