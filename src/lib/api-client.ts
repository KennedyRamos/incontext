import { useCallback } from "react"
import { useAuth } from "@clerk/clerk-react"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function useApiClient() {
  const { getToken } = useAuth()

  return useCallback(
    async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
      const token = await getToken()

      const response = await fetch(`/api${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...init?.headers,
        },
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        throw new ApiError(response.status, body.error ?? "Erro desconhecido")
      }

      if (response.status === 204) {
        return undefined as T
      }

      return response.json() as Promise<T>
    },
    [getToken],
  )
}