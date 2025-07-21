// React Hook for Firebase Claims Management
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { ClaimsChecker, EmployeeClaims, GuestClaims, HostClaims, EmployeePermission } from '../utils/firebaseClaims';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export type UserRole = 'guest' | 'host' | 'staff' | 'admin' | 'super_admin';
export type UserClaims = EmployeeClaims | GuestClaims | HostClaims;

export const useUserClaims = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<any>(null);
  const [claimsLoading, setClaimsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchClaims = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setClaims(idTokenResult.claims);
        } catch (error) {
          console.error('Error fetching user claims:', error);
        }
      } else {
        setClaims(null);
      }
      setClaimsLoading(false);
    };

    fetchClaims();
  }, [user]);

  // Force refresh claims
  const refreshClaims = async () => {
    if (user) {
      setClaimsLoading(true);
      try {
        await user.getIdToken(true); // Force refresh
        const idTokenResult = await user.getIdTokenResult();
        setClaims(idTokenResult.claims);
      } catch (error) {
        console.error('Error refreshing claims:', error);
      }
      setClaimsLoading(false);
    }
  };

  // Debug function to log claims
  const logClaims = async () => {
    console.log('=== USER CLAIMS DEBUG ===');
    console.log('User UID:', user?.uid);
    console.log('User Email:', user?.email);
    console.log('User Display Name:', user?.displayName);
    console.log('User Object:', user);
    console.log('Claims Object:', claims);
    console.log('Claims JSON:', JSON.stringify(claims, null, 2));
    
    // Try to refresh token and get fresh claims
    if (user) {
      try {
        console.log('🔄 Refreshing token...');
        const freshToken = await user.getIdTokenResult(true);
        console.log('Fresh Claims:', freshToken.claims);
        console.log('Fresh Claims JSON:', JSON.stringify(freshToken.claims, null, 2));
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    } else {
      console.log('❌ No user found in hook state');
    }
    console.log('========================');
    return claims;
  };

  // Make logClaims globally accessible for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).logUserClaims = logClaims;
      (window as any).refreshUserClaims = refreshClaims;
    }
  }, [user, claims]);

  return {
    user,
    claims,
    loading: loading || claimsLoading,
    refreshClaims,
    logClaims
  };
};

export const useRoleChecker = () => {
  const { claims } = useUserClaims();

  return {
    isEmployee: () => ClaimsChecker.isEmployee(claims),
    isGuest: () => ClaimsChecker.isGuest(claims),
    isHost: () => ClaimsChecker.isHost(claims),
    isAdmin: () => ClaimsChecker.isAdmin(claims),
    isStaff: () => claims?.role === 'staff',
    isSuperAdmin: () => claims?.role === 'super_admin',
    
    canAccessAdminPortal: () => ClaimsChecker.canAccessAdminPortal(claims),
    canAccessStaffPortal: () => ClaimsChecker.canAccessStaffPortal(claims),
    
    hasPermission: (permission: string) => 
      ClaimsChecker.isEmployee(claims) && ClaimsChecker.hasPermission(claims, permission as any),
    
    hasAccessLevel: (level: number) => 
      ClaimsChecker.isEmployee(claims) && ClaimsChecker.hasAccessLevel(claims, level),
    
    hasRegionalAccess: (region: string) => 
      ClaimsChecker.isEmployee(claims) && ClaimsChecker.hasRegionalAccess(claims, region),
    
    hasParishAccess: (parish: string) => 
      ClaimsChecker.isEmployee(claims) && ClaimsChecker.hasParishAccess(claims, parish),
    
    isVerifiedHost: () => 
      ClaimsChecker.isHost(claims) && ClaimsChecker.isVerifiedHost(claims),
    
    isVerifiedGuest: () => 
      ClaimsChecker.isGuest(claims) && ClaimsChecker.isVerifiedGuest(claims),
    
    getRole: () => claims?.role || null,
    getUserType: () => claims?.userType || null,
    getAccessLevel: () => ClaimsChecker.isEmployee(claims) ? claims.accessLevel : 0,
    getDepartment: () => ClaimsChecker.isEmployee(claims) ? claims.department : null,
    getPosition: () => ClaimsChecker.isEmployee(claims) ? claims.position : null
  };
};

export const useClaimsManagement = () => {
  const [loading, setLoading] = useState(false);

  const setEmployeeClaims = async (uid: string, employeeData: any) => {
    setLoading(true);
    try {
      const setEmployeeClaimsFn = httpsCallable(functions, 'setEmployeeClaims');
      const result = await setEmployeeClaimsFn({ uid, employeeData });
      return result.data;
    } catch (error) {
      console.error('Error setting employee claims:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setGuestClaims = async (uid: string) => {
    setLoading(true);
    try {
      const setGuestClaimsFn = httpsCallable(functions, 'setGuestClaims');
      const result = await setGuestClaimsFn({ uid });
      return result.data;
    } catch (error) {
      console.error('Error setting guest claims:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setHostClaims = async (uid: string) => {
    setLoading(true);
    try {
      const setHostClaimsFn = httpsCallable(functions, 'setHostClaims');
      const result = await setHostClaimsFn({ uid });
      return result.data;
    } catch (error) {
      console.error('Error setting host claims:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserClaims = async (uid: string, updates: any) => {
    setLoading(true);
    try {
      const updateUserClaimsFn = httpsCallable(functions, 'updateUserClaims');
      const result = await updateUserClaimsFn({ uid, updates });
      return result.data;
    } catch (error) {
      console.error('Error updating user claims:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyHostDocumentation = async (
    hostUid: string, 
    verificationType: string, 
    approved: boolean
  ) => {
    setLoading(true);
    try {
      const verifyHostDocFn = httpsCallable(functions, 'verifyHostDocumentation');
      const result = await verifyHostDocFn({ hostUid, verificationType, approved });
      return result.data;
    } catch (error) {
      console.error('Error verifying host documentation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const batchUpdateClaims = async (updates: Array<{ uid: string; claims: any }>) => {
    setLoading(true);
    try {
      const batchUpdateClaimsFn = httpsCallable(functions, 'batchUpdateClaims');
      const result = await batchUpdateClaimsFn({ updates });
      return result.data;
    } catch (error) {
      console.error('Error batch updating claims:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setEmployeeClaims,
    setGuestClaims,
    setHostClaims,
    updateUserClaims,
    verifyHostDocumentation,
    batchUpdateClaims
  };
};

// Hook for creating new employees with user account and claims
export const useCreateEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmployee = async (employeeData: {
    email: string;
    password: string;
    displayName: string;
    photoURL?: string;
    customClaims: EmployeeClaims;
    sendWelcomeEmail?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Call the Firebase Cloud Function to create employee
      const createEmployeeFn = httpsCallable(functions, 'createEmployee');
      const result = await createEmployeeFn({
        email: employeeData.email,
        password: employeeData.password,
        displayName: employeeData.displayName,
        photoURL: employeeData.photoURL || null,
        customClaims: employeeData.customClaims,
        sendWelcomeEmail: employeeData.sendWelcomeEmail || true
      });

      return result.data;
    } catch (error: any) {
      console.error('Error creating employee:', error);
      console.log('Error object details:', {
        message: error?.message,
        details: error?.details,
        code: error?.code,
        fullError: error
      });
      
      // Extract the actual error message from Firebase Functions error
      let errorMessage = 'Failed to create employee';
      
      // Firebase Functions errors can be structured differently
      if (error?.details && typeof error.details === 'string') {
        // Firebase Functions v2 error format
        errorMessage = error.details;
      } else if (error?.message && typeof error.message === 'string') {
        // Standard error message
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.toString) {
        errorMessage = error.toString();
      }
      
      // If we still have a generic message, try to extract more info
      if (errorMessage === 'INTERNAL' || errorMessage === 'Failed to create employee') {
        if (error?.code) {
          errorMessage = `Error code: ${error.code}`;
        } else if (error?.status) {
          errorMessage = `Error status: ${error.status}`;
        }
      }
      
      console.log('Extracted error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEmployeeWithEmailPassword = async (
    email: string,
    password: string,
    employeeDetails: {
      displayName: string;
      photoURL?: string;
      employeeId: string;
      department: EmployeeClaims['department'];
      position: EmployeeClaims['position'];
      role: 'staff' | 'admin' | 'super_admin';
      accessLevel: 1 | 2 | 3 | 4 | 5;
      assignedRegions?: string[];
      assignedParishes?: string[];
      territorialAccess?: 'parish' | 'region' | 'national';
      permissions?: EmployeePermission[];
      sendWelcomeEmail?: boolean;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Create employee claims object
      const employeeClaims: EmployeeClaims = {
        role: employeeDetails.role,
        userType: 'employee',
        isEmployee: true,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString(),
        employeeId: employeeDetails.employeeId,
        department: employeeDetails.department,
        position: employeeDetails.position,
        accessLevel: employeeDetails.accessLevel,
        assignedRegions: employeeDetails.assignedRegions || [],
        assignedParishes: employeeDetails.assignedParishes || [],
        territorialAccess: employeeDetails.territorialAccess || 'parish',
        permissions: employeeDetails.permissions || [],
        
        // Set default capabilities based on role
        canModerateReviews: employeeDetails.role !== 'staff',
        canManageBookings: employeeDetails.role !== 'staff',
        canAccessFinancials: employeeDetails.role === 'admin' || employeeDetails.role === 'super_admin',
        canManageUsers: employeeDetails.role === 'admin' || employeeDetails.role === 'super_admin',
        canManageProperties: employeeDetails.role !== 'staff',
        canAccessAnalytics: employeeDetails.role !== 'staff',
        canHandleDisputes: employeeDetails.role !== 'staff',
        canProcessPayouts: employeeDetails.role === 'admin' || employeeDetails.role === 'super_admin',
        canAssignStaff: employeeDetails.role === 'admin' || employeeDetails.role === 'super_admin',
        canViewReports: employeeDetails.role !== 'staff'
      };

      // Call the create employee function
      const result = await createEmployee({
        email,
        password,
        displayName: employeeDetails.displayName,
        photoURL: employeeDetails.photoURL,
        customClaims: employeeClaims,
        sendWelcomeEmail: employeeDetails.sendWelcomeEmail
      });

      return result;
    } catch (error: any) {
      console.error('Error creating employee with email/password:', error);
      console.log('Error object details:', {
        message: error?.message,
        details: error?.details,
        code: error?.code,
        fullError: error
      });
      
      // Extract the actual error message from Firebase Functions error
      let errorMessage = 'Failed to create employee';
      
      // Firebase Functions errors can be structured differently
      if (error?.details && typeof error.details === 'string') {
        // Firebase Functions v2 error format
        errorMessage = error.details;
      } else if (error?.message && typeof error.message === 'string') {
        // Standard error message
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.toString) {
        errorMessage = error.toString();
      }
      
      // If we still have a generic message, try to extract more info
      if (errorMessage === 'INTERNAL' || errorMessage === 'Failed to create employee') {
        if (error?.code) {
          errorMessage = `Error code: ${error.code}`;
        } else if (error?.status) {
          errorMessage = `Error status: ${error.status}`;
        }
      }
      
      console.log('Extracted error message:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    createEmployee,
    createEmployeeWithEmailPassword,
    clearError
  };
};

// Hook for permission-based access control
export const usePermissionGuard = () => {
  const roleChecker = useRoleChecker();

  const requirePermission = (permission: string) => {
    if (!roleChecker.hasPermission(permission)) {
      throw new Error(`Insufficient permissions: ${permission} required`);
    }
  };

  const requireAccessLevel = (level: number) => {
    if (!roleChecker.hasAccessLevel(level)) {
      throw new Error(`Insufficient access level: Level ${level} required`);
    }
  };

  const requireRole = (role: UserRole | UserRole[]) => {
    const userRole = roleChecker.getRole();
    const hasRole = Array.isArray(role) ? role.includes(userRole as UserRole) : userRole === role;
    
    if (!hasRole) {
      throw new Error(`Insufficient role: ${Array.isArray(role) ? role.join(' or ') : role} required`);
    }
  };

  return {
    requirePermission,
    requireAccessLevel,
    requireRole,
    canAccess: {
      adminPortal: roleChecker.canAccessAdminPortal(),
      staffPortal: roleChecker.canAccessStaffPortal(),
      hostFeatures: roleChecker.isVerifiedHost(),
      guestFeatures: roleChecker.isVerifiedGuest()
    }
  };
};
