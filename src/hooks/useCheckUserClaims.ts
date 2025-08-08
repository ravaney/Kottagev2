// Hook to check current user's authentication and claims
import { useQuery } from '@tanstack/react-query';
import { auth } from '../firebase';
import { useAuth } from './useAuth';

export const useCheckUserClaims = () => {
  const { firebaseUser, loading } = useAuth();

  return useQuery({
    queryKey: ['userClaims', firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) {
        console.log('❌ No user authenticated');
        return { authenticated: false, claims: null, tokenResult: null };
      }

      console.log('✅ User authenticated:', firebaseUser.email);
      console.log('🔍 User UID:', firebaseUser.uid);

      try {
        // Get the ID token with claims
        const tokenResult = await firebaseUser.getIdTokenResult();
        console.log('🎫 Token result:', tokenResult);
        console.log('🎭 Custom claims:', tokenResult.claims);

        // Check specific claims we need
        const claims = tokenResult.claims;
        console.log('👤 Role:', claims.role);
        console.log('🏢 User Type:', claims.userType);
        console.log('👔 Is Employee:', claims.isEmployee);
        console.log('🔑 Permissions:', claims.permissions);

        // Check if user has permission to read users
        const canReadUsers =
          claims.role === 'admin' ||
          claims.role === 'staff' ||
          claims.isEmployee === true;

        console.log('✅ Can read users:', canReadUsers);

        return {
          authenticated: true,
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          },
          claims: tokenResult.claims,
          canReadUsers,
          tokenResult,
        };
      } catch (error) {
        console.error('❌ Error getting user claims:', error);
        throw error;
      }
    },
    enabled: !!firebaseUser && !loading,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
