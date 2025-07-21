# Firebase Claims & Permissions Documentation

## Overview
This document provides comprehensive documentation for the Firebase custom claims and permissions system implemented in the Kottage V2 application. The system supports role-based access control (RBAC) with geographic restrictions specific to Jamaica's administrative divisions.

## Table of Contents
1. [User Types](#user-types)
2. [Employee Claims Structure](#employee-claims-structure)
3. [Guest Claims Structure](#guest-claims-structure)
4. [Host Claims Structure](#host-claims-structure)
5. [Permission Enums](#permission-enums)
6. [Geographic Enums](#geographic-enums)
7. [Department & Position Enums](#department--position-enums)
8. [Permission Sets](#permission-sets)
9. [Access Levels](#access-levels)
10. [Implementation Examples](#implementation-examples)

---

## User Types

### UserType Enum
```typescript
enum UserType {
  GUEST = 'guest',
  HOST = 'host', 
  EMPLOYEE = 'employee'
}
```

### Employee Role Hierarchy
```typescript
enum EmployeeRole {
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

---

## Employee Claims Structure

### EmployeeClaims Interface
```typescript
interface EmployeeClaims extends BaseUserClaims {
  userType: 'employee';
  employeeId: string;
  role: 'staff' | 'admin' | 'super_admin';
  department: EmployeeDepartment;
  position: EmployeePosition;
  accessLevel: number; // 1-10 scale
  assignedRegions: JamaicanRegion[];
  assignedParishes: JamaicanParish[];
  customPermissions: EmployeePermission[];
  isActive: boolean;
  hireDate: string;
  lastUpdated: string;
  updatedBy: string;
}
```

### Department Enum
```typescript
enum EmployeeDepartment {
  CUSTOMER_SERVICE = 'customer_service',
  HOUSEKEEPING = 'housekeeping',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
  FRONT_DESK = 'front_desk',
  FOOD_BEVERAGE = 'food_beverage',
  ADMINISTRATION = 'administration',
  MARKETING = 'marketing',
  ACCOUNTING = 'accounting',
  MANAGEMENT = 'management'
}
```

### Position Enum
```typescript
enum EmployeePosition {
  STAFF = 'staff',
  SUPERVISOR = 'supervisor',
  MANAGER = 'manager',
  DIRECTOR = 'director',
  ADMIN = 'admin'
}
```

---

## Guest Claims Structure

### GuestClaims Interface
```typescript
interface GuestClaims extends BaseUserClaims {
  userType: 'guest';
  guestLevel: GuestLevel;
  loyaltyPoints: number;
  preferredRegions: JamaicanRegion[];
  verificationStatus: GuestVerificationStatus;
  bookingHistory: BookingHistoryLevel;
  specialRequests: GuestSpecialRequest[];
  communicationPreferences: CommunicationPreference[];
}
```

### Guest Level Enum
```typescript
enum GuestLevel {
  BRONZE = 'bronze',
  SILVER = 'silver', 
  GOLD = 'gold',
  PLATINUM = 'platinum',
  VIP = 'vip'
}
```

### Guest Verification Status
```typescript
enum GuestVerificationStatus {
  UNVERIFIED = 'unverified',
  EMAIL_VERIFIED = 'email_verified',
  PHONE_VERIFIED = 'phone_verified',
  IDENTITY_VERIFIED = 'identity_verified',
  FULLY_VERIFIED = 'fully_verified'
}
```

### Booking History Level
```typescript
enum BookingHistoryLevel {
  NEW_GUEST = 'new_guest',
  RETURNING_GUEST = 'returning_guest',
  FREQUENT_GUEST = 'frequent_guest',
  LOYAL_GUEST = 'loyal_guest'
}
```

---

## Host Claims Structure

### HostClaims Interface
```typescript
interface HostClaims extends BaseUserClaims {
  userType: 'host';
  hostLevel: HostLevel;
  verificationStatus: HostVerificationStatus;
  propertyCount: number;
  totalBookings: number;
  rating: number;
  activeRegions: JamaicanRegion[];
  activeParishes: JamaicanParish[];
  specializations: PropertySpecialization[];
  certifications: HostCertification[];
  isVerified: boolean;
  isSuperHost: boolean;
}
```

### Host Level Enum
```typescript
enum HostLevel {
  STARTER = 'starter',
  EXPERIENCED = 'experienced',
  PROFESSIONAL = 'professional',
  SUPER_HOST = 'super_host'
}
```

### Host Verification Status
```typescript
enum HostVerificationStatus {
  PENDING = 'pending',
  DOCUMENTS_SUBMITTED = 'documents_submitted',
  UNDER_REVIEW = 'under_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}
```

---

## Permission Enums

### Core Employee Permissions
```typescript
enum EmployeePermission {
  // Booking Management
  VIEW_BOOKINGS = 'view_bookings',
  EDIT_BOOKINGS = 'edit_bookings',
  CANCEL_BOOKINGS = 'cancel_bookings',
  CREATE_BOOKINGS = 'create_bookings',
  MANAGE_BOOKING_CALENDAR = 'manage_booking_calendar',
  
  // Guest Management
  VIEW_GUESTS = 'view_guests',
  EDIT_GUESTS = 'edit_guests',
  MANAGE_GUEST_PROFILES = 'manage_guest_profiles',
  VIEW_GUEST_HISTORY = 'view_guest_history',
  
  // Property Management
  VIEW_PROPERTIES = 'view_properties',
  EDIT_PROPERTIES = 'edit_properties',
  CREATE_PROPERTIES = 'create_properties',
  DELETE_PROPERTIES = 'delete_properties',
  MANAGE_PROPERTY_SETTINGS = 'manage_property_settings',
  
  // Staff Management
  MANAGE_STAFF = 'manage_staff',
  VIEW_STAFF = 'view_staff',
  EDIT_STAFF_PROFILES = 'edit_staff_profiles',
  MANAGE_STAFF_PERMISSIONS = 'manage_staff_permissions',
  
  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  EDIT_ANALYTICS = 'edit_analytics',
  VIEW_REPORTS = 'view_reports',
  EDIT_REPORTS = 'edit_reports',
  EXPORT_DATA = 'export_data',
  
  // Financial Management
  MANAGE_PAYMENTS = 'manage_payments',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  PROCESS_REFUNDS = 'process_refunds',
  MANAGE_PRICING = 'manage_pricing',
  
  // System Administration
  SYSTEM_ADMIN = 'system_admin',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  
  // Communication
  SEND_NOTIFICATIONS = 'send_notifications',
  MANAGE_MESSAGING = 'manage_messaging',
  BROADCAST_ANNOUNCEMENTS = 'broadcast_announcements'
}
```

### Guest Permissions
```typescript
enum GuestPermission {
  BOOK_PROPERTIES = 'book_properties',
  CANCEL_BOOKINGS = 'cancel_bookings',
  MODIFY_BOOKINGS = 'modify_bookings',
  LEAVE_REVIEWS = 'leave_reviews',
  CONTACT_HOSTS = 'contact_hosts',
  ACCESS_LOYALTY_PROGRAM = 'access_loyalty_program',
  REQUEST_SPECIAL_SERVICES = 'request_special_services'
}
```

### Host Permissions
```typescript
enum HostPermission {
  MANAGE_PROPERTIES = 'manage_properties',
  VIEW_BOOKINGS = 'view_bookings',
  ACCEPT_BOOKINGS = 'accept_bookings',
  DECLINE_BOOKINGS = 'decline_bookings',
  COMMUNICATE_WITH_GUESTS = 'communicate_with_guests',
  SET_PRICING = 'set_pricing',
  MANAGE_CALENDAR = 'manage_calendar',
  VIEW_ANALYTICS = 'view_analytics',
  REQUEST_PAYOUTS = 'request_payouts'
}
```

---

## Geographic Enums

### Jamaican Parishes
```typescript
enum JamaicanParish {
  KINGSTON = 'Kingston',
  ST_ANDREW = 'St. Andrew',
  ST_THOMAS = 'St. Thomas',
  PORTLAND = 'Portland',
  ST_MARY = 'St. Mary',
  ST_ANN = 'St. Ann',
  TRELAWNY = 'Trelawny',
  ST_JAMES = 'St. James',
  HANOVER = 'Hanover',
  WESTMORELAND = 'Westmoreland',
  ST_ELIZABETH = 'St. Elizabeth',
  MANCHESTER = 'Manchester',
  CLARENDON = 'Clarendon',
  ST_CATHERINE = 'St. Catherine'
}
```

### Jamaican Regions
```typescript
enum JamaicanRegion {
  KINGSTON_METROPOLITAN_AREA = 'Kingston Metropolitan Area',
  BLUE_MOUNTAINS = 'Blue Mountains',
  NORTH_COAST = 'North Coast',
  SOUTH_COAST = 'South Coast',
  CENTRAL_JAMAICA = 'Central Jamaica',
  WESTERN_JAMAICA = 'Western Jamaica'
}
```

---

## Permission Sets

### Predefined Permission Sets by Position
```typescript
const PERMISSION_SETS = {
  STAFF: [
    'view_bookings',
    'view_guests',
    'view_properties'
  ],
  
  SUPERVISOR: [
    'view_bookings',
    'edit_bookings',
    'view_guests',
    'edit_guests',
    'view_properties',
    'manage_staff'
  ],
  
  MANAGER: [
    'view_bookings',
    'edit_bookings',
    'cancel_bookings',
    'create_bookings',
    'view_guests',
    'edit_guests',
    'manage_guest_profiles',
    'view_properties',
    'edit_properties',
    'manage_staff',
    'view_analytics',
    'view_reports',
    'manage_payments'
  ],
  
  DIRECTOR: [
    'view_bookings',
    'edit_bookings',
    'cancel_bookings',
    'create_bookings',
    'view_guests',
    'edit_guests',
    'manage_guest_profiles',
    'view_properties',
    'edit_properties',
    'create_properties',
    'manage_staff',
    'view_analytics',
    'edit_analytics',
    'view_reports',
    'edit_reports',
    'manage_payments',
    'view_financial_reports',
    'manage_settings'
  ],
  
  ADMIN: [
    // All permissions - full system access
    'view_bookings',
    'edit_bookings',
    'cancel_bookings',
    'create_bookings',
    'manage_booking_calendar',
    'view_guests',
    'edit_guests',
    'manage_guest_profiles',
    'view_guest_history',
    'view_properties',
    'edit_properties',
    'create_properties',
    'delete_properties',
    'manage_property_settings',
    'manage_staff',
    'view_staff',
    'edit_staff_profiles',
    'manage_staff_permissions',
    'view_analytics',
    'edit_analytics',
    'view_reports',
    'edit_reports',
    'export_data',
    'manage_payments',
    'view_financial_reports',
    'process_refunds',
    'manage_pricing',
    'system_admin',
    'manage_settings',
    'view_audit_logs',
    'manage_integrations',
    'send_notifications',
    'manage_messaging',
    'broadcast_announcements'
  ]
};
```

---

## Access Levels

### Access Level Scale (1-10)
```typescript
enum AccessLevel {
  BASIC_STAFF = 1,        // Basic staff with read-only access
  SENIOR_STAFF = 2,       // Staff with limited edit permissions
  SUPERVISOR = 3,         // Departmental supervision capabilities
  MANAGER = 4,            // Cross-departmental management
  SENIOR_MANAGER = 5,     // Regional management capabilities
  DIRECTOR = 6,           // Multi-regional oversight
  SENIOR_DIRECTOR = 7,    // National operations oversight
  VP_LEVEL = 8,           // Strategic decision making
  C_LEVEL = 9,            // Executive level access
  SUPER_ADMIN = 10        // Full system administration
}
```

### Access Level Permissions Matrix
```typescript
const ACCESS_LEVEL_PERMISSIONS = {
  1: ['view_bookings', 'view_guests', 'view_properties'],
  2: ['view_bookings', 'edit_bookings', 'view_guests', 'view_properties'],
  3: ['view_bookings', 'edit_bookings', 'cancel_bookings', 'view_guests', 'edit_guests', 'view_properties', 'manage_staff'],
  4: ['view_bookings', 'edit_bookings', 'cancel_bookings', 'create_bookings', 'view_guests', 'edit_guests', 'view_properties', 'edit_properties', 'manage_staff', 'view_analytics'],
  5: ['view_bookings', 'edit_bookings', 'cancel_bookings', 'create_bookings', 'view_guests', 'edit_guests', 'manage_guest_profiles', 'view_properties', 'edit_properties', 'manage_staff', 'view_analytics', 'view_reports', 'manage_payments'],
  // ... continues for levels 6-10
};
```

---

## Implementation Examples

### 1. Creating Employee Claims
```typescript
const employeeClaims: EmployeeClaims = {
  uid: 'emp_12345',
  userType: 'employee',
  employeeId: 'EMP_001_2024',
  role: 'manager',
  department: 'customer_service',
  position: 'manager',
  accessLevel: 4,
  assignedRegions: ['North Coast'],
  assignedParishes: ['St. James', 'St. Ann'],
  customPermissions: ['manage_staff', 'view_analytics'],
  isActive: true,
  hireDate: '2024-01-15',
  lastUpdated: '2024-07-19',
  updatedBy: 'admin_001'
};
```

### 2. Checking Permissions
```typescript
const claimsChecker = new ClaimsChecker(userClaims);

// Check if user has specific permission
if (claimsChecker.hasPermission('manage_staff')) {
  // Allow staff management
}

// Check access level
if (claimsChecker.hasAccessLevel(4)) {
  // Allow manager-level operations
}

// Check geographic access
if (claimsChecker.hasGeographicAccess('St. James')) {
  // Allow operations in St. James parish
}
```

### 3. Role-Based Component Rendering
```typescript
const AdminPanel = () => {
  const roleChecker = useRoleChecker();
  
  return (
    <Box>
      {roleChecker.hasPermission('view_analytics') && (
        <AnalyticsSection />
      )}
      
      {roleChecker.hasPermission('manage_staff') && (
        <StaffManagementSection />
      )}
      
      {roleChecker.canAccessAdminPortal() && (
        <AdminControls />
      )}
    </Box>
  );
};
```

### 4. Geographic Restrictions
```typescript
const PropertyManagement = () => {
  const { claims } = useUserClaims();
  const claimsChecker = new ClaimsChecker(claims);
  
  const getUserProperties = () => {
    if (claimsChecker.isEmployee(claims)) {
      // Filter properties by assigned parishes/regions
      return properties.filter(property => 
        claims.assignedParishes.includes(property.parish) ||
        claims.assignedRegions.includes(property.region)
      );
    }
    return properties;
  };
};
```

---

## Security Considerations

### 1. Server-Side Validation
All permission checks must be validated server-side using Firebase Cloud Functions:

```typescript
// Cloud Function example
export const updateBooking = functions.https.onCall(async (data, context) => {
  const claims = context.auth?.token;
  
  if (!claims || !ClaimsChecker.hasPermission(claims, 'edit_bookings')) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Insufficient permissions to edit bookings'
    );
  }
  
  // Proceed with booking update
});
```

### 2. Claims Refresh
Claims should be refreshed periodically and after any permission changes:

```typescript
const refreshUserClaims = async () => {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true); // Force refresh
  }
};
```

### 3. Audit Logging
All permission changes should be logged for compliance:

```typescript
const auditPermissionChange = async (
  targetUserId: string,
  adminUserId: string,
  changes: any
) => {
  await firestore.collection('audit_logs').add({
    type: 'permission_change',
    targetUserId,
    adminUserId,
    changes,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
};
```

---

## Migration & Updates

### Claim Structure Versioning
```typescript
interface BaseUserClaims {
  version: string; // e.g., "1.0.0"
  // ... other properties
}
```

### Backward Compatibility
When updating claim structures, maintain backward compatibility by checking the version:

```typescript
const migrateClaimsIfNeeded = (claims: any) => {
  if (!claims.version || claims.version < "1.0.0") {
    // Apply migration logic
    return migrateTo100(claims);
  }
  return claims;
};
```

---

This documentation serves as the comprehensive reference for all claims and permissions-related implementations in the Kottage V2 application. Regular updates should be made as the system evolves.
