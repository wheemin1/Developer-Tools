"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { trackEvent } from "@/lib/analytics"

export function useProcessing<T>() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>("")
  const { toast } = useToast()

  const process = useCallback(
    async (
      processFn: () => Promise<T> | T,
      options?: {
        onSuccess?: (result: T) => void
        onError?: (error: string) => void
        showToast?: boolean
        eventName?: string
      },
    ): Promise<T | null> => {
      setIsProcessing(true)
      setError("")

      try {
        const result = await processFn()
        trackEvent("process_success", { eventName: options?.eventName ?? "generic_process" })
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        trackEvent("process_failure", { eventName: options?.eventName ?? "generic_process" })
        setError(errorMessage)
        options?.onError?.(errorMessage)

        if (options?.showToast !== false) {
          toast({
            title: "Processing Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [toast],
  )

  return {
    isProcessing,
    error,
    process,
  }
}
