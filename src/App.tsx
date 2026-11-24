import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { useState } from "react"
import { WordFormDialog } from "@/components/word-form-dialog"
import { WordList } from "@/components/word-list"
import { WordSearch } from "@/components/word-search"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useWords } from "@/hooks/use-words"

function Dashboard() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 300)
  const { words, isLoading, error, refetch } = useWords({ q: debouncedSearch })

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex gap-2">
        <WordSearch value={search} onChange={setSearch} />
        <WordFormDialog onCreated={refetch} />
      </div>
      <WordList words={words} isLoading={isLoading} error={error} />
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-8">
      <div className="flex w-full max-w-xl items-center justify-between">
        <h1 className="text-2xl font-semibold">incontext</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  )
}