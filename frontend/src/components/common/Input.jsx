import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(function Input(
  { id, label, error, hint, className, type = 'text', ...props },
  ref,
) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        ref={ref}
        type={type}
        className={cn(
          'h-10 w-full rounded-md border border-line bg-paper px-3 text-sm text-ink',
          'placeholder:text-muted/80',
          'outline-none transition-shadow focus:border-ink/30 focus:ring-2 focus:ring-accent/20',
          error && 'border-danger focus:ring-danger/20',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})

export default Input
