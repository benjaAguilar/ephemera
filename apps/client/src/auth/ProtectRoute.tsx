import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthProvider';

export function ProtectRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
