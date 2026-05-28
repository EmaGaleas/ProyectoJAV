import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'
import type { Role } from '../features/auth/types'

interface Props {
  allowedRoles: Role[]
}

export const RoleRoute = ({ allowedRoles }: Props) => {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}