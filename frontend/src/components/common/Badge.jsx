import { cn } from '@/utils/cn'

const variants = {
  default: 'bg-sand text-ink-soft',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-[#e7f3ec] text-success',
  danger: 'bg-danger-soft text-danger',
}

export default function Badge({ children, className, variant = 'default' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
