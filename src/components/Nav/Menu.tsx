import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import React from 'react';
import { auth } from '../../firebase';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@fluentui/react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineManageAccounts } from 'react-icons/md';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSignOut } from '../../hooks/useSignOut';
import { useAuth } from '../../hooks';

export default function CommandMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOutMutation = useSignOut();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOutMutation.mutateAsync();
    navigate('/');
  };

  const { appUser } = useAuth();
  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{
          color: 'black',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: 'transparent',
        }}
      >
        <MdOutlineManageAccounts />
      </IconButton>
      <Menu
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            minWidth: 220,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)',
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            src={auth?.currentUser?.photoURL as string}
            sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            {appUser?.firstName} {appUser?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {auth?.currentUser?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem component={Link} to="/MyAccount" onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>

        <MenuItem
          component={Link}
          onClick={handleClose}
          to="/MyAccount/Settings"
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HelpCenterIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help Center</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
