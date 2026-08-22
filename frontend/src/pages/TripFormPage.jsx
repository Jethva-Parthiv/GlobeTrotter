import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tripApi } from '@/api/tripApi'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ErrorState from '@/components/common/ErrorState'
import Input from '@/components/common/Input'
import Skeleton from '@/components/common/Skeleton'
import Textarea from '@/components/common/Textarea'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'
import { tripSchema } from '@/validations/trip'

export default function TripFormPage({ mode }) {
  const { tripId } = useParams()
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [apiError, setApiError] = useState('')

  const tripQuery = useQuery({
    queryKey: QUERY_KEYS.trip(tripId),
    queryFn: () => tripApi.get(tripId),
    enabled: isEdit && Boolean(tripId),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      cover_photo_url: '',
      is_public: false,
    },
  })

  useEffect(() => {
    if (tripQuery.data) {
      reset({
        name: tripQuery.data.name,
        description: tripQuery.data.description || '',
        start_date: tripQuery.data.start_date,
        end_date: tripQuery.data.end_date,
        cover_photo_url: tripQuery.data.cover_photo_url || '',
        is_public: tripQuery.data.is_public,
      })
    }
  }, [reset, tripQuery.data])

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        name: values.name,
        description: values.description || null,
        start_date: values.start_date,
        end_date: values.end_date,
        cover_photo_url: values.cover_photo_url || null,
        is_public: Boolean(values.is_public),
      }
      return isEdit ? tripApi.update(tripId, payload) : tripApi.create(payload)
    },
    onSuccess: (trip) => {
      toast.success(isEdit ? 'Trip updated' : 'Trip created')
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trip(trip.id) })
      navigate(ROUTES.trip(trip.id))
    },
    onError: (error) => setApiError(getApiErrorMessage(error)),
  })

  if (isEdit && tripQuery.isLoading) {
    return <Skeleton className="h-96" />
  }

  if (isEdit && tripQuery.isError) {
    return <ErrorState description={getApiErrorMessage(tripQuery.error)} onRetry={tripQuery.refetch} />
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl sm:text-4xl">{isEdit ? 'Edit trip' : 'New trip'}</h1>
      <p className="mt-2 text-sm text-muted">Use the dates your journey actually spans.</p>
      <Card className="mt-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutateAsync(v))} noValidate>
          <Input id="name" label="Trip name" error={errors.name?.message} {...register('name')} />
          <Textarea id="description" label="Description" error={errors.description?.message} {...register('description')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="start_date" type="date" label="Start date" error={errors.start_date?.message} {...register('start_date')} />
            <Input id="end_date" type="date" label="End date" error={errors.end_date?.message} {...register('end_date')} />
          </div>
          <Input
            id="cover_photo_url"
            label="Cover photo URL"
            hint="A public image URL"
            error={errors.cover_photo_url?.message}
            {...register('cover_photo_url')}
          />
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" className="h-4 w-4" {...register('is_public')} />
            Make this itinerary public
          </label>
          {apiError ? <p className="text-sm text-danger">{apiError}</p> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {isEdit ? 'Save trip' : 'Create trip'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
