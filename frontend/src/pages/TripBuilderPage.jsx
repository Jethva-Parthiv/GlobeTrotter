import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarRange, GripVertical, Pencil, Plus, Trash2, Wallet } from 'lucide-react'
import { stopApi } from '@/api/stopApi'
import { tripApi } from '@/api/tripApi'
import Button from '@/components/common/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import CoverImage from '@/components/common/CoverImage'
import EmptyState from '@/components/common/EmptyState'
import ErrorState from '@/components/common/ErrorState'
import Skeleton from '@/components/common/Skeleton'
import AddStopDrawer from '@/components/itinerary/AddStopDrawer'
import EditStopModal from '@/components/itinerary/EditStopModal'
import ActivityDrawer from '@/components/activities/ActivityDrawer'
import ScheduleActivityModal from '@/components/activities/ScheduleActivityModal'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateRange } from '@/utils/dates'
import { getApiErrorMessage } from '@/utils/apiError'
import Badge from '@/components/common/Badge'

export default function TripBuilderPage() {
  const { tripId } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [addStopOpen, setAddStopOpen] = useState(false)
  const [editStop, setEditStop] = useState(null)
  const [deleteStop, setDeleteStop] = useState(null)
  const [activityStop, setActivityStop] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [editActivity, setEditActivity] = useState(null)
  const [deleteActivity, setDeleteActivity] = useState(null)

  const tripQuery = useQuery({
    queryKey: QUERY_KEYS.trip(tripId),
    queryFn: () => tripApi.get(tripId),
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const trip = tripQuery.data
  const stops = useMemo(
    () => [...(trip?.stops || [])].sort((a, b) => a.order - b.order),
    [trip?.stops],
  )
  const isOwner = trip && user && trip.user_id === user.id

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trip(tripId) })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budget(tripId) })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailyBudget(tripId) })
    queryClient.invalidateQueries({ queryKey: ['trips'] })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard })
  }

  const reorderMutation = useMutation({
    mutationFn: (ordered) =>
      stopApi.reorder(
        tripId,
        ordered.map((stop, index) => ({ stop_id: stop.id, order: index + 1 })),
      ),
    onSuccess: () => {
      toast.success('Stops reordered')
      invalidate()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trip(tripId) })
    },
  })

  const deleteStopMutation = useMutation({
    mutationFn: (stopId) => stopApi.remove(tripId, stopId),
    onSuccess: () => {
      toast.success('Stop removed')
      setDeleteStop(null)
      invalidate()
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const deleteActivityMutation = useMutation({
    mutationFn: ({ stopId, id }) => stopApi.removeActivity(tripId, stopId, id),
    onSuccess: () => {
      toast.success('Activity removed')
      setDeleteActivity(null)
      invalidate()
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (tripQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-40" />
      </div>
    )
  }

  if (tripQuery.isError) {
    return <ErrorState description={getApiErrorMessage(tripQuery.error)} onRetry={tripQuery.refetch} />
  }

  const onDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = stops.findIndex((s) => s.id === active.id)
    const newIndex = stops.findIndex((s) => s.id === over.id)
    const next = arrayMove(stops, oldIndex, newIndex)
    queryClient.setQueryData(QUERY_KEYS.trip(tripId), (current) =>
      current ? { ...current, stops: next.map((s, i) => ({ ...s, order: i + 1 })) } : current,
    )
    reorderMutation.mutate(next)
  }

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-xl border border-line bg-paper">
        <CoverImage src={trip.cover_photo_url} alt="" className="h-48 w-full sm:h-64" />
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-muted uppercase">Itinerary builder</p>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl">{trip.name}</h1>
              <p className="mt-2 text-sm text-muted">{formatDateRange(trip.start_date, trip.end_date)}</p>
            </div>
            {trip.is_public ? <Badge variant="accent">Public</Badge> : <Badge>Private</Badge>}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span>{trip.stop_count} destinations</span>
            <span>{formatCurrency(trip.total_estimated_cost)}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="rounded-md bg-sand px-3 py-2 text-sm font-medium" to={ROUTES.tripItinerary(trip.id)}>
              Timeline
            </Link>
            <Link className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm" to={ROUTES.tripCalendar(trip.id)}>
              <CalendarRange className="h-4 w-4" />
              Calendar
            </Link>
            <Link className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm" to={ROUTES.tripBudget(trip.id)}>
              <Wallet className="h-4 w-4" />
              Budget
            </Link>
            {isOwner ? (
              <Link className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm" to={ROUTES.tripEdit(trip.id)}>
                <Pencil className="h-4 w-4" />
                Edit trip
              </Link>
            ) : null}
            {trip.is_public ? (
              <Link className="rounded-md px-3 py-2 text-sm" to={ROUTES.sharedTrip(trip.id)}>
                Preview
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Journey</h2>
        {isOwner ? (
          <Button onClick={() => setAddStopOpen(true)}>
            <Plus className="h-4 w-4" />
            Add stop
          </Button>
        ) : null}
      </div>

      {!stops.length ? (
        <EmptyState
          title="No cities yet"
          description="Add your first destination to start shaping the route."
          actionLabel={isOwner ? 'Add stop' : undefined}
          onAction={isOwner ? () => setAddStopOpen(true) : undefined}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={isOwner ? onDragEnd : undefined}>
          <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <ol className="space-y-4 lg:space-y-0 lg:border-l lg:border-line lg:pl-8">
              {stops.map((stop) => (
                <SortableStop
                  key={stop.id}
                  stop={stop}
                  canEdit={isOwner}
                  onEdit={() => setEditStop(stop)}
                  onDelete={() => setDeleteStop(stop)}
                  onAddActivity={() => setActivityStop(stop)}
                  onEditActivity={(activity) => setEditActivity({ stop, activity })}
                  onDeleteActivity={(activity) => setDeleteActivity({ stop, activity })}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      <AddStopDrawer
        open={addStopOpen}
        onClose={() => setAddStopOpen(false)}
        trip={trip}
        nextOrder={stops.length + 1}
        onCreated={invalidate}
      />
      <EditStopModal
        open={Boolean(editStop)}
        stop={editStop}
        trip={trip}
        onClose={() => setEditStop(null)}
        onSaved={invalidate}
      />
      <ActivityDrawer
        open={Boolean(activityStop)}
        stop={activityStop}
        onClose={() => setActivityStop(null)}
        onPick={(activity) => {
          setSchedule({ stop: activityStop, activity })
          setActivityStop(null)
        }}
      />
      <ScheduleActivityModal
        open={Boolean(schedule) || Boolean(editActivity)}
        tripId={tripId}
        stop={schedule?.stop || editActivity?.stop}
        catalogueActivity={schedule?.activity}
        existing={editActivity?.activity}
        onClose={() => {
          setSchedule(null)
          setEditActivity(null)
        }}
        onSaved={invalidate}
      />
      <ConfirmDialog
        open={Boolean(deleteStop)}
        title="Remove this stop?"
        description="The city and its activities will be removed from the trip."
        confirmLabel="Delete stop"
        destructive
        onCancel={() => setDeleteStop(null)}
        onConfirm={() => deleteStop && deleteStopMutation.mutate(deleteStop.id)}
      />
      <ConfirmDialog
        open={Boolean(deleteActivity)}
        title="Remove this activity?"
        description="It will be unscheduled from this stop."
        confirmLabel="Delete activity"
        destructive
        onCancel={() => setDeleteActivity(null)}
        onConfirm={() =>
          deleteActivity &&
          deleteActivityMutation.mutate({ stopId: deleteActivity.stop.id, id: deleteActivity.activity.id })
        }
      />
    </div>
  )
}

function SortableStop({ stop, canEdit, onEdit, onDelete, onAddActivity, onEditActivity, onDeleteActivity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id,
    disabled: !canEdit,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-line bg-paper p-4 shadow-card lg:relative lg:mb-6 ${isDragging ? 'opacity-80' : ''}`}
    >
      <div className="flex items-start gap-3">
        {canEdit ? (
          <button
            type="button"
            className="mt-1 hidden rounded p-1 text-muted hover:bg-sand lg:block"
            aria-label="Reorder stop"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted">Stop {stop.order}</p>
              <h3 className="font-display text-2xl">
                {stop.city_name}, {stop.country}
              </h3>
              <p className="text-sm text-muted">{formatDateRange(stop.arrival_date, stop.departure_date)}</p>
            </div>
            {canEdit ? (
              <div className="flex flex-wrap gap-1">
                {canEdit ? (
                  <button type="button" className="rounded-md px-2 py-1 text-sm lg:hidden" {...attributes} {...listeners}>
                    Reorder
                  </button>
                ) : null}
                <button type="button" onClick={onEdit} className="rounded-md px-2 py-1 text-sm hover:bg-sand">
                  Edit
                </button>
                <button type="button" onClick={onDelete} className="rounded-md px-2 py-1 text-sm text-danger hover:bg-danger-soft">
                  <Trash2 className="inline h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <p>Transport {formatCurrency(stop.transport_cost)}</p>
            <p>Stay {formatCurrency(stop.stay_cost)}</p>
            <p>Total {formatCurrency(stop.total_cost)}</p>
          </div>
          <div className="mt-4 space-y-2">
            {(stop.activities || []).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 rounded-md border border-line p-2">
                <CoverImage src={activity.image_url} alt="" className="h-12 w-12 rounded" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{activity.activity_name}</p>
                  <p className="text-xs text-muted">
                    {activity.date} {activity.start_time || ''} {activity.end_time ? `– ${activity.end_time}` : ''} ·{' '}
                    {formatCurrency(activity.estimated_cost)}
                  </p>
                </div>
                {canEdit ? (
                  <div className="flex gap-1">
                    <button type="button" className="text-xs text-accent" onClick={() => onEditActivity(activity)}>
                      Schedule
                    </button>
                    <button type="button" className="text-xs text-danger" onClick={() => onDeleteActivity(activity)}>
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {canEdit ? (
            <Button size="sm" variant="secondary" className="mt-4" onClick={onAddActivity}>
              <Plus className="h-4 w-4" />
              Add activity
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  )
}
