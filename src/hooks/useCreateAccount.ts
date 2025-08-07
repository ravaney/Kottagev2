import { useMutation } from '@tanstack/react-query';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  sendEmailVerification,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import {
  getStorage,
  ref as ref2,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { IInitUser, IUser } from '../../public/QuickType';
import { auth, database } from '../firebase';
import { useClaimsManagement } from './useUserClaims';

export const useCreateAccount = () => {
  const { setHostClaims } = useClaimsManagement();

  return useMutation({
    mutationFn: async (accountInfo: IInitUser): Promise<IUser> => {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        accountInfo.email,
        accountInfo.password
      );
      await sendEmailVerification(user);
      await updateProfile(auth.currentUser as User, {
        displayName: `${accountInfo.firstName} ${accountInfo.lastName}`,
      });

      if (accountInfo.image) {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `profileImages/${accountInfo.image[0].name}`),
          accountInfo.image[0]
        );
        const url = await getDownloadURL(snapshot.ref);
        await updateProfile(auth.currentUser as User, { photoURL: url });
      }

      if (!auth.currentUser) throw new Error('User not found');
      const newUser: IUser = {
        email: accountInfo.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        phoneNumber: user.phoneNumber || '',
        photoURL: user.photoURL || '',
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        address: accountInfo.address,
      };

      await set(ref(database, 'users/' + auth.currentUser?.uid), newUser);

      // Set user claims based on userType (default to guest if not provided)
      const userType = accountInfo.userType || 'guest';
      console.log(`Setting ${userType} claims for user:`, user.uid);

      try {
        // Ensure user is properly authenticated before calling functions
        await auth.currentUser?.getIdToken(true);
        console.log('User token refreshed before claims setting');

        await setHostClaims(user.uid, userType);

        console.log(`Successfully set ${userType} claims`);

        // Force refresh the user's token to get the new claims
        if (auth.currentUser) {
          await auth.currentUser.getIdToken(true);
          console.log('Token refreshed with new claims');
        }
      } catch (claimsError) {
        console.error('Error setting user claims:', claimsError);
        console.error('Claims error details:', {
          message: (claimsError as any)?.message || 'Unknown error',
          code: (claimsError as any)?.code || 'Unknown code',
          details: claimsError,
        });

        // Note: We don't throw here to avoid breaking the signup flow
        // Claims can be set later if needed
      }

      return newUser;
    },
  });
};
