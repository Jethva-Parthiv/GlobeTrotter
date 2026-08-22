import { AuthFooterLink, AuthPlaceholder } from '@/components/common/PlaceholderPage'
import { ROUTES } from '@/constants/routes'

export default function LoginPage() {
  return (
    <AuthPlaceholder
      title="Welcome back"
      description="Sign in to continue planning your next itinerary."
      footer={
        <div>
          <AuthFooterLink to={ROUTES.signup} prompt="New to GlobeTrotter?" label="Create an account" />
          <AuthFooterLink to={ROUTES.forgotPassword} prompt="Need help?" label="Forgot password" />
        </div>
      }
    />
  )
}
