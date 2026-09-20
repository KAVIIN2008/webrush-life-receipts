export type ReceiptKind =
  | 'music'
  | 'purchase'
  | 'transaction'
  | 'transfer'
  | 'income';

export type ReceiptSource =
  | 'spotify_history'
  | 'daily_household_transactions'
  | 'india_transaction';

export interface ReceiptLocation {
  city: string;
  state: string;
}

export interface ReceiptMeta {
  trackCount?: number;
  uniqueArtists?: number;
  uniqueAlbums?: number;
  topArtists?: string[];
  topTracks?: string[];
  platforms?: string[];
  skipped?: number;
  shuffleRate?: number;
  durationMs?: number;

  mode?: string | null;
  incomeExpense?: string | null;
  subcategory?: string | null;
  note?: string | null;

  merchant?: string | null;
  city?: string | null;
  state?: string | null;
  transactionDate?: string | null;
}

export interface Receipt {
  id: string;
  kind: ReceiptKind;
  timestamp: string | null;
  endTimestamp: string | null;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  amount: number | null;
  currency: string | null;
  location: ReceiptLocation | null;
  source: ReceiptSource;
  meta: ReceiptMeta;
}

export interface ReceiptDataset {
  version: number;
  generatedFrom: {
    spotifyRows: number;
    householdRows: number;
    indiaTransactionRows: number;
    musicSessions: number;
  };
  receipts: Receipt[];
}
