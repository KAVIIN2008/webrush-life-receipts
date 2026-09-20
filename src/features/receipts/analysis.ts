import type { Receipt } from '../../types/receipt';

export interface DatasetSummary {
  total: number;
  music: number;
  financial: number;
  connectedDays: number;
  activeDays: number;
  startDate: string | null;
  endDate: string | null;
  topArtist: string | null;
  topArtistSessions: number;
  topCategory: string | null;
  topCategoryCount: number;
}

export interface ConnectedDay {
  date: string;
  receipts: Receipt[];
  kinds: string[];
}

function getDay(timestamp: string | null): string | null {
  return timestamp ? timestamp.slice(0, 10) : null;
}

export function groupByDay(
  receipts: Receipt[],
): Map<string, Receipt[]> {
  const groups = new Map<string, Receipt[]>();

  for (const receipt of receipts) {
    const day = getDay(receipt.timestamp);

    if (!day) {
      continue;
    }

    const current = groups.get(day);

    if (current) {
      current.push(receipt);
    } else {
      groups.set(day, [receipt]);
    }
  }

  return groups;
}

export function getConnectedDays(
  receipts: Receipt[],
): ConnectedDay[] {
  const groups = groupByDay(receipts);

  return [...groups.entries()]
    .map(([date, dayReceipts]) => ({
      date,
      receipts: dayReceipts,
      kinds: [...new Set(
        dayReceipts.map((receipt) => receipt.kind),
      )],
    }))
    .filter((entry) => entry.kinds.length >= 2)
    .sort(
      (a, b) =>
        b.receipts.length - a.receipts.length ||
        b.kinds.length - a.kinds.length,
    );
}

export function buildSummary(
  receipts: Receipt[],
): DatasetSummary {
  const timedReceipts = receipts.filter(
    (receipt) => receipt.timestamp,
  );

  const connectedDays = getConnectedDays(receipts);

  const artists = new Map<string, number>();

  const categories = new Map<string, number>();

  for (const receipt of receipts) {
    for (const artist of receipt.meta.topArtists ?? []) {
      artists.set(
        artist,
        (artists.get(artist) ?? 0) + 1,
      );
    }

    if (receipt.kind !== 'music') {
      categories.set(
        receipt.category,
        (categories.get(receipt.category) ?? 0) + 1,
      );
    }
  }

  const topArtistEntry = [...artists.entries()]
    .sort((a, b) => b[1] - a[1])[0];

  const topCategoryEntry = [...categories.entries()]
    .sort((a, b) => b[1] - a[1])[0];

  const sortedDates = timedReceipts
    .map((receipt) => receipt.timestamp as string)
    .sort();

  return {
    total: receipts.length,
    music: receipts.filter(
      (receipt) => receipt.kind === 'music',
    ).length,
    financial: receipts.filter(
      (receipt) => receipt.kind !== 'music',
    ).length,
    connectedDays: connectedDays.length,
    activeDays: new Set(
      timedReceipts.map(
        (receipt) => receipt.timestamp!.slice(0, 10),
      ),
    ).size,
    startDate: sortedDates[0]?.slice(0, 10) ?? null,
    endDate:
      sortedDates.at(-1)?.slice(0, 10) ?? null,
    topArtist: topArtistEntry?.[0] ?? null,
    topArtistSessions: topArtistEntry?.[1] ?? 0,
    topCategory: topCategoryEntry?.[0] ?? null,
    topCategoryCount: topCategoryEntry?.[1] ?? 0,
  };
}

export function findRelatedReceipts(
  target: Receipt,
  receipts: Receipt[],
  limit = 8,
): Receipt[] {
  const targetDay = getDay(target.timestamp);

  if (!targetDay) {
    return [];
  }

  return receipts
    .filter(
      (receipt) =>
        receipt.id !== target.id &&
        getDay(receipt.timestamp) === targetDay,
    )
    .sort((a, b) => {
      const aDifferent = a.kind !== target.kind ? 1 : 0;
      const bDifferent = b.kind !== target.kind ? 1 : 0;

      return bDifferent - aDifferent;
    })
    .slice(0, limit);
}
