import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Compass, LayoutDashboard, Map, Plus, Settings, UserRound } from 'lucide-react'
import Drawer from '@/components/common/Drawer'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import MobileNavigation from './MobileNavigation'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const drawerLinks = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.trips, label: 'Trips', icon: Map },
  { to: ROUTES.tripNew, label: 'New trip', icon: Plus },
  { to: ROUTES.discover, label: 'Discover', icon: Compass },
  { to: ROUTES.profile, label: 'Profile', icon: UserRound },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
]

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-cream lg:flex">
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
        </nav>
      </Drawer>
    </div>
  )
}
