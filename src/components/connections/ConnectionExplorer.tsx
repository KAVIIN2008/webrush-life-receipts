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
import { dayOf } from '../../features/receipts/selectors'
import { formatClockTime, formatLongDay } from '../../utils/formatting'
import { findRelatedByArtist, findRelatedByCategory } from '../../features/patterns/patterns'

type Props = {
  day: string
  receipts: Receipt[]
  allReceipts: Receipt[]
  onClear: () => void
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
  allReceipts,
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

  const observableLinks = useMemo(() => {
    const artistMatches = new Map<string, number>()
    const categoryMatches = new Map<string, number>()

    for (const receipt of receipts) {
      const artistRelated = findRelatedByArtist(receipt, allReceipts, 3)
      const categoryRelated = findRelatedByCategory(receipt, allReceipts, 3)

      for (const related of artistRelated) {
        artistMatches.set(related.id, (artistMatches.get(related.id) ?? 0) + 1)
      }
      for (const related of categoryRelated) {
        categoryMatches.set(related.id, (categoryMatches.get(related.id) ?? 0) + 1)
      }
    }

    return {
      artistCount: artistMatches.size,
      categoryCount: categoryMatches.size,
    }
  }, [allReceipts, receipts])

  const artistRelations = useMemo(() => {
    const links: Array<{
      artist: string
      sourceTitle: string
      related: Receipt
    }> = []
    const seen = new Set<string>()

    for (const source of receipts) {
      const sourceArtists = new Set(source.meta?.topArtists ?? [])
      if (!sourceArtists.size) continue

      for (const related of findRelatedByArtist(source, allReceipts, 8)) {
        if (!dayOf(related) || dayOf(related) === dayOf(source)) continue

        const sharedArtist = (related.meta?.topArtists ?? []).find((artist) =>
          sourceArtists.has(artist),
        )
        if (!sharedArtist) continue

        const key = related.id + '::' + sharedArtist
        if (seen.has(key)) continue

        seen.add(key)
        links.push({
          artist: sharedArtist,
          sourceTitle: source.title,
          related,
        })

        if (links.length >= 6) return links
      }
    }

    return links
  }, [allReceipts, receipts])

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
              {formatLongDay(day)}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
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
            <div className="flex items-center gap-2 text-white/50">
              <CalendarDays size={15} />
              <span className="text-xs">Calendar overlap</span>
            </div>
            <p className="mt-2 text-xl font-semibold">1 day</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
            <div className="flex items-center gap-2 text-white/50">
              <Link2 size={15} />
              <span className="text-xs">Receipt types</span>
            </div>
            <p className="mt-2 text-xl font-semibold">{groups.length}</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
            <div className="flex items-center gap-2 text-white/50">
              <Clock3 size={15} />
              <span className="text-xs">Evidence items</span>
            </div>
            <p className="mt-2 text-xl font-semibold">{receipts.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-white/10 p-5 sm:grid-cols-2 sm:p-7">
        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/50">Artist overlap</p>
          <p className="mt-2 text-xl font-semibold">{observableLinks.artistCount}</p>
          <p className="mt-1 text-xs leading-5 text-white/50">Selected-day records with the same artist field elsewhere in the supplied data.</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/50">Category overlap</p>
          <p className="mt-2 text-xl font-semibold">{observableLinks.categoryCount}</p>
          <p className="mt-1 text-xs leading-5 text-white/50">Selected-day records sharing a category with other supplied records.</p>
        </div>
      </div>

      {artistRelations.length > 0 && (
        <div className="border-b border-white/10 p-5 sm:p-7">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/50">Related by artist</p>
            <h3 className="mt-2 text-xl font-semibold">Same artist, different day.</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/50">
              These records share an artist field with evidence from the selected day and occur on a different date.
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {artistRelations.map((link) => (
              <article
                key={link.related.id + link.artist}
                className="rounded-2xl border border-white/8 bg-black/10 p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-lime-200/80">
                  {link.artist}
                </p>
                <h4 className="mt-2 text-sm font-semibold leading-5">
                  {link.related.title}
                </h4>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  {formatLongDay(dayOf(link.related))} · linked to “{link.sourceTitle}”
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

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
                    <p className="mt-1 text-xs text-white/50">
                      {items.length} {items.length === 1 ? 'receipt' : 'receipts'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-white/50">
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
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                            {typeLabel(receipt.kind)}
                          </p>
                          <h3 className="mt-1 text-sm font-semibold leading-5">
                            {receipt.title}
                          </h3>
                        </div>

                        <span className="shrink-0 text-xs text-white/50">
                          {formatClockTime(receipt.timestamp)}
                        </span>
                      </div>

                      {receipt.subtitle && (
                        <p className="mt-2 text-xs leading-5 text-white/50">
                          {receipt.subtitle}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {receipt.category && (
                          <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-white/50">
                            {receipt.category}
                          </span>
                        )}

                        {receipt.location?.city && (
                          <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-white/50">
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
        <p className="text-xs leading-5 text-white/50">
          Temporal, artist, and category relationships are derived from fields in
          the supplied records. The explorer exposes the underlying evidence so
          each connection can be inspected rather than inferred.
        </p>
      </div>
    </section>
  )
}
