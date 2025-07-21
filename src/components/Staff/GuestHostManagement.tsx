import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Rating,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import MessageIcon from '@mui/icons-material/Message';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import HomeIcon from '@mui/icons-material/Home';
import SupportIcon from '@mui/icons-material/Support';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Mock data for users (guests and hosts)
const users = [
  {
    id: 'USR-1001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-876-555-0123',
    avatar: '/api/placeholder/40/40',
    type: 'guest',
    joinDate: '2023-01-15',
    status: 'active',
    verified: true,
    location: 'Kingston, Jamaica',
    totalBookings: 12,
    totalSpent: 8450,
    rating: 4.8,
    lastActive: '2024-07-18',
    issues: null,
    documents: {
      idVerified: true,
      phoneVerified: true,
      emailVerified: true
    }
  },
  {
    id: 'USR-1002',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-876-555-0124',
    avatar: '/api/placeholder/40/40',
    type: 'host',
    joinDate: '2022-08-20',
    status: 'active',
    verified: true,
    location: 'Negril, Jamaica',
    totalProperties: 3,
    totalEarnings: 45000,
    rating: 4.9,
    lastActive: '2024-07-19',
    issues: null,
    documents: {
      idVerified: true,
      phoneVerified: true,
      emailVerified: true,
      businessLicense: true
    }
  },
  {
    id: 'USR-1003',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-876-555-0125',
    avatar: '/api/placeholder/40/40',
    type: 'host',
    joinDate: '2023-03-10',
    status: 'pending_verification',
    verified: false,
    location: 'Blue Mountains, Jamaica',
    totalProperties: 1,
    totalEarnings: 3200,
    rating: 4.5,
    lastActive: '2024-07-17',
    issues: 'verification_needed',
    documents: {
      idVerified: false,
      phoneVerified: true,
      emailVerified: true,
      businessLicense: false
    }
  },
  {
    id: 'USR-1004',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-876-555-0126',
    avatar: '/api/placeholder/40/40',
    type: 'guest',
    joinDate: '2023-06-05',
    status: 'suspended',
    verified: true,
    location: 'Montego Bay, Jamaica',
    totalBookings: 3,
    totalSpent: 1200,
    rating: 3.2,
    lastActive: '2024-07-10',
    issues: 'multiple_complaints',
    documents: {
      idVerified: true,
      phoneVerified: true,
      emailVerified: true
    }
  },
  {
    id: 'USR-1005',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1-876-555-0127',
    avatar: '/api/placeholder/40/40',
    type: 'host',
    joinDate: '2023-11-12',
    status: 'active',
    verified: true,
    location: 'Ocho Rios, Jamaica',
    totalProperties: 2,
    totalEarnings: 12500,
    rating: 4.7,
    lastActive: '2024-07-18',
    issues: null,
    documents: {
      idVerified: true,
      phoneVerified: true,
      emailVerified: true,
      businessLicense: true
    }
  }
];

// Mock support tickets
const supportTickets = [
  {
    id: 'SUP-1001',
    userId: 'USR-1001',
    userName: 'John Smith',
    subject: 'Login Issues',
    category: 'account',
    priority: 'medium',
    status: 'open',
    created: '2024-07-19T10:00:00Z',
    lastReply: '2024-07-19T10:30:00Z',
    messages: [
      {
        id: '1',
        sender: 'user',
        message: 'I cannot log into my account. It says my password is incorrect but I know it\'s right.',
        timestamp: '2024-07-19T10:00:00Z'
      },
      {
        id: '2',
        sender: 'staff',
        message: 'Hi John, I can help you with that. Let me check your account status and we can reset your password if needed.',
        timestamp: '2024-07-19T10:30:00Z'
      }
    ]
  },
  {
    id: 'SUP-1002',
    userId: 'USR-1003',
    userName: 'David Wilson',
    subject: 'Verification Documents',
    category: 'verification',
    priority: 'high',
    status: 'pending',
    created: '2024-07-18T14:00:00Z',
    lastReply: '2024-07-18T14:00:00Z',
    messages: [
      {
        id: '1',
        sender: 'user',
        message: 'I uploaded my ID and business license but they haven\'t been verified yet. How long does this usually take?',
        timestamp: '2024-07-18T14:00:00Z'
      }
    ]
  }
];

// FAQ categories and questions
const faqCategories = [
  {
    category: 'Account & Login',
    questions: [
      {
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking "Forgot Password" on the login page and following the instructions sent to your email.'
      },
      {
        question: 'How do I verify my account?',
        answer: 'To verify your account, upload a valid government-issued ID and complete phone verification through the verification section in your profile.'
      }
    ]
  },
  {
    category: 'Bookings & Payments',
    questions: [
      {
        question: 'When will I be charged for my booking?',
        answer: 'You will be charged immediately upon booking confirmation. Refunds are subject to the property\'s cancellation policy.'
      },
      {
        question: 'How do I cancel my booking?',
        answer: 'You can cancel your booking through your account dashboard under "My Bookings" or by contacting our support team.'
      }
    ]
  },
  {
    category: 'Host Requirements',
    questions: [
      {
        question: 'What documents do I need to become a host?',
        answer: 'You need a valid government ID, property ownership documents, and a business license if applicable in your area.'
      },
      {
        question: 'How long does property verification take?',
        answer: 'Property verification typically takes 2-5 business days after all required documents are submitted.'
      }
    ]
  }
];

export default function GuestHostManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<any>(null);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleViewProfile = (user: any) => {
    setSelectedUserData(user);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleSendMessage = (user: any) => {
    setSelectedUserData(user);
    setChatDialogOpen(true);
    handleMenuClose();
  };

  const handleVerifyUser = (user: any) => {
    setSelectedUserData(user);
    setVerificationDialogOpen(true);
    handleMenuClose();
  };

  const handleSupportTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setSupportDialogOpen(true);
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedTicket) {
      // Add message to ticket
      const updatedTicket = {
        ...selectedTicket,
        messages: [
          ...selectedTicket.messages,
          {
            id: Date.now().toString(),
            sender: 'staff',
            message: newMessage,
            timestamp: new Date().toISOString()
          }
        ]
      };
      setSelectedTicket(updatedTicket);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#388e3c';
      case 'pending_verification': return '#f57c00';
      case 'suspended': return '#d32f2f';
      default: return '#757575';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'host': return '#1976d2';
      case 'guest': return '#7b1fa2';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  // Filter users based on tab, search term, and filters
  const filteredUsers = users.filter(user => {
    // Apply tab filter
    if (tabValue === 1 && user.type !== 'guest') return false;
    if (tabValue === 2 && user.type !== 'host') return false;
    if (tabValue === 3 && !user.issues) return false;
    
    // Apply type filter
    if (filterType !== 'all' && user.type !== filterType) return false;
    
    // Apply status filter
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.id.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link 
                color="inherit" 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                sx={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'text.secondary'
                }}
              >
                <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Dashboard
              </Link>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <PeopleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Guest & Host Management
              </Typography>
            </Breadcrumbs>
          </Box>
          <IconButton color="inherit" size="small">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ p: 3, flexGrow: 1, backgroundColor: '#f5f5f5' }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Guest & Host Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage user profiles, handle support requests, and assist with verification issues.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SupportIcon />}
              onClick={() => setSupportDialogOpen(true)}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5
              }}
            >
              Support Inbox
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<HelpIcon />}
              onClick={() => setFaqDialogOpen(true)}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5
              }}
            >
              FAQ Management
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<VerifiedIcon />}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5
              }}
            >
              Verification Queue
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ChatIcon />}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': { borderColor: '#1565c0', backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5
              }}
            >
              Live Chat
            </Button>
          </Grid>
        </Grid>

        {/* Users Table */}
        <Paper sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Table Header with Tabs, Search and Filters */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTab-root': { 
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 100
                },
                '& .MuiTabs-indicator': { backgroundColor: '#1976d2' }
              }}
            >
              <Tab label="All Users" />
              <Tab label="Guests" />
              <Tab label="Hosts" />
              <Tab label="Issues" />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="guest">Guest</MenuItem>
                  <MenuItem value="host">Host</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending_verification">Pending</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              <TextField
                placeholder="Search users..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>

          {/* Table Content */}
          <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Activity</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      backgroundColor: user.issues ? 'rgba(255, 152, 0, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            user.verified ? (
                              <VerifiedIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                            ) : null
                          }
                        >
                          <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                        </Badge>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.id}
                          </Typography>
                        </Box>
                        {user.issues && <WarningIcon fontSize="small" sx={{ color: '#f57c00' }} />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.type} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${getTypeColor(user.type)}15`,
                          color: getTypeColor(user.type),
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{user.email}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status.replace('_', ' ')} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${getStatusColor(user.status)}15`,
                          color: getStatusColor(user.status),
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#ffa726' }} />
                        <Typography variant="body2">{user.rating}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {user.lastActive}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%', mt: 1 }
        }}
      >
        <MenuItem onClick={() => {
          const user = users.find(u => u.id === selectedUser);
          if (user) handleViewProfile(user);
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          const user = users.find(u => u.id === selectedUser);
          if (user) handleSendMessage(user);
        }}>
          <ListItemIcon>
            <MessageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Message</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          const user = users.find(u => u.id === selectedUser);
          if (user) handleVerifyUser(user);
        }}>
          <ListItemIcon>
            <VerifiedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Verify User</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Suspend User</ListItemText>
        </MenuItem>
      </Menu>

      {/* View Profile Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">User Profile</Typography>
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUserData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar 
                      src={selectedUserData.avatar} 
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} 
                    />
                    <Typography variant="h6" gutterBottom>
                      {selectedUserData.name}
                    </Typography>
                    <Chip 
                      label={selectedUserData.type}
                      color={selectedUserData.type === 'host' ? 'primary' : 'secondary'}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                      <StarIcon sx={{ color: '#ffa726' }} />
                      <Typography variant="h6">{selectedUserData.rating}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Joined {selectedUserData.joinDate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography>{selectedUserData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography>{selectedUserData.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography>{selectedUserData.location}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Verification Status</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {selectedUserData.documents.emailVerified ? 
                          <CheckCircleIcon sx={{ color: '#388e3c' }} /> : 
                          <WarningIcon sx={{ color: '#f57c00' }} />
                        }
                        <Typography>Email</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {selectedUserData.documents.phoneVerified ? 
                          <CheckCircleIcon sx={{ color: '#388e3c' }} /> : 
                          <WarningIcon sx={{ color: '#f57c00' }} />
                        }
                        <Typography>Phone</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {selectedUserData.documents.idVerified ? 
                          <CheckCircleIcon sx={{ color: '#388e3c' }} /> : 
                          <WarningIcon sx={{ color: '#f57c00' }} />
                        }
                        <Typography>ID Document</Typography>
                      </Box>
                    </Grid>
                    {selectedUserData.type === 'host' && (
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {selectedUserData.documents.businessLicense ? 
                            <CheckCircleIcon sx={{ color: '#388e3c' }} /> : 
                            <WarningIcon sx={{ color: '#f57c00' }} />
                          }
                          <Typography>Business License</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>Statistics</Typography>
                  {selectedUserData.type === 'guest' ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Total Bookings</Typography>
                        <Typography variant="h6">{selectedUserData.totalBookings}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Total Spent</Typography>
                        <Typography variant="h6">${selectedUserData.totalSpent}</Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Properties</Typography>
                        <Typography variant="h6">{selectedUserData.totalProperties}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Total Earnings</Typography>
                        <Typography variant="h6">${selectedUserData.totalEarnings}</Typography>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<MessageIcon />}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Support Inbox Dialog */}
      <Dialog
        open={supportDialogOpen}
        onClose={() => setSupportDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Support Inbox</Typography>
            <IconButton onClick={() => setSupportDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Active Tickets</Typography>
              <List>
                {supportTickets.map((ticket) => (
                  <ListItem key={ticket.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleSupportTicket(ticket)}
                      selected={selectedTicket?.id === ticket.id}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {ticket.userName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={ticket.subject}
                        secondary={
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              {ticket.userName}
                            </Typography>
                            <Chip 
                              label={ticket.priority}
                              size="small"
                              sx={{ 
                                ml: 1,
                                backgroundColor: `${getPriorityColor(ticket.priority)}15`,
                                color: getPriorityColor(ticket.priority),
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={8}>
              {selectedTicket ? (
                <Box>
                  <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, mb: 2 }}>
                    <Typography variant="h6">{selectedTicket.subject}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedTicket.userName} • {selectedTicket.category}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                    {selectedTicket.messages.map((message: any) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          flexDirection: message.sender === 'staff' ? 'row-reverse' : 'row',
                          mb: 2
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            backgroundColor: message.sender === 'staff' ? '#1976d2' : '#f5f5f5',
                            color: message.sender === 'staff' ? 'white' : 'inherit'
                          }}
                        >
                          <Typography variant="body2">
                            {message.message}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                            {new Date(message.timestamp).toLocaleString()}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="textSecondary">
                    Select a ticket to view conversation
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* FAQ Management Dialog */}
      <Dialog
        open={faqDialogOpen}
        onClose={() => setFaqDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">FAQ Management</Typography>
            <IconButton onClick={() => setFaqDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {faqCategories.map((category, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{category.category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {category.questions.map((faq, faqIndex) => (
                  <Box key={faqIndex} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Q: {faq.question}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      A: {faq.answer}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFaqDialogOpen(false)}>Close</Button>
          <Button variant="contained">Add New FAQ</Button>
        </DialogActions>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Manual Verification</DialogTitle>
        <DialogContent>
          {selectedUserData && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Manually verify documents for {selectedUserData.name}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedUserData.documents.emailVerified} />}
                  label="Email Verified"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedUserData.documents.phoneVerified} />}
                  label="Phone Verified"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedUserData.documents.idVerified} />}
                  label="ID Document Verified"
                />
              </Box>
              {selectedUserData.type === 'host' && (
                <Box>
                  <FormControlLabel
                    control={<Switch defaultChecked={selectedUserData.documents.businessLicense} />}
                    label="Business License Verified"
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success">
            Update Verification
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
