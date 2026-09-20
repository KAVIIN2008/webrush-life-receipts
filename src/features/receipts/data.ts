import type {
  Receipt,
  ReceiptDataset,
} from '../../types/receipt';

const DATA_URL = '/data/receipts.json';

function isReceipt(value: unknown): value is Receipt {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const receipt = value as Partial<Receipt>;

  return (
    typeof receipt.id === 'string' &&
    typeof receipt.kind === 'string' &&
    (receipt.timestamp === null ||
      typeof receipt.timestamp === 'string') &&
    (receipt.endTimestamp === null ||
      typeof receipt.endTimestamp === 'string') &&
    typeof receipt.title === 'string' &&
    typeof receipt.subtitle === 'string' &&
    typeof receipt.category === 'string' &&
    Array.isArray(receipt.tags) &&
    (receipt.amount === null ||
      typeof receipt.amount === 'number') &&
    (receipt.currency === null ||
      typeof receipt.currency === 'string') &&
    typeof receipt.source === 'string'
  );
}

function isDataset(
  value: unknown,
): value is ReceiptDataset {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const dataset =
    value as Partial<ReceiptDataset>;

  return (
    typeof dataset.version === 'number' &&
    Array.isArray(dataset.receipts) &&
    dataset.receipts.every(isReceipt)
  );
}

export async function loadReceiptDataset(): Promise<ReceiptDataset> {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to load receipt dataset (${response.status})`,
    );
  }

  const data: unknown = await response.json();

  if (!isDataset(data)) {
    throw new Error(
      'Receipt dataset has an unexpected structure.',
    );
  }

  return data;
}


export interface ConnectedDayOverview {
  day: string
  receiptCount: number
  kinds: number
}

export interface ReceiptOverview {
  version: number
  totalReceipts: number
  musicCount: number
  activityCount: number
  activeDays: number
  connectedDays: ConnectedDayOverview[]
  connectedDayCount: number
  topCategory: [string, number] | null
  topArtist: [string, number] | null
  previewReceipts: Receipt[]
}

const OVERVIEW_URL = '/data/overview.json'

function isPair(value: unknown): value is [string, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'number'
  )
}

function isOverview(value: unknown): value is ReceiptOverview {
  if (!value || typeof value !== 'object') {
    return false
  }

  const overview = value as Partial<ReceiptOverview>

  return (
    typeof overview.version === 'number' &&
    typeof overview.totalReceipts === 'number' &&
    typeof overview.musicCount === 'number' &&
    typeof overview.activityCount === 'number' &&
    typeof overview.activeDays === 'number' &&
    typeof overview.connectedDayCount === 'number' &&
    Array.isArray(overview.connectedDays) &&
    overview.connectedDays.every(
      (item) =>
        item &&
        typeof item.day === 'string' &&
        typeof item.receiptCount === 'number' &&
        typeof item.kinds === 'number',
    ) &&
    (overview.topCategory === null || isPair(overview.topCategory)) &&
    (overview.topArtist === null || isPair(overview.topArtist)) &&
    Array.isArray(overview.previewReceipts) &&
    overview.previewReceipts.every(isReceipt)
  )
}

export async function loadReceiptOverview(): Promise<ReceiptOverview> {
  const response = await fetch(OVERVIEW_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to load receipt overview (${response.status})`,
    )
  }

  const data: unknown = await response.json()

  if (!isOverview(data)) {
    throw new Error(
      'Receipt overview has an unexpected structure.',
    )
  }

  return data
}

