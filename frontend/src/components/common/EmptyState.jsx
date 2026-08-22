import { cn } from '@/utils/cn'
import Button from './Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper px-6 py-12 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand text-ink-soft">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
