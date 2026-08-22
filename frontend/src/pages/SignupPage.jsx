import { AuthFooterLink, AuthPlaceholder } from '@/components/common/PlaceholderPage'
import { ROUTES } from '@/constants/routes'

export default function SignupPage() {
  return (
    <AuthPlaceholder
      title="Create your studio"
      description="A calm space for multi-city trips, stops, and daily plans."
      footer={<AuthFooterLink to={ROUTES.login} prompt="Already have an account?" label="Log in" />}
    />
  )
}
