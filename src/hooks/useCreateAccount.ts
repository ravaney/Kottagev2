import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, updateProfile, User } from "firebase/auth";
import { ref, set } from "firebase/database";
import { getStorage, ref as ref2, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { IInitUser, IUser } from "../../public/QuickType";
import { auth, database } from "../firebase";

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: async (accountInfo: IInitUser): Promise<IUser> => {
      await createUserWithEmailAndPassword(auth, accountInfo.email, accountInfo.password);
      await setPersistence(auth, browserSessionPersistence);
      await updateProfile(auth.currentUser as User, { displayName: accountInfo.email });

      if (accountInfo.image) {
        const snapshot = await uploadBytesResumable(
          ref2(getStorage(), `profileImages/${accountInfo.image[0].name}`),
          accountInfo.image[0]
        );
        const url = await getDownloadURL(snapshot.ref);
        await updateProfile(auth.currentUser as User, { photoURL: url });
      }

      const newUser: IUser = {
        email: accountInfo.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        uid: auth.currentUser?.uid,
        phoneNumber: auth.currentUser?.phoneNumber,
        photoURL: auth.currentUser?.photoURL,
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        address: accountInfo.address,
      } as IUser;

      await set(ref(database, 'users/' + auth.currentUser?.uid), newUser);
      return newUser;
    },
  });
};