import { CalendarDays, Music2, Search, WalletCards } from 'lucide-react'
import type { Receipt } from '../../types/receipt'
import type { ReceiptFilter } from '../../features/receipts/selectors'
import { formatDay } from '../../utils/formatting'
import { ReceiptCard } from './ReceiptCard'

type Props = {
  receipts: Receipt[]
  query: string
  filter: ReceiptFilter
  selectedDay: string | null
  onQueryChange: (value: string) => void
  onFilterChange: (value: ReceiptFilter) => void
  onClearDay: () => void
}

export function EvidenceExplorer({ receipts, query, filter, selectedDay, onQueryChange, onFilterChange, onClearDay }: Props) {
  return (
    <section id="evidence" className="scroll-mt-6 py-12 sm:py-16">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">Explore the evidence</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Receipts, not assumptions.</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3">
            <Search size={16} className="text-white/50" aria-hidden="true" />
            <span className="sr-only">Search receipts</span>
            <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search receipts..." className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/50 sm:w-60" />
          </label>
          <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1" role="group" aria-label="Filter receipts">
            {([
              ['all', 'All'],
              ['music', 'Music'],
              ['activity', 'Activity'],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={filter === value} onClick={() => onFilterChange(value)} className={`rounded-lg px-3 py-2 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 ${filter === value ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-lime-300/10 bg-lime-300/[0.04] px-4 py-3">
          <CalendarDays size={16} className="text-lime-200" aria-hidden="true" />
          <span className="text-sm text-white/60">Showing <strong className="text-white">{formatDay(selectedDay)}</strong></span>
          <button type="button" onClick={onClearDay} className="ml-auto rounded-lg px-2 py-1 text-xs text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-200">Clear</button>
        </div>
      )}
      {receipts.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{receipts.map((receipt) => <ReceiptCard key={receipt.id} receipt={receipt} />)}</div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-white/50">No receipts match this view.</div>
      )}
    </section>
  )
}
