import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminLanding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [staffOperationsOpen, setStaffOperationsOpen] = useState(false);

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
    if (path.includes('/employee-management')) return 'employees';
    if (path.includes('/regional-assignment')) return 'regional';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/users')) return 'users';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };
  
  const activeModule = getActiveModule();

  // Admin-specific modules
  const adminOnlyModules = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'employees', name: 'Employee Management', icon: <AssignmentIndIcon />, path: '/employee-management' },
    { id: 'regional', name: 'Regional Assignment', icon: <LocationOnIcon />, path: '/regional-assignment' },
    { id: 'analytics', name: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  // Staff operation modules (inherited from staff portal)
  const staffOperationModules = [
    { id: 'properties', name: 'Properties', icon: <HomeWorkIcon />, path: '/properties' },
    { id: 'bookings', name: 'Bookings', icon: <EventNoteIcon />, path: '/bookings' },
    { id: 'reservations', name: 'Reservation Support', icon: <EventNoteIcon />, path: '/reservation-support' },
    { id: 'guests', name: 'Guests/Hosts', icon: <PeopleIcon />, path: '/guests' },
    { id: 'reviews', name: 'Review Moderation', icon: <RateReviewIcon />, path: '/review-moderation' },
    { id: 'integrity', name: 'Platform Integrity', icon: <SecurityIcon />, path: '/platform-integrity' },
    { id: 'payouts', name: 'Payout & Disputes', icon: <PaymentIcon />, path: '/payout-dispute' }
  ];

  const handleModuleClick = (moduleId: string, path: string) => {
    navigate(path);
  };

  const toggleStaffOperations = () => {
    setStaffOperationsOpen(!staffOperationsOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Navigation */}
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        backgroundColor: '#1a237e', // Darker blue for admin
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
            alt="Yaad Admin"
            sx={{
              height: 48,
              mb: 1
            }}
          />
          <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '0.5px' }}>
            ADMIN PORTAL
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 2 }}>
          {/* Admin-only modules */}
          {adminOnlyModules.map((module) => (
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

          {/* Staff Operations Collapsible Section */}
          <Button
            fullWidth
            startIcon={<WorkIcon />}
            endIcon={staffOperationsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={toggleStaffOperations}
            sx={{
              justifyContent: 'space-between',
              py: 1.5,
              px: 2,
              color: 'rgba(255,255,255,0.9)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderLeft: '4px solid transparent',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              },
              textTransform: 'none',
              fontWeight: 600,
              mt: 1
            }}
          >
            Staff Operations
          </Button>

          {/* Collapsible Staff Operations */}
          <Collapse in={staffOperationsOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {staffOperationModules.map((module) => (
                <ListItem 
                  key={module.id}
                  button
                  onClick={() => handleModuleClick(module.id, module.path)}
                  sx={{
                    py: 1,
                    px: 0,
                    color: activeModule === module.id ? 'white' : 'rgba(255,255,255,0.6)',
                    backgroundColor: activeModule === module.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    borderLeft: activeModule === module.id ? '4px solid white' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeModule === module.id ? 'white' : 'rgba(255,255,255,0.6)',
                    minWidth: 40,
                    pl: 2
                  }}>
                    {module.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={module.name}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>

        {/* User Info */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon />
          <Typography variant="body2">
            Admin User
          </Typography>
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
