import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Autocomplete,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Fab,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon,
  GroupWork as GroupWorkIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useClaimsManagement, useRoleChecker, useUserClaims } from '../../hooks/useUserClaims';
import { useEmployees } from '../../hooks/useEmployees';
import { 
  EmployeeClaims, 
  EmployeePermission, 
  PERMISSION_SETS, 
  createEmployeeClaims 
} from '../../utils/firebaseClaims';
import { BulkClaimsOperation, PermissionAuditDialog } from './ClaimsDialogs';
import { NewEmployeeWizard } from './NewEmployeeWizard';

const JAMAICA_PARISHES = [
  'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary', 'St. Ann',
  'Trelawny', 'St. James', 'Hanover', 'Westmoreland', 'St. Elizabeth',
  'Manchester', 'Clarendon', 'St. Catherine'
];

const JAMAICA_REGIONS = [
  'North Coast', 'South Coast', 'Eastern Region', 'Western Region', 'Central Region'
];

const DEPARTMENTS = [
  'customer_service',
  'operations',
  'marketing',
  'finance',
  'it',
  'legal',
  'management'
];

const POSITIONS = [
  'staff',
  'senior_staff',
  'team_lead',
  'supervisor',
  'manager',
  'admin',
  'director'
];

const ALL_PERMISSIONS = [
  'read_bookings',
  'write_bookings',
  'cancel_bookings',
  'read_users',
  'write_users',
  'suspend_users',
  'read_properties',
  'write_properties',
  'approve_properties',
  'read_reviews',
  'moderate_reviews',
  'delete_reviews',
  'read_financials',
  'process_payouts',
  'refund_payments',
  'read_analytics',
  'export_data',
  'generate_reports',
  'manage_staff',
  'assign_territories',
  'view_admin_panel'
];

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
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
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

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [newEmployeeWizardOpen, setNewEmployeeWizardOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    role: '',
    department: '',
    position: '',
    isActive: true,
    permissions: [] as string[],
    assignedParishes: [] as string[],
    assignedRegions: [] as string[],
    accessLevel: 1
  });
  
  const { setEmployeeClaims, updateUserClaims, batchUpdateClaims, loading: claimsLoading } = useClaimsManagement();
  const roleChecker = useRoleChecker();
  const { claims: userClaims, loading: userClaimsLoading, user } = useUserClaims();
  
  // Use the new employees hook
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
    totalCount,
    refreshEmployees,
    searchEmployees: searchEmployeesHook,
    filterEmployees,
    getEmployeeById,
    getActiveEmployees,
    getInactiveEmployees
  } = useEmployees({
    pageSize: 50,
    filters: {
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      role: roleFilter === 'all' ? undefined : roleFilter as any,
      department: departmentFilter === 'all' ? undefined : departmentFilter,
      searchTerm: searchTerm || undefined
    }
  });

  // Employee statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: { staff: 0, admin: 0, super_admin: 0 },
    byDepartment: {} as Record<string, number>
  });

  useEffect(() => {
    if (employees) {
      const active = employees.filter(emp => emp.customClaims?.isActive !== false && !emp.disabled).length;
      const inactive = employees.filter(emp => emp.customClaims?.isActive === false || emp.disabled).length;
      
      const byRole = {
        staff: employees.filter(emp => emp.customClaims?.role === 'staff').length,
        admin: employees.filter(emp => emp.customClaims?.role === 'admin').length,
        super_admin: employees.filter(emp => emp.customClaims?.role === 'super_admin').length
      };

      const byDepartment = employees.reduce((acc, emp) => {
        const dept = emp.customClaims?.department || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        total: employees.length,
        active,
        inactive,
        byRole,
        byDepartment
      });
    }
  }, [employees]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      role: employee.customClaims?.role || 'staff',
      department: employee.customClaims?.department || '',
      position: employee.customClaims?.position || '',
      isActive: employee.customClaims?.isActive !== false,
      permissions: employee.customClaims?.permissions || [],
      assignedParishes: employee.customClaims?.assignedParishes || [],
      assignedRegions: employee.customClaims?.assignedRegions || [],
      accessLevel: employee.customClaims?.accessLevel || 1
    });
    setEditDialogOpen(true);
  };

  const handleSaveEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      const updatedClaims = {
        ...selectedEmployee.customClaims,
        role: editForm.role,
        department: editForm.department,
        position: editForm.position,
        isActive: editForm.isActive,
        permissions: editForm.permissions,
        assignedParishes: editForm.assignedParishes,
        assignedRegions: editForm.assignedRegions,
        accessLevel: editForm.accessLevel,
        lastModified: new Date().toISOString(),
        modifiedBy: user?.uid
      };
      
      await updateUserClaims(selectedEmployee.uid, updatedClaims);
      setEditDialogOpen(false);
      refreshEmployees();
      showSnackbar('Employee updated successfully', 'success');
    } catch (error) {
      console.error('Error updating employee:', error);
      showSnackbar('Failed to update employee', 'error');
    }
  };

  const handleCreateEmployee = () => {
    setNewEmployeeWizardOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      // Implement delete functionality here
      showSnackbar('Employee deleted successfully', 'success');
      refreshEmployees();
    } catch (error) {
      showSnackbar('Failed to delete employee', 'error');
    }
  };

  const handleToggleEmployeeStatus = async (employee: any) => {
    try {
      const newStatus = !employee.customClaims?.isActive;
      await updateUserClaims(employee.uid, {
        ...employee.customClaims,
        isActive: newStatus
      });
      showSnackbar(`Employee ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      refreshEmployees();
    } catch (error) {
      showSnackbar('Failed to update employee status', 'error');
    }
  };

  const handleBulkOperation = (operation: 'activate' | 'deactivate' | 'assign_role' | 'assign_department') => {
    setBulkDialogOpen(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusChip = (employee: any) => {
    const isActive = employee.customClaims?.isActive !== false && !employee.disabled;
    return (
      <Chip
        size="small"
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'default'}
        icon={isActive ? <CheckCircleIcon /> : <BlockIcon />}
      />
    );
  };

  const getRoleChip = (role: string) => {
    const colors = {
      'super_admin': 'error',
      'admin': 'warning',
      'staff': 'primary'
    } as const;
    
    return (
      <Chip
        size="small"
        label={role?.replace('_', ' ').toUpperCase() || 'STAFF'}
        color={colors[role as keyof typeof colors] || 'default'}
      />
    );
  };

  const getPermissionSummary = (permissions: string[] = []) => {
    if (permissions.length === 0) return 'No permissions';
    if (permissions.length <= 3) return permissions.join(', ');
    return `${permissions.slice(0, 2).join(', ')} +${permissions.length - 2} more`;
  };

  // Overview Stats Cards
  const StatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Total Employees
                </Typography>
                <Typography variant="h4">
                  {stats.total}
                </Typography>
              </Box>
              <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Active
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.active}
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Inactive
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.inactive}
                </Typography>
              </Box>
              <BlockIcon sx={{ fontSize: 40, color: 'warning.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="overline">
                  Departments
                </Typography>
                <Typography variant="h4">
                  {Object.keys(stats.byDepartment).length}
                </Typography>
              </Box>
              <WorkIcon sx={{ fontSize: 40, color: 'info.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Filter Controls
  const FilterControls = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                label="Department"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {Object.keys(stats.byDepartment).map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setRoleFilter('all');
                setDepartmentFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Employee Table
  const EmployeeTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < employees.length}
                checked={employees.length > 0 && selectedEmployees.length === employees.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEmployees(employees.map(emp => emp.uid));
                  } else {
                    setSelectedEmployees([]);
                  }
                }}
              />
            </TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeesLoading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : employeesError ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography color="error">
                  Error loading employees: {employeesError}
                </Typography>
                <Button 
                  onClick={refreshEmployees} 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 1 }}
                >
                  Retry
                </Button>
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography color="textSecondary">
                  No employees found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow
                key={employee.uid}
                hover
                selected={selectedEmployees.includes(employee.uid)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEmployees.includes(employee.uid)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees([...selectedEmployees, employee.uid]);
                      } else {
                        setSelectedEmployees(selectedEmployees.filter(id => id !== employee.uid));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={employee.photoURL} 
                      sx={{ mr: 2, width: 32, height: 32 }}
                    >
                      {employee.displayName?.[0] || employee.email?.[0] || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {employee.displayName || 'No Name'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {getRoleChip(employee.customClaims?.role)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {employee.customClaims?.department || 'Not assigned'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {getStatusChip(employee)}
                </TableCell>
                <TableCell>
                  <Tooltip title={employee.customClaims?.permissions?.join(', ') || 'No permissions'}>
                    <Typography variant="caption">
                      {getPermissionSummary(employee.customClaims?.permissions)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {employee.customClaims?.assignedParishes?.join(', ') || 'Not assigned'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Employee">
                      <IconButton
                        size="small"
                        onClick={() => handleEditEmployee(employee)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={employee.customClaims?.isActive ? 'Deactivate' : 'Activate'}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleEmployeeStatus(employee)}
                        color={employee.customClaims?.isActive ? 'warning' : 'success'}
                      >
                        {employee.customClaims?.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Employee Edit Dialog
  const EmployeeEditDialog = () => (
    <Dialog 
      open={editDialogOpen} 
      onClose={() => setEditDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EditIcon />
          <Box>
            <Typography variant="h6">
              Edit Employee: {selectedEmployee?.displayName || selectedEmployee?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Modify roles, permissions, and departmental assignments
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editForm.role}
                label="Role"
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={editForm.department}
                label="Department"
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              >
                {DEPARTMENTS.map(dept => (
                  <MenuItem key={dept} value={dept}>
                    {dept.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={editForm.position}
                label="Position"
                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
              >
                {POSITIONS.map(pos => (
                  <MenuItem key={pos} value={pos}>
                    {pos.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Access Level</InputLabel>
              <Select
                value={editForm.accessLevel}
                label="Access Level"
                onChange={(e) => setEditForm({ ...editForm, accessLevel: Number(e.target.value) })}
              >
                <MenuItem value={1}>Level 1 - Basic</MenuItem>
                <MenuItem value={2}>Level 2 - Standard</MenuItem>
                <MenuItem value={3}>Level 3 - Enhanced</MenuItem>
                <MenuItem value={4}>Level 4 - Advanced</MenuItem>
                <MenuItem value={5}>Level 5 - Full Access</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                />
              }
              label="Employee is Active"
            />
          </Grid>
          
          {/* Permissions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Permissions
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Select the specific permissions for this employee
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormGroup>
              <Grid container spacing={1}>
                {ALL_PERMISSIONS.map(permission => (
                  <Grid item xs={12} sm={6} md={4} key={permission}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editForm.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditForm({
                                ...editForm,
                                permissions: [...editForm.permissions, permission]
                              });
                            } else {
                              setEditForm({
                                ...editForm,
                                permissions: editForm.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                        />
                      }
                      label={permission.replace(/_/g, ' ').toUpperCase()}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Grid>
          
          {/* Location Assignment */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Location Assignment
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={JAMAICA_PARISHES}
              value={editForm.assignedParishes}
              onChange={(event, newValue) => {
                setEditForm({ ...editForm, assignedParishes: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assigned Parishes"
                  placeholder="Select parishes"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={JAMAICA_REGIONS}
              value={editForm.assignedRegions}
              onChange={(event, newValue) => {
                setEditForm({ ...editForm, assignedRegions: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assigned Regions"
                  placeholder="Select regions"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveEmployee}
          variant="contained"
          disabled={claimsLoading}
          startIcon={claimsLoading ? <CircularProgress size={20} /> : <EditIcon />}
        >
          {claimsLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Claims Management Tab (existing EmployeeClaimsManagement functionality)
  const ClaimsManagementTab = () => (
    <Box>
      <FilterControls />
      <EmployeeTable />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Employee Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage all employees, their roles, permissions, and departmental assignments
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedEmployees.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<GroupWorkIcon />}
              onClick={() => handleBulkOperation('activate')}
            >
              Bulk Actions ({selectedEmployees.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleCreateEmployee}
            sx={{ backgroundColor: '#1976d2' }}
          >
            Add New Employee
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <StatsCards />

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={
                <Badge badgeContent={stats.total} color="primary" max={999}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    All Employees
                  </Box>
                </Badge>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon />
                  Claims & Permissions
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon />
                  Analytics & Reports
                </Box>
              } 
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <ClaimsManagementTab />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Advanced Claims Management
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Manage detailed permissions, bulk operations, and permission audits
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={() => setAuditDialogOpen(true)}
              >
                Permission Audit
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Export Claims
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
              >
                Import Claims
              </Button>
            </Grid>
          </Grid>
          
          <ClaimsManagementTab />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Employee Analytics & Reports
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Role Distribution
                  </Typography>
                  {Object.entries(stats.byRole).map(([role, count]) => (
                    <Box key={role} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{role.replace('_', ' ').toUpperCase()}</Typography>
                      <Typography fontWeight="bold">{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department Distribution
                  </Typography>
                  {Object.entries(stats.byDepartment).map(([dept, count]) => (
                    <Box key={dept} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{dept}</Typography>
                      <Typography fontWeight="bold">{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* New Employee Wizard */}
      <NewEmployeeWizard
        open={newEmployeeWizardOpen}
        onClose={() => setNewEmployeeWizardOpen(false)}
        onEmployeeCreated={() => {
          setNewEmployeeWizardOpen(false);
          refreshEmployees();
          showSnackbar('Employee created successfully!', 'success');
        }}
      />

      {/* Employee Edit Dialog */}
      <EmployeeEditDialog />

      {/* Bulk Operations Dialog */}
      <BulkClaimsOperation
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        selectedEmployees={selectedEmployees}
        onApply={async (updates) => {
          try {
            // Transform the updates to the expected format
            const batchUpdates = selectedEmployees.map(uid => ({
              uid,
              claims: updates
            }));
            await batchUpdateClaims(batchUpdates);
            setBulkDialogOpen(false);
            setSelectedEmployees([]);
            refreshEmployees();
            showSnackbar('Bulk operation completed successfully!', 'success');
          } catch (error) {
            showSnackbar('Bulk operation failed', 'error');
          }
        }}
      />

      {/* Permission Audit Dialog */}
      {selectedEmployee && (
        <PermissionAuditDialog
          open={auditDialogOpen}
          onClose={() => setAuditDialogOpen(false)}
          employee={selectedEmployee}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeManagement;
