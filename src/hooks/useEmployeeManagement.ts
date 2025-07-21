import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { firestore, functions } from '../firebase';

// Keep cloud functions ONLY for operations requiring Admin SDK
const createEmployeeFunction = httpsCallable(functions, 'createEmployee');
const getEmployeesFunction = httpsCallable(functions, 'getEmployees'); // If you need Auth + Firestore joins

export const useEmployeeManagement = () => {
  const queryClient = useQueryClient();

  // TanStack Query for employee data (faster, real-time)
  const {
    data: employees = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      // Option 1: Direct Firestore (faster)
      const employeesCollection = collection(firestore, 'employees');
      const q = query(employeesCollection, orderBy('displayName'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Option 2: Cloud function (if you need Auth + claims joining)
      // const result = await getEmployeesFunction({ filters: {} });
      // return result.data.employees;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Cloud function ONLY for employee creation (requires Admin SDK)
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      const result = await createEmployeeFunction(employeeData);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  // Direct Firestore for updates (faster)
  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const employeeRef = doc(firestore, 'employees', id);
      await updateDoc(employeeRef, updates);
      return { id, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  // Direct Firestore for deletion (faster)
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const employeeRef = doc(firestore, 'employees', id);
      await deleteDoc(employeeRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  // Real-time updates with Firestore subscription
  const useRealtimeEmployees = () => {
    return useQuery({
      queryKey: ['employees', 'realtime'],
      queryFn: () => {
        return new Promise((resolve) => {
          const employeesCollection = collection(firestore, 'employees');
          const q = query(employeesCollection, orderBy('displayName'));
          
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const employees = snapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data() 
            }));
            resolve(employees);
          });

          return () => unsubscribe();
        });
      }
    });
  };

  return {
    employees,
    isLoading,
    error,
    createEmployee: createEmployeeMutation.mutate,
    updateEmployee: updateEmployeeMutation.mutate,
    deleteEmployee: deleteEmployeeMutation.mutate,
    isCreating: createEmployeeMutation.isPending,
    isUpdating: updateEmployeeMutation.isPending,
    isDeleting: deleteEmployeeMutation.isPending,
    useRealtimeEmployees
  };
};

// Search with client-side filtering (instant)
export const useEmployeeSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['employees', 'search', searchTerm],
    queryFn: async () => {
      const employeesCollection = collection(firestore, 'employees');
      const snapshot = await getDocs(employeesCollection);
      const allEmployees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      
      if (!searchTerm) return allEmployees;
      
      return allEmployees.filter((emp: any) => 
        emp.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    enabled: !!searchTerm
  });
};

// Department filtering with client-side logic
export const useEmployeesByDepartment = (department: string) => {
  return useQuery({
    queryKey: ['employees', 'department', department],
    queryFn: async () => {
      const employeesCollection = collection(firestore, 'employees');
      const q = query(
        employeesCollection, 
        where('department', '==', department),
        orderBy('displayName')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!department
  });
};
