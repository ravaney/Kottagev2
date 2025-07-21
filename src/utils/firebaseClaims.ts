// Firebase Custom Claims Types and Utilities

export interface BaseUserClaims {
  role: 'guest' | 'host' | 'staff' | 'admin' | 'super_admin';
  userType: 'customer' | 'employee';
  isEmployee: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface EmployeeClaims extends BaseUserClaims {
  // Employee Information
  employeeId: string;
  department: 'customer_service' | 'operations' | 'finance' | 'marketing' | 'it' | 'management';
  position: 'staff' | 'supervisor' | 'manager' | 'director' | 'admin';
  accessLevel: 1 | 2 | 3 | 4 | 5; // 1=basic staff, 5=super admin
  
  // Geographic Access
  assignedRegions: string[];
  assignedParishes: string[];
  territorialAccess: 'parish' | 'region' | 'national';
  
  // Permissions Array
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

export interface GuestClaims extends BaseUserClaims {
  guestId: string;
  membershipLevel: 'basic' | 'silver' | 'gold' | 'platinum';
  accountStatus: 'active' | 'suspended' | 'pending_verification';
  
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    payment: boolean;
  };
  
  bookingHistory: {
    totalBookings: number;
    totalSpent: number;
    averageRating: number;
    lastBookingDate: string;
  };
  
  preferences: {
    favoriteRegions: string[];
    propertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  
  loyaltyPoints: number;
  canBookProperties: boolean;
  canLeaveReviews: boolean;
}

export interface HostClaims extends BaseUserClaims {
  hostId: string;
  hostStatus: 'pending' | 'active' | 'suspended' | 'deactivated';
  hostLevel: 'new' | 'experienced' | 'superhost';
  
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    business: boolean;
    tax: boolean;
    property: boolean;
  };
  
  businessMetrics: {
    propertyCount: number;
    totalEarnings: number;
    averageRating: number;
    responseRate: number;
    acceptanceRate: number;
    cancellationRate: number;
  };
  
  permissions: {
    canListProperties: boolean;
    canReceiveBookings: boolean;
    canWithdrawEarnings: boolean;
    canModifyPricing: boolean;
  };
  
  payoutSetup: boolean;
  taxDocuments: boolean;
}

export type EmployeePermission = 
  | 'read_bookings' | 'write_bookings' | 'cancel_bookings'
  | 'read_users' | 'write_users' | 'suspend_users'
  | 'read_properties' | 'write_properties' | 'approve_properties'
  | 'read_reviews' | 'moderate_reviews' | 'delete_reviews'
  | 'read_financials' | 'process_payouts' | 'refund_payments'
  | 'read_analytics' | 'export_data' | 'generate_reports'
  | 'manage_staff' | 'assign_territories' | 'view_admin_panel';

// Utility functions for checking permissions
export class ClaimsChecker {
  static isEmployee(claims: any): claims is EmployeeClaims {
    return claims?.isEmployee === true && claims?.userType === 'employee';
  }

  static isGuest(claims: any): claims is GuestClaims {
    return claims?.role === 'guest' && claims?.userType === 'customer';
  }

  static isHost(claims: any): claims is HostClaims {
    return claims?.role === 'host' && claims?.userType === 'customer';
  }

  static isAdmin(claims: any): boolean {
    return claims?.role === 'admin' || claims?.role === 'super_admin';
  }

  static hasPermission(claims: EmployeeClaims, permission: EmployeePermission): boolean {
    return claims?.permissions?.includes(permission) || false;
  }

  static hasAccessLevel(claims: EmployeeClaims, minLevel: number): boolean {
    return (claims?.accessLevel || 0) >= minLevel;
  }

  static hasRegionalAccess(claims: EmployeeClaims, region: string): boolean {
    if (claims?.territorialAccess === 'national') return true;
    return claims?.assignedRegions?.includes(region) || false;
  }

  static hasParishAccess(claims: EmployeeClaims, parish: string): boolean {
    if (claims?.territorialAccess === 'national') return true;
    return claims?.assignedParishes?.includes(parish) || false;
  }

  static canAccessAdminPortal(claims: any): boolean {
    return this.isEmployee(claims) && (claims.role === 'admin' || claims.role === 'super_admin');
  }

  static canAccessStaffPortal(claims: any): boolean {
    return this.isEmployee(claims) && ['staff', 'admin', 'super_admin'].includes(claims.role);
  }

  static isVerifiedHost(claims: HostClaims): boolean {
    const verification = claims?.verificationStatus;
    return verification?.email && verification?.phone && verification?.identity && verification?.business;
  }

  static isVerifiedGuest(claims: GuestClaims): boolean {
    const verification = claims?.verificationStatus;
    return verification?.email && verification?.phone;
  }
}

// Predefined permission sets for different roles
export const PERMISSION_SETS = {
  STAFF: [
    'read_bookings', 'write_bookings',
    'read_users', 'read_properties',
    'read_reviews', 'moderate_reviews'
  ] as EmployeePermission[],
  
  SUPERVISOR: [
    'read_bookings', 'write_bookings', 'cancel_bookings',
    'read_users', 'write_users',
    'read_properties', 'write_properties',
    'read_reviews', 'moderate_reviews', 'delete_reviews',
    'read_analytics'
  ] as EmployeePermission[],
  
  MANAGER: [
    'read_bookings', 'write_bookings', 'cancel_bookings',
    'read_users', 'write_users', 'suspend_users',
    'read_properties', 'write_properties', 'approve_properties',
    'read_reviews', 'moderate_reviews', 'delete_reviews',
    'read_financials', 'process_payouts',
    'read_analytics', 'export_data', 'generate_reports',
    'manage_staff'
  ] as EmployeePermission[],
  
  ADMIN: [
    'read_bookings', 'write_bookings', 'cancel_bookings',
    'read_users', 'write_users', 'suspend_users',
    'read_properties', 'write_properties', 'approve_properties',
    'read_reviews', 'moderate_reviews', 'delete_reviews',
    'read_financials', 'process_payouts', 'refund_payments',
    'read_analytics', 'export_data', 'generate_reports',
    'manage_staff', 'assign_territories', 'view_admin_panel'
  ] as EmployeePermission[]
};

// Helper functions to create claims
export const createEmployeeClaims = (
  employeeData: {
    employeeId: string;
    role: 'staff' | 'admin' | 'super_admin';
    department: EmployeeClaims['department'];
    position: EmployeeClaims['position'];
    accessLevel: number;
    assignedRegions?: string[];
    assignedParishes?: string[];
  }
): Partial<EmployeeClaims> => {
  const permissions = PERMISSION_SETS[employeeData.position.toUpperCase() as keyof typeof PERMISSION_SETS] || PERMISSION_SETS.STAFF;
  
  return {
    role: employeeData.role,
    userType: 'employee',
    isEmployee: true,
    isActive: true,
    employeeId: employeeData.employeeId,
    department: employeeData.department,
    position: employeeData.position,
    accessLevel: employeeData.accessLevel as 1 | 2 | 3 | 4 | 5,
    assignedRegions: employeeData.assignedRegions || [],
    assignedParishes: employeeData.assignedParishes || [],
    territorialAccess: employeeData.assignedRegions?.length ? 'region' : 'parish',
    permissions,
    canModerateReviews: permissions.includes('moderate_reviews'),
    canManageBookings: permissions.includes('write_bookings'),
    canAccessFinancials: permissions.includes('read_financials'),
    canManageUsers: permissions.includes('write_users'),
    canManageProperties: permissions.includes('write_properties'),
    canAccessAnalytics: permissions.includes('read_analytics'),
    canHandleDisputes: permissions.includes('process_payouts'),
    canProcessPayouts: permissions.includes('process_payouts'),
    canAssignStaff: permissions.includes('manage_staff'),
    canViewReports: permissions.includes('generate_reports'),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
};

export const createGuestClaims = (guestId: string): Partial<GuestClaims> => ({
  role: 'guest',
  userType: 'customer',
  isEmployee: false,
  isActive: true,
  guestId,
  membershipLevel: 'basic',
  accountStatus: 'pending_verification',
  verificationStatus: {
    email: false,
    phone: false,
    identity: false,
    payment: false
  },
  bookingHistory: {
    totalBookings: 0,
    totalSpent: 0,
    averageRating: 0,
    lastBookingDate: ''
  },
  preferences: {
    favoriteRegions: [],
    propertyTypes: [],
    priceRange: { min: 0, max: 1000 }
  },
  loyaltyPoints: 0,
  canBookProperties: true,
  canLeaveReviews: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
});

export const createHostClaims = (hostId: string): Partial<HostClaims> => ({
  role: 'host',
  userType: 'customer',
  isEmployee: false,
  isActive: true,
  hostId,
  hostStatus: 'pending',
  hostLevel: 'new',
  verificationStatus: {
    email: false,
    phone: false,
    identity: false,
    business: false,
    tax: false,
    property: false
  },
  businessMetrics: {
    propertyCount: 0,
    totalEarnings: 0,
    averageRating: 0,
    responseRate: 0,
    acceptanceRate: 0,
    cancellationRate: 0
  },
  permissions: {
    canListProperties: false, // Set to true after verification
    canReceiveBookings: false,
    canWithdrawEarnings: false,
    canModifyPricing: true
  },
  payoutSetup: false,
  taxDocuments: false,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
});
