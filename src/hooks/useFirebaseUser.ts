import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../firebase';

const getFirebaseUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user);
      unsubscribe();
    });
  });
};

export const useFirebaseUser = (): UseQueryResult<User | null> => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      queryClient.invalidateQueries({ queryKey: ['firebaseUser'] });
    });
    return unsubscribe;
  }, [queryClient]);

  return useQuery({
    queryKey: ['firebaseUser'],
    queryFn: getFirebaseUser,
    staleTime: Infinity,
    refetchOnWindowFocus: false,

  });
};
