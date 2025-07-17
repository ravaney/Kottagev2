import { Label, Stack } from "@fluentui/react";
import { Avatar, Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Breadcrumbs } from "@mui/material";
import { auth } from "../../firebase";
import { Colors } from "../constants";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import LuggageIcon from "@mui/icons-material/Luggage";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";

export default function Sidebar() {
  const { appUser } = useAuth();
  const location = useLocation();
  
  const menuItems = [
    { path: "/MyAccount/Dashboard", icon: DashboardIcon, label: "Dashboard" },
    { path: "/MyAccount/Profile", icon: AccountBoxIcon, label: "My Account" },
    { path: "/MyAccount/MyKottages", icon: HolidayVillageIcon, label: "My Properties" },
    { path: "/MyAccount/MyBookings", icon: LuggageIcon, label: "My Bookings" },
    { path: "/MyAccount/Favourites", icon: FavoriteIcon, label: "Favourites" },
    { path: "/MyAccount/Settings", icon: SettingsIcon, label: "Settings" }
  ];
  
  const getCurrentPageLabel = () => {
    const currentItem = menuItems.find(item => location.pathname.startsWith(item.path));
    return currentItem ? currentItem.label : "My Account";
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: 280, 
        height: "calc(100vh - 60px)", 
        borderRadius: 0,
        background: `linear-gradient(135deg, ${Colors.offWhite} 0%, #ffffff 100%)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: "60px",
        left: 0,
        zIndex: 100
      }}
    >
      <Box sx={{ p: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ color: Colors.blue, textDecoration: "none", display: "flex", alignItems: "center" }}>
            <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" color={Colors.blue}>Kottage</Typography>
          </Link>
          <Typography variant="body2" color={Colors.raspberry} fontWeight={600}>
            {getCurrentPageLabel()}
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{ 
              width: 120, 
              height: 120, 
              mx: "auto",
              mb: 2,
              border: `4px solid ${Colors.blue}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
            }}
            src={auth.currentUser?.photoURL as string}
          />
          <Typography variant="h6" fontWeight={600} color={Colors.blue}>
            {appUser?.firstName || "User"}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              wordBreak: "break-word",
              overflowWrap: "break-word",
              px: 1
            }}
          >
            {appUser?.email}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
      </Box>
      
      <List sx={{ px: 2, pb: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActive ? Colors.blue : "transparent",
                color: isActive ? "white" : "inherit",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isActive ? Colors.blue : `${Colors.blue}15`,
                  transform: "translateX(4px)"
                },
                textDecoration: "none"
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon 
                  sx={{ 
                    color: isActive ? "white" : (item.label === "Favourites" ? Colors.raspberry : Colors.blue),
                    fontSize: 22
                  }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.95rem"
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
