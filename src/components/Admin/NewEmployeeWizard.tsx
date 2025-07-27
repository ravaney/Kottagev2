import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Typography,
  Button,

  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Autocomplete,
  FormGroup,
  Checkbox,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Person,
  Security,
  LocationOn,
  Assignment,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';
import { 
  EmployeeClaims, 
  EmployeePermission
} from '../../utils/firebaseClaims';
import { useUserClaims, useCreateEmployee } from '../../hooks/useUserClaims';

interface NewEmployeeData {
  // Basic Information
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
  sendWelcomeEmail: boolean;
  
  // Employee Details
  employeeId: string;
  department: 'customer_service' | 'operations' | 'finance' | 'marketing' | 'it' | 'management';
  position: 'staff' | 'supervisor' | 'manager' | 'director' | 'admin';
  startDate: string;
  
  // Claims and Permissions
  role: 'staff' | 'admin' | 'super_admin';
  accessLevel: 1 | 2 | 3 | 4 | 5;
  isActive: boolean;
  assignedRegions: string[];
  assignedParishes: string[];
  territorialAccess: 'parish' | 'region' | 'national';
  permissions: EmployeePermission[];
  
  // Specific Capabilities
  canModerateReviews: boolean;
  canManageBookings: boolean;
  canAccessFinancials: boolean;
  canManageUsers: boolean;
  canManageProperties: boolean;
  canAccessAnalytics: boolean;
  canHandleDisputes: boolean;
  canProcessPayouts: boolean;
  canAssignStaff: boolean;
  canViewReports: boolean;
}

interface NewEmployeeWizardProps {
  open: boolean;
  onClose: () => void;
  onEmployeeCreated: (employee: any) => void;
}

const steps = [
  'Basic Information',
  'Employee Details',
  'Role & Access Level',
  'Territorial Access',
  'Permissions',
  'Review & Create'
];

const departments: Array<'customer_service' | 'operations' | 'finance' | 'marketing' | 'it' | 'management'> = [
  'management',
  'customer_service',
  'operations',
  'finance',
  'marketing',
  'it'
];

const positions: Array<'staff' | 'supervisor' | 'manager' | 'director' | 'admin'> = [
  'staff',
  'supervisor',
  'manager',
  'director',
  'admin'
];

const jamaicaRegions: string[] = [
  'Kingston Metropolitan Area',
  'North Coast',
  'Western Jamaica',
  'Central Jamaica',
  'Eastern Jamaica',
  'South Coast'
];

const jamaicaParishes: string[] = [
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
  'St. Catherine'
];

const permissionDescriptions: Record<EmployeePermission, string> = {
  'read_bookings': 'View booking information',
  'write_bookings': 'Create and modify bookings',
  'cancel_bookings': 'Cancel existing bookings',
  'read_users': 'View user profiles and information',
  'write_users': 'Create and modify user accounts',
  'suspend_users': 'Suspend user accounts',
  'read_properties': 'View property listings and details',
  'write_properties': 'Create and modify properties',
  'approve_properties': 'Approve new property listings',
  'read_reviews': 'View customer reviews',
  'moderate_reviews': 'Moderate and manage reviews',
  'delete_reviews': 'Delete inappropriate reviews',
  'read_financials': 'View financial information',
  'process_payouts': 'Process host payouts',
  'refund_payments': 'Process payment refunds',
  'read_analytics': 'View analytics and reports',
  'export_data': 'Export system data',
  'generate_reports': 'Generate custom reports',
  'manage_staff': 'Manage employee accounts',
  'assign_territories': 'Assign territorial access',
  'view_admin_panel': 'Access admin panel'
};

export const NewEmployeeWizard: React.FC<NewEmployeeWizardProps> = ({
  open,
  onClose,
  onEmployeeCreated
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<NewEmployeeData>({
    email: '',
    password: '',
    displayName: '',
    photoURL: '',
    sendWelcomeEmail: true,
    employeeId: '',
    department: 'customer_service',
    position: 'staff',
    startDate: new Date().toISOString().split('T')[0],
    role: 'staff',
    accessLevel: 1,
    isActive: true,
    assignedRegions: [],
    assignedParishes: [],
    territorialAccess: 'parish',
    permissions: ['read_bookings', 'read_properties'],
    canModerateReviews: false,
    canManageBookings: false,
    canAccessFinancials: false,
    canManageUsers: false,
    canManageProperties: false,
    canAccessAnalytics: false,
    canHandleDisputes: false,
    canProcessPayouts: false,
    canAssignStaff: false,
    canViewReports: false
  });

  const { claims } = useUserClaims();
  const { createEmployeeWithEmailPassword, loading: createLoading, error: createError } = useCreateEmployee();

  // Generate employee ID based on department and date
  useEffect(() => {
    if (employeeData.department) {
      const deptCode = employeeData.department.substring(0, 3).toUpperCase();
      const year = new Date().getFullYear();
      const timestamp = Date.now().toString().slice(-4);
      setEmployeeData(prev => ({
        ...prev,
        employeeId: `EMP_${deptCode}_${year}_${timestamp}`
      }));
    }
  }, [employeeData.department]);

  // Auto-set permissions based on role
  useEffect(() => {
    let newPermissions: EmployeePermission[] = [];
    let capabilities = {
      canModerateReviews: false,
      canManageBookings: false,
      canAccessFinancials: false,
      canManageUsers: false,
      canManageProperties: false,
      canAccessAnalytics: false,
      canHandleDisputes: false,
      canProcessPayouts: false,
      canAssignStaff: false,
      canViewReports: false
    };

    switch (employeeData.role) {
      case 'staff':
        newPermissions = ['read_bookings', 'read_properties', 'read_users'];
        break;
      case 'admin':
        newPermissions = [
          'read_bookings', 'write_bookings', 'cancel_bookings',
          'read_users', 'write_users',
          'read_properties', 'write_properties',
          'read_reviews', 'moderate_reviews',
          'read_analytics', 'manage_staff',
          'read_financials', 'process_payouts'
        ];
        capabilities = {
          canModerateReviews: true,
          canManageBookings: true,
          canAccessFinancials: true,
          canManageUsers: true,
          canManageProperties: true,
          canAccessAnalytics: true,
          canHandleDisputes: true,
          canProcessPayouts: true,
          canAssignStaff: true,
          canViewReports: true
        };
        break;
      case 'super_admin':
        newPermissions = Object.keys(permissionDescriptions) as EmployeePermission[];
        capabilities = {
          canModerateReviews: true,
          canManageBookings: true,
          canAccessFinancials: true,
          canManageUsers: true,
          canManageProperties: true,
          canAccessAnalytics: true,
          canHandleDisputes: true,
          canProcessPayouts: true,
          canAssignStaff: true,
          canViewReports: true
        };
        break;
    }

    setEmployeeData(prev => ({
      ...prev,
      permissions: newPermissions,
      accessLevel: employeeData.role === 'staff' ? 2 : employeeData.role === 'admin' ? 4 : 5,
      territorialAccess: employeeData.role === 'super_admin' ? 'national' : prev.territorialAccess,
      ...capabilities
    }));
  }, [employeeData.role]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setError(null);
    setEmployeeData({
      email: '',
      password: '',
      displayName: '',
      photoURL: '',
      sendWelcomeEmail: true,
      employeeId: '',
      department: 'customer_service',
      position: 'staff',
      startDate: new Date().toISOString().split('T')[0],
      role: 'staff',
      accessLevel: 1,
      isActive: true,
      assignedRegions: [],
      assignedParishes: [],
      territorialAccess: 'parish',
      permissions: ['read_bookings', 'read_properties'],
      canModerateReviews: false,
      canManageBookings: false,
      canAccessFinancials: false,
      canManageUsers: false,
      canManageProperties: false,
      canAccessAnalytics: false,
      canHandleDisputes: false,
      canProcessPayouts: false,
      canAssignStaff: false,
      canViewReports: false
    });
  };

  const handleCreateEmployee = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!employeeData.email || !employeeData.password || !employeeData.displayName || !employeeData.department) {
        throw new Error('Please fill in all required fields including password');
      }

      // Use the new hook to create employee with email and password
      const result = await createEmployeeWithEmailPassword(
        employeeData.email,
        employeeData.password,
        {
          displayName: employeeData.displayName,
          photoURL: employeeData.photoURL,
          employeeId: employeeData.employeeId,
          department: employeeData.department,
          position: employeeData.position,
          role: employeeData.role,
          accessLevel: employeeData.accessLevel,
          assignedRegions: employeeData.assignedRegions,
          assignedParishes: employeeData.assignedParishes,
          territorialAccess: employeeData.territorialAccess,
          permissions: employeeData.permissions,
          sendWelcomeEmail: employeeData.sendWelcomeEmail
        }
      );

      onEmployeeCreated(result);
      onClose();
      handleReset();

    } catch (err: any) {
      console.error('Error creating employee:', err);
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(employeeData.email && employeeData.password && employeeData.displayName);
      case 1: // Employee Details
        return !!(employeeData.department && employeeData.position);
      case 2: // Role & Access Level
        return !!(employeeData.role);
      case 3: // Territorial Access
        return employeeData.territorialAccess === 'national' || 
               employeeData.assignedRegions.length > 0 || 
               employeeData.assignedParishes.length > 0;
      case 4: // Permissions
        return employeeData.permissions.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={employeeData.email}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  helperText="This will be the employee's login email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={employeeData.displayName}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, displayName: e.target.value }))}
                  required
                  helperText="Full name as it should appear in the system"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={employeeData.password}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  helperText="Temporary password for the employee (they can change it later)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Photo URL"
                  value={employeeData.photoURL}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, photoURL: e.target.value }))}
                  helperText="Optional profile picture URL"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={employeeData.sendWelcomeEmail}
                      onChange={(e) => setEmployeeData(prev => ({ ...prev, sendWelcomeEmail: e.target.checked }))}
                    />
                  }
                  label="Send welcome email with login instructions"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Employee Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={employeeData.employeeId}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, employeeId: e.target.value }))}
                  helperText="Auto-generated based on department (can be modified)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={employeeData.department}
                    onChange={(e) => setEmployeeData(prev => ({ 
                      ...prev, 
                      department: e.target.value as NewEmployeeData['department']
                    }))}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={employeeData.position}
                    onChange={(e) => setEmployeeData(prev => ({ 
                      ...prev, 
                      position: e.target.value as NewEmployeeData['position']
                    }))}
                  >
                    {positions.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={employeeData.startDate}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={employeeData.isActive}
                      onChange={(e) => setEmployeeData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Active Employee"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              Role & Access Level
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Employee Role</InputLabel>
                  <Select
                    value={employeeData.role}
                    onChange={(e) => setEmployeeData(prev => ({ 
                      ...prev, 
                      role: e.target.value as NewEmployeeData['role']
                    }))}
                  >
                    <MenuItem value="staff">
                      <Box>
                        <Typography variant="subtitle1">Staff</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Basic access to view bookings and properties
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="admin">
                      <Box>
                        <Typography variant="subtitle1">Admin</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Can manage bookings, users, and moderate content
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="super_admin">
                      <Box>
                        <Typography variant="subtitle1">Super Admin</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Full system access including financial operations
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Access Level: {employeeData.accessLevel}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Higher levels grant access to more sensitive operations
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Territorial Access
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Territorial Access Type</InputLabel>
                  <Select
                    value={employeeData.territorialAccess}
                    onChange={(e) => setEmployeeData(prev => ({ 
                      ...prev, 
                      territorialAccess: e.target.value as 'parish' | 'region' | 'national'
                    }))}
                  >
                    <MenuItem value="parish">Parish Level</MenuItem>
                    <MenuItem value="region">Regional Level</MenuItem>
                    <MenuItem value="national">National Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {employeeData.territorialAccess !== 'national' && (
                <>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={jamaicaRegions}
                      value={employeeData.assignedRegions}
                      onChange={(_, newValue) => setEmployeeData(prev => ({ ...prev, assignedRegions: newValue }))}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Assigned Regions" />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={jamaicaParishes}
                      value={employeeData.assignedParishes}
                      onChange={(_, newValue) => setEmployeeData(prev => ({ ...prev, assignedParishes: newValue }))}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Assigned Parishes" />
                      )}
                    />
                  </Grid>
                </>
              )}
              
              {employeeData.territorialAccess === 'national' && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    This employee will have access to all regions and parishes in Jamaica.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Permissions & Capabilities
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>System Permissions</Typography>
              <FormGroup>
                {(Object.keys(permissionDescriptions) as EmployeePermission[]).map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={employeeData.permissions.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...employeeData.permissions, permission]
                            : employeeData.permissions.filter(p => p !== permission);
                          setEmployeeData(prev => ({ ...prev, permissions: newPermissions }));
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{permissionDescriptions[permission]}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {permission}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Specific Capabilities</Typography>
              <Grid container spacing={2}>
                {[
                  { key: 'canModerateReviews', label: 'Moderate Reviews' },
                  { key: 'canManageBookings', label: 'Manage Bookings' },
                  { key: 'canAccessFinancials', label: 'Access Financial Data' },
                  { key: 'canManageUsers', label: 'Manage Users' },
                  { key: 'canManageProperties', label: 'Manage Properties' },
                  { key: 'canAccessAnalytics', label: 'Access Analytics' },
                  { key: 'canHandleDisputes', label: 'Handle Disputes' },
                  { key: 'canProcessPayouts', label: 'Process Payouts' },
                  { key: 'canAssignStaff', label: 'Assign Staff' },
                  { key: 'canViewReports', label: 'View Reports' }
                ].map((capability) => (
                  <Grid item xs={12} sm={6} key={capability.key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={(employeeData as any)[capability.key]}
                          onChange={(e) => setEmployeeData(prev => ({ 
                            ...prev, 
                            [capability.key]: e.target.checked 
                          }))}
                        />
                      }
                      label={capability.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
              Review & Create Employee
            </Typography>
            
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
                <Typography variant="body2">Email: {employeeData.email}</Typography>
                <Typography variant="body2">Name: {employeeData.displayName}</Typography>
                <Typography variant="body2">Password: {'*'.repeat(employeeData.password.length)} (temporary)</Typography>
                <Typography variant="body2">Employee ID: {employeeData.employeeId}</Typography>
                <Typography variant="body2">
                  Welcome Email: {employeeData.sendWelcomeEmail ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Employment Details</Typography>
                <Typography variant="body2">Department: {employeeData.department}</Typography>
                <Typography variant="body2">Position: {employeeData.position}</Typography>
                <Typography variant="body2">Role: {employeeData.role}</Typography>
                <Typography variant="body2">Access Level: {employeeData.accessLevel}</Typography>
                <Typography variant="body2">Status: {employeeData.isActive ? 'Active' : 'Inactive'}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Territorial Access</Typography>
                <Typography variant="body2">Type: {employeeData.territorialAccess}</Typography>
                {employeeData.assignedRegions.length > 0 && (
                  <Typography variant="body2">
                    Regions: {employeeData.assignedRegions.join(', ')}
                  </Typography>
                )}
                {employeeData.assignedParishes.length > 0 && (
                  <Typography variant="body2">
                    Parishes: {employeeData.assignedParishes.join(', ')}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Permissions Summary</Typography>
                <Typography variant="body2" gutterBottom>
                  {employeeData.permissions.length} system permissions granted
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {employeeData.permissions.map((permission) => (
                    <Chip key={permission} label={permission} size="small" />
                  ))}
                </Box>
                
                <Typography variant="body2" gutterBottom>Active Capabilities:</Typography>
                <List dense>
                  {[
                    { key: 'canModerateReviews', label: 'Moderate Reviews' },
                    { key: 'canManageBookings', label: 'Manage Bookings' },
                    { key: 'canAccessFinancials', label: 'Access Financial Data' },
                    { key: 'canManageUsers', label: 'Manage Users' },
                    { key: 'canManageProperties', label: 'Manage Properties' },
                    { key: 'canAccessAnalytics', label: 'Access Analytics' },
                    { key: 'canHandleDisputes', label: 'Handle Disputes' },
                    { key: 'canProcessPayouts', label: 'Process Payouts' },
                    { key: 'canAssignStaff', label: 'Assign Staff' },
                    { key: 'canViewReports', label: 'View Reports' }
                  ].filter(cap => (employeeData as any)[cap.key]).map((capability) => (
                    <ListItem key={capability.key} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="success" sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText primary={capability.label} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // TODO: Re-enable permission check later
  // Check if user has permission to create employees
  // if (!claims || (!claims.permissions?.includes('manage_staff') && !claims.canManageUsers)) {
  //   return (
  //     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  //       <DialogContent>
  //         <Alert severity="error">
  //           You don't have permission to create employees.
  //         </Alert>
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={onClose}>Close</Button>
  //       </DialogActions>
  //     </Dialog>
  //   );
  // }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { minHeight: '80vh' } }}
    >
      <DialogTitle>
        Create New Employee
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
                error={!isStepValid(index) && activeStep > index}
              >
                {label}
              </StepLabel>
              <StepContent>
                {renderStepContent(index)}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleCreateEmployee : handleNext}
                    disabled={!isStepValid(index) || loading}
                    sx={{ mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Create Employee' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0 || loading}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep === steps.length && (
          <Button onClick={handleReset} disabled={loading}>
            Create Another
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewEmployeeWizard;
