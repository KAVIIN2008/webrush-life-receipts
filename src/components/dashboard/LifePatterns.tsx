import { Activity, MoonStar, Sparkles } from 'lucide-react'
import type { PatternSummary } from '../../features/patterns/patterns'
import { ActivityChart } from './ActivityChart'

type Props = { summary: PatternSummary | null; loading: boolean; onAnalyze: () => void }

function heatClass(value: number, max: number) {
  if (!value) return 'bg-white/[0.035]'
  const ratio = value / max
  if (ratio > 0.75) return 'bg-lime-200/80'
  if (ratio > 0.5) return 'bg-lime-200/60'
  if (ratio > 0.25) return 'bg-lime-200/35'
  return 'bg-lime-200/15'
}

export function LifePatterns({ summary, loading, onAnalyze }: Props) {
  const maxHeat = Math.max(...(summary?.heatmap.map((item) => item.value) ?? [0]), 1)

  return (
    <section id="patterns" className="scroll-mt-6 py-12 sm:py-16">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">Life patterns</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">See the rhythm behind the receipts.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Timing and category patterns are calculated from observable fields in the supplied records.
            They describe activity structure rather than personality or intent.
          </p>
        </div>
        {!summary && (
          <button type="button" onClick={onAnalyze} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
            <Sparkles size={15} aria-hidden="true" /> {loading ? 'Analyzing…' : 'Reveal patterns'}
          </button>
        )}
      </div>

      {!summary ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Activity rhythm', 'Monthly and time-of-day trends'],
            ['Category signals', 'Non-music activity categories'],
            ['Observed pattern', 'A neutral evidence-based summary'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Activity size={18} className="text-lime-200" aria-hidden="true" />
              <p className="mt-4 font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-6 text-white/50">{detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 lg:grid-cols-[0.8fr_0.8fr_1.4fr]">
            <div className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.045] p-5">
              <div className="flex items-center gap-2 text-lime-200">
                <MoonStar size={17} aria-hidden="true" />
                <span className="text-xs uppercase tracking-[0.16em]">Observed pattern</span>
              </div>
              <p className="mt-3 text-xl font-semibold">{summary.observedPattern.label}</p>
              <p className="mt-2 text-sm leading-6 text-white/50">{summary.observedPattern.detail}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/50">Top categories</p>
              <div className="mt-4 space-y-3">
                {summary.topCategories.length ? summary.topCategories.slice(0, 4).map((item) => (
                  <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 text-sm">
                    <span className="truncate text-white/70">{item.label}</span>
                    <span className="tabular-nums text-white/50">{item.value}</span>
                  </div>
                )) : <p className="text-sm text-white/50">No category-labelled activity was found.</p>}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/50">Activity heatmap</p>
              <div className="mt-4 overflow-x-auto">
                <div className="min-w-[34rem]">
                  <div className="mb-2 grid grid-cols-[3.2rem_repeat(8,minmax(0,1fr))] gap-1 text-[9px] text-white/50">
                    <span />
                    {summary.heatmap.slice(0, 8).map((item) => <span key={item.bucket} className="text-center">{item.bucket.split('–')[0]}</span>)}
                  </div>
                  <div className="space-y-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="grid grid-cols-[3.2rem_repeat(8,minmax(0,1fr))] gap-1">
                        <span className="text-[10px] text-white/50">{day}</span>
                        {summary.heatmap.filter((item) => item.day === day).map((item) => (
                          <div key={day + item.bucket} className={`h-5 rounded-md ${heatClass(item.value, maxHeat)}`} title={`${day} ${item.bucket}: ${item.value}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ActivityChart monthly={summary.monthly} timeBuckets={summary.timeBuckets} />
        </div>
      )}
    </section>
  )
}
