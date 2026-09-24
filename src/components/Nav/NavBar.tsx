import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Typography,
  Menu as MuiMenu,
  MenuItem,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  LaptopMac as LaptopMacIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  TravelExplore as TravelIcon,
  Close as CloseIcon,
  LocalActivity as LocalActivityIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useEventWallet } from '../../hooks';
import { useUserClaims } from '../../hooks/useUserClaims';
import { AnimatedBadge } from '../common/AnimatedBadge';
import { Colors } from '../constants';
import UserMenu from './Menu';
import { useChat } from '../../contexts/ChatContext';

interface NavBarProps {
  transparent?: boolean;
}

type NavThemeMode = 'dark' | 'light';

const getInitialNavTheme = (): NavThemeMode => {
  try {
    return window.localStorage.getItem('bk-nav-theme') === 'light'
      ? 'light'
      : 'dark';
  } catch {
    return 'dark';
  }
};

const NavBar = ({ transparent = false }: NavBarProps) => {
  const { firebaseUser, loading, appUser } = useAuth();
  const { user: claimsUser, loading: claimsLoading } = useUserClaims();
  const { chats, currentUserId, totalUnreadMessages, setCurrentChat } =
    useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navThemeMode, setNavThemeMode] =
    useState<NavThemeMode>(getInitialNavTheme);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const { totalCount: eventWalletCount } = useEventWallet();

  // Use either firebaseUser from useAuth or claimsUser from useUserClaims
  const currentUser = firebaseUser || claimsUser;
  const isLoading = loading && claimsLoading;

  const unreadChats = chats.filter(chat => {
    return (chat.unreadCount?.[currentUserId] || 0) > 0;
  });

  const handleMessageClick = () => {
    navigate('/MyAccount/Dashboard/messages');
  };

  const handleEventWalletClick = () => {
    navigate('/MyAccount/TicketsAndCoupons');
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleUnreadChatClick = (chatId: string) => {
    const selectedChat = chats.find(chat => chat.id === chatId) || null;
    setCurrentChat(selectedChat);
    navigate('/MyAccount/Dashboard/messages');
    handleNotificationClose();
  };

  const navigationItems = [
    ...(location.pathname !== '/'
      ? [{ label: 'Home', icon: <HomeIcon />, path: '/' }]
      : []),
    { label: 'Explore', icon: <ExploreIcon />, path: '/Explore' },
    { label: 'Nomads', icon: <LaptopMacIcon />, path: '/nomad-network' },
    { label: 'Excursions', icon: <TravelIcon />, path: '/Excursions' },
    { label: 'Events', icon: <EventIcon />, path: '/Events' },
    { label: 'Restaurants', icon: <RestaurantIcon />, path: '/Restaurants' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNavTheme = () => {
    setNavThemeMode(currentMode => {
      const nextMode = currentMode === 'dark' ? 'light' : 'dark';

      try {
        window.localStorage.setItem('bk-nav-theme', nextMode);
      } catch {
        // The theme still changes for this session if storage is unavailable.
      }

      return nextMode;
    });
  };

  const isLightNavTheme = navThemeMode === 'light';
  const navBackgroundColor = isLightNavTheme
    ? '#f9f4f0'
    : transparent
      ? 'rgba(7,20,33,0.78)'
      : 'rgba(7,20,33,0.92)';
  const navTextColor = isLightNavTheme
    ? 'rgba(7,20,33,0.88)'
    : 'rgba(245,248,252,0.92)';
  const navMutedTextColor = isLightNavTheme
    ? 'rgba(7,20,33,0.62)'
    : 'rgba(245,248,252,0.72)';
  const navHoverBackground = isLightNavTheme
    ? 'rgba(209,85,182,0.12)'
    : 'rgba(209,85,182,0.18)';
  const navSoftHoverBackground = isLightNavTheme
    ? 'rgba(7,20,33,0.06)'
    : 'rgba(255,255,255,0.08)';
  const navBorderColor = isLightNavTheme
    ? 'rgba(7,20,33,0.1)'
    : 'rgba(255,255,255,0.08)';

  const isActiveNavPath = (path: string) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = path.toLowerCase();

    if (targetPath === '/') {
      return currentPath === '/';
    }

    return (
      currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    );
  };

  return (
    <>
      <AppBar
        // position={transparent ? "absolute" : "sticky"}
        elevation={0}
        sx={{
          backgroundColor: navBackgroundColor,
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${navBorderColor}`,
          color: navTextColor,
          boxShadow: isLightNavTheme
            ? '0 10px 28px rgba(38,50,56,0.1)'
            : '0 14px 34px rgba(4,11,20,0.22)',
          transition:
            'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
        }}
      >
        <Toolbar
          sx={{
            height: { xs: 64, sm: 70 },
            minHeight: { xs: '64px !important', sm: '70px !important' },
            px: { xs: 1, sm: 2, md: 3 },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              pl: { xs: 0.5, sm: 0.75, md: 2 },
              pt: 1,
            }}
            id="logo home link"
          >
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={
                  isLightNavTheme
                    ? '/bk_brand/bk-wordmark.png'
                    : '/bk_brand/bk_whitewordmarkV2.png'
                }
                alt="Kottage Logo"
                style={{
                  height: isSmallMobile ? '35px' : isMobile ? '40px' : '55px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: isLightNavTheme
                    ? 'drop-shadow(0 5px 12px rgba(0,123,167,0.12))'
                    : 'drop-shadow(0 8px 18px rgba(0,0,0,0.24))',
                  margin: 'auto',
                }}
              />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                flex: 1,
                justifyContent: 'center',
                px: { md: 2 },
                minWidth: 0,
                overflow: 'visible',
              }}
            >
              {navigationItems.map(item => {
                const isActive = isActiveNavPath(item.path);

                return (
                  <Button
                    key={item.label}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: isActive ? Colors.raspberry : navTextColor,
                      backgroundColor: isActive
                        ? navHoverBackground
                        : 'transparent',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: { xs: '12px', sm: '13px', md: '14px' },
                      textTransform: 'none',
                      px: { xs: 1, sm: 1.5, md: 2 },
                      py: 1,
                      borderRadius: 2,
                      minWidth: 'auto',
                      flexShrink: 1,
                      '&:hover': {
                        backgroundColor: navHoverBackground,
                        color: Colors.raspberry,
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Right Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 2 },
              flexShrink: 0,
              justifyContent: 'flex-end',
            }}
          >
            <Tooltip
              title={`Switch to ${isLightNavTheme ? 'dark' : 'light'} theme`}
            >
              <IconButton
                aria-label={`Switch to ${isLightNavTheme ? 'dark' : 'light'} navbar theme`}
                onClick={toggleNavTheme}
                sx={{
                  color: navTextColor,
                  '&:hover': {
                    backgroundColor: navSoftHoverBackground,
                    color: Colors.raspberry,
                  },
                }}
              >
                {isLightNavTheme ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Desktop: User Actions and Auth */}
            {!isMobile && (
              <>
                {/* User Actions for Desktop */}
                {!isLoading && currentUser && (
                  <>
                    {/* Messages */}
                    {totalUnreadMessages > 0 && (
                      <AnimatedBadge
                        badgeContent={totalUnreadMessages}
                        color="primary"
                        animate
                      >
                        <IconButton
                          onClick={handleMessageClick}
                          sx={{
                            color: navTextColor,
                            '&:hover': {
                              backgroundColor: navSoftHoverBackground,
                              color: Colors.raspberry,
                            },
                          }}
                        >
                          <MailIcon />
                        </IconButton>
                      </AnimatedBadge>
                    )}

                    {/* Notifications */}
                    <AnimatedBadge
                      badgeContent={eventWalletCount}
                      color="primary"
                      animate={eventWalletCount > 0}
                      invisible={eventWalletCount === 0}
                    >
                      <Tooltip title="Tickets & Coupons">
                        <IconButton
                          onClick={handleEventWalletClick}
                          sx={{
                            color: navTextColor,
                            '&:hover': {
                              backgroundColor: navSoftHoverBackground,
                              color: Colors.raspberry,
                            },
                          }}
                        >
                          <LocalActivityIcon />
                        </IconButton>
                      </Tooltip>
                    </AnimatedBadge>

                    {/* Notifications */}
                    <AnimatedBadge
                      badgeContent={totalUnreadMessages}
                      color="secondary"
                      animate={totalUnreadMessages > 0}
                      invisible={totalUnreadMessages === 0}
                    >
                      <IconButton
                        onClick={handleNotificationClick}
                        sx={{
                          color: navTextColor,
                          '&:hover': {
                            backgroundColor: navSoftHoverBackground,
                            color: Colors.raspberry,
                          },
                        }}
                      >
                        <NotificationsIcon />
                      </IconButton>
                    </AnimatedBadge>

                    {/* User Avatar/Menu */}
                    <Box sx={{ ml: 1 }}>
                      <UserMenu
                        color={navTextColor}
                        hoverBackground={navSoftHoverBackground}
                      />
                    </Box>
                  </>
                )}

                {/* Login and Create Account Buttons for Desktop non-authenticated users */}
                {!isLoading && !currentUser && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: { xs: 0.5, md: 1 },
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      component={Link}
                      to="/Login"
                      variant="text"
                      sx={{
                        color: navTextColor,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: { xs: 1.5, md: 3 },
                        fontSize: { xs: '14px', md: '16px' },
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: navSoftHoverBackground,
                          color: Colors.raspberry,
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/signup"
                      variant="contained"
                      sx={{
                        backgroundColor: isLightNavTheme
                          ? Colors.cerulean
                          : 'rgba(255,255,255,0.12)',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: { xs: 1.5, md: 3 },
                        fontSize: { xs: '14px', md: '16px' },
                        minWidth: 'auto',
                        border: `1px solid ${
                          isLightNavTheme
                            ? Colors.cerulean
                            : 'rgba(255,255,255,0.14)'
                        }`,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: Colors.raspberry,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        '&:active': {
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Mobile: Just Hamburger Menu */}
            {isMobile && (
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  color: navTextColor,
                  p: 1,
                  '&:hover': {
                    backgroundColor: navSoftHoverBackground,
                    color: Colors.raspberry,
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{ display: { md: 'none' } }}
      >
        <Box
          sx={{
            width: 280,
            height: '100%',
            backgroundColor: isLightNavTheme ? '#f9f4f0' : 'rgba(7,20,33,0.98)',
            color: navTextColor,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: `1px solid ${navBorderColor}`,
            }}
          >
            <Typography variant="h6" fontWeight={600} color={navTextColor}>
              Menu
            </Typography>
            <IconButton onClick={toggleMobileMenu} sx={{ color: navTextColor }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Profile Section (when logged in) */}
          {!isLoading && currentUser && (
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${navBorderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: Colors.cerulean, width: 40, height: 40 }}>
                {appUser?.firstName?.charAt(0) ||
                  currentUser.email?.charAt(0) ||
                  'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color={navTextColor}
                >
                  {appUser?.firstName && appUser?.lastName
                    ? `${appUser.firstName} ${appUser.lastName}`
                    : currentUser.displayName || currentUser.email}
                </Typography>
                <Typography variant="caption" sx={{ color: navMutedTextColor }}>
                  Member
                </Typography>
              </Box>
            </Box>
          )}

          {/* User Actions for Mobile (when logged in) */}
          {!isLoading && currentUser && (
            <List sx={{ py: 0 }}>
              {totalUnreadMessages > 0 && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleMessageClick();
                      toggleMobileMenu();
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: navSoftHoverBackground,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: navTextColor }}>
                      <Badge badgeContent={totalUnreadMessages} color="primary">
                        <MailIcon />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary="Messages"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: navTextColor,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleEventWalletClick();
                    toggleMobileMenu();
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: navSoftHoverBackground,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: navTextColor }}>
                    <Badge
                      badgeContent={eventWalletCount}
                      color="primary"
                      invisible={eventWalletCount === 0}
                    >
                      <LocalActivityIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary="Tickets & Coupons"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: navTextColor,
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={event => {
                    handleNotificationClick(event);
                    toggleMobileMenu();
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: navSoftHoverBackground,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: navTextColor }}>
                    <Badge
                      badgeContent={totalUnreadMessages}
                      color="secondary"
                      invisible={totalUnreadMessages === 0}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: navTextColor,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          )}

          {/* Navigation Items */}
          <List sx={{ mt: currentUser ? 0 : 1, flex: 1 }}>
            {currentUser && <Divider sx={{ my: 1 }} />}
            {navigationItems.map(item => {
              const isActive = isActiveNavPath(item.path);

              return (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      toggleMobileMenu();
                    }}
                    sx={{
                      backgroundColor: isActive
                        ? navHoverBackground
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: navHoverBackground,
                        '& .MuiListItemIcon-root': {
                          color: Colors.raspberry,
                        },
                        '& .MuiListItemText-primary': {
                          color: Colors.raspberry,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: isActive ? Colors.raspberry : navTextColor }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? Colors.raspberry : navTextColor,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Bottom Section */}
          <Box sx={{ mt: 'auto' }}>
            {/* User Menu Options (when logged in) */}
            {!isLoading && currentUser && (
              <Box
                sx={{
                  borderTop: `1px solid ${navBorderColor}`,
                  p: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <UserMenu
                  color={navTextColor}
                  hoverBackground={navSoftHoverBackground}
                />
              </Box>
            )}

            {/* Authentication Buttons (when not logged in) */}
            {!isLoading && !currentUser && (
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${navBorderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Button
                  component={Link}
                  to="/Login"
                  variant="text"
                  fullWidth
                  onClick={toggleMobileMenu}
                  sx={{
                    color: navTextColor,
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: navSoftHoverBackground,
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  fullWidth
                  onClick={toggleMobileMenu}
                  sx={{
                    backgroundColor: isLightNavTheme
                      ? Colors.cerulean
                      : 'rgba(255,255,255,0.12)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    border: `1px solid ${
                      isLightNavTheme
                        ? Colors.cerulean
                        : 'rgba(255,255,255,0.14)'
                    }`,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: Colors.raspberry,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Notifications Menu */}
      <MuiMenu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)',
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {unreadChats.length > 0 ? (
          unreadChats.slice(0, 5).map(chat => {
            const currentUserId = currentUser?.uid || '';
            const otherParticipantId =
              chat.participants.find(id => id !== currentUserId) || '';
            const unreadForCurrentUser = chat.unreadCount?.[currentUserId] || 0;
            const conversationName =
              chat.propertyName ||
              chat.participantNames?.[otherParticipantId] ||
              'Conversation';

            return (
              <MenuItem
                key={chat.id}
                onClick={() => handleUnreadChatClick(chat.id)}
              >
                <Box sx={{ py: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {conversationName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat.lastMessage || 'New unread message'}
                  </Typography>
                  <Typography variant="caption" color={Colors.raspberry}>
                    {unreadForCurrentUser} unread
                  </Typography>
                </Box>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={handleNotificationClose} disabled>
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                No new messages
              </Typography>
              <Typography variant="caption" color="text.secondary">
                You&apos;re all caught up.
              </Typography>
            </Box>
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            navigate('/MyAccount/Dashboard');
            handleNotificationClose();
          }}
          sx={{ justifyContent: 'center', color: Colors.cerulean }}
        >
          <Typography variant="body2" fontWeight={500}>
            View All Notifications
          </Typography>
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default NavBar;
