import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute() {
  const { token, isLoading, user } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
