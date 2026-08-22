import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Compass, LayoutDashboard, LogOut, Map, Plus, Settings, Shield, UserRound } from 'lucide-react'
import Drawer from '@/components/common/Drawer'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import MobileNavigation from './MobileNavigation'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isAdmin, logout } = useAuth()

  const drawerLinks = [
    ...(isAuthenticated
      ? [
          { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
          { to: ROUTES.trips, label: 'Trips', icon: Map },
          { to: ROUTES.tripNew, label: 'New trip', icon: Plus },
        ]
      : []),
    { to: ROUTES.discover, label: 'Discover', icon: Compass },
    { to: ROUTES.discoverTrips, label: 'Public trips', icon: Map },
    ...(isAuthenticated
      ? [
          { to: ROUTES.profile, label: 'Profile', icon: UserRound },
          { to: ROUTES.settings, label: 'Settings', icon: Settings },
        ]
      : [{ to: ROUTES.login, label: 'Sign in', icon: UserRound }]),
    ...(isAdmin ? [{ to: ROUTES.adminDashboard, label: 'Admin', icon: Shield }] : []),
  ]

  return (
    <div className="min-h-dvh overflow-x-hidden bg-cream lg:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
      <Drawer open={menuOpen} title="Menu" onClose={() => setMenuOpen(false)} side="left">
        <nav className="flex flex-col gap-1">
          {drawerLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                  isActive ? 'bg-sand text-ink' : 'text-ink-soft hover:bg-cream',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                logout()
              }}
              className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          ) : null}
        </nav>
      </Drawer>
    </div>
  )
}
