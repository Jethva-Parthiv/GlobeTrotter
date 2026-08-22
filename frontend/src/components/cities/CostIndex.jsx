export default function CostIndex({ value }) {
  const n = Number(value) || 0
  return (
    <span className="text-xs tracking-wide text-muted" aria-label={`Cost index ${n} of 5`}>
      <span className="text-accent">{'●'.repeat(n)}</span>
      <span className="opacity-30">{'○'.repeat(Math.max(5 - n, 0))}</span>
    </span>
  )
}
