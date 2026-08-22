import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/api/authApi'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import PasswordInput from '@/components/common/PasswordInput'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'
import { loginSchema } from '@/validations/auth'

export default function LoginPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [apiError, setApiError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      const data = await authApi.login(values)
      loginWithToken(data.access_token)
      toast.success('Welcome back')
      navigate(ROUTES.dashboard, { replace: true })
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Sign in to continue planning.</p>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput id="password" label="Password" autoComplete="current-password" error={errors.password?.message} register={register('password')} />
        {apiError ? <p className="text-sm text-danger">{apiError}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        New to GlobeTrotter?{' '}
        <Link to={ROUTES.signup} className="font-medium text-accent">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-sm text-muted">
        <Link to={ROUTES.forgotPassword} className="font-medium text-accent">
          Forgot password
        </Link>
      </p>
    </div>
  )
}
