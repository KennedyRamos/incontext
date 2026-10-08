import { useEffect, useState } from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { useApiClient } from "@/lib/api-client"

function MeCheck() {
  const apiFetch = useApiClient()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<{ userId: string }>("/me").then((data) => setUserId(data.userId))
  }, [apiFetch])

  return <p className="text-sm text-muted-foreground">userId: {userId ?? "carregando..."}</p>
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">incontext</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <MeCheck />
      </SignedIn>
    </div>
  )
}