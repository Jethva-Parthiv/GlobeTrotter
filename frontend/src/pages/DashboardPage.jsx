import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Compass, Plus } from 'lucide-react'
import { dashboardApi } from '@/api/dashboardApi'
import Button from '@/components/common/Button'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import CityCard from '@/components/cities/CityCard'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateRange } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: dashboardApi.get,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-56" />
      </div>
    )
  }

  if (isError) {
    return <ErrorState description={getApiErrorMessage(error)} onRetry={refetch} />
  }

  const name = data.welcome_name || user?.name || 'Traveller'

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-xl border border-line bg-ink text-paper">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 sm:p-10">
            <p className="text-xs tracking-[0.2em] uppercase opacity-70">GlobeTrotter</p>
            <h1 className="mt-3 font-display text-3xl sm:text-5xl">Welcome back, {name}.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-paper/75">
              Your next itinerary is waiting. Plan a new trip or pick up where you left off.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => navigate(ROUTES.tripNew)}>
                <Plus className="h-4 w-4" />
                Plan new trip
              </Button>
              <Link
                to={ROUTES.discoverCities}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 px-4 text-sm"
              >
                <Compass className="h-4 w-4" />
                Discover cities
              </Link>
            </div>
          </div>
          <CoverImage
            src={data.upcoming_trips?.[0]?.cover_photo_url}
            alt=""
            className="hidden h-full min-h-56 w-full lg:block"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total trips" value={data.total_trips ?? 0} />
        <Stat label="All-trip budget" value={formatCurrency(data.total_budget_all_trips)} />
        <Stat label="Upcoming" value={data.upcoming_trips?.length ?? 0} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl">Upcoming trips</h2>
          <Link to={ROUTES.trips} className="text-sm font-medium text-accent">
            View all
          </Link>
        </div>
        {data.upcoming_trips?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.upcoming_trips.map((trip) => (
              <Link
                key={trip.id}
                to={ROUTES.trip(trip.id)}
                className="overflow-hidden rounded-lg border border-line bg-paper shadow-card"
              >
                <CoverImage src={trip.cover_photo_url} alt="" className="h-40 w-full" />
                <div className="p-4">
                  <h3 className="font-display text-xl">{trip.name}</h3>
                  <p className="mt-1 text-sm text-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
                  <p className="mt-2 text-sm">
                    {trip.stop_count} stops · {formatCurrency(trip.total_estimated_cost)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming trips"
            description="Start a new itinerary and add your first city."
            actionLabel="Plan new trip"
            onAction={() => navigate(ROUTES.tripNew)}
          />
        )}
      </section>

      {data.recent_trips?.length ? (
        <section>
          <h2 className="mb-4 font-display text-2xl">Recent trips</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.recent_trips.map((trip) => (
              <Link
                key={trip.id}
                to={ROUTES.trip(trip.id)}
                className="rounded-lg border border-line bg-paper p-4 shadow-card"
              >
                <h3 className="font-medium">{trip.name}</h3>
                <p className="mt-1 text-sm text-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 font-display text-2xl">Recommended cities</h2>
        {data.recommended_cities?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.recommended_cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recommendations yet"
            description="Browse the city catalogue to find your next stop."
            actionLabel="Discover cities"
            onAction={() => navigate(ROUTES.discoverCities)}
          />
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-5 shadow-card">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  )
}
