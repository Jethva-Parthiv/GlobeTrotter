import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns'
import { tripApi } from '@/api/tripApi'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'
import { cn } from '@/utils/cn'

export default function CalendarPage() {
  const { tripId } = useParams()
  const { data: trip, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.trip(tripId),
    queryFn: () => tripApi.get(tripId),
  })
  const [selected, setSelected] = useState(null)

  const days = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return []
    try {
      return eachDayOfInterval({ start: parseISO(trip.start_date), end: parseISO(trip.end_date) })
    } catch {
      return []
    }
  }, [trip])

  const activities = useMemo(() => {
    return (trip?.stops || []).flatMap((stop) =>
      (stop.activities || []).map((activity) => ({ ...activity, city_name: stop.city_name })),
    )
  }, [trip])

  const selectedDate = selected || trip?.start_date
  const dayActivities = activities.filter((a) => a.date === selectedDate)

  if (isLoading) return <Skeleton className="h-96" />
  if (isError) return <ErrorState description={getApiErrorMessage(error)} onRetry={refetch} />

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link to={ROUTES.tripItinerary(trip.id)} className="rounded-md px-3 py-1.5 text-sm hover:bg-sand">
          Timeline
        </Link>
        <span className="rounded-md bg-ink px-3 py-1.5 text-sm text-paper">Calendar</span>
        <Link to={ROUTES.trip(trip.id)} className="rounded-md px-3 py-1.5 text-sm hover:bg-sand">
          Builder
        </Link>
      </div>
      <h1 className="font-display text-3xl">{trip.name}</h1>
      <p className="mt-1 text-sm text-muted">Tap a day to see what is planned.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-x-auto rounded-lg border border-line bg-paper p-4">
          <div className="grid min-w-[280px] grid-cols-7 gap-1 text-center text-xs text-muted">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
            {padStart(days).map((day, index) =>
              day ? (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelected(format(day, 'yyyy-MM-dd'))}
                  className={cn(
                    'aspect-square rounded-md text-sm',
                    isSameDay(day, parseISO(selectedDate || trip.start_date))
                      ? 'bg-ink text-paper'
                      : 'hover:bg-sand',
                    activities.some((a) => a.date === format(day, 'yyyy-MM-dd')) &&
                      !isSameDay(day, parseISO(selectedDate || trip.start_date))
                      ? 'font-semibold text-accent'
                      : '',
                  )}
                >
                  {format(day, 'd')}
                </button>
              ) : (
                <div key={`e-${index}`} />
              ),
            )}
          </div>
        </div>
        <section className="rounded-lg border border-line bg-paper p-4">
          <h2 className="font-display text-xl">{selectedDate ? formatDate(selectedDate, 'EEEE d MMMM') : 'Select a day'}</h2>
          {dayActivities.length ? (
            <ul className="mt-4 space-y-3">
              {dayActivities.map((activity) => (
                <li key={activity.id} className="flex gap-3">
                  <CoverImage src={activity.image_url} alt="" className="h-14 w-14 rounded" />
                  <div>
                    <p className="font-medium">{activity.activity_name}</p>
                    <p className="text-sm text-muted">
                      {activity.city_name} · {activity.start_time || 'Flexible'} · {formatCurrency(activity.estimated_cost)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-4 border-0 p-4 shadow-none" title="Nothing scheduled" description="Free day — or add activities in the builder." />
          )}
        </section>
      </div>
    </div>
  )
}

function padStart(days) {
  if (!days.length) return []
  const first = days[0]
  const weekday = (first.getDay() + 6) % 7
  return [...Array.from({ length: weekday }, () => null), ...days]
}
