import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/userApi'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ImageUpload from '@/components/common/ImageUpload'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'
import { profileSchema } from '@/validations/auth'

export default function ProfilePage() {
  const { user } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [apiError, setApiError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(profileSchema) })

  const photoUrl = watch('photo_url')

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        photo_url: user.photo_url || '',
        language_preference: user.language_preference || 'en',
      })
    }
  }, [reset, user])

  const mutation = useMutation({
    mutationFn: (values) =>
      userApi.updateMe({
        name: values.name,
        email: values.email,
        photo_url: values.photo_url || null,
        language_preference: values.language_preference,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.me, data)
      toast.success('Profile updated')
      setApiError('')
    },
    onError: (error) => setApiError(getApiErrorMessage(error)),
  })

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">Profile</h1>
      <Card className="mt-6">
        <div className="mb-6 flex items-center gap-3">
          <Avatar src={photoUrl || user?.photo_url} name={user?.name} size="lg" />
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutateAsync(v))}>
          <Input id="name" label="Name" error={errors.name?.message} {...register('name')} />
          <Input id="email" label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <ImageUpload
            label="Profile photo"
            hint="Upload your avatar (PNG, JPG, WEBP, or GIF up to 10MB)"
            folder="avatars"
            value={photoUrl}
            onChange={(newUrl) => setValue('photo_url', newUrl, { shouldValidate: true, shouldDirty: true })}
            error={errors.photo_url?.message}
          />

          <Select id="language_preference" label="Language preference" {...register('language_preference')}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
          </Select>
          {apiError ? <p className="text-sm text-danger">{apiError}</p> : null}
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            Save profile
          </Button>
        </form>
      </Card>
    </div>
  )
}
