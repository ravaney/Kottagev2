import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,

  Paper,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Colors } from '../constants';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import GroupIcon from '@mui/icons-material/Group';

// Jamaica's 14 parishes
const jamaicaParishes = [
  'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
  'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
  'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
];

// Regional areas
const regionalAreas = [
  'Jamaica North Coast',
  'Blue Mountains Region',
  'South Coast',
  'Central Jamaica',
  'Western Jamaica',
  'Eastern Jamaica'
];

// Mock staff data
const mockStaff: Staff[] = [
  { id: 1, name: 'John Smith', email: 'john@yaad.com', role: 'Property Manager', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@yaad.com', role: 'Customer Support', status: 'Active' },
  { id: 3, name: 'Michael Brown', email: 'michael@yaad.com', role: 'Regional Supervisor', status: 'Active' },
  { id: 4, name: 'Lisa Davis', email: 'lisa@yaad.com', role: 'Operations Manager', status: 'Active' },
  { id: 5, name: 'Robert Wilson', email: 'robert@yaad.com', role: 'Property Coordinator', status: 'Active' },
];

// Mock current assignments
interface Assignment {
  id: number;
  staffId: number;
  staffName: string;
  assignmentType: 'parish' | 'regional';
  assignmentValue: string;
  role: string;
}

interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockAssignments: Assignment[] = [
  { id: 1, staffId: 1, staffName: 'John Smith', assignmentType: 'parish', assignmentValue: 'Kingston', role: 'Property Manager' },
  { id: 2, staffId: 1, staffName: 'John Smith', assignmentType: 'parish', assignmentValue: 'St. Andrew', role: 'Property Manager' },
  { id: 3, staffId: 2, staffName: 'Sarah Johnson', assignmentType: 'regional', assignmentValue: 'Jamaica North Coast', role: 'Customer Support' },
  { id: 4, staffId: 3, staffName: 'Michael Brown', assignmentType: 'regional', assignmentValue: 'Blue Mountains Region', role: 'Regional Supervisor' },
  { id: 5, staffId: 4, staffName: 'Lisa Davis', assignmentType: 'parish', assignmentValue: 'St. James', role: 'Operations Manager' },
];

export default function RegionalAssignment() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignmentType, setAssignmentType] = useState<'parish' | 'regional'>('parish');
  const [assignmentValue, setAssignmentValue] = useState('');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const handleAddAssignment = () => {
    if (!selectedStaff || !assignmentValue) return;

    const staff = mockStaff.find(s => s.id === parseInt(selectedStaff));
    if (!staff) return;

    const newAssignment: Assignment = {
      id: assignments.length + 1,
      staffId: parseInt(selectedStaff),
      staffName: staff.name,
      assignmentType,
      assignmentValue,
      role: staff.role
    };

    setAssignments([...assignments, newAssignment]);
    setDialogOpen(false);
    setSelectedStaff('');
    setAssignmentValue('');
    setEditingAssignment(null);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setSelectedStaff(assignment.staffId.toString());
    setAssignmentType(assignment.assignmentType);
    setAssignmentValue(assignment.assignmentValue);
    setDialogOpen(true);
  };

  const handleUpdateAssignment = () => {
    if (!selectedStaff || !assignmentValue || !editingAssignment) return;

    const staff = mockStaff.find(s => s.id === parseInt(selectedStaff));
    if (!staff) return;

    const updatedAssignments = assignments.map(assignment => 
      assignment.id === editingAssignment.id 
        ? {
            ...assignment,
            staffId: parseInt(selectedStaff),
            staffName: staff.name,
            assignmentType,
            assignmentValue,
            role: staff.role
          }
        : assignment
    );

    setAssignments(updatedAssignments);
    setDialogOpen(false);
    setSelectedStaff('');
    setAssignmentValue('');
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (id: number) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStaff('');
    setAssignmentValue('');
    setEditingAssignment(null);
  };

  const getAssignmentsByType = (type: 'parish' | 'regional') => {
    return assignments.filter(assignment => assignment.assignmentType === type);
  };

  const getStaffAssignments = (staffId: number) => {
    return assignments.filter(assignment => assignment.staffId === staffId);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color={Colors.blue} gutterBottom>
          Regional Staff Assignment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Assign staff members to specific parishes or regional areas in Jamaica for better coverage and management.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight={700} color={Colors.blue}>
              {mockStaff.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Staff
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight={700} color="#4caf50">
              {assignments.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Assignments
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight={700} color={Colors.raspberry}>
              {getAssignmentsByType('parish').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Parish Assignments
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" fontWeight={700} color="#ff9800">
              {getAssignmentsByType('regional').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regional Assignments
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Staff List and Assignment Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Staff Overview
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{
                  backgroundColor: Colors.blue,
                  '&:hover': { backgroundColor: Colors.raspberry }
                }}
              >
                New Assignment
              </Button>
            </Box>

            <List>
              {mockStaff.map((staff) => {
                const staffAssignments = getStaffAssignments(staff.id);
                return (
                  <React.Fragment key={staff.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {staff.name}
                            </Typography>
                            <Chip 
                              label={staff.role} 
                              size="small" 
                              sx={{ backgroundColor: '#e3f2fd', color: Colors.blue }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {staff.email}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {staffAssignments.map((assignment) => (
                                <Chip
                                  key={assignment.id}
                                  label={assignment.assignmentValue}
                                  size="small"
                                  variant="outlined"
                                  color={assignment.assignmentType === 'parish' ? 'primary' : 'secondary'}
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                              {staffAssignments.length === 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  No assignments
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Assignment Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Current Assignments
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Staff Member</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {assignment.staffName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={assignment.assignmentType === 'parish' ? 'Parish' : 'Regional'}
                          size="small"
                          color={assignment.assignmentType === 'parish' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {assignment.assignmentValue}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditAssignment(assignment)}
                          sx={{ color: Colors.blue }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          sx={{ color: Colors.raspberry }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Parish Coverage Map */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Coverage Overview
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} color={Colors.blue} gutterBottom>
                  Parish Coverage
                </Typography>
                <Grid container spacing={1}>
                  {jamaicaParishes.map((parish) => {
                    const assigned = getAssignmentsByType('parish').find(a => a.assignmentValue === parish);
                    return (
                      <Grid item xs={6} sm={4} md={3} key={parish}>
                        <Card
                          sx={{
                            p: 1,
                            textAlign: 'center',
                            backgroundColor: assigned ? '#e8f5e8' : '#fff3e0',
                            border: `1px solid ${assigned ? '#4caf50' : '#ff9800'}`
                          }}
                        >
                          <Typography variant="caption" fontWeight={500}>
                            {parish}
                          </Typography>
                          {assigned && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {assigned.staffName}
                            </Typography>
                          )}
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} color={Colors.raspberry} gutterBottom>
                  Regional Coverage
                </Typography>
                <Grid container spacing={1}>
                  {regionalAreas.map((region) => {
                    const assigned = getAssignmentsByType('regional').find(a => a.assignmentValue === region);
                    return (
                      <Grid item xs={12} sm={6} key={region}>
                        <Card
                          sx={{
                            p: 2,
                            backgroundColor: assigned ? '#f3e5f5' : '#fce4ec',
                            border: `1px solid ${assigned ? Colors.raspberry : '#f8bbd9'}`
                          }}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            {region}
                          </Typography>
                          {assigned && (
                            <Typography variant="caption" color="text.secondary">
                              {assigned.staffName} - {assigned.role}
                            </Typography>
                          )}
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Assignment Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAssignment ? 'Edit Assignment' : 'New Staff Assignment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Staff Member</InputLabel>
                <Select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  label="Staff Member"
                >
                  {mockStaff.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.name} - {staff.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assignment Type</InputLabel>
                <Select
                  value={assignmentType}
                  onChange={(e) => {
                    setAssignmentType(e.target.value as 'parish' | 'regional');
                    setAssignmentValue('');
                  }}
                  label="Assignment Type"
                >
                  <MenuItem value="parish">Parish</MenuItem>
                  <MenuItem value="regional">Regional Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>
                  {assignmentType === 'parish' ? 'Parish' : 'Regional Area'}
                </InputLabel>
                <Select
                  value={assignmentValue}
                  onChange={(e) => setAssignmentValue(e.target.value)}
                  label={assignmentType === 'parish' ? 'Parish' : 'Regional Area'}
                >
                  {(assignmentType === 'parish' ? jamaicaParishes : regionalAreas).map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            Staff members can be assigned to multiple parishes or regional areas. 
            This helps ensure comprehensive coverage across Jamaica.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={editingAssignment ? handleUpdateAssignment : handleAddAssignment}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: Colors.blue,
              '&:hover': { backgroundColor: Colors.raspberry }
            }}
          >
            {editingAssignment ? 'Update' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
