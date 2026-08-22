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
import { signupSchema } from '@/validations/auth'

export default function SignupPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [apiError, setApiError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await authApi.signup(values)
      const data = await authApi.login({ email: values.email, password: values.password })
      loginWithToken(data.access_token)
      toast.success('Account created')
      navigate(ROUTES.dashboard, { replace: true })
    } catch (error) {
      setApiError(getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Create your studio</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Plan multi-city trips with a calm, considered workflow.</p>
      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="name" label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input id="email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput id="password" label="Password" autoComplete="new-password" error={errors.password?.message} register={register('password')} />
        {apiError ? <p className="text-sm text-danger">{apiError}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-accent">
          Log in
        </Link>
      </p>
    </div>
  )
}
