import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { stopApi } from '@/api/stopApi'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'

export default function ScheduleActivityModal({
  open,
  tripId,
  stop,
  catalogueActivity,
  existing,
  onClose,
  onSaved,
}) {
  const toast = useToast()
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (!open || !stop) return
    reset({
      date: existing?.date || stop.arrival_date,
      start_time: existing?.start_time || '',
      end_time: existing?.end_time || '',
      order: existing?.order ?? 0,
    })
  }, [existing, open, reset, stop])

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        date: values.date,
        start_time: values.start_time || null,
        end_time: values.end_time || null,
        order: Number(values.order) || 0,
      }
      if (existing) {
        return stopApi.updateActivity(tripId, stop.id, existing.id, payload)
      }
      return stopApi.addActivity(tripId, stop.id, {
        activity_id: catalogueActivity.id,
        ...payload,
      })
    },
    onSuccess: () => {
      toast.success(existing ? 'Activity updated' : 'Activity added')
      onSaved?.()
      onClose()
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const title = existing
    ? `Schedule ${existing.activity_name}`
    : catalogueActivity
      ? `Add ${catalogueActivity.name}`
      : 'Schedule activity'

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((values) => {
          if (values.date < stop.arrival_date || values.date > stop.departure_date) {
            toast.error('Activity date must be within the stop dates')
            return
          }
          return mutation.mutateAsync(values)
        })}
      >
        <Input id="act-date" type="date" label="Date" min={stop?.arrival_date} max={stop?.departure_date} {...register('date')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="act-start" type="time" label="Start time" {...register('start_time')} />
          <Input id="act-end" type="time" label="End time" {...register('end_time')} />
        </div>
        <Input id="act-order" type="number" label="Order in the day" {...register('order')} />
        <Button type="submit" disabled={mutation.isPending}>
          {existing ? 'Save schedule' : 'Add to stop'}
        </Button>
      </form>
    </Modal>
  )
}
