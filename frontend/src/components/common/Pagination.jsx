import Button from './Button'

export default function Pagination({ offset, limit, total, onChange }) {
  const start = total === 0 ? 0 : offset + 1
  const end = Math.min(offset + limit, total)
  const canPrev = offset > 0
  const canNext = offset + limit < total

  if (total <= limit) return null

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => onChange(Math.max(offset - limit, 0))}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => onChange(offset + limit)}>
          Next
        </Button>
      </div>
    </div>
  )
}
