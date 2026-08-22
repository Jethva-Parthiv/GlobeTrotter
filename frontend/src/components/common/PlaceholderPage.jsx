import { Link } from 'react-router-dom'
import Badge from '@/components/common/Badge'
import Card from '@/components/common/Card'
import { APP_NAME } from '@/constants/app'

export default function PlaceholderPage({
  eyebrow = APP_NAME,
  title,
  description,
  badge = 'Coming next',
}) {
  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p>
      <Card className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-ink">This screen is a foundation placeholder</h2>
          <Badge>{badge}</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          Business features, API data, and itinerary tools will land in later phases. No sample
          trips or cities are shown here.
        </p>
      </Card>
    </section>
  )
}

export function AuthPlaceholder({ title, description, footer }) {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <Card className="mt-8">
        <p className="text-sm leading-6 text-muted">
          Authentication forms will be implemented in a later phase. This route exists so the
          application shell and navigation can be verified now.
        </p>
      </Card>
      {footer}
    </div>
  )
}

export function AuthFooterLink({ to, prompt, label }) {
  return (
    <p className="mt-6 text-sm text-muted">
      {prompt}{' '}
      <Link to={to} className="font-medium text-accent hover:text-accent-hover">
        {label}
      </Link>
    </p>
  )
}
