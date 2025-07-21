import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { firestore, functions } from '../firebase';
import { EmployeeClaims } from '../utils/firebaseClaims';
import { useUserClaims } from './useUserClaims';

export interface Employee {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime?: string;
  };
  customClaims: EmployeeClaims;
}

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

export interface UseEmployeesOptions {
  filters?: EmployeeFilters;
  pageSize?: number;
  realTimeUpdates?: boolean;
  orderByField?: 'displayName' | 'email' | 'createdAt' | 'lastSignInTime';
  orderDirection?: 'asc' | 'desc';
}

export interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  refreshEmployees: () => Promise<void>;
  loadMore: () => Promise<void>;
  searchEmployees: (searchTerm: string) => Promise<void>;
  filterEmployees: (filters: EmployeeFilters) => Promise<void>;
  getEmployeeById: (uid: string) => Employee | undefined;
  getEmployeesByDepartment: (department: string) => Employee[];
  getEmployeesByRole: (role: string) => Employee[];
  getActiveEmployees: () => Employee[];
  getInactiveEmployees: () => Employee[];
}

export const useEmployees = (options: UseEmployeesOptions = {}): UseEmployeesReturn => {
  const {
    filters = {},
    pageSize = 50,
    realTimeUpdates = true,
    orderByField = 'displayName',
    orderDirection = 'asc'
  } = options;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [currentFilters, setCurrentFilters] = useState<EmployeeFilters>(filters);

  const { claims } = useUserClaims();

  // Cloud function to get employees with auth records
  const getEmployeesFunction = httpsCallable(functions, 'getEmployees');
  const searchEmployeesFunction = httpsCallable(functions, 'searchEmployees');

  const fetchEmployees = async (
    reset = true,
    newFilters: EmployeeFilters = currentFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      // TEMPORARY: Skip permission check for debugging
      if (!claims) {
        console.error('❌ useEmployees: No claims available');
        throw new Error('No user claims available');
      }

      // Check if user has permission to view employees
      const hasPermission = claims.permissions?.includes('read_users') || 
                           claims.permissions?.includes('manage_staff') ||
                           claims.role === 'super_admin' ||
                           claims.role === 'admin';

      if (!hasPermission) {
        console.error('❌ useEmployees: Insufficient permissions');
        console.error('❌ useEmployees: Claims:', claims);
        throw new Error('Insufficient permissions to view employees');
      }

      // Use Cloud Functions to get employees
      const result = await getEmployeesFunction({
        filters: newFilters,
        pageSize,
        lastDocId: reset ? null : lastDoc?.id,
        orderBy: orderByField,
        orderDirection
      });

      const data = result.data as {
        employees: Employee[];
        hasMore: boolean;
        totalCount: number;
        lastDocId?: string;
      };

      if (reset) {
        setEmployees(data.employees);
      } else {
        setEmployees(prev => [...prev, ...data.employees]);
      }

      setHasMore(data.hasMore);
      setTotalCount(data.totalCount);
      
      // Store last document for pagination
      if (data.employees.length > 0) {
        setLastDoc({ id: data.lastDocId } as any);
      }

    } catch (err: any) {
      console.error('❌ Error fetching employees:', err);
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeListener = () => {
    // TEMPORARY: Disable realtime listener to avoid Firestore errors
    return undefined;
    
    if (!realTimeUpdates || !claims) return;

    try {
      // Set up Firestore listener for employee claims changes
      const claimsQuery = query(
        collection(firestore, 'userClaims'),
        where('userType', '==', 'employee'),
        orderBy(orderByField, orderDirection)
      );

      const unsubscribe = onSnapshot(
        claimsQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            // When claims change, refresh the full employee list
            // This ensures we get updated auth records along with claims
            refreshEmployees();
          }
        },
        (err) => {
          console.error('Error in realtime listener:', err);
          setError('Failed to setup real-time updates');
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up realtime listener:', err);
      return undefined;
    }
  };

  const refreshEmployees = async () => {
    await fetchEmployees(true, currentFilters);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchEmployees(false, currentFilters);
  };

  const searchEmployees = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      // Use Cloud Functions to search employees
      const result = await searchEmployeesFunction({
        searchTerm,
        filters: currentFilters,
        pageSize
      });

      const data = result.data as {
        employees: Employee[];
        totalCount: number;
      };

      setEmployees(data.employees);
      setTotalCount(data.totalCount);
      setHasMore(false); // Search results are not paginated
      setLastDoc(null);

    } catch (err: any) {
      console.error('Error searching employees:', err);
      setError(err.message || 'Failed to search employees');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = async (newFilters: EmployeeFilters) => {
    setCurrentFilters(newFilters);
    await fetchEmployees(true, newFilters);
  };

  // Helper functions
  const getEmployeeById = (uid: string): Employee | undefined => {
    return employees.find(emp => emp.uid === uid);
  };

  const getEmployeesByDepartment = (department: string): Employee[] => {
    return employees.filter(emp => 
      emp.customClaims?.department === department
    );
  };

  const getEmployeesByRole = (role: string): Employee[] => {
    return employees.filter(emp => 
      emp.customClaims?.role === role
    );
  };

  const getActiveEmployees = (): Employee[] => {
    return employees.filter(emp => 
      emp.customClaims?.isActive !== false && !emp.disabled
    );
  };

  const getInactiveEmployees = (): Employee[] => {
    return employees.filter(emp => 
      emp.customClaims?.isActive === false || emp.disabled
    );
  };

  // Initial fetch and setup
  useEffect(() => {
    if (claims) {
      fetchEmployees(true, currentFilters);
    }
  }, [claims, orderByField, orderDirection]);

  // Setup realtime listener
  useEffect(() => {
    const unsubscribe = setupRealtimeListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [realTimeUpdates, claims]);

  // Update filters
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(currentFilters)) {
      filterEmployees(filters);
    }
  }, [filters]);

  return {
    employees,
    loading,
    error,
    hasMore,
    totalCount,
    refreshEmployees,
    loadMore,
    searchEmployees,
    filterEmployees,
    getEmployeeById,
    getEmployeesByDepartment,
    getEmployeesByRole,
    getActiveEmployees,
    getInactiveEmployees
  };
};

// Specialized hook for getting employees by department
export const useEmployeesByDepartment = (department: string) => {
  return useEmployees({
    filters: { department },
    realTimeUpdates: true
  });
};

// Specialized hook for getting employees by role
export const useEmployeesByRole = (role: 'staff' | 'admin' | 'super_admin') => {
  return useEmployees({
    filters: { role },
    realTimeUpdates: true
  });
};

// Specialized hook for getting active employees only
export const useActiveEmployees = () => {
  return useEmployees({
    filters: { isActive: true },
    realTimeUpdates: true
  });
};

// Hook for employee statistics
export const useEmployeeStats = () => {
  const { employees, loading, error } = useEmployees({
    realTimeUpdates: true
  });

  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.customClaims?.isActive !== false && !emp.disabled).length,
    inactive: employees.filter(emp => emp.customClaims?.isActive === false || emp.disabled).length,
    byRole: {
      staff: employees.filter(emp => emp.customClaims?.role === 'staff').length,
      admin: employees.filter(emp => emp.customClaims?.role === 'admin').length,
      super_admin: employees.filter(emp => emp.customClaims?.role === 'super_admin').length
    },
    byDepartment: employees.reduce((acc, emp) => {
      const dept = emp.customClaims?.department || 'unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byRegion: employees.reduce((acc, emp) => {
      const regions = emp.customClaims?.assignedRegions || [];
      regions.forEach(region => {
        acc[region] = (acc[region] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>)
  };

  return { stats, loading, error };
};
