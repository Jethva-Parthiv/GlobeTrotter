import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function AdminRoute() {
  const { isLoading, isAdmin, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
