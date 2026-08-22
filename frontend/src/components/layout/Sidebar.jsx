import { Compass, LayoutDashboard, LogOut, Map, Plus, Settings, Shield, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

export default function Sidebar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  const links = [
    ...(isAuthenticated
      ? [
          { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
          { to: ROUTES.trips, label: 'Trips', icon: Map },
          { to: ROUTES.tripNew, label: 'New trip', icon: Plus },
        ]
      : []),
    { to: ROUTES.discover, label: 'Discover', icon: Compass },
    ...(isAuthenticated
      ? [
          { to: ROUTES.profile, label: 'Profile', icon: UserRound },
          { to: ROUTES.settings, label: 'Settings', icon: Settings },
        ]
      : []),
    ...(isAdmin ? [{ to: ROUTES.adminDashboard, label: 'Admin', icon: Shield }] : []),
  ]

  return (
    <aside className="hidden h-dvh w-64 shrink-0 border-r border-line bg-paper lg:flex lg:flex-col">
      <div className="px-6 py-6">
        <p className="font-display text-2xl text-ink">{APP_NAME}</p>
        <p className="mt-1 text-xs text-muted">Itinerary studio</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors',
                isActive ? 'bg-sand text-ink' : 'hover:bg-cream hover:text-ink',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      {isAuthenticated ? (
        <div className="p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      ) : (
        <div className="p-3">
          <NavLink to={ROUTES.login} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-accent">
            Sign in
          </NavLink>
        </div>
      )}
    </aside>
  )
}
