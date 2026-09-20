import { ChevronRight } from 'lucide-react'
import { formatDay } from '../../utils/formatting'
import type { ConnectedDayOverview } from '../../features/receipts/data'

type Props = {
  days: ConnectedDayOverview[]
  onSelectDay: (day: string) => void
}

export function ConnectionTrail({ days, onSelectDay }: Props) {
  return (
    <section id="connections" className="scroll-mt-6 border-t border-white/10 py-12">
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
          {days.slice(0, 8).map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => onSelectDay(item.day)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/15 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
            >
              <div>
                <p className="text-sm font-medium">{formatDay(item.day)}</p>
                <p className="mt-1 text-xs text-white/50">
                  {item.receiptCount} receipts · {item.kinds} types
                </p>
              </div>
              <ChevronRight size={16} className="text-white/50" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
