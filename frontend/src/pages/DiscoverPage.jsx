import { Link } from 'react-router-dom'
import CoverImage from '@/components/common/CoverImage'
import { ROUTES } from '@/constants/routes'

export default function DiscoverPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Discover</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Browse cities from the catalogue or find public itineraries to copy.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to={ROUTES.discoverCities} className="overflow-hidden rounded-xl border border-line bg-paper shadow-card">
          <CoverImage
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200"
            alt=""
            className="h-48 w-full"
          />
          <div className="p-5">
            <h2 className="font-display text-2xl">Cities</h2>
            <p className="mt-1 text-sm text-muted">Search destinations by name, country, or region.</p>
          </div>
        </Link>
        <Link to={ROUTES.discoverTrips} className="overflow-hidden rounded-xl border border-line bg-paper shadow-card">
          <CoverImage
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
            alt=""
            className="h-48 w-full"
          />
          <div className="p-5">
            <h2 className="font-display text-2xl">Public trips</h2>
            <p className="mt-1 text-sm text-muted">Get inspired by itineraries other travellers have shared.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
