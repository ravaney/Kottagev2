import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, signOut } from "../firebase";

export const useSignOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
