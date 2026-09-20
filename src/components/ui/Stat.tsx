import { memo } from 'react'

type Props = { icon?: React.ReactNode; label: string; value: number | string }

export const Stat = memo(function Stat({ icon, label, value }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/50">{icon}<span className="text-xs">{label}</span></div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
    </div>
  )
})
