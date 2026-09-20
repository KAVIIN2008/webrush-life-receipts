export function formatDay(day: string) {
  if (!day) return 'Undated'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(day + 'T00:00:00'))
}

export function formatLongDay(day: string) {
  if (!day) return 'Undated'
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(day + 'T00:00:00'))
}

export function formatTime(timestamp?: string | null) {
  if (!timestamp) return 'No timestamp'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatClockTime(timestamp?: string | null) {
  if (!timestamp) return 'No timestamp'
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatCurrency(amount: number | null | undefined, currency = 'INR') {
  if (amount == null) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}
