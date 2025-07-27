import React from 'react';
import { Box, Typography, Divider, Tabs, Tab, Badge } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import { Colors } from '../constants';
import { useAuth } from '../../hooks';
import { useChat } from '../../contexts/ChatContext';

export default function DashboardMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appUser, firebaseUser } = useAuth();
  const { chats } = useChat();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate total unread messages
  const totalUnreadMessages = chats.reduce((total, chat) => {
    const currentUserId = firebaseUser?.uid || '';
    return total + (chat.unreadCount?.[currentUserId] || 0);
  }, 0);
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('action-center')) return 1;
    if (path.includes('messages')) return 2;
    if (path.includes('reservations')) return 3;
    if (path.includes('properties')) return 4;
    return 0; // Default to Home
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const routes = [
      '/MyAccount/Dashboard',
      '/MyAccount/Dashboard/action-center',
      '/MyAccount/Dashboard/messages',
      '/MyAccount/Dashboard/reservations',
      '/MyAccount/Dashboard/properties'
    ];
    navigate(routes[newValue]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        p: 3, 
        mb: 0, 
        pb:0,
        position: 'sticky', 
        top: 60, 
        backgroundColor: 'white', 
        zIndex: 100,
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <DashboardIcon sx={{ color: Colors.blue, fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight={700} color={Colors.blue} sx={{ lineHeight: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Property Management Overview
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
        
        <Box sx={{ mt: 0 }}>
          <Tabs 
            value={getActiveTab()} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.9rem'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: Colors.blue,
                height: 3
              }
            }}
          >
            <Tab 
              icon={<HomeIcon sx={{ fontSize: 20 }} />} 
              label="Home" 
              iconPosition="start"
              sx={{ color: getActiveTab() === 0 ? Colors.blue : 'text.secondary' }}
            />
            <Tab 
              icon={
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                  <NotificationsIcon sx={{ fontSize: 20 }} />
                </Badge>
              } 
              label="Action Center" 
              iconPosition="start"
              sx={{ color: getActiveTab() === 1 ? Colors.blue : 'text.secondary' }}
            />
            <Tab 
              icon={
                <Badge badgeContent={totalUnreadMessages} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                  <MessageIcon sx={{ fontSize: 20 }} />
                </Badge>
              } 
              label="Messages" 
              iconPosition="start"
              sx={{ color: getActiveTab() === 2 ? Colors.blue : 'text.secondary' }}
            />
            <Tab 
              icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />} 
              label="Manage Reservations" 
              iconPosition="start"
              sx={{ color: getActiveTab() === 3 ? Colors.blue : 'text.secondary' }}
            />
            <Tab 
              icon={<HolidayVillageIcon sx={{ fontSize: 20 }} />} 
              label="Property Management" 
              iconPosition="start"
              sx={{ color: getActiveTab() === 4 ? Colors.blue : 'text.secondary' }}
            />
          </Tabs>
        </Box>
      </Box>
      
      <Box sx={{ p: 0, pt: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}