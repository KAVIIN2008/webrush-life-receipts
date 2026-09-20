import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  Link2,
  Music2,
  WalletCards,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Receipt } from '../../types/receipt'

type Props = {
  day: string
  receipts: Receipt[]
  onClear: () => void
}

function formatDay(day: string) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${day}T00:00:00`))
}

function formatTime(timestamp?: string | null) {
  if (!timestamp) return 'No timestamp'

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function typeLabel(kind: Receipt['kind']) {
  switch (kind) {
    case 'music':
      return 'Music'
    case 'purchase':
      return 'Purchases'
    case 'transaction':
      return 'Transactions'
    case 'transfer':
      return 'Transfers'
    case 'income':
      return 'Income'
    default:
      return kind
  }
}

function TypeIcon({ kind }: { kind: Receipt['kind'] }) {
  if (kind === 'music') return <Music2 size={16} />
  return <WalletCards size={16} />
}

export function ConnectionExplorer({
  day,
  receipts,
  onClear,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const groups = useMemo(() => {
    const grouped = new Map<Receipt['kind'], Receipt[]>()

    for (const receipt of receipts) {
      const current = grouped.get(receipt.kind) ?? []
      current.push(receipt)
      grouped.set(receipt.kind, current)
    }

    return [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [receipts])

  return (
    <section className="mb-10 overflow-hidden rounded-[2rem] border border-lime-300/15 bg-[linear-gradient(135deg,rgba(190,255,80,0.06),rgba(120,100,255,0.05))]">
      <div className="border-b border-white/10 p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/5 px-3 py-1.5 text-xs text-lime-200">
              <Link2 size={13} />
              Connection explorer
            </div>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {formatDay(day)}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              {receipts.length} receipts appear on this day across{' '}
              {groups.length} different receipt types. Explore each group to see
              the evidence behind the connection.
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="self-start rounded-xl border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:border-white/20 hover:text-white"
          >
            Close explorer
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
            <div className="flex items-center gap-2 text-white/35">
              <CalendarDays size={15} />
              <span className="text-xs">Calendar overlap</span>
            </div>
            <p className="mt-2 text-xl font-semibold">1 day</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
            <div className="flex items-center gap-2 text-white/35">
              <Link2 size={15} />
              <span className="text-xs">Receipt types</span>
            </div>
            <p className="mt-2 text-xl font-semibold">{groups.length}</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
            <div className="flex items-center gap-2 text-white/35">
              <Clock3 size={15} />
              <span className="text-xs">Evidence items</span>
            </div>
            <p className="mt-2 text-xl font-semibold">{receipts.length}</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/8">
        {groups.map(([kind, items]) => {
          const isOpen = expanded === kind

          return (
            <div key={kind}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : kind)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-7"
                aria-expanded={isOpen}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-white/55">
                    <TypeIcon kind={kind} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{typeLabel(kind)}</p>
                    <p className="mt-1 text-xs text-white/30">
                      {items.length} {items.length === 1 ? 'receipt' : 'receipts'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-white/30">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="grid gap-2 border-t border-white/7 bg-black/10 p-4 sm:grid-cols-2 sm:p-5">
                  {items.map((receipt) => (
                    <article
                      key={receipt.id}
                      className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                            {typeLabel(receipt.kind)}
                          </p>
                          <h3 className="mt-1 text-sm font-semibold leading-5">
                            {receipt.title}
                          </h3>
                        </div>

                        <span className="shrink-0 text-xs text-white/30">
                          {formatTime(receipt.timestamp)}
                        </span>
                      </div>

                      {receipt.subtitle && (
                        <p className="mt-2 text-xs leading-5 text-white/40">
                          {receipt.subtitle}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {receipt.category && (
                          <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-white/40">
                            {receipt.category}
                          </span>
                        )}

                        {receipt.location?.city && (
                          <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-white/40">
                            {receipt.location.city}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-t border-white/10 px-5 py-4 sm:px-7">
        <p className="text-xs leading-5 text-white/30">
          Relationship shown: these receipts share the same calendar date.
          The explorer exposes the underlying records so the connection can be
          inspected rather than inferred.
        </p>
      </div>
    </section>
  )
}
