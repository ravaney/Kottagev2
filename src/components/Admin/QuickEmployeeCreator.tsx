import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  Typography
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useCreateEmployee } from '../../hooks/useUserClaims';

interface QuickEmployeeCreatorProps {
  open: boolean;
  onClose: () => void;
  onEmployeeCreated?: (employee: any) => void;
}

/**
 * Simple form to quickly create an employee with email/password
 * This is an alternative to the full wizard for simpler use cases
 */
export const QuickEmployeeCreator: React.FC<QuickEmployeeCreatorProps> = ({
  open,
  onClose,
  onEmployeeCreated
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    department: 'customer_service' as const,
    position: 'staff' as const,
    role: 'staff' as const,
    sendWelcomeEmail: true
  });

  const { loading, error, createEmployeeWithEmailPassword, clearError } = useCreateEmployee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate employee ID
      const employeeId = `EMP_${formData.department.substring(0, 3).toUpperCase()}_${Date.now()}`;
      
      const result = await createEmployeeWithEmailPassword(
        formData.email,
        formData.password,
        {
          displayName: formData.displayName,
          employeeId,
          department: formData.department,
          position: formData.position,
          role: formData.role,
          accessLevel: formData.role === 'staff' ? 2 : formData.role === 'admin' ? 4 : 5,
          sendWelcomeEmail: formData.sendWelcomeEmail
        }
      );

      // Call success callback
      if (onEmployeeCreated && result) {
        onEmployeeCreated((result as any).employee || result);
      }

      // Reset form and close
      setFormData({
        email: '',
        password: '',
        displayName: '',
        department: 'customer_service',
        position: 'staff',
        role: 'staff',
        sendWelcomeEmail: true
      });
      onClose();

    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Quick Employee Creation</DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="textSecondary" gutterBottom>
            Create a new employee account with email and password
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                helperText="Temporary password for the employee"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    department: e.target.value as typeof formData.department 
                  }))}
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
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    position: e.target.value as typeof formData.position 
                  }))}
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="director">Director</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    role: e.target.value as typeof formData.role 
                  }))}
                >
                  <MenuItem value="staff">Staff (Basic Access)</MenuItem>
                  <MenuItem value="admin">Admin (Full Access)</MenuItem>
                  <MenuItem value="super_admin">Super Admin (System Access)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.email || !formData.displayName || !formData.password}
          >
            {loading ? <CircularProgress size={20} /> : 'Create Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuickEmployeeCreator;
