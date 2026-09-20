import { memo } from 'react'

type Props = { icon: React.ReactNode; label: string; value: string; detail: string }

export const Signal = memo(function Signal({ icon, label, value, detail }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/50">{icon}<span className="text-xs">{label}</span></div>
      <p className="mt-2 truncate font-semibold">{value}</p>
      <p className="mt-1 text-xs text-white/50">{detail}</p>
    </div>
  )
})
