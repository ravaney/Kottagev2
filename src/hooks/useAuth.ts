

import { useFirebaseUser } from './useFirebaseUser';
import { IUser } from '../../public/QuickType';
import { User } from 'firebase/auth';
import { useGetAdditionalUserData } from './useGetAdditionalUserData';
import { auth } from '../firebase';

export const useAuth = (): {
  firebaseUser: User | null | undefined;
  appUser: IUser | null;
  uid: string | null;
  loading: boolean;
} => {
  const { data: firebaseUser, isLoading: loadingAuth } = useFirebaseUser();
  const uid = firebaseUser?.uid ?? null;
  
  // Wait for both the auth loading to complete AND for uid to be available
  const { data: appUser, isLoading: loadingUserData } = useGetAdditionalUserData(auth.currentUser?.uid);
  
  return {
    firebaseUser,
    appUser: appUser ?? null,
    uid,
    loading: loadingAuth || loadingUserData,
  };
};

