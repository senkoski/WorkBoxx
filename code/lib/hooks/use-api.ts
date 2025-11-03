"use client"

// Hook para facilitar uso da API no frontend
import { useCallback, useState } from "react"
import type { ApiResponse } from "@/lib/api"

export function useApi<T>(apiFunction: (...args: any[]) => Promise<ApiResponse<T>>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiFunction(...args)
        if (response.success && response.data) {
          setData(response.data)
          return response.data
        } else {
          setError(response.error || "Erro desconhecido")
          return null
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erro desconhecido"
        setError(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiFunction],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}
