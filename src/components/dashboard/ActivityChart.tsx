import type { MonthlyActivity, TimeBucket } from '../../features/patterns/patterns'

type Props = { monthly: MonthlyActivity[]; timeBuckets: TimeBucket[] }

export function ActivityChart({ monthly, timeBuckets }: Props) {
  const maxMonthly = Math.max(...monthly.map((item) => item.value), 1)
  const maxTime = Math.max(...timeBuckets.map((item) => item.value), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-white/50">Monthly activity</p>
        <p className="mt-1 text-sm text-white/50">The most recent 12 months represented in the supplied data.</p>
        <div className="mt-4 grid min-h-48 grid-cols-12 items-end gap-2 rounded-2xl border border-white/8 bg-black/10 p-4">
          {monthly.map((item) => (
            <div key={item.label} className="flex h-40 flex-col justify-end gap-2">
              <div
                className="rounded-t-lg bg-lime-200/80"
                style={{ height: `${Math.max((item.value / maxMonthly) * 100, 4)}%` }}
                title={`${item.label}: ${item.value.toLocaleString('en-IN')}`}
              />
              <span className="text-center text-[10px] text-white/50">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-white/50">Time-of-day rhythm</p>
        <p className="mt-1 text-sm text-white/50">When timestamped records tend to occur.</p>
        <div className="mt-4 space-y-2">
          {timeBuckets.map((item) => (
            <div key={item.label} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-xs">
              <span className="text-white/50">{item.label}</span>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-violet-300/80" style={{ width: `${item.value ? Math.max((item.value / maxTime) * 100, 5) : 0}%` }} />
              </div>
              <span className="tabular-nums text-white/50">{item.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
