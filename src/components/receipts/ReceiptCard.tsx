import { memo } from 'react'
import type { Receipt } from '../../types/receipt'
import { formatCurrency, formatTime } from '../../utils/formatting'

interface ReceiptCardProps { receipt: Receipt }

const kindLabels: Record<string, string> = {
  music: 'Music',
  purchase: 'Purchase',
  transaction: 'Transaction',
  transfer: 'Transfer',
  income: 'Income',
}

export const ReceiptCard = memo(function ReceiptCard({ receipt }: ReceiptCardProps) {
  return (
    <article className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">{kindLabels[receipt.kind] ?? receipt.kind}</p>
          <p className="text-xs text-white/50">{formatTime(receipt.timestamp)}</p>
        </div>
        {receipt.amount !== null && (
          <span className="shrink-0 text-sm font-semibold text-lime-200">{formatCurrency(receipt.amount, receipt.currency ?? 'INR')}</span>
        )}
      </div>
      <h3 className="mt-4 line-clamp-2 font-semibold leading-6">{receipt.title}</h3>
      {receipt.subtitle && <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/50">{receipt.subtitle}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {receipt.category && <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/50">{receipt.category}</span>}
        {receipt.location?.city && <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/50">{receipt.location.city}</span>}
      </div>
    </article>
  )
})
