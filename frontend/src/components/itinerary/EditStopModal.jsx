import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { stopApi } from '@/api/stopApi'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'

export default function EditStopModal({ open, stop, trip, onClose, onSaved }) {
  const toast = useToast()
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (stop) {
      reset({
        arrival_date: stop.arrival_date,
        departure_date: stop.departure_date,
        transport_cost: stop.transport_cost,
        stay_cost: stop.stay_cost,
      })
    }
  }, [reset, stop])

  const mutation = useMutation({
    mutationFn: (values) =>
      stopApi.update(trip.id, stop.id, {
        arrival_date: values.arrival_date,
        departure_date: values.departure_date,
        transport_cost: Number(values.transport_cost),
        stay_cost: Number(values.stay_cost),
      }),
    onSuccess: () => {
      toast.success('Stop updated')
      onSaved?.()
      onClose()
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  return (
    <Modal open={open} title={stop ? `${stop.city_name}` : 'Edit stop'} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutateAsync(v))}>
        <Input id="edit-arrival" type="date" label="Arrival" {...register('arrival_date')} />
        <Input id="edit-departure" type="date" label="Departure" {...register('departure_date')} />
        <Input id="edit-transport" type="number" min="0" step="0.01" label="Transport cost (₹)" {...register('transport_cost')} />
        <Input id="edit-stay" type="number" min="0" step="0.01" label="Stay cost (₹)" {...register('stay_cost')} />
        <Button type="submit" disabled={mutation.isPending}>
          Save stop
        </Button>
      </form>
    </Modal>
  )
}
