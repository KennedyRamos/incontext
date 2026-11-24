import { useCallback, useState } from "react"
import { useApiClient } from "@/lib/api-client"
import type { CreateWordInput } from "@/hooks/use-create-word"
import type { Word } from "@/types/word"

export function useUpdateWord() {
  const apiFetch = useApiClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateWord = useCallback(
    async (id: string, input: CreateWordInput) => {
      setIsSubmitting(true)
      setError(null)
      try {
        const word = await apiFetch<Word>(`/words/${id}`, {
          method: "PUT",
          body: JSON.stringify(input),
        })
        return word
      } catch {
        setError("Não foi possível atualizar a palavra")
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [apiFetch],
  )

  return { updateWord, isSubmitting, error }
}