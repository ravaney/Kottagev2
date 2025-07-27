import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,

  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { EmployeePermission, PERMISSION_SETS } from '../../utils/firebaseClaims';

interface BulkClaimsOperationProps {
  open: boolean;
  onClose: () => void;
  selectedEmployees: string[];
  onApply: (updates: any) => Promise<void>;
}

const BulkClaimsOperation: React.FC<BulkClaimsOperationProps> = ({
  open,
  onClose,
  selectedEmployees,
  onApply
}) => {
  const [operationType, setOperationType] = useState<'role' | 'permissions' | 'territory' | 'status'>('role');
  const [updates, setUpdates] = useState<any>({});

  const handleApply = async () => {
    await onApply(updates);
    onClose();
    setUpdates({});
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Bulk Update Employee Claims
        <Typography variant="body2" color="text.secondary">
          Applying changes to {selectedEmployees.length} employees
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Operation Type</InputLabel>
              <Select
                value={operationType}
                label="Operation Type"
                onChange={(e) => setOperationType(e.target.value as any)}
              >
                <MenuItem value="role">Update Roles</MenuItem>
                <MenuItem value="permissions">Update Permissions</MenuItem>
                <MenuItem value="territory">Update Territory Access</MenuItem>
                <MenuItem value="status">Update Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {operationType === 'role' && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>New Role</InputLabel>
                  <Select
                    value={updates.role || ''}
                    label="New Role"
                    onChange={(e) => setUpdates((prev: any) => ({ ...prev, role: e.target.value }))}
                  >
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="super_admin">Super Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Access Level</InputLabel>
                  <Select
                    value={updates.accessLevel || ''}
                    label="Access Level"
                    onChange={(e) => setUpdates((prev: any) => ({ ...prev, accessLevel: Number(e.target.value) }))}
                  >
                    <MenuItem value={1}>Level 1 - Basic Staff</MenuItem>
                    <MenuItem value={2}>Level 2 - Senior Staff</MenuItem>
                    <MenuItem value={3}>Level 3 - Supervisor</MenuItem>
                    <MenuItem value={4}>Level 4 - Manager</MenuItem>
                    <MenuItem value={5}>Level 5 - Super Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {operationType === 'permissions' && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Permission Templates
              </Typography>
              <FormGroup>
                {Object.entries(PERMISSION_SETS).map(([role, permissions]) => (
                  <FormControlLabel
                    key={role}
                    control={
                      <Checkbox
                        checked={updates.permissionTemplate === role}
                        onChange={(e) => setUpdates((prev: any) => ({ 
                          ...prev, 
                          permissionTemplate: e.target.checked ? role : null,
                          permissions: e.target.checked ? permissions : []
                        }))}
                      />
                    }
                    label={`${role} Permissions (${permissions.length} permissions)`}
                  />
                ))}
              </FormGroup>
            </Grid>
          )}

          {operationType === 'territory' && (
            <>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Territory Access</InputLabel>
                  <Select
                    value={updates.territorialAccess || ''}
                    label="Territory Access"
                    onChange={(e) => setUpdates((prev: any) => ({ ...prev, territorialAccess: e.target.value }))}
                  >
                    <MenuItem value="parish">Parish Level</MenuItem>
                    <MenuItem value="region">Regional Level</MenuItem>
                    <MenuItem value="national">National Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  Territory assignments will be cleared and need to be reassigned individually.
                </Alert>
              </Grid>
            </>
          )}

          {operationType === 'status' && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={updates.isActive !== false}
                    onChange={(e) => setUpdates((prev: any) => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active Status"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleApply}
          variant="contained"
          disabled={Object.keys(updates).length === 0}
        >
          Apply to {selectedEmployees.length} Employees
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PermissionAuditDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  employee: any;
}> = ({ open, onClose, employee }) => {
  const getPermissionsByPosition = (position: string) => {
    return PERMISSION_SETS[position?.toUpperCase() as keyof typeof PERMISSION_SETS] || [];
  };

  const groupPermissions = (permissions: EmployeePermission[]) => {
    const groups: { [key: string]: EmployeePermission[] } = {
      'Booking Management': [],
      'User Management': [],
      'Property Management': [],
      'Review Management': [],
      'Financial Operations': [],
      'Analytics & Reports': [],
      'Staff Management': []
    };

    permissions.forEach(permission => {
      if (permission.includes('booking')) groups['Booking Management'].push(permission);
      else if (permission.includes('user')) groups['User Management'].push(permission);
      else if (permission.includes('properties')) groups['Property Management'].push(permission);
      else if (permission.includes('review')) groups['Review Management'].push(permission);
      else if (permission.includes('financial') || permission.includes('payout') || permission.includes('refund')) {
        groups['Financial Operations'].push(permission);
      }
      else if (permission.includes('analytics') || permission.includes('export') || permission.includes('reports')) {
        groups['Analytics & Reports'].push(permission);
      }
      else if (permission.includes('staff') || permission.includes('assign')) groups['Staff Management'].push(permission);
    });

    return groups;
  };

  if (!employee) return null;

  const permissions = getPermissionsByPosition(employee.position);
  const groupedPermissions = groupPermissions(permissions);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Permission Audit: {employee.displayName}
        <Typography variant="body2" color="text.secondary">
          {employee.position?.toUpperCase()} - Access Level {employee.accessLevel}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Employee Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Employee ID:</strong> {employee.employeeId}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Department:</strong> {employee.department?.replace('_', ' ').toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Role:</strong> {employee.role?.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Territory:</strong> {
                  employee.assignedRegions?.length > 0 ? 'Regional' :
                  employee.assignedParishes?.length > 0 ? 'Parish' : 'National'
                }
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h6" gutterBottom>
          Permission Breakdown ({permissions.length} total permissions)
        </Typography>
        
        {Object.entries(groupedPermissions).map(([group, perms]) => 
          perms.length > 0 && (
            <Accordion key={group}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {group} ({perms.length} permissions)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {perms.map(permission => (
                    <ListItem key={permission}>
                      <ListItemText 
                        primary={permission.replace(/_/g, ' ').toUpperCase()}
                        secondary={getPermissionDescription(permission)}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Capability Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Security Level
                  </Typography>
                  <Typography variant="body2">
                    Access Level {employee.accessLevel} - {getAccessLevelDescription(employee.accessLevel)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Geographic Scope
                  </Typography>
                  <Typography variant="body2">
                    {employee.assignedRegions?.length > 0 && `Regions: ${employee.assignedRegions.join(', ')}`}
                    {employee.assignedParishes?.length > 0 && `Parishes: ${employee.assignedParishes.join(', ')}`}
                    {(!employee.assignedRegions?.length && !employee.assignedParishes?.length) && 'National Access'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const getPermissionDescription = (permission: EmployeePermission): string => {
  const descriptions: { [key in EmployeePermission]: string } = {
    'read_bookings': 'View booking information and history',
    'write_bookings': 'Create and modify bookings',
    'cancel_bookings': 'Cancel existing bookings',
    'read_users': 'View user profiles and information',
    'write_users': 'Edit user profiles and data',
    'suspend_users': 'Suspend or activate user accounts',
    'read_properties': 'View property listings and details',
    'write_properties': 'Edit property information',
    'approve_properties': 'Approve new property listings',
    'read_reviews': 'View reviews and ratings',
    'moderate_reviews': 'Edit or hide inappropriate reviews',
    'delete_reviews': 'Permanently delete reviews',
    'read_financials': 'View financial data and reports',
    'process_payouts': 'Process host payouts',
    'refund_payments': 'Issue refunds to guests',
    'read_analytics': 'View analytics and metrics',
    'export_data': 'Export data for external analysis',
    'generate_reports': 'Create custom reports',
    'manage_staff': 'Manage employee accounts and permissions',
    'assign_territories': 'Assign geographic territories to staff',
    'view_admin_panel': 'Access administrative dashboard'
  };
  return descriptions[permission] || 'No description available';
};

const getAccessLevelDescription = (level: number): string => {
  const descriptions = {
    1: 'Basic operations and customer support',
    2: 'Senior staff with additional responsibilities',
    3: 'Supervisory level with team management',
    4: 'Management level with department oversight',
    5: 'Executive level with full system access'
  };
  return descriptions[level as keyof typeof descriptions] || 'Unknown level';
};

export { BulkClaimsOperation, PermissionAuditDialog };
