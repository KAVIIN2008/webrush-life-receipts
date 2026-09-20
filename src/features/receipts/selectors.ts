import type { Receipt } from '../../types/receipt'

export type ReceiptFilter = 'all' | 'music' | 'activity'

export function dayOf(receipt: Receipt) {
  return receipt.timestamp ? receipt.timestamp.slice(0, 10) : ''
}

export function filterReceipts(
  receipts: Receipt[],
  options: {
    query?: string
    filter?: ReceiptFilter
    selectedDay?: string | null
    limit?: number
  } = {},
) {
  const text = options.query?.toLowerCase().trim() ?? ''
  const filter = options.filter ?? 'all'

  return receipts
    .filter((receipt) => {
      if (filter === 'music') return receipt.kind === 'music'
      if (filter === 'activity') return receipt.kind !== 'music'
      return true
    })
    .filter((receipt) => {
      if (!options.selectedDay) return true
      return dayOf(receipt) === options.selectedDay
    })
    .filter((receipt) => {
      if (!text) return true
      const searchable = [
        receipt.title,
        receipt.subtitle,
        receipt.category,
        receipt.location?.city,
        receipt.location?.state,
        ...(receipt.tags ?? []),
        ...(receipt.meta?.topArtists ?? []),
      ].join(' ').toLowerCase()
      return searchable.includes(text)
    })
    .sort((left, right) => {
      const a = left.timestamp ? new Date(left.timestamp).getTime() : 0
      const b = right.timestamp ? new Date(right.timestamp).getTime() : 0
      return b - a
    })
    .slice(0, options.limit ?? 30)
}
