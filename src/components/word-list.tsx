import { Badge } from "@/components/ui/badge"
import type { Word } from "@/types/word"

const statusLabel: Record<string, string> = {
  new: "Nova",
  learning: "Em aprendizado",
  mastered: "Dominada",
}

interface WordListProps {
  words: Word[]
  isLoading: boolean
  error: string | null
}

export function WordList({ words, isLoading, error }: WordListProps) {
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
            <Badge variant="secondary">{statusLabel[word.status]}</Badge>
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