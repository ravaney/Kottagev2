import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Colors } from '../constants';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  lastActive: string;
  assignments: string[];
}

const mockStaffData: Staff[] = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john@yaad.com', 
    phone: '+1-876-123-4567',
    role: 'Property Manager', 
    status: 'Active',
    joinDate: '2023-01-15',
    lastActive: '2024-01-18',
    assignments: ['Kingston', 'St. Andrew']
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    email: 'sarah@yaad.com', 
    phone: '+1-876-234-5678',
    role: 'Customer Support', 
    status: 'Active',
    joinDate: '2023-03-22',
    lastActive: '2024-01-18',
    assignments: ['Jamaica North Coast']
  },
  { 
    id: 3, 
    name: 'Michael Brown', 
    email: 'michael@yaad.com', 
    phone: '+1-876-345-6789',
    role: 'Regional Supervisor', 
    status: 'Active',
    joinDate: '2022-11-10',
    lastActive: '2024-01-17',
    assignments: ['Blue Mountains Region']
  },
  { 
    id: 4, 
    name: 'Lisa Davis', 
    email: 'lisa@yaad.com', 
    phone: '+1-876-456-7890',
    role: 'Operations Manager', 
    status: 'Active',
    joinDate: '2023-05-08',
    lastActive: '2024-01-18',
    assignments: ['St. James']
  },
  { 
    id: 5, 
    name: 'Robert Wilson', 
    email: 'robert@yaad.com', 
    phone: '+1-876-567-8901',
    role: 'Property Coordinator', 
    status: 'Inactive',
    joinDate: '2023-07-12',
    lastActive: '2024-01-10',
    assignments: []
  },
];

const staffRoles = [
  'Property Manager',
  'Customer Support',
  'Regional Supervisor',
  'Operations Manager',
  'Property Coordinator',
  'Maintenance Supervisor',
  'Guest Relations',
  'Financial Coordinator'
];

export default function StaffManagement() {
  const [staffData, setStaffData] = useState<Staff[]>(mockStaffData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStaffId, setMenuStaffId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'Active' as Staff['status']
  });

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'Active'
    });
    setDialogOpen(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      status: staff.status
    });
    setDialogOpen(true);
  };

  const handleSaveStaff = () => {
    if (!formData.name || !formData.email || !formData.role) return;

    if (selectedStaff) {
      // Edit existing staff
      setStaffData(staffData.map(staff => 
        staff.id === selectedStaff.id 
          ? { ...staff, ...formData }
          : staff
      ));
    } else {
      // Add new staff
      const newStaff: Staff = {
        id: Math.max(...staffData.map(s => s.id)) + 1,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        assignments: []
      };
      setStaffData([...staffData, newStaff]);
    }

    setDialogOpen(false);
  };

  const handleDeleteStaff = (id: number) => {
    setStaffData(staffData.filter(staff => staff.id !== id));
    handleCloseMenu();
  };

  const handleStatusChange = (id: number, status: Staff['status']) => {
    setStaffData(staffData.map(staff => 
      staff.id === id ? { ...staff, status } : staff
    ));
    handleCloseMenu();
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, staffId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuStaffId(staffId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuStaffId(null);
  };

  const getStatusColor = (status: Staff['status']) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Suspended': return 'error';
      default: return 'default';
    }
  };

  const getStaffByStatus = (status: Staff['status']) => {
    return staffData.filter(staff => staff.status === status);
  };

  const filteredStaff = tabValue === 0 ? staffData : 
                      tabValue === 1 ? getStaffByStatus('Active') :
                      tabValue === 2 ? getStaffByStatus('Inactive') :
                      getStaffByStatus('Suspended');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color={Colors.blue} gutterBottom>
          Staff Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage staff members, their roles, and access permissions across the platform.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color={Colors.blue}>
              {staffData.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Staff
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color="#4caf50">
              {getStaffByStatus('Active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Staff
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color="#ff9800">
              {getStaffByStatus('Inactive').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inactive Staff
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color={Colors.raspberry}>
              {getStaffByStatus('Suspended').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suspended Staff
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ borderRadius: 3 }}>
        {/* Header with Add Button */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Staff Directory
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddStaff}
              sx={{
                backgroundColor: Colors.blue,
                '&:hover': { backgroundColor: Colors.raspberry }
              }}
            >
              Add Staff Member
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Staff" />
            <Tab label="Active" />
            <Tab label="Inactive" />
            <Tab label="Suspended" />
          </Tabs>
        </Box>

        {/* Staff Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Staff Member</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Assignments</strong></TableCell>
                <TableCell><strong>Last Active</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: Colors.blue, width: 40, height: 40 }}>
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {staff.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Joined {new Date(staff.joinDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={staff.role} 
                      size="small" 
                      sx={{ backgroundColor: '#e3f2fd', color: Colors.blue }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{staff.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{staff.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={staff.status} 
                      size="small" 
                      color={getStatusColor(staff.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {staff.assignments.map((assignment, index) => (
                        <Chip
                          key={index}
                          label={assignment}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                          icon={<LocationOnIcon sx={{ fontSize: '12px !important' }} />}
                        />
                      ))}
                      {staff.assignments.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                          No assignments
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(staff.lastActive).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStaff(staff)}
                        sx={{ color: Colors.blue }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, staff.id)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredStaff.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No staff members found in this category.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Staff Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1-876-XXX-XXXX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  {staffRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Staff['status'] })}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {!selectedStaff && (
            <Alert severity="info" sx={{ mt: 2 }}>
              New staff members will receive an email invitation to set up their account and access the platform.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveStaff}
            variant="contained"
            sx={{
              backgroundColor: Colors.blue,
              '&:hover': { backgroundColor: Colors.raspberry }
            }}
          >
            {selectedStaff ? 'Update' : 'Add'} Staff
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {menuStaffId && (
          <>
            <MenuItem onClick={() => {
              const staff = staffData.find(s => s.id === menuStaffId);
              if (staff && staff.status !== 'Active') {
                handleStatusChange(menuStaffId, 'Active');
              }
            }}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Activate</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (menuStaffId) {
                handleStatusChange(menuStaffId, 'Suspended');
              }
            }}>
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Suspend</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (menuStaffId) {
                handleDeleteStaff(menuStaffId);
              }
            }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </Container>
  );
}
