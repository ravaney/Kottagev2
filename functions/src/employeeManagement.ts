import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

// Firebase Auth and Firestore instances
const firebaseAuth = admin.auth();
const firestore = admin.firestore();

export interface EmployeeFilters {
  department?: string;
  role?: 'staff' | 'admin' | 'super_admin';
  position?: string;
  isActive?: boolean;
  assignedRegion?: string;
  assignedParish?: string;
  accessLevel?: number;
  searchTerm?: string;
}

export interface GetEmployeesRequest {
  filters?: EmployeeFilters;
  pageSize?: number;
  lastDocId?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface SearchEmployeesRequest {
  searchTerm: string;
  filters?: EmployeeFilters;
  pageSize?: number;
}

// Helper function to check if user has permission to view employees
const checkViewPermission = (claims: any) => {
  console.log('🔍 Checking view permission for claims:', claims);
  
  const hasViewStaff = claims?.customPermissions?.includes('view_staff') || 
                      claims?.permissions?.includes('view_staff');
  const hasManageStaff = claims?.customPermissions?.includes('manage_staff') || 
                        claims?.permissions?.includes('manage_staff');
  const hasReadUsers = claims?.permissions?.includes('read_users');
  const isAdmin = claims?.role === 'admin';
  const isSuperAdmin = claims?.role === 'super_admin';
  
  const hasPermission = hasViewStaff || hasManageStaff || hasReadUsers || isAdmin || isSuperAdmin;
  
  console.log('🔍 Permission check results:', {
    hasViewStaff,
    hasManageStaff,
    hasReadUsers,
    isAdmin,
    isSuperAdmin,
    hasPermission
  });
  
  return hasPermission;
};

// Helper function to get employee auth data and check if user is an employee
const mergeEmployeeData = async (uid: string): Promise<Employee | null> => {
  try {
    // Use getUser() to get auth record
    const authRecord = await admin.auth().getUser(uid);
    console.log('🔍 Processing auth record for:', authRecord.email);
    
    // Check if this user is an employee by looking at their custom claims
    const customClaims = authRecord.customClaims || {};
    console.log('🔍 User custom claims:', authRecord.email, customClaims);
    
    // Only return employee data if the user has employee claims
    if (!customClaims || customClaims.userType !== 'employee') {
      console.log('🚫 Not an employee:', authRecord.email, 'userType:', customClaims.userType);
      return null;
    }

    console.log('✅ Found employee:', authRecord.email, 'with claims:', customClaims);

    return {
      uid: authRecord.uid,
      email: authRecord.email || '',
      displayName: authRecord.displayName || '',
      photoURL: authRecord.photoURL,
      emailVerified: authRecord.emailVerified,
      disabled: authRecord.disabled,
      metadata: {
        creationTime: authRecord.metadata.creationTime,
        lastSignInTime: authRecord.metadata.lastSignInTime || ''
      },
      customClaims: customClaims as any // Use custom claims from Firebase Auth
    };
  } catch (error) {
    logger.error(`Error merging employee data for uid:`, error);
    throw error;
  }
};

// Define employee type for better type safety
interface Employee {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  customClaims: {
    [key: string]: any;
    userType?: string;
    isActive?: boolean;
    role?: string;
    department?: string;
    position?: string;
    accessLevel?: number;
    assignedRegions?: string[];
    assignedParishes?: string[];
  };
}

// Helper function to filter employees based on criteria
const filterEmployee = (employee: Employee, filters: EmployeeFilters): boolean => {
  const claims = employee.customClaims;
  
  // Log each user being filtered for debugging
  logger.info('🔍 Filtering employee:', {
    uid: employee.uid,
    email: employee.email,
    claims: claims,
    userType: claims?.userType,
    isEmployee: claims?.userType === 'employee'
  });
  
  // At this point, we know this is an employee (filtered in mergeEmployeeData)
  // So we only need to apply additional filters

  logger.info(`✅ ${employee.email}: Processing employee filters...`);
  logger.info(`🔍 ${employee.email}: Applied filters:`, filters);

  // Apply filters - only apply if filter value is provided (not null/undefined)
  if (filters.department && filters.department !== null && claims.department !== filters.department) {
    logger.info(`🚫 ${employee.email}: Filtered out by department. Expected: ${filters.department}, Got: ${claims.department}`);
    return false;
  }

  if (filters.role && filters.role !== null && claims.role !== filters.role) {
    logger.info(`🚫 ${employee.email}: Filtered out by role. Expected: ${filters.role}, Got: ${claims.role}`);
    return false;
  }

  if (filters.position && filters.position !== null && claims.position !== filters.position) {
    logger.info(`🚫 ${employee.email}: Filtered out by position. Expected: ${filters.position}, Got: ${claims.position}`);
    return false;
  }

  if (filters.isActive !== undefined && filters.isActive !== null && claims.isActive !== filters.isActive) {
    logger.info(`🚫 ${employee.email}: Filtered out by isActive. Expected: ${filters.isActive}, Got: ${claims.isActive}`);
    return false;
  }

  if (filters.assignedRegion && filters.assignedRegion !== null && 
      (!claims.assignedRegions || !claims.assignedRegions.includes(filters.assignedRegion))) {
    logger.info(`🚫 ${employee.email}: Filtered out by assignedRegion. Expected: ${filters.assignedRegion}, Got: ${claims.assignedRegions}`);
    return false;
  }

  if (filters.assignedParish && filters.assignedParish !== null && 
      (!claims.assignedParishes || !claims.assignedParishes.includes(filters.assignedParish))) {
    logger.info(`🚫 ${employee.email}: Filtered out by assignedParish. Expected: ${filters.assignedParish}, Got: ${claims.assignedParishes}`);
    return false;
  }

  if (filters.accessLevel && filters.accessLevel !== null && claims.accessLevel !== filters.accessLevel) {
    logger.info(`🚫 ${employee.email}: Filtered out by accessLevel. Expected: ${filters.accessLevel}, Got: ${claims.accessLevel}`);
    return false;
  }

  if (filters.searchTerm && filters.searchTerm !== null) {
    const searchLower = filters.searchTerm.toLowerCase();
    const searchFields = [
      employee.email || '',
      employee.displayName || '',
      claims.employeeId || '',
      claims.department || '',
      claims.position || ''
    ].map(field => field.toString().toLowerCase());

    if (!searchFields.some(field => field.includes(searchLower))) {
      logger.info(`🚫 ${employee.email}: Filtered out by searchTerm. Term: ${filters.searchTerm}, SearchFields: ${searchFields}`);
      return false;
    }
  }

  logger.info(`✅ ${employee.email}: Passed all filters!`);
  return true;
};

// Helper function to sort employees - Updated to use Employee type
const sortEmployees = (employees: Employee[], orderBy: string, orderDirection: 'asc' | 'desc'): Employee[] => {
  return employees.sort((a: Employee, b: Employee) => {
    let aValue: any = (a as any)[orderBy];
    let bValue: any = (b as any)[orderBy];

    // Handle nested properties like customClaims.department
    if (orderBy.includes('.')) {
      const parts = orderBy.split('.');
      aValue = parts.reduce((obj: any, key: string) => obj?.[key], a as any);
      bValue = parts.reduce((obj: any, key: string) => obj?.[key], b as any);
    }

    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    const comparison = aValue.toString().localeCompare(bValue.toString());
    return orderDirection === 'asc' ? comparison : -comparison;
  });
};

// Internal function to get employees (shared logic)
const getEmployeesInternal = async (filters: EmployeeFilters, pageSize: number, lastDocId?: string, orderBy: string = 'displayName', orderDirection: 'asc' | 'desc' = 'asc') => {
  logger.info('🔍 getEmployeesInternal called with filters:', filters);

  // Get all users from Firebase Auth
  // Note: Firebase Auth doesn't support advanced querying, so we fetch and filter
  let authUsers: admin.auth.UserRecord[] = [];
  let nextPageToken: string | undefined;
  
  do {
    const listUsersResult = await firebaseAuth.listUsers(1000, nextPageToken);
    authUsers = authUsers.concat(listUsersResult.users);
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  logger.info('🔍 Total auth users found:', authUsers.length);

  // Merge with claims data and filter
  const employees: Employee[] = [];
  for (const authUser of authUsers) {
    try {
      const employee = await mergeEmployeeData(authUser.uid);
      
      // Skip if not an employee
      if (!employee) {
        console.log('🚫 Skipping non-employee:', authUser.email);
        continue;
      }
      
      console.log('🔍 About to filter employee:', employee.email);
      const shouldInclude = filterEmployee(employee, filters);
      console.log('🔍 Filter result for', employee.email, ':', shouldInclude);
      
      logger.info('🔍 Processing user for inclusion:', {
        email: employee.email,
        shouldInclude,
        hasUserType: !!employee.customClaims?.userType,
        userType: employee.customClaims?.userType,
        isEmployee: employee.customClaims?.userType === 'employee'
      });
      
      if (shouldInclude) {
        employees.push(employee);
        logger.info('✅ Added employee to list:', employee.email);
      }
    } catch (error) {
      logger.warn(`Failed to process user ${authUser.uid}:`, error);
      // Continue processing other users
    }
  }

  logger.info('🔍 Employees after filtering:', {
    totalAuthUsers: authUsers.length,
    filteredEmployees: employees.length,
    filters
  });

  // Sort employees using the helper function
  const sortedEmployees = sortEmployees(employees, orderBy, orderDirection);

  // Handle pagination
  let startIndex = 0;
  if (lastDocId) {
    startIndex = sortedEmployees.findIndex(emp => emp.uid === lastDocId);
    if (startIndex !== -1) {
      startIndex += 1; // Start after the last document
    } else {
      startIndex = 0;
    }
  }

  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < sortedEmployees.length;
  const lastDoc = paginatedEmployees.length > 0 ? 
    paginatedEmployees[paginatedEmployees.length - 1] : null;

  const result = {
    employees: paginatedEmployees,
    hasMore,
    totalCount: sortedEmployees.length,
    lastDocId: lastDoc?.uid
  };

  logger.info('🔍 getEmployeesInternal result:', {
    employeesReturned: result.employees.length,
    hasMore: result.hasMore,
    totalCount: result.totalCount
  });

  return result;
};

// Cloud Function to get employees with pagination and filtering
export const getEmployees = onCall(async (request) => {
  try {
    logger.info('🔍 getEmployees called', { 
      authUid: request.auth?.uid,
      hasAuth: !!request.auth 
    });

    // Check authentication
    if (!request.auth) {
      throw new Error('Authentication required');
    }

    // Check permissions
    const userClaims = request.auth.token;
    logger.info('🔍 User claims for permission check:', userClaims);
    
    if (!checkViewPermission(userClaims)) {
      logger.warn('🚫 Insufficient permissions for user:', {
        uid: request.auth.uid,
        email: userClaims.email,
        role: userClaims.role,
        permissions: userClaims.permissions
      });
      throw new Error('Insufficient permissions to view employees');
    }

    const {
      filters = {},
      pageSize = 50,
      lastDocId,
      orderBy = 'displayName',
      orderDirection = 'asc'
    }: GetEmployeesRequest = request.data;

    logger.info('🔍 getEmployees parameters:', {
      filters,
      pageSize,
      lastDocId,
      orderBy,
      orderDirection
    });

    const result = await getEmployeesInternal(filters, pageSize, lastDocId, orderBy, orderDirection);
    
    logger.info('🔍 getEmployees final result before return:', result);
    
    return result;

  } catch (error) {
    logger.error('❌ Error in getEmployees function:', error);
    throw new Error(`Failed to get employees: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Cloud Function to search employees
export const searchEmployees = onCall(async (request) => {
  try {
    // Check authentication
    if (!request.auth) {
      throw new Error('Authentication required');
    }

    // Check permissions
    const userClaims = request.auth.token;
    if (!checkViewPermission(userClaims)) {
      throw new Error('Insufficient permissions to search employees');
    }

    const {
      searchTerm,
      filters = {},
      pageSize = 50
    }: SearchEmployeesRequest = request.data;

    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required');
    }

    logger.info('Searching employees with term:', searchTerm);

    // Add search term to filters
    const searchFilters = {
      ...filters,
      searchTerm: searchTerm.trim()
    };

    // Use the internal function
    const result = await getEmployeesInternal(searchFilters, pageSize, undefined, 'displayName', 'asc');

    return {
      employees: result.employees,
      totalCount: result.totalCount
    };

  } catch (error) {
    logger.error('Error in searchEmployees function:', error);
    throw new Error(`Failed to search employees: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Cloud Function to get employee statistics
export const getEmployeeStats = onCall(async (request) => {
  try {
    // Check authentication
    if (!request.auth) {
      throw new Error('Authentication required');
    }

    // Check permissions
    const userClaims = request.auth.token;
    if (!checkViewPermission(userClaims)) {
      throw new Error('Insufficient permissions to view employee statistics');
    }

    logger.info('Getting employee statistics');

    // Get all employees using internal function
    const result = await getEmployeesInternal({}, 10000); // Get all employees for stats
    const employees: Employee[] = result.employees;

    // Calculate statistics
    const stats = {
      total: employees.length,
      active: employees.filter((emp: Employee) => emp.customClaims?.isActive !== false && !emp.disabled).length,
      inactive: employees.filter((emp: Employee) => emp.customClaims?.isActive === false || emp.disabled).length,
      byRole: {
        staff: employees.filter((emp: Employee) => emp.customClaims?.role === 'staff').length,
        admin: employees.filter((emp: Employee) => emp.customClaims?.role === 'admin').length,
        super_admin: employees.filter((emp: Employee) => emp.customClaims?.role === 'super_admin').length
      },
      byDepartment: employees.reduce((acc: Record<string, number>, emp: Employee) => {
        const dept = emp.customClaims?.department || 'unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPosition: employees.reduce((acc: Record<string, number>, emp: Employee) => {
        const pos = emp.customClaims?.position || 'unknown';
        acc[pos] = (acc[pos] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byRegion: employees.reduce((acc: Record<string, number>, emp: Employee) => {
        const regions = emp.customClaims?.assignedRegions || [];
        regions.forEach((region: string) => {
          acc[region] = (acc[region] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
      averageAccessLevel: employees.length > 0 ? 
        employees.reduce((sum: number, emp: Employee) => sum + (emp.customClaims?.accessLevel || 1), 0) / employees.length : 0
    };

    return { stats };

  } catch (error) {
    logger.error('Error in getEmployeeStats function:', error);
    throw new Error(`Failed to get employee statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Cloud Function to get employee by ID
export const getEmployeeById = onCall(async (request) => {
  try {
    // Check authentication
    if (!request.auth) {
      throw new Error('Authentication required');
    }

    // Check permissions
    const userClaims = request.auth.token;
    if (!checkViewPermission(userClaims)) {
      throw new Error('Insufficient permissions to view employee details');
    }

    const { uid } = request.data;
    if (!uid) {
      throw new Error('Employee UID is required');
    }

    logger.info('Getting employee by ID:', uid);

    // Get user from Firebase Auth
    const authRecord = await firebaseAuth.getUser(uid);
    const employee = await mergeEmployeeData(authRecord.uid);

    // Verify this is an employee
    if (!employee) {
      throw new Error('User is not an employee');
    }

    return { employee };

  } catch (error) {
    logger.error('Error in getEmployeeById function:', error);
    throw new Error(`Failed to get employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Create new employee function
export const createEmployee = onCall({ cors: true }, async (request) => {
  try {
    logger.info('createEmployee function called', { data: request.data, authUid: request.auth?.uid });
    
    const { auth, data } = request;

    // Check if user is authenticated and has permission to create employees
    if (!auth?.uid) {
      logger.error('Authentication required - no auth.uid provided');
      throw new Error('Authentication required');
    }

    // Get caller's claims to check permissions
    // TODO: Re-enable for permission checking
    // const callerRecord = await admin.auth().getUser(auth.uid);
    // const callerClaims = callerRecord.customClaims || {};

    // TODO: Re-enable permission check later
    // Check if caller has permission to create employees
    // if (!callerClaims.canManageUsers && 
    //     !callerClaims.permissions?.includes('manage_staff') &&
    //     callerClaims.role !== 'admin' && 
    //     callerClaims.role !== 'super_admin') {
    //   throw new Error('Insufficient permissions to create employees');
    // }

    const { email, password, displayName, photoURL, customClaims, sendWelcomeEmail = true } = data;

    logger.info('createEmployee data received', { 
      email, 
      displayName, 
      hasPassword: !!password,
      hasCustomClaims: !!customClaims,
      customClaimsKeys: customClaims ? Object.keys(customClaims) : [],
      sendWelcomeEmail 
    });

    // Validate required fields
    if (!email || !displayName || !customClaims) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!displayName) missingFields.push('displayName');
      if (!customClaims) missingFields.push('customClaims');
      
      logger.error('Missing required fields', { missingFields, data });
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Create user data object
    const userData: any = {
      email,
      displayName,
      photoURL: photoURL || undefined,
      emailVerified: false
    };

    // Add password if provided, otherwise Firebase will handle email verification
    if (password) {
      userData.password = password;
    }

    // Create the user account
    let userRecord;
    try {
      userRecord = await firebaseAuth.createUser(userData);
      logger.info(`Created user account for employee: ${userRecord.uid}`);
    } catch (authError: any) {
      logger.error('Failed to create user account:', authError);
      
      // Handle specific Firebase Auth errors
      if (authError.code === 'auth/email-already-exists') {
        throw new Error(`Email address ${email} is already in use by another account`);
      } else if (authError.code === 'auth/invalid-email') {
        throw new Error(`Invalid email address: ${email}`);
      } else if (authError.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password');
      } else {
        throw new Error(`Failed to create user account: ${authError.message || 'Unknown error'}`);
      }
    }

    // Set custom claims
    await firebaseAuth.setCustomUserClaims(userRecord.uid, customClaims);
    logger.info(`Set custom claims for employee: ${userRecord.uid}`);

    // Try to store claims in Firestore for easier querying (optional - graceful failure)
    try {
      await firestore.collection('userClaims').doc(userRecord.uid).set({
        ...customClaims,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: auth.uid
      });
      logger.info(`Stored user claims in Firestore for employee: ${userRecord.uid}`);
    } catch (firestoreError: any) {
      logger.warn(`Failed to store claims in Firestore (this is non-critical): ${firestoreError.message}`);
      // Continue execution - this is not a critical failure
    }

    // Try to create employee profile document (optional - graceful failure)
    try {
      await firestore.collection('employees').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        employeeId: customClaims.employeeId,
        department: customClaims.department,
        position: customClaims.position,
        role: customClaims.role,
        startDate: customClaims.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        isActive: customClaims.isActive,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: auth.uid
      });
      logger.info(`Created employee profile document for: ${userRecord.uid}`);
    } catch (firestoreError: any) {
      logger.warn(`Failed to create employee profile document (this is non-critical): ${firestoreError.message}`);
      // Continue execution - this is not a critical failure
    }

    // Send welcome email if requested
    if (sendWelcomeEmail) {
      try {
        let emailContent = '';
        
        if (password) {
          // If password was provided, include it in the welcome email
          emailContent = `Welcome email would be sent to ${email} with temporary password: ${password}`;
        } else {
          // Generate password reset link for initial login
          const passwordResetLink = await firebaseAuth.generatePasswordResetLink(email);
          emailContent = `Welcome email would be sent to ${email} with password reset link: ${passwordResetLink}`;
        }
        
        // In a real application, you would send an email here
        logger.info(emailContent);
        
        // You can integrate with your email service here
        // await sendWelcomeEmail(email, displayName, password || passwordResetLink);
      } catch (emailError) {
        logger.warn(`Failed to send welcome email to ${email}:`, emailError);
        // Don't fail the entire operation if email sending fails
      }
    }

    // Return the created employee data
    const employee = await mergeEmployeeData(userRecord.uid);

    logger.info(`Successfully created employee: ${userRecord.uid}`);

    return {
      success: true,
      employee,
      message: `Employee ${displayName} created successfully`
    };

  } catch (error) {
    logger.error('Error in createEmployee function:', error);
    throw new Error(`Failed to create employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});
