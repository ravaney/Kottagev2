import { Box, Paper, Tabs, Tab, Typography, Divider, Button, List, ListItem, ListItemIcon, ListItemText, Switch, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { Colors } from "../constants";
import PageHeader from '../common/PageHeader';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import DescriptionIcon from '@mui/icons-material/Description';
import DocumentationViewer from './DocumentationViewer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications(prev => ({
      ...prev,
      [type]: event.target.checked
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader 
        title="Settings"
        subtitle="Configure your account preferences and settings"
        icon={<SettingsIcon sx={{ color: Colors.blue, fontSize: 32 }} />}
      />
      
      <Paper sx={{ mt: 1, borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 48,
                fontSize: '0.9rem'
              }
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Account" {...a11yProps(0)} />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" {...a11yProps(1)} />
            <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" {...a11yProps(2)} />
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Dev Documents" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* Account Settings */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom color={Colors.blue}>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Email Address" 
                secondary="Update your email address"
              />
              <Button variant="outlined" size="small">
                Change
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Phone Number" 
                secondary="Update your phone number"
              />
              <Button variant="outlined" size="small">
                Change
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Delete Account" 
                secondary="Permanently delete your account and all data"
              />
              <Button variant="outlined" color="error" size="small">
                Delete
              </Button>
            </ListItem>
          </List>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom color={Colors.blue}>
            Security & Privacy
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <LockIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Password" 
                secondary="Change your account password"
              />
              <Button variant="outlined" size="small">
                Change
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Two-Factor Authentication" 
                secondary="Add an extra layer of security"
              />
              <Button variant="outlined" size="small">
                Enable
              </Button>
            </ListItem>
          </List>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom color={Colors.blue}>
            Notification Preferences
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Email Notifications" 
                secondary="Receive notifications via email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={handleNotificationChange('email')}
                    color="primary"
                  />
                }
                label=""
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Push Notifications" 
                secondary="Receive push notifications in browser"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={handleNotificationChange('push')}
                    color="primary"
                  />
                }
                label=""
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Marketing Emails" 
                secondary="Receive promotional and marketing emails"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.marketing}
                    onChange={handleNotificationChange('marketing')}
                    color="primary"
                  />
                }
                label=""
              />
            </ListItem>
          </List>
        </TabPanel>

        {/* Dev Documents */}
        <TabPanel value={tabValue} index={3}>
          <DocumentationViewer />
        </TabPanel>
      </Paper>
    </Box>
  );
}
