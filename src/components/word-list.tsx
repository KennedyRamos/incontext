import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteWordButton } from "@/components/delete-word-button"
import { WordFormDialog } from "@/components/word-form-dialog"
import { WordStatusSelect } from "@/components/word-status-select"
import type { Word } from "@/types/word"

interface WordListProps {
  words: Word[]
  isLoading: boolean
  error: string | null
  onChanged: () => void
}

function WordListSkeleton() {
  return (
    <ul className="flex w-full flex-col gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="rounded-xl border p-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </li>
      ))}
    </ul>
  )
}

export function WordList({ words, isLoading, error, onChanged }: WordListProps) {
  if (isLoading) {
    return <WordListSkeleton />
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed py-12 text-center">
        <p className="font-medium">Nenhuma palavra por aqui</p>
        <p className="text-sm text-muted-foreground">
          Adicione uma palavra nova ou ajuste a busca.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex w-full flex-col gap-2">
      {words.map((word) => (
        <li
          key={word.id}
          className="group rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-base font-semibold">{word.term}</span>
                <span className="text-sm text-muted-foreground">{word.translation}</span>
              </div>
              {word.exampleSentence && (
                <p className="mt-2 border-l-2 pl-3 text-sm italic text-muted-foreground">
                  {word.exampleSentence}
                </p>
              )}
              {word.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {word.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <WordFormDialog word={word} onSaved={onChanged} />
                <DeleteWordButton wordId={word.id} wordTerm={word.term} onDeleted={onChanged} />
              </div>
              <WordStatusSelect word={word} onChanged={onChanged} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}