import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Add, Group } from '@mui/icons-material';
import { NewEmployeeWizard } from './NewEmployeeWizard';
import { useEmployees } from '../../hooks/useEmployees';

export const EmployeeManagementActions: React.FC = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { refreshEmployees } = useEmployees();

  const handleEmployeeCreated = (employee: any) => {
    setSuccessMessage(`Employee ${employee.displayName} created successfully!`);
    refreshEmployees(); // Refresh the employee list
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Group sx={{ mr: 1 }} />
            <Typography variant="h6">Employee Management</Typography>
          </Box>
          
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Create new employee accounts with custom roles, permissions, and territorial access.
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setWizardOpen(true)}
            sx={{ mt: 2 }}
          >
            Create New Employee
          </Button>
        </CardContent>
      </Card>

      <NewEmployeeWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </Box>
  );
};

export default EmployeeManagementActions;
