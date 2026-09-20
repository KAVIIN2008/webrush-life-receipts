import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  loadReceiptDataset,
  loadReceiptOverview,
} from '../features/receipts/data'

import type { ReceiptDataset } from '../types/receipt'
import type { ReceiptOverview } from '../features/receipts/data'

interface ReceiptDatasetState {
  overview: ReceiptOverview | null
  data: ReceiptDataset | null
  loading: boolean
  fullLoading: boolean
  error: string | null
  fullError: string | null
  loadFullDataset: () => Promise<ReceiptDataset>
}

export function useReceiptDataset(): ReceiptDatasetState {
  const [overview, setOverview] = useState<ReceiptOverview | null>(null)
  const [data, setData] = useState<ReceiptDataset | null>(null)

  const [loading, setLoading] = useState(true)
  const [fullLoading, setFullLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [fullError, setFullError] = useState<string | null>(null)

  const fullLoadRef = useRef<Promise<ReceiptDataset> | null>(null)

  useEffect(() => {
    let cancelled = false

    loadReceiptOverview()
      .then((result) => {
        if (cancelled) {
          return
        }

        setOverview(result)
        setLoading(false)
        setError(null)
      })
      .catch((loadError: unknown) => {
        if (cancelled) {
          return
        }

        setLoading(false)
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load receipt overview.',
        )
      })

    return () => {
      cancelled = true
    }
  }, [])

  const loadFullDataset = useCallback(async () => {
    if (data) {
      return data
    }

    if (fullLoadRef.current) {
      return fullLoadRef.current
    }

    setFullLoading(true)
    setFullError(null)

    const promise = loadReceiptDataset()
      .then((dataset) => {
        setData(dataset)
        setFullLoading(false)
        return dataset
      })
      .catch((loadError: unknown) => {
        setFullLoading(false)

        const message =
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load the full receipt dataset.'

        setFullError(message)

        throw loadError
      })
      .finally(() => {
        fullLoadRef.current = null
      })

    fullLoadRef.current = promise

    return promise
  }, [data])

  return {
    overview,
    data,
    loading,
    fullLoading,
    error,
    fullError,
    loadFullDataset,
  }
}
