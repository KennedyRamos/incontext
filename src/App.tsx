import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { WordFilters } from "@/components/word-filters"
import { WordFormDialog } from "@/components/word-form-dialog"
import { WordList } from "@/components/word-list"
import { WordSearch } from "@/components/word-search"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useTags } from "@/hooks/use-tags"
import { useWords } from "@/hooks/use-words"
import type { LearningStatus } from "@/types/word"

function Dashboard() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<LearningStatus | undefined>()
  const [tag, setTag] = useState<string | undefined>()
  const debouncedSearch = useDebouncedValue(search, 300)
  const {
    words,
    isLoading,
    error,
    refetch: refetchWords,
  } = useWords({ q: debouncedSearch, status, tag })
  const { tags, refetch: refetchTags } = useTags()

  function handleChanged() {
    refetchWords()
    refetchTags()
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex gap-2">
        <WordSearch value={search} onChange={setSearch} />
        <WordFormDialog onSaved={handleChanged} />
      </div>
      <WordFilters
        status={status}
        onStatusChange={setStatus}
        tag={tag}
        onTagChange={setTag}
        tags={tags}
      />
      <WordList words={words} isLoading={isLoading} error={error} onChanged={handleChanged} />
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">incontext</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
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