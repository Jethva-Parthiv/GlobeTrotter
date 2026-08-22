import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Select = forwardRef(function Select(
  { id, label, error, hint, className, children, ...props },
  ref,
) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        ref={ref}
        className={cn(
          'h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink',
          'outline-none transition-shadow focus:border-ink/30 focus:ring-2 focus:ring-accent/20',
          error && 'border-danger focus:ring-danger/20',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-sm text-danger">{error}</p> : hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  )
})

export default Select
