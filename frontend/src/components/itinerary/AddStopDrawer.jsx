import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cityApi } from '@/api/cityApi'
import { stopApi } from '@/api/stopApi'
import Button from '@/components/common/Button'
import Drawer from '@/components/common/Drawer'
import Input from '@/components/common/Input'
import SearchInput from '@/components/common/SearchInput'
import { QUERY_KEYS } from '@/constants/queryKeys'
import useDebounce from '@/hooks/useDebounce'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'
import { stopSchema } from '@/validations/trip'

export default function AddStopDrawer({ open, onClose, trip, nextOrder, onCreated }) {
  const toast = useToast()
  const [q, setQ] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const debouncedQ = useDebounce(q)
  const params = { q: debouncedQ || undefined, sort: 'popularity', limit: 8, offset: 0 }
  const citiesQuery = useQuery({
    queryKey: QUERY_KEYS.cities(params),
    queryFn: () => cityApi.list(params),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stopSchema),
    defaultValues: {
      city_id: '',
      arrival_date: trip?.start_date || '',
      departure_date: trip?.end_date || '',
      transport_cost: 0,
      stay_cost: 0,
    },
  })

  const mutation = useMutation({
    mutationFn: (values) =>
      stopApi.create(trip.id, {
        city_id: values.city_id,
        arrival_date: values.arrival_date,
        departure_date: values.departure_date,
        transport_cost: Number(values.transport_cost),
        stay_cost: Number(values.stay_cost),
        order: nextOrder,
      }),
    onSuccess: () => {
      toast.success('Stop added')
      reset()
      setSelectedCity(null)
      onCreated?.()
      onClose()
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  return (
    <Drawer open={open} title="Add a stop" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutateAsync(v))}>
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cities" />
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {citiesQuery.data?.cities?.map((city) => (
            <button
              type="button"
              key={city.id}
              onClick={() => {
                setSelectedCity(city)
                setValue('city_id', city.id, { shouldValidate: true })
              }}
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${selectedCity?.id === city.id ? 'bg-sand' : 'hover:bg-cream'}`}
            >
              {city.name}, {city.country}
            </button>
          ))}
        </div>
        {errors.city_id ? <p className="text-sm text-danger">{errors.city_id.message}</p> : null}
        <input type="hidden" {...register('city_id')} />
        <Input id="arrival_date" type="date" label="Arrival" error={errors.arrival_date?.message} {...register('arrival_date')} />
        <Input id="departure_date" type="date" label="Departure" error={errors.departure_date?.message} {...register('departure_date')} />
        <Input id="transport_cost" type="number" min="0" step="0.01" label="Transport cost (₹)" {...register('transport_cost')} />
        <Input id="stay_cost" type="number" min="0" step="0.01" label="Stay cost (₹)" {...register('stay_cost')} />
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          Add stop
        </Button>
      </form>
    </Drawer>
  )
}
