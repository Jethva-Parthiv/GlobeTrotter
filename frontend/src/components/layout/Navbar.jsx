import { Menu } from 'lucide-react'
import { APP_NAME } from '@/constants/app'
import Avatar from '@/components/common/Avatar'
import SearchInput from '@/components/common/SearchInput'

export default function Navbar({ onOpenMenu }) {
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
      <div className="hidden max-w-md flex-1 md:block">
        <SearchInput placeholder="Search destinations" disabled />
      </div>
      <div className="ml-auto">
        <Avatar name="Traveller" />
      </div>
    </header>
  )
}
