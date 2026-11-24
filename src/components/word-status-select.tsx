import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateWord } from "@/hooks/use-update-word"
import type { LearningStatus, Word } from "@/types/word"

const statusLabel: Record<LearningStatus, string> = {
  new: "Nova",
  learning: "Em aprendizado",
  mastered: "Dominada",
}

interface WordStatusSelectProps {
  word: Word
  onChanged: () => void
}

export function WordStatusSelect({ word, onChanged }: WordStatusSelectProps) {
  const { updateWord, isSubmitting } = useUpdateWord()

  async function handleChange(value: string) {
    const status = value as LearningStatus
    const result = await updateWord(word.id, {
      term: word.term,
      translation: word.translation,
      exampleSentence: word.exampleSentence,
      status,
      tags: word.tags,
    })

    if (result) {
      onChanged()
    }
  }

  return (
    <Select value={word.status} onValueChange={handleChange} disabled={isSubmitting}>
      <SelectTrigger size="sm" className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">{statusLabel.new}</SelectItem>
        <SelectItem value="learning">{statusLabel.learning}</SelectItem>
        <SelectItem value="mastered">{statusLabel.mastered}</SelectItem>
      </SelectContent>
    </Select>
  )
}