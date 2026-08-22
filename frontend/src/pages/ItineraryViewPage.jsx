import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tripApi } from '@/api/tripApi'
import Badge from '@/components/common/Badge'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate, formatDateRange } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'

export default function ItineraryViewPage() {
  const { tripId } = useParams()
  const { data: trip, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.trip(tripId),
    queryFn: () => tripApi.get(tripId),
  })

  if (isLoading) return <Skeleton className="h-96" />
  if (isError) return <ErrorState description={getApiErrorMessage(error)} onRetry={refetch} />

  const stops = [...(trip.stops || [])].sort((a, b) => a.order - b.order)
  const route = stops.map((s) => s.city_name).join(' → ')

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="rounded-md bg-ink px-3 py-1.5 text-sm text-paper">Timeline</span>
        <Link to={ROUTES.tripCalendar(trip.id)} className="rounded-md px-3 py-1.5 text-sm hover:bg-sand">
          Calendar
        </Link>
        <Link to={ROUTES.trip(trip.id)} className="rounded-md px-3 py-1.5 text-sm hover:bg-sand">
          Builder
        </Link>
      </div>
      <header className="overflow-hidden rounded-xl border border-line bg-paper">
        <CoverImage src={trip.cover_photo_url} alt="" className="h-52 w-full" />
        <div className="p-5 sm:p-8">
          <h1 className="font-display text-3xl sm:text-5xl">{trip.name}</h1>
          <p className="mt-2 text-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
          {route ? <p className="mt-3 text-sm text-ink-soft">{route}</p> : null}
          <p className="mt-3 font-medium">{formatCurrency(trip.total_estimated_cost)}</p>
        </div>
      </header>

      {!stops.length ? (
        <EmptyState className="mt-8" title="Empty itinerary" description="Add stops in the builder to see the timeline." />
      ) : (
        <ol className="mt-8 space-y-6">
          {stops.map((stop) => {
            const byDay = groupByDate(stop.activities || [])
            return (
              <li key={stop.id} className="rounded-lg border border-line bg-paper p-5 shadow-card">
                <h2 className="font-display text-2xl">
                  {stop.city_name}, {stop.country}
                </h2>
                <p className="text-sm text-muted">{formatDateRange(stop.arrival_date, stop.departure_date)}</p>
                <div className="mt-4 space-y-4">
                  {Object.entries(byDay).map(([date, items]) => (
                    <div key={date}>
                      <p className="text-xs tracking-wide text-muted uppercase">{formatDate(date, 'EEEE d MMM')}</p>
                      <ul className="mt-2 space-y-2">
                        {items.map((activity) => (
                          <li key={activity.id} className="flex gap-3">
                            <CoverImage src={activity.image_url} alt="" className="h-14 w-14 rounded" />
                            <div>
                              <p className="font-medium">{activity.activity_name}</p>
                              <p className="text-sm text-muted">
                                {activity.start_time || 'Flexible'}
                                {activity.end_time ? ` – ${activity.end_time}` : ''} · {formatCurrency(activity.estimated_cost)}
                              </p>
                              <Badge className="mt-1">{activity.category}</Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

function groupByDate(activities) {
  return [...activities]
    .sort((a, b) => a.date.localeCompare(b.date) || (a.order ?? 0) - (b.order ?? 0))
    .reduce((acc, item) => {
      acc[item.date] = acc[item.date] || []
      acc[item.date].push(item)
      return acc
    }, {})
}
