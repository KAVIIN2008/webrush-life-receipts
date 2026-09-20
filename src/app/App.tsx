import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronRight, Link2, Music2, ReceiptText, WalletCards } from 'lucide-react'
import { EvidenceExplorer } from '../components/receipts/EvidenceExplorer'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Stat } from '../components/ui/Stat'
import { Signal } from '../components/ui/Signal'
import { useReceiptDataset } from '../hooks/useReceiptDataset'
import { filterReceipts, type ReceiptFilter, dayOf } from '../features/receipts/selectors'
import { buildPatternSummary, type PatternSummary } from '../features/patterns/patterns'
import { formatDay } from '../utils/formatting'
import type { Receipt } from '../types/receipt'

const StoryMode = lazy(() => import('./components/story/StoryMode').then((module) => ({ default: module.StoryMode })))
const ConnectionExplorer = lazy(() => import('./components/connections/ConnectionExplorer').then((module) => ({ default: module.ConnectionExplorer })))
const LifePatterns = lazy(() => import('./components/dashboard/LifePatterns').then((module) => ({ default: module.LifePatterns })))

const EMPTY_RECEIPTS: Receipt[] = []

function SectionFallback({ label }: { label: string }) {
  return <div className="my-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50" role="status">Loading {label}…</div>
}

function App() {
  const { overview, data, loading, error, loadFullDataset } = useReceiptDataset()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ReceiptFilter>('all')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [patterns, setPatterns] = useState<PatternSummary | null>(null)
  const [patternsLoading, setPatternsLoading] = useState(false)
  const connectionRef = useRef<HTMLDivElement | null>(null)

  const receipts = data?.receipts ?? overview?.previewReceipts ?? EMPTY_RECEIPTS
  const connectedDays = overview?.connectedDays ?? []
  const featured = connectedDays[0]

  const visibleReceipts = useMemo(
    () => filterReceipts(receipts, { query, filter, selectedDay, limit: 30 }),
    [receipts, query, filter, selectedDay],
  )

  const selectedDayReceipts = useMemo(
    () => selectedDay && data ? data.receipts.filter((receipt) => dayOf(receipt) === selectedDay) : [],
    [selectedDay, data],
  )

  useEffect(() => {
    if ((query.trim() || filter !== 'all') && !data) void loadFullDataset()
  }, [query, filter, data, loadFullDataset])

  const selectDay = useCallback(async (day: string) => {
    try {
      await loadFullDataset()
      setSelectedDay(day)
      window.setTimeout(() => connectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch {
      // The hook exposes the full dataset error state.
    }
  }, [loadFullDataset])

  const revealPatterns = useCallback(async () => {
    if (patterns || patternsLoading) return
    setPatternsLoading(true)
    try {
      const dataset = await loadFullDataset()
      setPatterns(buildPatternSummary(dataset.receipts))
    } finally {
      setPatternsLoading(false)
    }
  }, [loadFullDataset, patterns, patternsLoading])

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#0c0d0f] text-white"><div className="text-center"><div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white" /><p className="text-lg font-semibold">Reading your life in receipts…</p><p className="mt-1 text-sm text-white/50">Loading the supplied dataset</p></div></main>
  }

  if (error) {
    return <main className="grid min-h-screen place-items-center bg-[#0c0d0f] p-6 text-white"><div className="max-w-lg rounded-3xl border border-red-400/20 bg-red-400/5 p-7"><h1 className="text-xl font-semibold">Dataset could not be loaded</h1><p className="mt-2 text-sm text-white/50">{error}</p></div></main>
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0c0d0f] text-white">
      <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_5%,rgba(190,255,80,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(120,100,255,0.10),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Header />

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/5 px-3 py-1.5 text-xs text-lime-200">
              <span aria-hidden="true">✦</span> Evidence-based life patterns
            </div>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Your life,<span className="block text-white/50">hidden in receipts.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">Explore the supplied activity as moments, discover where different parts of the data overlap, and follow each connection back to its evidence.</p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<ReceiptText size={17} />} label="Receipts" value={overview?.totalReceipts ?? receipts.length} />
            <Stat icon={<Music2 size={17} />} label="Music sessions" value={overview?.musicCount ?? 0} />
            <Stat icon={<WalletCards size={17} />} label="Other activity" value={overview?.activityCount ?? 0} />
            <Stat icon={<Link2 size={17} />} label="Connected days" value={overview?.connectedDayCount ?? 0} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="text-xs uppercase tracking-[0.18em] text-white/50">Moment worth exploring</p><h2 className="mt-2 text-2xl font-semibold">{featured ? formatDay(featured.day) : 'No connected moment found'}</h2></div>
              {featured && <button type="button" onClick={() => void selectDay(featured.day)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200">Explore moment <ChevronRight size={15} /></button>}
            </div>
            {featured && <><div className="mt-7 grid gap-3 sm:grid-cols-3"><Stat label="Receipts that day" value={featured.receiptCount} /><Stat label="Receipt types" value={featured.kinds} /><Stat label="Active day" value={formatDay(featured.day)} /></div><div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-4"><div className="flex gap-3"><Link2 className="mt-0.5 text-lime-200" size={18} /><div><p className="text-sm font-medium">Why this is a connection</p><p className="mt-1 text-sm leading-6 text-white/50">Multiple receipt types occur on the same calendar day. This is a direct relationship visible in the supplied data.</p></div></div></div></>}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#15161a] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Recurring signals</p>
            <div className="mt-5 space-y-3">
              <Signal icon={<Music2 size={17} />} label="Repeated artist" value={overview?.topArtist?.[0] ?? '—'} detail={overview?.topArtist ? overview.topArtist[1] + ' represented sessions' : 'No artist data'} />
              <Signal icon={<ReceiptText size={17} />} label="Common category" value={overview?.topCategory?.[0] ?? '—'} detail={overview?.topCategory ? overview.topCategory[1] + ' receipts' : 'No category data'} />
              <Signal icon={<CalendarDays size={17} />} label="Active days" value={(overview?.activeDays ?? 0).toLocaleString('en-IN')} detail="Dates represented in the dataset" />
            </div>
          </div>
        </section>

        <Suspense fallback={<SectionFallback label="patterns" />}>
          <LifePatterns summary={patterns} loading={patternsLoading} onAnalyze={() => void revealPatterns()} />
        </Suspense>

        {selectedDay && (
          <Suspense fallback={<SectionFallback label="story and connection evidence" />}>
            <StoryMode day={selectedDay} receipts={selectedDayReceipts} />
            <div ref={connectionRef} className="scroll-mt-6">
              <ConnectionExplorer day={selectedDay} receipts={selectedDayReceipts} onClear={() => setSelectedDay(null)} />
            </div>
          </Suspense>
        )}

        <EvidenceExplorer receipts={visibleReceipts} query={query} filter={filter} selectedDay={selectedDay} onQueryChange={setQuery} onFilterChange={setFilter} onClearDay={() => setSelectedDay(null)} />

        <section id="connections" className="scroll-mt-6 border-t border-white/10 py-12">
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div><p className="text-xs uppercase tracking-[0.18em] text-white/50">Connection trail</p><h2 className="mt-2 text-3xl font-semibold">Where different parts of the data overlap.</h2><p className="mt-3 text-sm leading-6 text-white/50">Choose a day and inspect the raw receipts behind the pattern.</p></div>
            <div className="space-y-2">
              {connectedDays.slice(0, 8).map((item) => <button key={item.day} type="button" onClick={() => void selectDay(item.day)} className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/15 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"><div><p className="text-sm font-medium">{formatDay(item.day)}</p><p className="mt-1 text-xs text-white/50">{item.receiptCount} receipts · {item.kinds} types</p></div><ChevronRight size={16} className="text-white/50" /></button>)}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default App
