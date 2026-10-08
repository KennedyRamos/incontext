import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "@/lib/api-client"
import type { Word } from "@/types/word"

export function useWords() {
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
        const data = await apiFetch<Word[]>("/words")
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

    run()

    return () => {
      active = false
    }
  }, [apiFetch, version])

  const refetch = useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  return { words, isLoading, error, refetch }
}