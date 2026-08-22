import { cn } from '@/utils/cn'

export default function Spinner({ className, label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'h-5 w-5 animate-spin rounded-full border-2 border-sand border-t-accent',
        className,
      )}
    />
  )
}
