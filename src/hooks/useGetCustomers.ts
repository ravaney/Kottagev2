//create a hook to get all users that are guest or host

import { get, ref } from 'firebase/database';
import { database, auth } from '../firebase';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useGetCustomers = (): UseQueryResult<any[], unknown> => {
  return useQuery({
    queryKey: ['Allcustomers'],
    queryFn: async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('❌ No authenticated user');
        throw new Error('Authentication required to fetch customers');
      }
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData: any[] = [];
          snapshot.forEach(childSnapshot => {
            const user = childSnapshot.val();
            if (user && user?.userType === 'customer') {
              usersData.push({
                ...user,
                key: childSnapshot.key!,
              });
            }
          });
          return usersData;
        } else {
          console.log('Snapshot does not exist - no users found');
        }

        return [];
      } catch (error) {
        console.error('Error in useGetCustomers:', error);
        throw error;
      }
    },
  });
};
