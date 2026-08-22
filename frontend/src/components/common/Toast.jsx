import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const styles = {
  success: 'border-line bg-paper text-ink',
  error: 'border-danger/20 bg-paper text-ink',
  info: 'border-line bg-paper text-ink',
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export default function Toast({ id, type = 'info', message, onDismiss }) {
  const Icon = icons[type] ?? Info

  return (
    <div
      role="status"
      className={cn(
        'shadow-elevated flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3',
        styles[type],
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          type === 'error' ? 'text-danger' : type === 'success' ? 'text-success' : 'text-accent',
        )}
      />
      <p className="flex-1 text-sm leading-5">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="rounded-md p-0.5 text-muted hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
