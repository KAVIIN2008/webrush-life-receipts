import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarDays,
  ChevronRight,
  Link2,
  Music2,
  ReceiptText,
  Search,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import { useReceiptDataset } from './hooks/useReceiptDataset'
import type { Receipt } from './types/receipt'

const EMPTY_RECEIPTS: Receipt[] = []
import { ConnectionExplorer } from './components/connections/ConnectionExplorer'
import { StoryMode } from './components/story/StoryMode'

type Filter = 'all' | 'music' | 'activity'

function dayOf(receipt: Receipt) {
  return receipt.timestamp ? receipt.timestamp.slice(0, 10) : ''
}

function formatDay(day: string) {
  if (!day) return 'Undated'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${day}T00:00:00`))
}

function formatTime(timestamp?: string | null) {
  if (!timestamp) return 'No timestamp'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function App() {
  const { overview, data, loading, error, loadFullDataset } = useReceiptDataset()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const connectionRef = useRef<HTMLDivElement | null>(null)

  const receipts = data?.receipts ?? overview?.previewReceipts ?? EMPTY_RECEIPTS

  const analysis = useMemo(() => ({
    activeDays: overview?.activeDays ?? 0,
    connectedDays: overview?.connectedDays ?? [],
    connectedDayCount: overview?.connectedDayCount ?? 0,
    music: overview?.musicCount ?? 0,
    activity: overview?.activityCount ?? 0,
    topCategory: overview?.topCategory ?? null,
    topArtist: overview?.topArtist ?? null,
  }), [overview])

  const visibleReceipts = useMemo(() => {
    const text = query.toLowerCase().trim()

    return receipts
      .filter((receipt) => {
        if (filter === 'music') return receipt.kind === 'music'
        if (filter === 'activity') return receipt.kind !== 'music'
        return true
      })
      .filter((receipt) => {
        if (!selectedDay) return true
        return dayOf(receipt) === selectedDay
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
        ]
          .join(' ')
          .toLowerCase()

        return searchable.includes(text)
      })
      .sort((a, b) => {
        const left = a.timestamp ? new Date(a.timestamp).getTime() : 0
        const right = b.timestamp ? new Date(b.timestamp).getTime() : 0
        return right - left
      })
      .slice(0, 30)
  }, [receipts, filter, query, selectedDay])

  const featured = analysis.connectedDays[0]

  const selectedDayReceipts =
    selectedDay && data
      ? data.receipts.filter(
          (receipt) => dayOf(receipt) === selectedDay,
        )
      : []

  useEffect(() => {
    if ((query.trim() || filter !== 'all') && !data) {
      void loadFullDataset()
    }
  }, [query, filter, data, loadFullDataset])

  const selectDay = async (day: string) => {
    try {
      await loadFullDataset()
      setSelectedDay(day)

      window.setTimeout(() => {
        connectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 50)
    } catch {
      // Full dataset errors are handled by the data hook.
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0d0f] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />
          <p className="text-lg font-semibold">Reading your life in receipts…</p>
          <p className="mt-1 text-sm text-white/50">Loading the supplied dataset</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0c0d0f] p-6 text-white">
        <div className="max-w-lg rounded-3xl border border-red-400/20 bg-red-400/5 p-7">
          <h1 className="text-xl font-semibold">Dataset could not be loaded</h1>
          <p className="mt-2 text-sm text-white/50">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0c0d0f] text-white">
      <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_5%,rgba(190,255,80,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(120,100,255,0.10),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-black">
              <ReceiptText size={19} />
            </div>
            <div>
              <div className="font-semibold">Life Pulse</div>
              <div className="text-xs text-white/50">Your Life, In Receipts</div>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 sm:block">
            Raw data → connections → story
          </div>
        </header>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/5 px-3 py-1.5 text-xs text-lime-200">
              <Sparkles size={13} />
              Evidence-based life patterns
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
              Your life,
              <span className="block text-white/50">hidden in receipts.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
              Explore the supplied activity as moments, discover where different
              parts of the data overlap, and follow each connection back to its evidence.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<ReceiptText size={17} />} label="Receipts" value={overview?.totalReceipts ?? receipts.length} />
            <Stat icon={<Music2 size={17} />} label="Music sessions" value={analysis.music} />
            <Stat icon={<WalletCards size={17} />} label="Other activity" value={analysis.activity} />
            <Stat icon={<Link2 size={17} />} label="Connected days" value={analysis.connectedDayCount} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  Moment worth exploring
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {featured ? formatDay(featured.day) : 'No connected moment found'}
                </h2>
              </div>

              {featured && (
                <button
                  type="button"
                  onClick={() => selectDay(featured.day)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"
                >
                  Explore moment
                  <ChevronRight size={15} />
                </button>
              )}
            </div>

            {featured && (
              <>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <Stat label="Receipts that day" value={featured.receiptCount} />
                  <Stat label="Receipt types" value={featured.kinds} />
                  <Stat label="Active day" value={formatDay(featured.day)} />
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-4">
                  <div className="flex gap-3">
                    <Link2 className="mt-0.5 text-lime-200" size={18} />
                    <div>
                      <p className="text-sm font-medium">Why this is a connection</p>
                      <p className="mt-1 text-sm leading-6 text-white/50">
                        Multiple receipt types occur on the same calendar day.
                        This is a direct relationship visible in the supplied data.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#15161a] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">
              Recurring signals
            </p>

            <div className="mt-5 space-y-3">
              <Signal
                icon={<Music2 size={17} />}
                label="Repeated artist"
                value={analysis.topArtist?.[0] ?? '—'}
                detail={analysis.topArtist ? `${analysis.topArtist[1]} represented sessions` : 'No artist data'}
              />
              <Signal
                icon={<ReceiptText size={17} />}
                label="Common category"
                value={analysis.topCategory?.[0] ?? '—'}
                detail={analysis.topCategory ? `${analysis.topCategory[1]} receipts` : 'No category data'}
              />
              <Signal
                icon={<CalendarDays size={17} />}
                label="Active days"
                value={analysis.activeDays.toLocaleString('en-IN')}
                detail="Dates represented in the dataset"
              />
            </div>
          </div>
        </section>

        {selectedDay && (
          <StoryMode
            day={selectedDay}
            receipts={selectedDayReceipts}
          />
        )}
        {selectedDay && (
          <div ref={connectionRef} className="scroll-mt-6">
            <ConnectionExplorer
              day={selectedDay}
              receipts={selectedDayReceipts}
              onClear={() => setSelectedDay(null)}
            />
          </div>
        )}
        <section className="py-12 sm:py-16">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Explore the evidence
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Receipts, not assumptions.
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3">
                <Search size={16} className="text-white/50" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search receipts..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/50 sm:w-60"
                />
              </label>

              <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
                {([
                  ['all', 'All'],
                  ['music', 'Music'],
                  ['activity', 'Activity'],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-lg px-3 py-2 text-xs transition ${
                      filter === value
                        ? 'bg-white text-black'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedDay && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-lime-300/10 bg-lime-300/[0.04] px-4 py-3">
              <CalendarDays size={16} className="text-lime-200" />
              <span className="text-sm text-white/60">
                Showing <strong className="text-white">{formatDay(selectedDay)}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="ml-auto text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleReceipts.map((receipt) => (
              <article
                key={receipt.id}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] text-white/55">
                      {receipt.kind === 'music' ? (
                        <Music2 size={16} />
                      ) : (
                        <WalletCards size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                        {receipt.kind}
                      </p>
                      <p className="text-xs text-white/50">{formatTime(receipt.timestamp)}</p>
                    </div>
                  </div>

                  {receipt.amount != null && (
                    <span className="text-sm font-semibold text-lime-200">
                      ₹{receipt.amount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 line-clamp-2 font-semibold leading-6">
                  {receipt.title}
                </h3>

                {receipt.subtitle && (
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/50">
                    {receipt.subtitle}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {receipt.category && (
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/50">
                      {receipt.category}
                    </span>
                  )}

                  {receipt.location?.city && (
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/50">
                      {receipt.location.city}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {visibleReceipts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-white/50">
              No receipts match this view.
            </div>
          )}
        </section>

        <section className="border-t border-white/10 py-12">
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Connection trail
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Where different parts of the data overlap.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/50">
                Choose a day and inspect the raw receipts behind the pattern.
              </p>
            </div>

            <div className="space-y-2">
              {analysis.connectedDays.slice(0, 8).map((item) => (
                <button
                  type="button"
                  key={item.day}
                  onClick={() => selectDay(item.day)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <div>
                    <p className="text-sm font-medium">{formatDay(item.day)}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {item.receiptCount} receipts · {item.kinds} types
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-white/50" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-7 text-xs text-white/50">
          Connections shown here are based on observable relationships in the supplied dataset.
        </footer>
      </div>
    </main>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: number | string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/50">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
    </div>
  )
}

function Signal({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/50">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 truncate font-semibold">{value}</p>
      <p className="mt-1 text-xs text-white/50">{detail}</p>
    </div>
  )
}

export default App











