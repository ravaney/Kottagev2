import React, { useState } from "react";
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
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Typography,
  Menu as MuiMenu,
  MenuItem,
  Divider
} from "@mui/material";
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Explore as ExploreIcon,
  Event as EventIcon,
  DirectionsCar as CarIcon,
  Restaurant as RestaurantIcon,
  TravelExplore as TravelIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { useUserClaims } from "../../hooks/useUserClaims";
import { AnimatedBadge } from '../common/AnimatedBadge';
import { Colors } from "../constants";
import UserMenu from "./Menu";

const NavBar = () => {
  const { firebaseUser, loading, appUser } = useAuth();
  const { user: claimsUser, loading: claimsLoading } = useUserClaims();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  // Use either firebaseUser from useAuth or claimsUser from useUserClaims
  const currentUser = firebaseUser || claimsUser;
  const isLoading = loading && claimsLoading;

  const handleMessageClick = () => {
    navigate('/MyAccount/Dashboard/messages');
  };
  
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const navigationItems = [
    { label: "Explore", icon: <ExploreIcon />, path: "/Explore" },
    { label: "Excursions", icon: <TravelIcon />, path: "/Excursions" },
    { label: "Events", icon: <EventIcon />, path: "/Events" },
    { label: "Restaurants", icon: <RestaurantIcon />, path: "/Restaurants" },
    { label: "Car Rentals", icon: <CarIcon />, path: "/CarRentals" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          color: "inherit"
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: 64, sm: 70 },
          px: { xs: 1, sm: 2, md: 3 },
          justifyContent: "space-between"
        }}>
          {/* Logo Section */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            flexShrink: 0
          }}>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img 
                src="/blue logo.png" 
                alt="Kottage Logo" 
                style={{ 
                  height: isSmallMobile ? "35px" : isMobile ? "40px" : "55px",
                  width: "auto",
                  objectFit: "contain"
                }}
              />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: { xs: 0.5, sm: 1 },
              flex: 1,
              justifyContent: "center",
              maxWidth: 600,
              minWidth: 0,
              overflow: "hidden"
            }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: Colors.blue,
                    fontWeight: 500,
                    fontSize: { xs: "12px", sm: "13px", md: "14px" },
                    textTransform: "none",
                    px: { xs: 1, sm: 1.5, md: 2 },
                    py: 1,
                    borderRadius: 2,
                    minWidth: "auto",
                    flexShrink: 1,
                    "&:hover": {
                      backgroundColor: `${Colors.blue}10`,
                      transform: "translateY(-1px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 0.5, sm: 1, md: 2 },
            flexShrink: 0,
            justifyContent: "flex-end"
          }}>
            {/* Desktop: User Actions and Auth */}
            {!isMobile && (
              <>
                {/* User Actions for Desktop */}
                {!isLoading && currentUser && (
                  <>
                    {/* Messages */}
                    <AnimatedBadge badgeContent={1} color="primary" animate>
                      <IconButton 
                        onClick={handleMessageClick}
                        sx={{ 
                          color: Colors.blue,
                          "&:hover": { backgroundColor: `${Colors.blue}10` }
                        }}
                      >
                        <MailIcon />
                      </IconButton>
                    </AnimatedBadge>

                    {/* Notifications */}
                    <AnimatedBadge badgeContent={3} color="secondary" animate>
                      <IconButton 
                        onClick={handleNotificationClick}
                        sx={{ 
                          color: Colors.blue,
                          "&:hover": { backgroundColor: `${Colors.blue}10` }
                        }}
                      >
                        <NotificationsIcon />
                      </IconButton>
                    </AnimatedBadge>

                    {/* User Avatar/Menu */}
                    <Box sx={{ ml: 1 }}>
                      <UserMenu />
                    </Box>
                  </>
                )}

                {/* Login and Create Account Buttons for Desktop non-authenticated users */}
                {!isLoading && !currentUser && (
                  <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 }, alignItems: "center" }}>
                    <Button
                      component={Link}
                      to="/Login"
                      variant="text"
                      sx={{
                        color: Colors.blue,
                        textTransform: "none",
                        fontWeight: 500,
                        px: { xs: 1.5, md: 3 },
                        fontSize: { xs: "14px", md: "16px" },
                        minWidth: "auto",
                        "&:hover": {
                          backgroundColor: `${Colors.blue}10`
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/CreateAccount"
                      variant="contained"
                      sx={{
                        backgroundColor: Colors.blue,
                        color: "white",
                        textTransform: "none",
                        fontWeight: 500,
                        px: { xs: 1.5, md: 3 },
                        fontSize: { xs: "14px", md: "16px" },
                        minWidth: "auto",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: Colors.raspberry,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        },
                        "&:active": {
                          boxShadow: "none"
                        }
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
                  color: Colors.blue,
                  p: 1
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
        sx={{ display: { md: "none" } }}
      >
        <Box sx={{ 
          width: 280,
          height: "100%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid rgba(0,0,0,0.08)"
          }}>
            <Typography variant="h6" fontWeight={600} color={Colors.blue}>
              Menu
            </Typography>
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Profile Section (when logged in) */}
          {!isLoading && currentUser && (
            <Box sx={{ 
              p: 2, 
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
              <Avatar sx={{ bgcolor: Colors.blue, width: 40, height: 40 }}>
                {appUser?.firstName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} color={Colors.blue}>
                  {appUser?.firstName && appUser?.lastName 
                    ? `${appUser.firstName} ${appUser.lastName}`
                    : currentUser.displayName || currentUser.email
                  }
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Member
                </Typography>
              </Box>
            </Box>
          )}

          {/* User Actions for Mobile (when logged in) */}
          {!isLoading && currentUser && (
            <List sx={{ py: 0 }}>
              <ListItem 
                button 
                onClick={() => {
                  handleMessageClick();
                  toggleMobileMenu();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: `${Colors.blue}10`
                  }
                }}
              >
                <ListItemIcon sx={{ color: Colors.blue }}>
                  <Badge badgeContent={1} color="primary">
                    <MailIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary="Messages"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: Colors.blue
                  }}
                />
              </ListItem>
              
              <ListItem 
                button 
                onClick={(event) => {
                  handleNotificationClick(event);
                  toggleMobileMenu();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: `${Colors.blue}10`
                  }
                }}
              >
                <ListItemIcon sx={{ color: Colors.blue }}>
                  <Badge badgeContent={3} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary="Notifications"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: Colors.blue
                  }}
                />
              </ListItem>
            </List>
          )}

          {/* Navigation Items */}
          <List sx={{ mt: currentUser ? 0 : 1, flex: 1 }}>
            {currentUser && <Divider sx={{ my: 1 }} />}
            {navigationItems.map((item) => (
              <ListItem 
                button 
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  toggleMobileMenu();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: `${Colors.blue}10`
                  }
                }}
              >
                <ListItemIcon sx={{ color: Colors.blue }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: Colors.blue
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Bottom Section */}
          <Box sx={{ mt: "auto" }}>
            {/* User Menu Options (when logged in) */}
            {!isLoading && currentUser && (
              <Box sx={{ 
                borderTop: "1px solid rgba(0,0,0,0.08)",
                p: 2,
                display: "flex",
                justifyContent: "center"
              }}>
                <UserMenu />
              </Box>
            )}

            {/* Authentication Buttons (when not logged in) */}
            {!isLoading && !currentUser && (
              <Box sx={{ 
                p: 2, 
                borderTop: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 1
              }}>
                <Button
                  component={Link}
                  to="/Login"
                  variant="text"
                  fullWidth
                  onClick={toggleMobileMenu}
                  sx={{
                    color: Colors.blue,
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: `${Colors.blue}10`
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/CreateAccount"
                  variant="contained"
                  fullWidth
                  onClick={toggleMobileMenu}
                  sx={{
                    backgroundColor: Colors.blue,
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    py: 1.5,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: Colors.raspberry,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }
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
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              New booking request
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mountain Cabin - 2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Payment received
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Beach House booking - 5 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              New review posted
            </Typography>
            <Typography variant="caption" color="text.secondary">
              City Loft - 1 day ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            navigate('/MyAccount/Dashboard');
            handleNotificationClose();
          }}
          sx={{ justifyContent: 'center', color: Colors.blue }}
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
