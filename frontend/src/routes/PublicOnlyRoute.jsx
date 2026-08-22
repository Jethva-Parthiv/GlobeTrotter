import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function PublicOnlyRoute() {
  const { token, isLoading, isAuthenticated } = useAuth()

  if (token && isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
