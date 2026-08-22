import { Link } from 'react-router-dom'
import { MapPin, Pencil, Trash2 } from 'lucide-react'
import Badge from '@/components/common/Badge'
import CoverImage from '@/components/common/CoverImage'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateRange } from '@/utils/dates'

export default function TripCard({ trip, onDelete }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
      <Link to={ROUTES.trip(trip.id)} className="block">
        <CoverImage src={trip.cover_photo_url} alt="" className="h-44 w-full" />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl text-ink">
            <Link to={ROUTES.trip(trip.id)}>{trip.name}</Link>
          </h3>
          {trip.is_public ? <Badge variant="accent">Public</Badge> : <Badge>Private</Badge>}
        </div>
        <p className="mt-1 text-sm text-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {trip.stop_count} {trip.stop_count === 1 ? 'stop' : 'stops'}
          </span>
          <span>{formatCurrency(trip.total_estimated_cost)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={ROUTES.trip(trip.id)}
            className="rounded-md bg-sand px-3 py-1.5 text-sm font-medium text-ink hover:bg-line"
          >
            View
          </Link>
          <Link
            to={ROUTES.tripEdit(trip.id)}
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-sand"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(trip)}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger-soft"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
