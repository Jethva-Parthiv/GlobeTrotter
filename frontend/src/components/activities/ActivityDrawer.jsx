import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { activityApi } from '@/api/activityApi'
import Badge from '@/components/common/Badge'
import CoverImage from '@/components/common/CoverImage'
import Drawer from '@/components/common/Drawer'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import SearchInput from '@/components/common/SearchInput'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import { ACTIVITY_CATEGORIES } from '@/constants/activities'
import { QUERY_KEYS } from '@/constants/queryKeys'
import useDebounce from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/formatCurrency'
import { getApiErrorMessage } from '@/utils/apiError'

export default function ActivityDrawer({ open, stop, onClose, onPick }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const debouncedQ = useDebounce(q)
  const params = {
    q: debouncedQ || undefined,
    category: category || undefined,
    sort: 'name',
    limit: 20,
    offset: 0,
  }
  const query = useQuery({
    queryKey: QUERY_KEYS.cityActivities(stop?.city_id, params),
    queryFn: () => activityApi.listByCity(stop.city_id, params),
    enabled: open && Boolean(stop?.city_id),
  })

  return (
    <Drawer open={open} title={stop ? `Activities in ${stop.city_name}` : 'Activities'} onClose={onClose} className="max-w-lg">
      <div className="mb-4 space-y-3">
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activities" />
        <Select id="act-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {ACTIVITY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      {query.isLoading ? (
        <Skeleton className="h-40" />
      ) : query.isError ? (
        <ErrorState description={getApiErrorMessage(query.error)} onRetry={query.refetch} />
      ) : query.data?.activities?.length ? (
        <ul className="space-y-2">
          {query.data.activities.map((activity) => (
            <li key={activity.id}>
              <button
                type="button"
                onClick={() => onPick(activity)}
                className="flex w-full gap-3 rounded-md border border-line p-2 text-left hover:bg-cream"
              >
                <CoverImage src={activity.image_url} alt="" className="h-16 w-16 shrink-0 rounded" />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{activity.name}</span>
                    <Badge>{activity.category}</Badge>
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {formatCurrency(activity.estimated_cost)} · {activity.duration_hours}h
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No activities" description="Try another search." />
      )}
    </Drawer>
  )
}
