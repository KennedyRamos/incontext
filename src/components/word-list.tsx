import { Badge } from "@/components/ui/badge"
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

export function WordList({ words, isLoading, error, onChanged }: WordListProps) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (words.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma palavra cadastrada ainda.</p>
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {words.map((word) => (
        <li key={word.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{word.term}</span>
            <div className="flex items-center gap-2">
              <WordStatusSelect word={word} onChanged={onChanged} />
              <WordFormDialog word={word} onSaved={onChanged} />
              <DeleteWordButton wordId={word.id} wordTerm={word.term} onDeleted={onChanged} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{word.translation}</p>
          {word.exampleSentence && (
            <p className="mt-2 text-sm italic text-muted-foreground">{word.exampleSentence}</p>
          )}
          {word.tags.length > 0 && (
            <div className="mt-2 flex gap-1">
              {word.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}