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

