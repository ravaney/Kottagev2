import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Menu,
  ListItemIcon,
  ListItemText,
  Fab,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  GroupWork as GroupWorkIcon,
} from '@mui/icons-material';
import { useClaimsManagement, useRoleChecker } from '../../hooks/useUserClaims';
import { useEmployees } from '../../hooks/useEmployees';
import {
  EmployeeClaims,
  EmployeePermission,
  PERMISSION_SETS,
  createEmployeeClaims,
} from '../../utils/firebaseClaims';
import { BulkClaimsOperation, PermissionAuditDialog } from './ClaimsDialogs';
import { NewEmployeeWizard } from './NewEmployeeWizard';

const JAMAICA_PARISHES = [
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

const JAMAICA_REGIONS = [
  'North Coast',
  'South Coast',
  'Eastern Region',
  'Western Region',
  'Central Region',
];

const EmployeeClaimsManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [newEmployeeWizardOpen, setNewEmployeeWizardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('view');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    setEmployeeClaims,
    updateUserClaims,
    batchUpdateClaims,
    loading: claimsLoading,
  } = useClaimsManagement();
  const roleChecker = useRoleChecker();

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
    getInactiveEmployees,
  } = useEmployees({
    realTimeUpdates: true,
    pageSize: 50,
  });

  const loading = employeesLoading || claimsLoading;

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    displayName: '',
    role: 'staff' as 'staff' | 'admin' | 'super_admin',
    department: 'customer_service' as EmployeeClaims['department'],
    position: 'staff' as EmployeeClaims['position'],
    accessLevel: 1,
    assignedRegions: [] as string[],
    assignedParishes: [] as string[],
    customPermissions: [] as EmployeePermission[],
    isActive: true,
  });

  const handleBulkUpdate = async (updates: any) => {
    if (!roleChecker.hasPermission('manage_staff')) {
      setSnackbar({
        open: true,
        message: 'You do not have permission to manage staff',
        severity: 'error',
      });
      return;
    }

    try {
      const bulkUpdates = selectedEmployees.map(uid => ({
        uid,
        claims: updates,
      }));
      await batchUpdateClaims(bulkUpdates);

      // Refresh employees list
      await refreshEmployees();

      setSnackbar({
        open: true,
        message: `Bulk update applied to ${selectedEmployees.length} employees`,
        severity: 'success',
      });
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error applying bulk update:', error);
      setSnackbar({
        open: true,
        message: 'Failed to apply bulk update',
        severity: 'error',
      });
    }
  };

  const handleEmployeeSelect = (uid: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, uid]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== uid));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map((emp: any) => emp.uid));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleOpenDialog = (
    mode: 'view' | 'edit' | 'create',
    employee?: any
  ) => {
    setViewMode(mode);
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        employeeId: employee.employeeId || '',
        email: employee.email || '',
        displayName: employee.displayName || '',
        role: employee.role || 'staff',
        department: employee.department || 'customer_service',
        position: employee.position || 'staff',
        accessLevel: employee.accessLevel || 1,
        assignedRegions: employee.assignedRegions || [],
        assignedParishes: employee.assignedParishes || [],
        customPermissions: employee.permissions || [],
        isActive: employee.isActive !== false,
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        employeeId: '',
        email: '',
        displayName: '',
        role: 'staff',
        department: 'customer_service',
        position: 'staff',
        accessLevel: 1,
        assignedRegions: [],
        assignedParishes: [],
        customPermissions: [],
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async () => {
    if (!roleChecker.hasPermission('manage_staff')) {
      setSnackbar({
        open: true,
        message: 'You do not have permission to manage staff',
        severity: 'error',
      });
      return;
    }

    try {
      const employeeData = {
        employeeId: formData.employeeId,
        role: formData.role,
        department: formData.department,
        position: formData.position,
        accessLevel: formData.accessLevel,
        assignedRegions: formData.assignedRegions,
        assignedParishes: formData.assignedParishes,
      };

      if (viewMode === 'create') {
        // In real implementation, you'd first create the Firebase user
        // For now, we'll use a mock UID
        const mockUid = `emp_${Date.now()}`;
        await setEmployeeClaims(mockUid, employeeData);
      } else if (viewMode === 'edit' && selectedEmployee) {
        await updateUserClaims(selectedEmployee.uid, employeeData);
      }

      // Refresh employees list
      await refreshEmployees();

      setSnackbar({
        open: true,
        message: `Employee ${
          viewMode === 'create' ? 'created' : 'updated'
        } successfully`,
        severity: 'success',
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save employee',
        severity: 'error',
      });
    }
  };

  const handleEmployeeCreated = async (employee: any) => {
    // Refresh the employees list to show the new employee
    await refreshEmployees();

    // Show success message
    setSnackbar({
      open: true,
      message: `Employee ${employee.displayName} created successfully!`,
      severity: 'success',
    });
  };

  const getPermissionChips = (position: string, accessLevel: number) => {
    const permissions =
      PERMISSION_SETS[position.toUpperCase() as keyof typeof PERMISSION_SETS] ||
      PERMISSION_SETS.STAFF;
    return permissions.slice(0, 3); // Show first 3 permissions
  };

  const getStatusColor = (isActive: boolean) =>
    isActive ? 'success' : 'error';
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'staff':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            Employee Claims Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage employee roles, permissions, and access levels
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewEmployeeWizardOpen(true)}
        >
          Create New Employee
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {getActiveEmployees().length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Employees
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {
                      employees.filter(
                        (emp: any) =>
                          emp.customClaims?.role === 'admin' ||
                          emp.customClaims?.role === 'super_admin'
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admins
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WorkIcon sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {
                      new Set(
                        employees.map(
                          (emp: any) => emp.customClaims?.department
                        )
                      ).size
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Departments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {
                      new Set(
                        employees.flatMap(
                          (emp: any) => emp.customClaims?.assignedRegions || []
                        )
                      ).size
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Covered Regions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Employee Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employee Directory
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Access Level</TableCell>
                  <TableCell>Territory</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee: any) => (
                  <TableRow key={employee.uid}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {employee.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {employee.customClaims?.employeeId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.customClaims?.role?.toUpperCase()}
                        color={getRoleColor(employee.customClaims?.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {employee.customClaims?.department
                          ?.replace('_', ' ')
                          .toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {employee.customClaims?.position?.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Level ${employee.customClaims?.accessLevel}`}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        {employee.customClaims?.assignedRegions?.length > 0 && (
                          <Typography variant="caption" display="block">
                            Regions:{' '}
                            {employee.customClaims.assignedRegions.join(', ')}
                          </Typography>
                        )}
                        {employee.customClaims?.assignedParishes?.length >
                          0 && (
                          <Typography variant="caption" display="block">
                            Parishes:{' '}
                            {employee.customClaims.assignedParishes
                              .slice(0, 2)
                              .join(', ')}
                            {employee.customClaims.assignedParishes.length >
                              2 &&
                              ` +${
                                employee.customClaims.assignedParishes.length -
                                2
                              }`}
                          </Typography>
                        )}
                        {!employee.customClaims?.assignedRegions?.length &&
                          !employee.customClaims?.assignedParishes?.length && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              National Access
                            </Typography>
                          )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          employee.customClaims?.isActive
                            ? 'Active'
                            : 'Inactive'
                        }
                        color={getStatusColor(employee.customClaims?.isActive)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('view', employee)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Claims">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('edit', employee)}
                            disabled={
                              !roleChecker.hasPermission('manage_staff')
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Employee Claims Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {viewMode === 'create'
            ? 'Add New Employee'
            : viewMode === 'edit'
            ? 'Edit Employee Claims'
            : 'Employee Details'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeId}
                onChange={e =>
                  setFormData(prev => ({ ...prev, employeeId: e.target.value }))
                }
                disabled={viewMode === 'view'}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                disabled={viewMode === 'view' || viewMode === 'edit'}
                required={viewMode === 'create'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Display Name"
                value={formData.displayName}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                disabled={viewMode === 'view'}
                required={viewMode === 'create'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    disabled={viewMode === 'view'}
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Role & Permissions */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Role & Permissions
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      role: e.target.value as any,
                    }))
                  }
                  disabled={viewMode === 'view'}
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="host">Host</MenuItem>
                  <MenuItem value="guest">Guest</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      department: e.target.value as any,
                    }))
                  }
                  disabled={viewMode === 'view'}
                >
                  <MenuItem value="customer_service">Customer Service</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="it">IT</MenuItem>
                  <MenuItem value="management">Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={formData.position}
                  label="Position"
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      position: e.target.value as any,
                    }))
                  }
                  disabled={viewMode === 'view'}
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="director">Director</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Access Level</InputLabel>
                <Select
                  value={formData.accessLevel}
                  label="Access Level"
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      accessLevel: Number(e.target.value),
                    }))
                  }
                  disabled={viewMode === 'view'}
                >
                  <MenuItem value={1}>Level 1 - Basic Staff</MenuItem>
                  <MenuItem value={2}>Level 2 - Senior Staff</MenuItem>
                  <MenuItem value={3}>Level 3 - Supervisor</MenuItem>
                  <MenuItem value={4}>Level 4 - Manager</MenuItem>
                  <MenuItem value={5}>Level 5 - Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Geographic Access */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Geographic Access
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={JAMAICA_REGIONS}
                value={formData.assignedRegions}
                onChange={(_, newValue) =>
                  setFormData(prev => ({ ...prev, assignedRegions: newValue }))
                }
                disabled={viewMode === 'view'}
                renderInput={params => (
                  <TextField {...params} label="Assigned Regions" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={JAMAICA_PARISHES}
                value={formData.assignedParishes}
                onChange={(_, newValue) =>
                  setFormData(prev => ({ ...prev, assignedParishes: newValue }))
                }
                disabled={viewMode === 'view'}
                renderInput={params => (
                  <TextField {...params} label="Assigned Parishes" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            {/* Permissions Preview */}
            {viewMode !== 'create' && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Permissions Preview
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {getPermissionChips(
                    formData.position,
                    formData.accessLevel
                  ).map(permission => (
                    <Chip
                      key={permission}
                      label={permission.replace(/_/g, ' ').toUpperCase()}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                  <Chip
                    label={`+${
                      (
                        PERMISSION_SETS[
                          formData.position.toUpperCase() as keyof typeof PERMISSION_SETS
                        ] || []
                      ).length - 3
                    } more`}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {viewMode !== 'view' && (
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={loading || !roleChecker.hasPermission('manage_staff')}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {viewMode === 'create' ? 'Create Employee' : 'Update Claims'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* New Employee Wizard */}
      <NewEmployeeWizard
        open={newEmployeeWizardOpen}
        onClose={() => setNewEmployeeWizardOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </Box>
  );
};

export default EmployeeClaimsManagement;
