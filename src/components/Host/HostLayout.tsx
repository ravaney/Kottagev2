import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
  NotificationImportant as ActionIcon,
  HolidayVillage as PropertiesIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Colors } from '../constants';
import { useChat } from '../../contexts/ChatContext';

export default function HostLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { appUser, firebaseUser } = useAuth();
  const { chats } = useChat();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Calculate total unread messages
  const totalUnreadMessages = chats.reduce((total, chat) => {
    const currentUserId = firebaseUser?.uid || '';
    return total + (chat.unreadCount?.[currentUserId] || 0);
  }, 0);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    {
      label: 'Action Center',
      path: '/dashboard/action-center',
      icon: <ActionIcon />,
    },
    {
      label: 'Messages',
      path: '/dashboard/messages',
      icon: <MessageIcon />,
      badge: totalUnreadMessages,
    },
    {
      label: 'Reservations',
      path: '/dashboard/reservations',
      icon: <CalendarIcon />,
    },
    {
      label: 'Properties',
      path: '/dashboard/properties',
      icon: <PropertiesIcon />,
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Box
          component="img"
          src="/logoType.png"
          alt="Blu Kottage"
          sx={{ height: 40, mb: 1 }}
        />
      </Box>
      <Divider />
      <List>
        {navigationItems.map(item => (
          <ListItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              backgroundColor: isActivePath(item.path)
                ? Colors.blue
                : 'transparent',
              color: isActivePath(item.path) ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: isActivePath(item.path)
                  ? Colors.blue
                  : 'rgba(0,0,0,0.04)',
              },
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              cursor: 'pointer',
            }}
          >
            <ListItemIcon
              sx={{
                color: isActivePath(item.path) ? 'white' : Colors.blue,
              }}
            >
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
      <List>
        <ListItem
          onClick={() => handleNavigation('/profile')}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemIcon sx={{ color: Colors.blue }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          onClick={() => handleNavigation('/settings')}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemIcon sx={{ color: Colors.blue }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and title for desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <Typography variant="h6" fontWeight={600} color={Colors.blue}>
                Host Portal
              </Typography>
            </Box>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={totalUnreadMessages} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen} color="inherit" sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: Colors.blue,
                  fontSize: '0.875rem',
                }}
              >
                {appUser?.firstName?.[0] ||
                  firebaseUser?.email?.[0]?.toUpperCase() ||
                  'H'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate('/profile');
                }}
              >
                <PersonIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate('/settings');
                }}
              >
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate('/');
                }}
              >
                <HomeIcon sx={{ mr: 1 }} />
                Host Landing
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              top: '64px',
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px',
          pl: { xs: 0, md: '250px' },
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
