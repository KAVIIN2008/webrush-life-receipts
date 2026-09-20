import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { EvidenceExplorer } from '../components/receipts/EvidenceExplorer'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/dashboard/Hero'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import { ErrorState, LoadingState } from '../components/layout/AppStatus'
import { MomentCard } from '../components/dashboard/MomentCard'
import { ConnectionTrail } from '../components/connections/ConnectionTrail'
import { Signal } from '../components/ui/Signal'
import { useReceiptDataset } from '../hooks/useReceiptDataset'
import { filterReceipts, type ReceiptFilter, dayOf } from '../features/receipts/selectors'
import { buildPatternSummary, type PatternSummary } from '../features/patterns/patterns'
import { formatDay } from '../utils/formatting'
import type { Receipt } from '../types/receipt'

const StoryMode = lazy(() => import('../components/story/StoryMode').then((module) => ({ default: module.StoryMode })))
const ConnectionExplorer = lazy(() => import('../components/connections/ConnectionExplorer').then((module) => ({ default: module.ConnectionExplorer })))
const LifePatterns = lazy(() => import('../components/dashboard/LifePatterns').then((module) => ({ default: module.LifePatterns })))

const EMPTY_RECEIPTS: Receipt[] = []

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="my-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50" role="status">
      Loading {label}…
    </div>
  )
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
    () => (selectedDay && data ? data.receipts.filter((receipt) => dayOf(receipt) === selectedDay) : []),
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
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0c0d0f] text-white">
      <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_15%_5%,rgba(190,255,80,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(120,100,255,0.10),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Header />
        <Hero />

        <StatsGrid total={overview?.totalReceipts ?? receipts.length} music={overview?.musicCount ?? 0} activity={overview?.activityCount ?? 0} connectedDays={overview?.connectedDayCount ?? 0} />

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          {featured ? (
            <MomentCard
              day={featured.day}
              receiptCount={featured.receiptCount}
              kinds={featured.kinds}
              onExplore={(day) => void selectDay(day)}
            />
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">No connected moment found.</div>
          )}

          <div className="rounded-[2rem] border border-white/10 bg-[#15161a] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Recurring signals</p>
            <div className="mt-5 space-y-3">
              <Signal icon={<span aria-hidden="true">♪</span>} label="Repeated artist" value={overview?.topArtist?.[0] ?? '—'} detail={overview?.topArtist ? overview.topArtist[1] + ' represented sessions' : 'No artist data'} />
              <Signal icon={<span aria-hidden="true">◈</span>} label="Common category" value={overview?.topCategory?.[0] ?? '—'} detail={overview?.topCategory ? overview.topCategory[1] + ' receipts' : 'No category data'} />
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
              <ConnectionExplorer
                day={selectedDay}
                receipts={selectedDayReceipts}
                allReceipts={data?.receipts ?? []}
                onClear={() => setSelectedDay(null)}
              />
            </div>
          </Suspense>
        )}

        <EvidenceExplorer
          receipts={visibleReceipts}
          query={query}
          filter={filter}
          selectedDay={selectedDay}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
          onClearDay={() => setSelectedDay(null)}
        />

        <ConnectionTrail days={connectedDays} onSelectDay={(day) => void selectDay(day)} />
        <Footer />
      </div>
    </main>
  )
}

export default App
