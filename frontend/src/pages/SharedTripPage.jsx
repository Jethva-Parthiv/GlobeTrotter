import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Copy, Share2 } from 'lucide-react'
import { publicApi } from '@/api/publicApi'
import { tripApi } from '@/api/tripApi'
import Button from '@/components/common/Button'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateRange } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'
import { shareOrCopy } from '@/utils/share'

export default function SharedTripPage() {
  const { tripId } = useParams()
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { data: trip, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.publicTrip(tripId),
    queryFn: () => publicApi.getTrip(tripId),
  })

  const copyMutation = useMutation({
    mutationFn: () => tripApi.copy(tripId),
    onSuccess: (copied) => {
      toast.success('Trip copied to your studio')
      navigate(ROUTES.trip(copied.id))
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })

  if (isLoading) return <Skeleton className="h-[28rem]" />
  if (isError) return <ErrorState description={getApiErrorMessage(error)} onRetry={refetch} />

  const stops = [...(trip.stops || [])].sort((a, b) => a.order - b.order)
  const route = stops.map((s) => s.city_name).join(' → ')

  const onShare = async () => {
    try {
      const result = await shareOrCopy(window.location.href, trip.name)
      toast.success(result === 'copied' ? 'Link copied' : 'Shared')
    } catch {
      toast.error('Sharing was cancelled')
    }
  }

  return (
    <article>
      <div className="relative">
        <CoverImage src={trip.cover_photo_url} alt="" className="h-[48vh] min-h-64 w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-paper sm:p-10">
          <Link to={ROUTES.discoverTrips} className="text-xs tracking-widest uppercase opacity-80">
            Public itinerary
          </Link>
          <h1 className="mt-2 font-display text-4xl sm:text-6xl">{trip.name}</h1>
          <p className="mt-3 text-sm text-paper/80">{formatDateRange(trip.start_date, trip.end_date)}</p>
          {route ? <p className="mt-2 max-w-2xl text-sm">{route}</p> : null}
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={onShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                navigate(ROUTES.login, { state: { from: ROUTES.sharedTrip(tripId) } })
                return
              }
              copyMutation.mutate()
            }}
            disabled={copyMutation.isPending}
          >
            <Copy className="h-4 w-4" />
            Copy trip
          </Button>
        </div>
        {trip.description ? <p className="mt-8 text-base leading-7 text-ink-soft">{trip.description}</p> : null}
        <p className="mt-4 text-lg">{formatCurrency(trip.total_estimated_cost)}</p>
        {!stops.length ? (
          <EmptyState className="mt-10" title="No stops published" />
        ) : (
          <ol className="mt-10 space-y-10">
            {stops.map((stop) => (
              <li key={stop.id}>
                <h2 className="font-display text-3xl">
                  {stop.city_name}, {stop.country}
                </h2>
                <p className="mt-1 text-sm text-muted">{formatDateRange(stop.arrival_date, stop.departure_date)}</p>
                <ul className="mt-4 space-y-3">
                  {(stop.activities || []).map((activity) => (
                    <li key={activity.id} className="flex gap-3">
                      <CoverImage src={activity.image_url} alt="" className="h-20 w-24 rounded-md" />
                      <div>
                        <p className="font-medium">{activity.activity_name}</p>
                        <p className="text-sm text-muted">
                          {activity.date} · {activity.start_time || 'Flexible'} · {formatCurrency(activity.estimated_cost)}
                        </p>
                        {activity.description ? <p className="mt-1 text-sm text-ink-soft">{activity.description}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  )
}
