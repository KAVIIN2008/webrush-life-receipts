export function LoadingState() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0c0d0f] text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />
        <p className="text-lg font-semibold">Reading your life in receipts…</p>
        <p className="mt-1 text-sm text-white/50">Loading the supplied dataset</p>
      </div>
    </main>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0c0d0f] p-6 text-white">
      <div className="max-w-lg rounded-3xl border border-red-400/20 bg-red-400/5 p-7">
        <h1 className="text-xl font-semibold">Dataset could not be loaded</h1>
        <p className="mt-2 text-sm text-white/50">{message}</p>
      </div>
    </main>
  )
}
