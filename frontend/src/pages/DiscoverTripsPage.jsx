import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '@/api/publicApi'
import Button from '@/components/common/Button'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateRange } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'

const LIMIT = 12

export default function DiscoverTripsPage() {
  const [sort, setSort] = useState('recent')
  const [offset, setOffset] = useState(0)
  const params = { sort, limit: LIMIT, offset }
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.publicTrips(params),
    queryFn: () => publicApi.listTrips(params),
  })

  const trips = Array.isArray(data) ? data : []

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Public itineraries</h1>
          <p className="mt-2 text-sm text-muted">Open a trip to read the story, then copy it into your studio.</p>
        </div>
        <Select
          id="public-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setOffset(0)
          }}
          className="sm:w-48"
        >
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState className="mt-8" description={getApiErrorMessage(error)} onRetry={refetch} />
      ) : trips.length ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                to={ROUTES.sharedTrip(trip.id)}
                className="overflow-hidden rounded-lg border border-line bg-paper shadow-card"
              >
                <CoverImage src={trip.cover_photo_url} alt="" className="h-44 w-full" />
                <div className="p-4">
                  <h2 className="font-display text-xl">{trip.name}</h2>
                  <p className="mt-1 text-sm text-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
                  <p className="mt-2 text-sm">
                    {trip.stop_count} stops · {formatCurrency(trip.total_estimated_cost)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(offset - LIMIT, 0))}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={trips.length < LIMIT} onClick={() => setOffset(offset + LIMIT)}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <EmptyState className="mt-8" title="No public trips" description="When travellers share itineraries, they will appear here." />
      )}
    </div>
  )
}
