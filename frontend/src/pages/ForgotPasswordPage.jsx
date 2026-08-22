import { AuthFooterLink, AuthPlaceholder } from '@/components/common/PlaceholderPage'
import { ROUTES } from '@/constants/routes'

export default function ForgotPasswordPage() {
  return (
    <AuthPlaceholder
      title="Reset your password"
      description="Password recovery will be wired to the API contract in a later phase."
      footer={<AuthFooterLink to={ROUTES.login} prompt="Remembered it?" label="Back to login" />}
    />
  )
}
