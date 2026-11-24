import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { WordFormDialog } from "@/components/word-form-dialog"
import { WordList } from "@/components/word-list"
import { useWords } from "@/hooks/use-words"

function Dashboard() {
  const { words, isLoading, error, refetch } = useWords()

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex justify-end">
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