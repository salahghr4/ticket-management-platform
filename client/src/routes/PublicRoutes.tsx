import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoutes() {
  const { token} = useAuth()

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default PublicRoutes;
