import type { Receipt } from '../../types/receipt'

export interface MonthlyActivity {
  label: string
  value: number
}

export interface TimeBucket {
  label: string
  value: number
}

export interface HeatCell {
  day: string
  bucket: string
  value: number
}

export interface PatternSummary {
  monthly: MonthlyActivity[]
  timeBuckets: TimeBucket[]
  heatmap: HeatCell[]
  topCategories: Array<{ label: string; value: number }>
  observedPattern: { label: string; detail: string }
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIME_BUCKETS = [
  { label: '00–03', start: 0 },
  { label: '03–06', start: 3 },
  { label: '06–09', start: 6 },
  { label: '09–12', start: 9 },
  { label: '12–15', start: 12 },
  { label: '15–18', start: 15 },
  { label: '18–21', start: 18 },
  { label: '21–24', start: 21 },
]

export function getActivityByMonth(receipts: Receipt[]): MonthlyActivity[] {
  const counts = new Map<string, number>()
  for (const receipt of receipts) {
    if (!receipt.timestamp) continue
    const date = new Date(receipt.timestamp)
    const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, value]) => {
      const parts = key.split('-')
      return {
        label: new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' })
          .format(new Date(Number(parts[0]), Number(parts[1]) - 1, 1)),
        value,
      }
    })
}

export function getActivityByHour(receipts: Receipt[]): TimeBucket[] {
  const counts = TIME_BUCKETS.map((bucket) => ({ label: bucket.label, value: 0 }))
  for (const receipt of receipts) {
    if (!receipt.timestamp) continue
    const hour = new Date(receipt.timestamp).getHours()
    const index = Math.min(Math.floor(hour / 3), counts.length - 1)
    counts[index].value += 1
  }
  return counts
}

export function getActivityHeatmap(receipts: Receipt[]): HeatCell[] {
  const cells = new Map<string, number>()
  for (const receipt of receipts) {
    if (!receipt.timestamp) continue
    const date = new Date(receipt.timestamp)
    const day = WEEKDAYS[date.getDay()]
    const bucket = TIME_BUCKETS[Math.min(Math.floor(date.getHours() / 3), 7)].label
    const key = day + '::' + bucket
    cells.set(key, (cells.get(key) ?? 0) + 1)
  }
  return WEEKDAYS.flatMap((day) =>
    TIME_BUCKETS.map((bucket) => ({
      day,
      bucket: bucket.label,
      value: cells.get(day + '::' + bucket.label) ?? 0,
    })),
  )
}

export function getTopCategories(receipts: Receipt[]) {
  const counts = new Map<string, number>()
  for (const receipt of receipts) {
    if (receipt.kind === 'music' || !receipt.category) continue
    counts.set(receipt.category, (counts.get(receipt.category) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }))
}

export function detectPersona(receipts: Receipt[]): PatternSummary['observedPattern'] {
  const timed = receipts.filter((receipt) => receipt.timestamp)
  if (!timed.length) {
    return {
      label: 'Insufficient activity data',
      detail: 'There are not enough timestamped records to identify a rhythm.',
    }
  }

  const musicShare =
    receipts.filter((receipt) => receipt.kind === 'music').length / receipts.length

  const lateNight =
    timed.filter((receipt) => {
      const hour = new Date(receipt.timestamp!).getHours()
      return hour >= 21 || hour < 3
    }).length / timed.length

  const weekend =
    timed.filter((receipt) => {
      const day = new Date(receipt.timestamp!).getDay()
      return day === 0 || day === 6
    }).length / timed.length

  if (musicShare >= 0.7) {
    return {
      label: 'Music-forward activity',
      detail: Math.round(musicShare * 100) + '% of records are music sessions.',
    }
  }
  if (lateNight >= 0.2) {
    return {
      label: 'Late-night activity',
      detail: Math.round(lateNight * 100) + '% of timestamped records occur between 9 PM and 3 AM.',
    }
  }
  if (weekend >= 0.4) {
    return {
      label: 'Weekend-active pattern',
      detail: Math.round(weekend * 100) + '% of timestamped records fall on weekends.',
    }
  }
  return {
    label: 'Mixed activity rhythm',
    detail: 'The supplied records are distributed across several times and activity types.',
  }
}

export function findRelatedByArtist(target: Receipt, receipts: Receipt[], limit = 6) {
  const artists = new Set(target.meta?.topArtists ?? [])
  if (!artists.size) return []
  return receipts
    .filter((receipt) => receipt.id !== target.id)
    .filter((receipt) => (receipt.meta?.topArtists ?? []).some((artist) => artists.has(artist)))
    .slice(0, limit)
}

export function findRelatedByCategory(target: Receipt, receipts: Receipt[], limit = 6) {
  if (!target.category) return []
  return receipts
    .filter((receipt) => receipt.id !== target.id)
    .filter((receipt) => receipt.category === target.category)
    .slice(0, limit)
}

export function buildPatternSummary(receipts: Receipt[]): PatternSummary {
  return {
    monthly: getActivityByMonth(receipts),
    timeBuckets: getActivityByHour(receipts),
    heatmap: getActivityHeatmap(receipts),
    topCategories: getTopCategories(receipts),
    observedPattern: detectPersona(receipts),
  }
}
