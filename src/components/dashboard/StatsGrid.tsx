import { CalendarDays, Link2, Music2, ReceiptText, WalletCards } from 'lucide-react'
import { Stat } from '../ui/Stat'

type Props = {
  total: number
  music: number
  activity: number
  connectedDays: number
}

export function StatsGrid({ total, music, activity, connectedDays }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat icon={<ReceiptText size={17} />} label="Receipts" value={total} />
      <Stat icon={<Music2 size={17} />} label="Music sessions" value={music} />
      <Stat icon={<WalletCards size={17} />} label="Other activity" value={activity} />
      <Stat icon={<Link2 size={17} />} label="Connected days" value={connectedDays} />
    </div>
  )
}

export function ActiveDaySignal({ value }: { value: string }) {
  return <Stat icon={<CalendarDays size={17} />} label="Active days" value={value} />
}
