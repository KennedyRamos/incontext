import { useCallback, useState } from "react"
import { useApiClient } from "@/lib/api-client"
import type { LearningStatus, Word } from "@/types/word"

export interface CreateWordInput {
  term: string
  translation: string
  exampleSentence: string | null
  status: LearningStatus
  tags: string[]
}

export function useCreateWord() {
  const apiFetch = useApiClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createWord = useCallback(
    async (input: CreateWordInput) => {
      setIsSubmitting(true)
      setError(null)
      try {
        const word = await apiFetch<Word>("/words", {
          method: "POST",
          body: JSON.stringify(input),
        })
        return word
      } catch {
        setError("Não foi possível salvar a palavra")
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [apiFetch],
  )

  return { createWord, isSubmitting, error }
}