import { ReceiptText, Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <a href="#" className="flex items-center gap-3" aria-label="Life Pulse home">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-black"><ReceiptText size={19} aria-hidden="true" /></span>
        <span><span className="block font-semibold">Life Pulse</span><span className="block text-xs text-white/50">Your Life, In Receipts</span></span>
      </a>
      <nav className="flex flex-wrap items-center gap-2 text-xs" aria-label="Page sections">
        {[['#patterns', 'Patterns'], ['#evidence', 'Evidence'], ['#connections', 'Connections']].map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border border-white/10 px-3 py-1.5 text-white/60 transition hover:border-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200">{label}</a>
        ))}
        <span className="hidden items-center gap-1 rounded-full border border-lime-300/10 bg-lime-300/5 px-3 py-1.5 text-lime-200 sm:inline-flex"><Sparkles size={13} aria-hidden="true" />Raw data → story</span>
      </nav>
    </header>
  )
}
