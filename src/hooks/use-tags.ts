import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "@/lib/api-client"
import type { Tag } from "@/types/tag"

export function useTags() {
  const apiFetch = useApiClient()
  const [tags, setTags] = useState<Tag[]>([])
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true

    async function run() {
      try {
        const data = await apiFetch<Tag[]>("/tags")
        if (active) setTags(data)
      } catch {
        if (active) setTags([])
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

  return { tags, refetch }
}