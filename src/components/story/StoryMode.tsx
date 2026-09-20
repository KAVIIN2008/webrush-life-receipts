import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Link2,
  Music2,
  ReceiptText,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import type { Receipt } from '../../types/receipt'
import { formatLongDay } from '../../utils/formatting'

type StoryModeProps = {
  day: string
  receipts: Receipt[]
}

function kindLabel(kind: Receipt['kind']) {
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

function iconFor(kind: Receipt['kind']) {
  return kind === 'music' ? <Music2 size={18} /> : <WalletCards size={18} />
}

export function StoryMode({ day, receipts }: StoryModeProps) {
  const [chapter, setChapter] = useState(0)

  const groups = useMemo(() => {
    const result = new Map<Receipt['kind'], Receipt[]>()

    for (const receipt of receipts) {
      const current = result.get(receipt.kind) ?? []
      current.push(receipt)
      result.set(receipt.kind, current)
    }

    return [...result.entries()]
  }, [receipts])

  const featuredGroup = groups[Math.min(chapter, Math.max(groups.length - 1, 0))]

  const topArtists = [
    ...new Set(
      receipts.flatMap((receipt) => receipt.meta?.topArtists ?? []),
    ),
  ].slice(0, 3)

  const categories = [
    ...new Set(
      receipts
        .map((receipt) => receipt.category)
        .filter((category): category is string => Boolean(category)),
    ),
  ].slice(0, 4)

  const isIntro = chapter === 0
  const isConnection = chapter === groups.length + 1
  const totalChapters = groups.length + 2

  const goBack = () => setChapter((current) => Math.max(0, current - 1))
  const goNext = () =>
    setChapter((current) => Math.min(totalChapters - 1, current + 1))

  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#121318]">
      <div className="border-b border-white/10 px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
            <Sparkles size={14} className="text-lime-200" />
            Story mode
          </div>

          <div className="text-xs text-white/50">
            {chapter + 1} / {totalChapters}
          </div>
        </div>
      </div>

      <div className="grid min-h-[360px] lg:grid-cols-[0.28fr_0.72fr]">
        <div className="border-b border-white/10 bg-black/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="text-xs text-white/50">Selected day</div>

          <h2 className="mt-2 text-2xl font-semibold leading-tight">
            {formatLongDay(day)}
          </h2>

          <div className="mt-6 space-y-2">
            <div className="rounded-xl bg-white/[0.05] px-3 py-2.5 text-sm text-white/70">
              {receipts.length} receipts
            </div>
            <div className="rounded-xl bg-white/[0.05] px-3 py-2.5 text-sm text-white/70">
              {groups.length} receipt types
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 text-xs uppercase tracking-[0.15em] text-white/50">
              Chapters
            </div>

            <div className="space-y-1">
              <ChapterButton
                active={chapter === 0}
                label="The day"
                onClick={() => setChapter(0)}
              />

              {groups.map(([kind], index) => (
                <ChapterButton
                  key={kind}
                  active={chapter === index + 1}
                  label={kindLabel(kind)}
                  onClick={() => setChapter(index + 1)}
                />
              ))}

              <ChapterButton
                active={isConnection}
                label="The connection"
                onClick={() => setChapter(groups.length + 1)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex-1">
            {isIntro && (
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-white/60">
                  <CalendarDays size={20} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/50">
                  Chapter 1
                </p>

                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  One date. Multiple traces.
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                  This day contains {receipts.length} receipts across{' '}
                  {groups.length} different receipt types. The story below
                  walks through those records one group at a time.
                </p>

                {(topArtists.length > 0 || categories.length > 0) && (
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {topArtists.length > 0 && (
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs text-white/50">Artist evidence</p>
                        <p className="mt-2 text-sm font-medium">
                          {topArtists.join(' · ')}
                        </p>
                      </div>
                    )}

                    {categories.length > 0 && (
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs text-white/50">Category evidence</p>
                        <p className="mt-2 text-sm font-medium">
                          {categories.join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isIntro && !isConnection && featuredGroup && (
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-white/60">
                  {iconFor(featuredGroup[0])}
                </div>

                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/50">
                  Chapter {chapter + 1}
                </p>

                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  {kindLabel(featuredGroup[0])}
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                  {featuredGroup[1].length} {kindLabel(featuredGroup[0]).toLowerCase()}
                  {' '}
                  {featuredGroup[1].length === 1 ? 'receipt appears' : 'receipts appear'}
                  {' '}on this date.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {featuredGroup[1].slice(0, 4).map((receipt) => (
                    <article
                      key={receipt.id}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                    >
                      <p className="text-sm font-semibold leading-5">
                        {receipt.title}
                      </p>

                      {receipt.subtitle && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/50">
                          {receipt.subtitle}
                        </p>
                      )}

                      {receipt.category && (
                        <span className="mt-3 inline-block rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] text-white/50">
                          {receipt.category}
                        </span>
                      )}
                    </article>
                  ))}
                </div>

                {featuredGroup[1].length > 4 && (
                  <p className="mt-4 text-xs text-white/50">
                    Showing 4 representative records from this chapter.
                  </p>
                )}
              </div>
            )}

            {isConnection && (
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-300/10 text-lime-200">
                  <Link2 size={20} />
                </div>

                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/50">
                  Final chapter
                </p>

                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  The connection
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                  The observable relationship is temporal: these different
                  receipt types share the same calendar date.
                </p>

                <div className="mt-7 rounded-2xl border border-lime-300/15 bg-lime-300/[0.045] p-5">
                  <div className="flex gap-3">
                    <ReceiptText className="mt-0.5 shrink-0 text-lime-200" size={18} />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {receipts.length} records, {groups.length} types
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/50">
                        The interface connects the records because the supplied
                        dataset places them on the same date — not because it
                        assumes a personal reason for the overlap.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-5">
            <button
              type="button"
              onClick={goBack}
              disabled={chapter === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              <ArrowLeft size={14} />
              Previous
            </button>

            <div className="hidden gap-1.5 sm:flex">
              {Array.from({ length: totalChapters }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to chapter ${index + 1}`}
                  onClick={() => setChapter(index)}
                  className={`h-1.5 rounded-full transition ${
                    index === chapter
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/15 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={chapter === totalChapters - 1}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-20"
            >
              Next
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChapterButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-2 text-left text-xs transition ${
        active
          ? 'bg-white text-black'
          : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}
