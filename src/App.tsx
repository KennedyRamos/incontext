import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { WordList } from "@/components/word-list"

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
        <WordList />
      </SignedIn>
    </div>
  )
}