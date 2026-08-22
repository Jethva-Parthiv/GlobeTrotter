import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Map } from 'lucide-react'
import { tripApi } from '@/api/tripApi'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Select from '@/components/common/Select'
import TripCard from '@/components/trips/TripCard'
import TripCardSkeleton from '@/components/trips/TripCardSkeleton'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'

export default function TripsPage() {
  const [sort, setSort] = useState('upcoming')
  const [pendingDelete, setPendingDelete] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.trips(sort),
    queryFn: () => tripApi.list(sort),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => tripApi.remove(id),
    onSuccess: () => {
      toast.success('Trip deleted')
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard })
      setPendingDelete(null)
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">My trips</h1>
          <p className="mt-2 text-sm text-muted">Every itinerary in one place.</p>
        </div>
        <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-48">
          <option value="upcoming">Upcoming</option>
          <option value="created">Recently created</option>
          <option value="name">Name</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <TripCardSkeleton />
          <TripCardSkeleton />
          <TripCardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState className="mt-8" description={getApiErrorMessage(error)} onRetry={refetch} />
      ) : data?.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={setPendingDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-8"
          icon={Map}
          title="No trips yet"
          description="Create your first multi-city itinerary."
          actionLabel="Plan new trip"
          onAction={() => navigate(ROUTES.tripNew)}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this trip?"
        description="This removes the trip, stops, and activities. This cannot be undone."
        confirmLabel="Delete trip"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  )
}
