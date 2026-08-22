import { Globe } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

export default function PublicShell() {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur-md sm:px-8">
        <Link to={ROUTES.discoverTrips} className="inline-flex items-center gap-2 text-sm font-medium">
          <Globe className="h-4 w-4" />
          {APP_NAME}
        </Link>
        <Link to={ROUTES.login} className="text-sm text-accent">
          Sign in
        </Link>
      </header>
      <Outlet />
    </div>
  )
}
