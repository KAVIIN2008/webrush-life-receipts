import type { Receipt } from '../../types/receipt';

interface ReceiptCardProps {
  receipt: Receipt;
  selected?: boolean;
  onSelect?: (receipt: Receipt) => void;
}

const kindLabels: Record<string, string> = {
  music: 'Music',
  purchase: 'Purchase',
  transaction: 'Transaction',
  transfer: 'Transfer',
  income: 'Income',
};

function formatDate(
  timestamp: string | null,
): string {
  if (!timestamp) {
    return 'Undated';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(timestamp));
}

function ReceiptCard({
  receipt,
  selected = false,
  onSelect,
}: ReceiptCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(receipt)}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? 'border-indigo-400/60 bg-indigo-500/10'
          : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {kindLabels[receipt.kind] ?? receipt.kind}
          </p>

          <h3 className="mt-2 truncate text-sm font-semibold text-white sm:text-base">
            {receipt.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
            {receipt.subtitle}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-400">
          {receipt.category.replaceAll('_', ' ')}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span>{formatDate(receipt.timestamp)}</span>

        {receipt.amount !== null && (
          <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
            {receipt.currency ?? 'INR'}{' '}
            {receipt.amount.toLocaleString(
              'en-IN',
              {
                maximumFractionDigits: 2,
              },
            )}
          </span>
        )}

        {receipt.tags
          .slice(0, 2)
          .map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-800/70 px-2 py-1"
            >
              {tag}
            </span>
          ))}
      </div>
    </button>
  );
}

export default ReceiptCard;



