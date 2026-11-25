import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateWord } from "@/hooks/use-create-word"
import { useUpdateWord } from "@/hooks/use-update-word"
import type { LearningStatus, Word } from "@/types/word"

interface WordFormDialogProps {
  word?: Word
  onSaved: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WordFormDialog({
  word,
  onSaved,
  open: controlledOpen,
  onOpenChange,
}: WordFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={word ? "outline" : "default"}
          size={word ? "sm" : "default"}
          title={word ? undefined : "Atalho: N"}
        >
          {word ? "Editar" : "Nova palavra"}
        </Button>
      </DialogTrigger>
      {open && (
        <WordFormFields
          key={word?.id ?? "create"}
          word={word}
          onClose={() => setOpen(false)}
          onSaved={onSaved}
        />
      )}
    </Dialog>
  )
}

interface WordFormFieldsProps {
  word?: Word
  onClose: () => void
  onSaved: () => void
}

function WordFormFields({ word, onClose, onSaved }: WordFormFieldsProps) {
  const isEditing = Boolean(word)
  const { createWord, isSubmitting: isCreating, error: createError } = useCreateWord()
  const { updateWord, isSubmitting: isUpdating, error: updateError } = useUpdateWord()
  const isSubmitting = isCreating || isUpdating
  const error = createError || updateError

  const [term, setTerm] = useState(word?.term ?? "")
  const [translation, setTranslation] = useState(word?.translation ?? "")
  const [exampleSentence, setExampleSentence] = useState(word?.exampleSentence ?? "")
  const [status, setStatus] = useState<LearningStatus>(word?.status ?? "new")
  const [tagsInput, setTagsInput] = useState(word?.tags.join(", ") ?? "")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const input = {
      term,
      translation,
      exampleSentence: exampleSentence || null,
      status,
      tags,
    }

    const result = isEditing && word ? await updateWord(word.id, input) : await createWord(input)

    if (result) {
      onClose()
      onSaved()
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar palavra" : "Nova palavra"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="term">Palavra em inglês</Label>
          <Input id="term" value={term} onChange={(e) => setTerm(e.target.value)} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="translation">Tradução / significado</Label>
          <Input
            id="translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="example">Frase de exemplo</Label>
          <Textarea
            id="example"
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as LearningStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nova</SelectItem>
              <SelectItem value="learning">Em aprendizado</SelectItem>
              <SelectItem value="mastered">Dominada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Trabalho, Verbos"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}