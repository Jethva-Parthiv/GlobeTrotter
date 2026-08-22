import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/authApi'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { ROUTES } from '@/constants/routes'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'
import { forgotPasswordSchema } from '@/validations/auth'

export default function ForgotPasswordPage() {
  const toast = useToast()
  const [apiError, setApiError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      const data = await authApi.forgotPassword(values)
      toast.success(data.detail || 'If the email exists, a reset link has been sent.')
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Reset your password</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Enter the email on your account.</p>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        {apiError ? <p className="text-sm text-danger">{apiError}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        <Link to={ROUTES.login} className="font-medium text-accent">
          Back to login
        </Link>
      </p>
    </div>
  )
}
