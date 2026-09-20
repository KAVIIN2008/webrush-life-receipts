import { Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/5 px-3 py-1.5 text-xs text-lime-200">
          <Sparkles size={13} aria-hidden="true" />
          Evidence-based life patterns
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
          Your life,
          <span className="block text-white/50">hidden in receipts.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
          Explore the supplied activity as moments, discover where different
          parts of the data overlap, and follow each connection back to its evidence.
        </p>
      </div>
    </section>
  )
}
