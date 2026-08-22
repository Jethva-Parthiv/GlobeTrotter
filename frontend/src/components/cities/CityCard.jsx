import { Link } from 'react-router-dom'
import CoverImage from '@/components/common/CoverImage'
import CostIndex from '@/components/cities/CostIndex'
import { ROUTES } from '@/constants/routes'

export default function CityCard({ city }) {
  return (
    <Link
      to={ROUTES.city(city.id)}
      className="group overflow-hidden rounded-lg border border-line bg-paper shadow-card"
    >
      <CoverImage src={city.image_url} alt="" className="h-48 w-full transition duration-500 group-hover:scale-[1.02]" />
      <div className="p-4">
        <h3 className="font-display text-xl text-ink">{city.name}</h3>
        <p className="text-sm text-muted">
          {city.country}
          {city.region ? ` · ${city.region}` : ''}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <CostIndex value={city.cost_index} />
          <span>Popularity {city.popularity}</span>
        </div>
      </div>
    </Link>
  )
}
