import { useCallback, useState } from "react"
import { useApiClient } from "@/lib/api-client"

export function useDeleteWord() {
  const apiFetch = useApiClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteWord = useCallback(
    async (id: string) => {
      setIsDeleting(true)
      setError(null)
      try {
        await apiFetch<void>(`/words/${id}`, { method: "DELETE" })
        return true
      } catch {
        setError("Não foi possível excluir a palavra")
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [apiFetch],
  )

  return { deleteWord, isDeleting, error }
}