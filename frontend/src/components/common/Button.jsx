import { cn } from '@/utils/cn'

const variants = {
  primary:
    'bg-accent text-white shadow-sm hover:bg-accent-hover focus-visible:outline-accent',
  secondary:
    'bg-paper text-ink border border-line hover:bg-sand focus-visible:outline-ink',
  ghost:
    'bg-transparent text-ink-soft hover:bg-sand hover:text-ink focus-visible:outline-ink',
  danger:
    'bg-danger text-white hover:bg-[#9b1c14] focus-visible:outline-danger',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
