import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Textarea = forwardRef(function Textarea(
  { id, label, error, hint, className, rows = 4, ...props },
  ref,
) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink',
          'placeholder:text-muted/80 outline-none focus:border-ink/30 focus:ring-2 focus:ring-accent/20',
          error && 'border-danger focus:ring-danger/20',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  )
})

export default Textarea
