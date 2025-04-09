import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoutes() {
  const { token } = useAuth()

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes