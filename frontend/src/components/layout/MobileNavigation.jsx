import { Compass, LayoutDashboard, Map, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const items = [
  { to: ROUTES.dashboard, label: 'Home', icon: LayoutDashboard },
  { to: ROUTES.trips, label: 'Trips', icon: Map },
  { to: ROUTES.discover, label: 'Discover', icon: Compass },
  { to: ROUTES.profile, label: 'Profile', icon: UserRound },
]

export default function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                  isActive ? 'text-accent' : 'text-muted',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
