# New Employee Wizard

A comprehensive multi-step wizard for creating new employees with custom roles, permissions, and territorial access in the Kottage employee management system.

## Features

- **6-Step Wizard Process**:
  1. Basic Information (email, name, profile picture)
  2. Employee Details (department, position, employee ID)
  3. Role & Access Level (staff, admin, super_admin)
  4. Territorial Access (parish, region, national)
  5. Permissions & Capabilities (granular permission control)
  6. Review & Create (confirmation before creation)

- **Automatic Permission Assignment**: Permissions are automatically assigned based on role selection
- **Territorial Access Control**: Assign employees to specific parishes or regions in Jamaica
- **Custom Claims Integration**: Full integration with Firebase custom claims system
- **Validation**: Step-by-step validation ensures all required information is provided
- **Permission Checking**: Only authorized users can create employees

## Components

### NewEmployeeWizard

The main wizard component that handles the employee creation process.

```tsx
import { NewEmployeeWizard } from './components/Admin/NewEmployeeWizard';

const MyAdminPage = () => {
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleEmployeeCreated = (employee: any) => {
    console.log('New employee created:', employee);
    // Refresh employee list, show success message, etc.
  };

  return (
    <div>
      <Button onClick={() => setWizardOpen(true)}>
        Create New Employee
      </Button>
      
      <NewEmployeeWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </div>
  );
};
```

### EmployeeManagementActions

A pre-built component that includes the wizard with success messaging and integration.

```tsx
import { EmployeeManagementActions } from './components/Admin/EmployeeManagementActions';

const AdminDashboard = () => {
  return (
    <div>
      <EmployeeManagementActions />
    </div>
  );
};
```

### AdminEmployeePage

A complete example page showing full employee management integration.

```tsx
import AdminEmployeePage from './components/Admin/AdminEmployeePage';

// Use as a complete admin page
<AdminEmployeePage />
```

## Step-by-Step Process

### Step 1: Basic Information
- **Email Address**: The employee's login email (required)
- **Display Name**: Full name as it appears in the system (required)
- **Photo URL**: Optional profile picture URL
- **Welcome Email**: Toggle to send login instructions via email

### Step 2: Employee Details
- **Employee ID**: Auto-generated based on department (editable)
- **Department**: Choose from predefined departments
- **Position**: Employee position/title
- **Start Date**: Employment start date
- **Active Status**: Whether the employee account is active

### Step 3: Role & Access Level
- **Staff**: Basic access to view bookings and properties
- **Admin**: Can manage bookings, users, and moderate content
- **Super Admin**: Full system access including financial operations
- **Access Level**: Automatically set based on role (1-5 scale)

### Step 4: Territorial Access
- **Parish Level**: Access to specific parishes
- **Regional Level**: Access to entire regions
- **National Level**: Access to all of Jamaica
- **Assigned Regions**: Select specific regions (if applicable)
- **Assigned Parishes**: Select specific parishes (if applicable)

### Step 5: Permissions & Capabilities
- **System Permissions**: Granular permissions for different system operations
- **Specific Capabilities**: Boolean flags for special abilities
- **Auto-Assignment**: Permissions are automatically assigned based on role but can be customized

### Step 6: Review & Create
- **Summary View**: Review all entered information
- **Validation**: Final validation before creation
- **Firebase Integration**: Creates user account and sets custom claims

## Permissions Required

To use the New Employee Wizard, the current user must have one of the following:
- `manage_staff` permission
- `canManageUsers` capability
- `admin` or `super_admin` role

## Firebase Integration

### Cloud Function
The wizard integrates with the `createEmployee` Cloud Function which:
- Creates the Firebase Auth user account
- Sets custom claims on the account
- Stores additional data in Firestore
- Sends welcome email with login instructions
- Handles all error cases and validation

### Custom Claims Structure
Each employee gets a comprehensive set of custom claims:

```typescript
interface EmployeeClaims {
  role: 'staff' | 'admin' | 'super_admin';
  userType: 'employee';
  isEmployee: true;
  isActive: boolean;
  employeeId: string;
  department: string;
  position: string;
  accessLevel: 1 | 2 | 3 | 4 | 5;
  assignedRegions: string[];
  assignedParishes: string[];
  territorialAccess: 'parish' | 'region' | 'national';
  permissions: EmployeePermission[];
  // ... specific capabilities
}
```

## Error Handling

The wizard includes comprehensive error handling:
- **Validation Errors**: Step-by-step validation with clear error messages
- **Permission Errors**: Clear messages when user lacks required permissions
- **Network Errors**: Proper handling of Firebase and network failures
- **Duplicate Email**: Handles cases where email already exists

## Customization

### Adding New Departments
Update the `departments` array in `NewEmployeeWizard.tsx`:

```typescript
const departments = [
  'management',
  'customer_service',
  'operations',
  'your_new_department', // Add here
  // ...
];
```

### Adding New Permissions
1. Add the permission to `EmployeePermission` type in `firebaseClaims.ts`
2. Add description to `permissionDescriptions` in the wizard
3. Update automatic permission assignment logic

### Custom Validation
Add custom validation logic in the `isStepValid` function:

```typescript
const isStepValid = (step: number): boolean => {
  switch (step) {
    case 0:
      return !!(employeeData.email && employeeData.displayName && customValidation());
    // ...
  }
};
```

## Integration with Employee Management

The wizard integrates seamlessly with the existing employee management system:
- **useEmployees Hook**: Automatically refreshes employee list after creation
- **Employee Directory**: New employees appear immediately in the directory
- **Claims Management**: Can modify claims immediately after creation
- **Search and Filtering**: New employees are searchable and filterable

## Best Practices

1. **Always validate permissions** before allowing access to the wizard
2. **Refresh employee lists** after successful creation
3. **Show success/error messages** to provide user feedback
4. **Use territorial access** appropriately based on your business needs
5. **Review generated employee IDs** to ensure they meet your naming conventions
6. **Test email functionality** in your environment before production use

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure the current user has `manage_staff` permission
2. **Email Already Exists**: Firebase Auth doesn't allow duplicate emails
3. **Claims Not Applied**: Check that the Cloud Function is properly deployed
4. **Territorial Access Not Working**: Verify region/parish names match your system

### Debug Mode

Enable debug logging in the browser console to see detailed operation flow:

```typescript
// Add to your environment configuration
if (process.env.NODE_ENV === 'development') {
  console.log('Employee wizard debug mode enabled');
}
```

## Future Enhancements

- **Bulk Employee Import**: CSV/Excel import functionality
- **Employee Templates**: Pre-configured role templates
- **Advanced Territorial Management**: Hierarchical territory assignment
- **Email Template Customization**: Custom welcome email templates
- **Audit Trail**: Track who created which employees when
- **Employee Photo Upload**: Direct photo upload instead of URL input
