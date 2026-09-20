import { ChevronRight, Link2 } from 'lucide-react'
import { formatDay } from '../../utils/formatting'
import { Stat } from '../ui/Stat'

type Props = {
  day: string
  receiptCount: number
  kinds: number
  onExplore: (day: string) => void
}

export function MomentCard({ day, receiptCount, kinds, onExplore }: Props) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">
            Moment worth exploring
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{formatDay(day)}</h2>
        </div>

        <button
          type="button"
          onClick={() => onExplore(day)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
        >
          Explore moment
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Stat label="Receipts that day" value={receiptCount} />
        <Stat label="Receipt types" value={kinds} />
        <Stat label="Active day" value={formatDay(day)} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-4">
        <div className="flex gap-3">
          <Link2 className="mt-0.5 shrink-0 text-lime-200" size={18} aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Why this is a connection</p>
            <p className="mt-1 text-sm leading-6 text-white/50">
              Multiple receipt types occur on the same calendar day. This is a
              direct relationship visible in the supplied data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
