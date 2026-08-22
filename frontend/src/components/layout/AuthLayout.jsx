import { Globe } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

export default function AuthLayout() {
  return (
    <div className="grid min-h-dvh bg-cream lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-paper">
          <Link to={ROUTES.login} className="inline-flex items-center gap-2 text-sm tracking-wide">
            <Globe className="h-5 w-5" />
            {APP_NAME}
          </Link>
          <div>
            <p className="font-display text-4xl leading-tight">Travel with intention.</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-paper/80">
              Multi-city itineraries, considered pacing, and a calm place to plan the journey.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
