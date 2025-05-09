// hooks/use-fetch.ts
import { useState, useCallback } from "react"
import { useApiErrorHandler } from "@/lib/error-utils"

export function useFetch<T, P = any>(
  fetchFn: (params: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: unknown) => void
    defaultData?: T
  }
) {
  const [data, setData] = useState<T | undefined>(options?.defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const { handleError } = useApiErrorHandler()

  const execute = useCallback(
    async (params: P) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fetchFn(params)
        setData(result)
        options?.onSuccess?.(result)
        return result
      } catch (e) {
        setError(e)
        handleError(e)
        options?.onError?.(e)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [fetchFn, options, handleError]
  )

  return { data, isLoading, error, execute, setData }
}