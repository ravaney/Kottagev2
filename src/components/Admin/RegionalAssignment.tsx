import React, { useState } from 'react';
import {
  Container, Paper, Button, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Colors } from '../constants';
import RegionalCoverageMap from './RegionalCoverageMap';
import RegionalStaffHeader from './RegionalStaffHeader';
import { jamaicaCoverageZones } from './regionalCoverage';
import SaveIcon from '@mui/icons-material/Save';

// Jamaica's 14 parishes
const jamaicaParishes = [
  'Kingston',
  'St. Andrew',
  'St. Thomas',
  'Portland',
  'St. Mary',
  'St. Ann',
  'Trelawny',
  'St. James',
  'Hanover',
  'Westmoreland',
  'St. Elizabeth',
  'Manchester',
  'Clarendon',
  'St. Catherine',
];

// Regional areas
const regionalAreas = jamaicaCoverageZones.map(zone => zone.label);

// Mock staff data
const mockStaff: Staff[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@bluekottage.com',
    role: 'Property Manager',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@bluekottage.com',
    role: 'Customer Support',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@bluekottage.com',
    role: 'Regional Supervisor',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Lisa Davis',
    email: 'lisa@bluekottage.com',
    role: 'Operations Manager',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert@bluekottage.com',
    role: 'Property Coordinator',
    status: 'Active',
  },
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
  {
    id: 1,
    staffId: 1,
    staffName: 'John Smith',
    assignmentType: 'parish',
    assignmentValue: 'Kingston',
    role: 'Property Manager',
  },
  {
    id: 2,
    staffId: 1,
    staffName: 'John Smith',
    assignmentType: 'parish',
    assignmentValue: 'St. Andrew',
    role: 'Property Manager',
  },
  {
    id: 3,
    staffId: 2,
    staffName: 'Sarah Johnson',
    assignmentType: 'regional',
    assignmentValue: 'Jamaica North Coast',
    role: 'Customer Support',
  },
  {
    id: 4,
    staffId: 3,
    staffName: 'Michael Brown',
    assignmentType: 'regional',
    assignmentValue: 'Blue Mountains Region',
    role: 'Regional Supervisor',
  },
  {
    id: 5,
    staffId: 4,
    staffName: 'Lisa Davis',
    assignmentType: 'parish',
    assignmentValue: 'St. James',
    role: 'Operations Manager',
  },
];

export default function RegionalAssignment() {

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignmentType, setAssignmentType] = useState<'parish' | 'regional'>(
    'parish'
  );
  const [assignmentValue, setAssignmentValue] = useState('');

  const handleAddAssignment = () => {
    if (!selectedStaff || !assignmentValue) return;

    const staff = mockStaff.find(s => s.id === parseInt(selectedStaff));
    if (!staff) return;

    const newAssignment: Assignment = {
      id: Math.max(0, ...assignments.map(item => item.id)) + 1,
      staffId: parseInt(selectedStaff),
      staffName: staff.name,
      assignmentType,
      assignmentValue,
      role: staff.role,
    };

    setAssignments([...assignments, newAssignment]);
    setDialogOpen(false);
    setSelectedStaff('');
    setAssignmentValue('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStaff('');
    setAssignmentValue('');
  };

  return (
    <Container maxWidth={false} sx={{ height: '100%', flex: '1 1 0', minHeight: 0, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', py: { xs: 1.5, md: 2 }, gap: 1.5, boxSizing: 'border-box', backgroundColor: '#f4f7fa' }}>
      <RegionalStaffHeader
        parishCount={jamaicaParishes.length}
        regionCount={regionalAreas.length}
        onNewAssignment={() => { handleCloseDialog(); setDialogOpen(true); }}
      />

      <Paper elevation={0} sx={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden', border: '1px solid #e2e9ef', borderRadius: 3 }}>
        <RegionalCoverageMap assignments={assignments} onAssign={(name, type) => {
          handleCloseDialog();
          setAssignmentType(type);
          setAssignmentValue(name);
          setDialogOpen(true);
        }} />
      </Paper>

      {/* Assignment Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          New Staff Assignment
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Staff Member</InputLabel>
                <Select
                  value={selectedStaff}
                  onChange={e => setSelectedStaff(e.target.value)}
                  label="Staff Member"
                >
                  {mockStaff.map(staff => (
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
                  onChange={e => {
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
                  onChange={e => setAssignmentValue(e.target.value)}
                  label={
                    assignmentType === 'parish' ? 'Parish' : 'Regional Area'
                  }
                >
                  {(assignmentType === 'parish'
                    ? jamaicaParishes
                    : regionalAreas
                  ).map(location => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            Staff members can be assigned to multiple parishes or regional
            areas. This helps ensure comprehensive coverage across Jamaica.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddAssignment}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: Colors.cerulean,
              '&:hover': { backgroundColor: Colors.raspberry },
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
