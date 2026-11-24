import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "@/lib/api-client"
import type { LearningStatus, Word } from "@/types/word"

export interface WordFilters {
  q?: string
  status?: LearningStatus
  tag?: string
}

function buildQueryString(filters: WordFilters) {
  const params = new URLSearchParams()
  if (filters.q) params.set("q", filters.q)
  if (filters.status) params.set("status", filters.status)
  if (filters.tag) params.set("tag", filters.tag)
  const query = params.toString()
  return query ? `?${query}` : ""
}

export function useWords(filters: WordFilters = {}) {
  const apiFetch = useApiClient()
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true

    async function run() {
      setIsLoading(true)
      try {
        const data = await apiFetch<Word[]>(`/words${buildQueryString(filters)}`)
        if (!active) return
        setWords(data)
        setError(null)
      } catch {
        if (!active) return
        setError("Não foi possível carregar as palavras")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca de dados na montagem/refetch, padrão recomendado pela doc do React
    run()

    return () => {
      active = false
    }
  }, [apiFetch, filters.q, filters.status, filters.tag, version])

  const refetch = useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  return { words, isLoading, error, refetch }
}