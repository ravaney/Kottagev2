import { useMutation,  } from '@tanstack/react-query';
import { signInWithEmailAndPassword, auth,   database } from '../firebase';
import { ILoginCredentials } from '../components/types';
import {  IUser } from '../../public/QuickType';
import { get, ref } from 'firebase/database';
import { browserSessionPersistence, setPersistence, UserCredential } from 'firebase/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: ILoginCredentials): Promise<UserCredential> => {
      const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      await setPersistence(auth, browserSessionPersistence);
      return response;
      // const snapshot = await get(ref(database, 'users/' + response.user.uid));
      // if (snapshot.exists()) {
      //   return snapshot.val() as IUser;
      // }
      // throw new Error('No user data available');
    },
  });
};




