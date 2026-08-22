import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { activityApi } from '@/api/activityApi'
import { cityApi } from '@/api/cityApi'
import CostIndex from '@/components/cities/CostIndex'
import Badge from '@/components/common/Badge'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import { ACTIVITY_CATEGORIES } from '@/constants/activities'
import { QUERY_KEYS } from '@/constants/queryKeys'
import useDebounce from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/formatCurrency'
import { getApiErrorMessage } from '@/utils/apiError'

const LIMIT = 12

export default function CityDetailPage() {
  const { cityId } = useParams()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [offset, setOffset] = useState(0)
  const debouncedQ = useDebounce(q)
  const params = {
    q: debouncedQ || undefined,
    category: category || undefined,
    sort: 'name',
    limit: LIMIT,
    offset,
  }

  const cityQuery = useQuery({
    queryKey: QUERY_KEYS.city(cityId),
    queryFn: () => cityApi.get(cityId),
  })
  const activitiesQuery = useQuery({
    queryKey: QUERY_KEYS.cityActivities(cityId, params),
    queryFn: () => activityApi.listByCity(cityId, params),
    enabled: Boolean(cityId),
  })

  if (cityQuery.isLoading) return <Skeleton className="h-80" />
  if (cityQuery.isError) {
    return <ErrorState description={getApiErrorMessage(cityQuery.error)} onRetry={cityQuery.refetch} />
  }

  const city = cityQuery.data

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        <CoverImage src={city.image_url} alt="" className="h-56 w-full sm:h-72" />
        <div className="p-5 sm:p-8">
          <h1 className="font-display text-3xl sm:text-5xl">{city.name}</h1>
          <p className="mt-2 text-muted">
            {city.country}
            {city.region ? ` · ${city.region}` : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <CostIndex value={city.cost_index} />
            <span className="text-muted">Popularity {city.popularity}</span>
          </div>
          {city.description ? <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-soft">{city.description}</p> : null}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOffset(0)
          }}
          placeholder="Search activities"
        />
        <Select
          id="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setOffset(0)
          }}
          className="sm:w-48"
        >
          <option value="">All categories</option>
          {ACTIVITY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      {activitiesQuery.isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : activitiesQuery.isError ? (
        <ErrorState className="mt-6" description={getApiErrorMessage(activitiesQuery.error)} onRetry={activitiesQuery.refetch} />
      ) : activitiesQuery.data?.activities?.length ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {activitiesQuery.data.activities.map((activity) => (
              <article key={activity.id} className="flex gap-3 overflow-hidden rounded-lg border border-line bg-paper">
                <CoverImage src={activity.image_url} alt="" className="h-28 w-28 shrink-0" />
                <div className="min-w-0 py-3 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{activity.name}</h3>
                    <Badge>{activity.category}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatCurrency(activity.estimated_cost)} · {activity.duration_hours}h
                  </p>
                  {activity.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{activity.description}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <Pagination
            offset={offset}
            limit={LIMIT}
            total={activitiesQuery.data.total}
            onChange={setOffset}
          />
        </>
      ) : (
        <EmptyState className="mt-6" title="No activities" description="Nothing matches those filters." />
      )}
    </div>
  )
}
