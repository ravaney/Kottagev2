import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { IUser } from "../../public/QuickType";
import { database } from "../firebase";
;

export const useGetAdditionalUserData = (uid: string|undefined): UseQueryResult<IUser | undefined,unknown> => {
  return useQuery({
    queryKey: ['user', uid],
    queryFn: async (): Promise<IUser| undefined> => {
      const snapshot = await get(ref(database, 'users/' + uid));
        return snapshot.exists() ? (snapshot.val() as IUser) : undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!uid,
  });
};

