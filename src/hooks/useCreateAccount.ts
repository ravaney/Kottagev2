import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, updateProfile, User, sendEmailVerification } from "firebase/auth";
import { ref, set } from "firebase/database";
import { getStorage, ref as ref2, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { IInitUser, IUser } from "../../public/QuickType";
import { auth, database } from "../firebase";

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: async (accountInfo: IInitUser): Promise<IUser> => {
      const {user}= await createUserWithEmailAndPassword(auth, accountInfo.email, accountInfo.password);
      await sendEmailVerification(user);
      await updateProfile(auth.currentUser as User, { displayName: `${accountInfo.firstName} ${accountInfo.lastName}` });

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
      } ;

      await set(ref(database, 'users/' + auth.currentUser?.uid), newUser);
      return newUser;
    },
  });
};