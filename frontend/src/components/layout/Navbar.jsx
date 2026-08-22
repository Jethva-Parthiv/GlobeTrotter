import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import Avatar from '@/components/common/Avatar'
import SearchInput from '@/components/common/SearchInput'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar({ onOpenMenu }) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur-md lg:px-8">
      <button
        type="button"
        className="rounded-md p-2 text-ink lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <p className="font-display text-lg lg:hidden">{APP_NAME}</p>
      <form
        className="hidden max-w-md flex-1 md:block"
        onSubmit={(e) => {
          e.preventDefault()
          const params = new URLSearchParams()
          if (q.trim()) params.set('q', q.trim())
          navigate(`${ROUTES.discoverCities}${params.toString() ? `?${params}` : ''}`)
        }}
      >
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search destinations" />
      </form>
      <div className="ml-auto">
        {isAuthenticated ? (
          <button type="button" onClick={() => navigate(ROUTES.profile)} aria-label="Profile">
            <Avatar src={user?.photo_url} name={user?.name || 'Traveller'} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate(ROUTES.login)}
            className="text-sm font-medium text-accent"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
