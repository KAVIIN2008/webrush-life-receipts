import { useEffect, useState } from 'react';

import {
  loadReceiptDataset,
} from '../features/receipts/data';

import type { ReceiptDataset } from '../types/receipt';

interface ReceiptDatasetState {
  data: ReceiptDataset | null;
  loading: boolean;
  error: string | null;
}

export function useReceiptDataset(): ReceiptDatasetState {
  const [state, setState] =
    useState<ReceiptDatasetState>({
      data: null,
      loading: true,
      error: null,
    });

  useEffect(() => {
    let cancelled = false;

    loadReceiptDataset()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setState({
          data,
          loading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unable to load receipt data.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
