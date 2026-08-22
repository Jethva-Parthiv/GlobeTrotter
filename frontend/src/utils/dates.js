import { differenceInCalendarDays, format, parseISO } from 'date-fns'

export function formatDate(value, pattern = 'd MMM yyyy') {
  if (!value) return '—'
  try {
    return format(parseISO(value), pattern)
  } catch {
    return value
  }
}

export function formatDateRange(start, end) {
  if (!start || !end) return '—'
  return `${formatDate(start, 'd MMM')} – ${formatDate(end, 'd MMM yyyy')}`
}

export function nightCount(start, end) {
  if (!start || !end) return 0
  try {
    return Math.max(differenceInCalendarDays(parseISO(end), parseISO(start)), 0)
  } catch {
    return 0
  }
}
