# Firebase Custom Claims for Kottage Platform

## Overview
This document outlines the comprehensive custom claims structure for Firebase Authentication in the Kottage platform, covering employees, guests, and hosts with role-based access control.

## Claims Structure Summary

### **Base Claims (All Users)**
```typescript
{
  role: 'guest' | 'host' | 'staff' | 'admin' | 'super_admin',
  userType: 'customer' | 'employee',
  isEmployee: boolean,
  isActive: boolean,
  createdAt: string,
  lastLogin: string
}
```

## **1. Employee Claims**

### **Core Employee Structure**
```typescript
{
  // Identity & Role
  employeeId: string,                    // "EMP_001_2024"
  role: 'staff' | 'admin' | 'super_admin',
  userType: 'employee',
  isEmployee: true,
  
  // Organizational Structure
  department: 'customer_service' | 'operations' | 'finance' | 'marketing' | 'it' | 'management',
  position: 'staff' | 'supervisor' | 'manager' | 'director' | 'admin',
  accessLevel: 1 | 2 | 3 | 4 | 5,       // 1=basic staff, 5=super admin
  
  // Geographic Access Control
  assignedRegions: string[],              // ['north_coast', 'south_coast']
  assignedParishes: string[],             // ['st_james', 'st_ann', 'kingston']
  territorialAccess: 'parish' | 'region' | 'national',
  
  // Granular Permissions
  permissions: string[],                  // Array of specific permissions
  
  // Operational Capabilities
  canModerateReviews: boolean,
  canManageBookings: boolean,
  canAccessFinancials: boolean,
  canManageUsers: boolean,
  canManageProperties: boolean,
  canAccessAnalytics: boolean,
  canHandleDisputes: boolean,
  canProcessPayouts: boolean,
  canAssignStaff: boolean,
  canViewReports: boolean
}
```

### **Employee Permission Sets**
```typescript
// STAFF Level (Access Level 1-2)
[
  'read_bookings', 'write_bookings',
  'read_users', 'read_properties',
  'read_reviews', 'moderate_reviews'
]

// SUPERVISOR Level (Access Level 2-3)
[
  'read_bookings', 'write_bookings', 'cancel_bookings',
  'read_users', 'write_users',
  'read_properties', 'write_properties',
  'read_reviews', 'moderate_reviews', 'delete_reviews',
  'read_analytics'
]

// MANAGER Level (Access Level 3-4)
[
  'read_bookings', 'write_bookings', 'cancel_bookings',
  'read_users', 'write_users', 'suspend_users',
  'read_properties', 'write_properties', 'approve_properties',
  'read_reviews', 'moderate_reviews', 'delete_reviews',
  'read_financials', 'process_payouts',
  'read_analytics', 'export_data', 'generate_reports',
  'manage_staff'
]

// ADMIN Level (Access Level 4-5)
[
  'read_bookings', 'write_bookings', 'cancel_bookings',
  'read_users', 'write_users', 'suspend_users',
  'read_properties', 'write_properties', 'approve_properties',
  'read_reviews', 'moderate_reviews', 'delete_reviews',
  'read_financials', 'process_payouts', 'refund_payments',
  'read_analytics', 'export_data', 'generate_reports',
  'manage_staff', 'assign_territories', 'view_admin_panel'
]
```

### **Geographic Access Levels**
- **Parish Level**: Access to specific parishes (St. James, St. Ann, etc.)
- **Regional Level**: Access to regions (North Coast, South Coast, etc.)
- **National Level**: Access to all of Jamaica

## **2. Guest Claims**

### **Guest Structure**
```typescript
{
  // Identity & Status
  guestId: string,                       // "guest_abc123_1640995200000"
  role: 'guest',
  userType: 'customer',
  isEmployee: false,
  
  // Membership & Status
  membershipLevel: 'basic' | 'silver' | 'gold' | 'platinum',
  accountStatus: 'active' | 'suspended' | 'pending_verification',
  
  // Verification Status
  verificationStatus: {
    email: boolean,
    phone: boolean,
    identity: boolean,                   // Government ID verified
    payment: boolean                     // Payment method verified
  },
  
  // Booking History & Metrics
  bookingHistory: {
    totalBookings: number,
    totalSpent: number,
    averageRating: number,
    lastBookingDate: string
  },
  
  // Preferences & Behavior
  preferences: {
    favoriteRegions: string[],           // ['montego_bay', 'negril']
    propertyTypes: string[],             // ['villa', 'apartment', 'cottage']
    priceRange: {
      min: number,
      max: number
    }
  },
  
  // Loyalty & Permissions
  loyaltyPoints: number,
  canBookProperties: boolean,
  canLeaveReviews: boolean
}
```

### **Guest Membership Levels**
- **Basic**: New users, basic booking privileges
- **Silver**: 5+ bookings, priority customer service
- **Gold**: 15+ bookings, early access to new properties
- **Platinum**: 50+ bookings, exclusive deals and concierge service

## **3. Host Claims**

### **Host Structure**
```typescript
{
  // Identity & Status
  hostId: string,                        // "host_def456_1640995200000"
  role: 'host',
  userType: 'customer',
  isEmployee: false,
  
  // Host Status & Level
  hostStatus: 'pending' | 'active' | 'suspended' | 'deactivated',
  hostLevel: 'new' | 'experienced' | 'superhost',
  
  // Comprehensive Verification
  verificationStatus: {
    email: boolean,
    phone: boolean,
    identity: boolean,                   // Government ID
    business: boolean,                   // Business registration
    tax: boolean,                        // Tax documentation
    property: boolean                    // Property ownership/lease
  },
  
  // Business Performance Metrics
  businessMetrics: {
    propertyCount: number,
    totalEarnings: number,
    averageRating: number,
    responseRate: number,                // % of inquiries responded to within 24hrs
    acceptanceRate: number,              // % of booking requests accepted
    cancellationRate: number             // % of bookings cancelled by host
  },
  
  // Host Permissions
  permissions: {
    canListProperties: boolean,          // Can create new listings
    canReceiveBookings: boolean,         // Can accept reservations
    canWithdrawEarnings: boolean,        // Can request payouts
    canModifyPricing: boolean            // Can update rates
  },
  
  // Financial Setup
  payoutSetup: boolean,                  // Bank account/payment method configured
  taxDocuments: boolean                  // Tax forms submitted
}
```

### **Host Levels**
- **New**: 0-5 bookings, learning the platform
- **Experienced**: 5+ bookings, established presence
- **Superhost**: Top 10% performers, exceptional ratings and service

## **Usage Examples**

### **Setting Employee Claims**
```typescript
const employeeData = {
  employeeId: "EMP_001_2024",
  role: "staff",
  department: "customer_service",
  position: "supervisor",
  accessLevel: 3,
  assignedRegions: ["north_coast"],
  assignedParishes: ["st_james", "st_ann"]
};

await setEmployeeClaims(userUid, employeeData);
```

### **Checking Permissions**
```typescript
const roleChecker = useRoleChecker();

// Check if user can access admin portal
if (roleChecker.canAccessAdminPortal()) {
  // Show admin navigation
}

// Check specific permission
if (roleChecker.hasPermission('moderate_reviews')) {
  // Show review moderation tools
}

// Check regional access
if (roleChecker.hasRegionalAccess('north_coast')) {
  // Show North Coast properties
}
```

### **Role-Based Routing**
```typescript
// Protect admin routes
if (!roleChecker.canAccessAdminPortal()) {
  navigate('/unauthorized');
}

// Protect staff features
if (!roleChecker.hasPermission('manage_bookings')) {
  throw new Error('Insufficient permissions');
}
```

## **Security Considerations**

### **Claim Validation**
- All claims are set server-side via Firebase Cloud Functions
- Claims are digitally signed and cannot be tampered with client-side
- Regular audit logs track all claim modifications

### **Permission Inheritance**
- Higher access levels inherit lower-level permissions
- Admin roles can perform all staff functions
- Regional access includes parish-level access within that region

### **Verification Requirements**
- Hosts must complete verification before listing properties
- Employees require background checks for financial permissions
- Regular re-verification for high-privilege accounts

## **Implementation Benefits**

1. **Fine-Grained Access Control**: Specific permissions for different operations
2. **Geographic Restrictions**: Limit staff access to assigned territories
3. **Progressive Verification**: Step-by-step verification process
4. **Audit Trail**: Complete logging of permission changes
5. **Scalable Roles**: Easy to add new roles and permissions
6. **Security**: Server-side claim management prevents tampering

## **Compliance & Privacy**

- Claims contain only necessary operational data
- Personal information is stored separately in Firestore
- GDPR-compliant data handling
- Regular claim cleanup for inactive accounts
- Data minimization principles applied

This comprehensive claims system provides robust role-based access control while maintaining security and scalability for the Kottage platform.
