import { Navigate, useLocation } from 'react-router-dom';
import { useFirebaseUser } from './hooks/useFirebaseUser';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const { data: user, isLoading } = useFirebaseUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return children;
}
