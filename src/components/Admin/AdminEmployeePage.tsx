import React from 'react';
import {
  Container,
  Typography,
  Box
} from '@mui/material';
import EmployeeManagement from './EmployeeManagement';

/**
 * Admin Employee Management page with integrated New Employee Wizard
 * This demonstrates the complete employee management workflow:
 * 1. Create new employees with the wizard (integrated into EmployeeManagement)
 * 2. Manage existing employee claims and permissions
 * 3. View employee directory and analytics
 * 4. Bulk operations and advanced management
 */
export const AdminEmployeePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Employee Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create and manage employee accounts, roles, permissions, and departmental assignments
        </Typography>
      </Box>

      {/* Unified Employee Management with integrated New Employee Wizard */}
      <EmployeeManagement />
    </Container>
  );
};

export default AdminEmployeePage;
