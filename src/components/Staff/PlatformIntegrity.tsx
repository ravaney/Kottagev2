import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Badge,
  Alert,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  NavigateNext as NavigateNextIcon,
  Notifications as NotificationsIcon,
  Flag as FlagIcon,
  Block as BlockIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as ApproveIcon,
  Report as ReportIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FlaggedItem {
  id: number;
  type: 'user' | 'property' | 'booking';
  title: string;
  description: string;
  reportedBy: string;
  date: string;
  status: 'pending' | 'investigating' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  details: any;
}

// Mock data for flagged items
const mockFlaggedItems: FlaggedItem[] = [
  {
    id: 1,
    type: 'user',
    title: 'Suspicious User Activity - Multiple Accounts',
    description: 'User appears to be creating multiple accounts with similar details and booking patterns',
    reportedBy: 'Automated System',
    date: '2024-01-15',
    status: 'pending',
    priority: 'high',
    flags: ['Multiple accounts', 'Fraud suspicion'],
    details: {
      userId: 'user123',
      userName: 'John Doe',
      email: 'john@example.com',
      accountsFound: 3,
      similarBookings: 5
    }
  },
  {
    id: 2,
    type: 'property',
    title: 'Duplicate Property Listing',
    description: 'Same property appears to be listed multiple times with different hosts',
    reportedBy: 'Sarah Johnson',
    date: '2024-01-14',
    status: 'investigating',
    priority: 'medium',
    flags: ['Duplicate listing', 'Verification needed'],
    details: {
      propertyId: 'prop456',
      propertyName: 'Ocean View Apartment',
      duplicateCount: 2,
      hosts: ['Host A', 'Host B']
    }
  },
  {
    id: 3,
    type: 'booking',
    title: 'Fake Booking Pattern Detected',
    description: 'Multiple bookings made and cancelled to inflate review scores',
    reportedBy: 'Automated System',
    date: '2024-01-13',
    status: 'escalated',
    priority: 'critical',
    flags: ['Fake bookings', 'Review manipulation'],
    details: {
      bookingIds: ['book1', 'book2', 'book3'],
      pattern: 'Book and cancel within 24h',
      frequency: 'Weekly'
    }
  },
  {
    id: 4,
    type: 'user',
    title: 'Reported Inappropriate Behavior',
    description: 'Host reported for inappropriate communication and demands',
    reportedBy: 'Guest User',
    date: '2024-01-12',
    status: 'resolved',
    priority: 'high',
    flags: ['Inappropriate behavior', 'Policy violation'],
    details: {
      userId: 'host789',
      userName: 'Mike Wilson',
      violations: ['Harassment', 'Unauthorized charges']
    }
  }
];

export default function PlatformIntegrity() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return '#4caf50';
      case 'investigating': return '#ff9800';
      case 'escalated': return '#f44336';
      case 'pending': return '#2196f3';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#1976d2';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'user': return <PersonIcon />;
      case 'property': return <HomeIcon />;
      case 'booking': return <ScheduleIcon />;
      default: return <ReportIcon />;
    }
  };

  const filteredItems = () => {
    switch(currentTab) {
      case 0: return mockFlaggedItems.filter(item => item.status === 'pending');
      case 1: return mockFlaggedItems.filter(item => item.status === 'investigating');
      case 2: return mockFlaggedItems.filter(item => item.status === 'escalated');
      case 3: return mockFlaggedItems.filter(item => item.status === 'resolved');
      default: return mockFlaggedItems;
    }
  };

  const handleInvestigate = (item: FlaggedItem) => {
    console.log('Starting investigation for:', item.id);
    // Update status logic here
  };

  const handleResolve = (item: FlaggedItem) => {
    setSelectedItem(item);
    setActionDialogOpen(true);
  };

  const handleEscalate = (item: FlaggedItem) => {
    console.log('Escalating item:', item.id);
    // Escalation logic here
  };

  const handleSaveAction = () => {
    console.log('Saving action:', actionNotes, 'for item:', selectedItem?.id);
    setActionDialogOpen(false);
    setActionNotes('');
    setSelectedItem(null);
  };

  const tabCounts = {
    pending: mockFlaggedItems.filter(item => item.status === 'pending').length,
    investigating: mockFlaggedItems.filter(item => item.status === 'investigating').length,
    escalated: mockFlaggedItems.filter(item => item.status === 'escalated').length,
    resolved: mockFlaggedItems.filter(item => item.status === 'resolved').length
  };

  // Stats for the dashboard
  const stats = {
    totalFlags: mockFlaggedItems.length,
    highPriority: mockFlaggedItems.filter(item => item.priority === 'high' || item.priority === 'critical').length,
    resolved: mockFlaggedItems.filter(item => item.status === 'resolved').length,
    resolutionRate: Math.round((mockFlaggedItems.filter(item => item.status === 'resolved').length / mockFlaggedItems.length) * 100)
  };

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Button 
                color="inherit" 
                onClick={() => navigate('/dashboard')}
                sx={{ textTransform: 'none', fontWeight: 400 }}
              >
                Dashboard
              </Button>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <SecurityIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Platform Integrity & Trust
              </Typography>
            </Breadcrumbs>
          </Box>
          <IconButton color="inherit" size="small">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Header */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Platform Integrity & Trust
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Monitor flagged users, properties, and investigate fraud to maintain platform trust
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={600}>
                    {stats.totalFlags}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Flags
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="error" fontWeight={600}>
                    {stats.highPriority}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    High Priority
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    {stats.resolved}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Resolved
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    {stats.resolutionRate}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Resolution Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.resolutionRate} 
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Investigation Tabs */}
        <Paper sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.pending} color="primary">
                    Pending Review
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.investigating} color="warning">
                    Investigating
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.escalated} color="error">
                    Escalated
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={tabCounts.resolved} color="success">
                    Resolved
                  </Badge>
                } 
              />
            </Tabs>
          </Box>

          {/* Flagged Items List */}
          <List sx={{ p: 0 }}>
            {filteredItems().map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: getPriorityColor(item.priority) }}>
                      {getTypeIcon(item.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Chip 
                          label={item.type.toUpperCase()}
                          size="small"
                          color={item.type === 'user' ? 'primary' : item.type === 'property' ? 'secondary' : 'default'}
                        />
                        <Chip 
                          label={item.priority.toUpperCase()}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getPriorityColor(item.priority)}15`,
                            color: getPriorityColor(item.priority),
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          label={item.status.toUpperCase()}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getStatusColor(item.status)}15`,
                            color: getStatusColor(item.status)
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {item.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                          Reported by: {item.reportedBy} • {item.date}
                        </Typography>
                        {item.flags.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                            {item.flags.map((flag, idx) => (
                              <Chip 
                                key={idx}
                                label={flag}
                                size="small"
                                icon={<FlagIcon />}
                                color="error"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          {item.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                startIcon={<AssessmentIcon />}
                                onClick={() => handleInvestigate(item)}
                                sx={{ color: '#ff9800' }}
                              >
                                Start Investigation
                              </Button>
                              <Button
                                size="small"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleResolve(item)}
                                sx={{ color: '#4caf50' }}
                              >
                                Mark Resolved
                              </Button>
                            </>
                          )}
                          {item.status === 'investigating' && (
                            <>
                              <Button
                                size="small"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleResolve(item)}
                                sx={{ color: '#4caf50' }}
                              >
                                Resolve
                              </Button>
                              <Button
                                size="small"
                                startIcon={<WarningIcon />}
                                onClick={() => handleEscalate(item)}
                                sx={{ color: '#f44336' }}
                              >
                                Escalate
                              </Button>
                            </>
                          )}
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            sx={{ color: '#1976d2' }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="small"
                            startIcon={<BlockIcon />}
                            sx={{ color: '#f44336' }}
                          >
                            Take Action
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredItems().length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Resolve Case - {selectedItem?.title}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please provide detailed notes about your investigation and resolution.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter resolution notes and actions taken..."
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAction} variant="contained">Save Resolution</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
