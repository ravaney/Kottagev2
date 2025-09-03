import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, User } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { database } from '../firebase';

interface UpdateProfileParams {
  user: User;
  profile: any;
  userData?: any; // Additional user data to update in Realtime Database
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, profile, userData }: UpdateProfileParams) => {
      console.log('Updating profile with:', profile);
      console.log('Updating user data with:', userData);

      // Update Firebase Auth profile (displayName, photoURL, etc.)
      if (profile && Object.keys(profile).length > 0) {
        await updateProfile(user, profile);
        console.log('Updated Firebase Auth profile:', profile);
      }

      // Update user data in Realtime Database if userData is provided
      if (userData && Object.keys(userData).length > 0) {
        const userRef = ref(database, `users/${user.uid}`);
        const updateData = {
          ...userData,
          updatedAt: new Date().toISOString(),
        };
        await update(userRef, updateData);
        console.log('Updated user data in database:', updateData);
      }

      return { authProfile: profile, userData };
    },
    onSuccess: (data, variables) => {
      // Invalidate user-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['user', variables.user.uid] });
      queryClient.invalidateQueries({ queryKey: ['firebaseUser'] });
      console.log('Invalidated user queries for uid:', variables.user.uid);
    },
  });
};
