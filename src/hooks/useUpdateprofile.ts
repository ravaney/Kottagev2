import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "firebase/auth";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({ user, profile }: { user: any; profile: any }) => {
      return await updateProfile(user, profile);
    },
  });
};