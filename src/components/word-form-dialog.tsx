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
import type { LearningStatus } from "@/types/word"

interface WordFormDialogProps {
  onCreated: () => void
}

export function WordFormDialog({ onCreated }: WordFormDialogProps) {
  const { createWord, isSubmitting, error } = useCreateWord()
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState("")
  const [translation, setTranslation] = useState("")
  const [exampleSentence, setExampleSentence] = useState("")
  const [status, setStatus] = useState<LearningStatus>("new")
  const [tagsInput, setTagsInput] = useState("")

  function resetForm() {
    setTerm("")
    setTranslation("")
    setExampleSentence("")
    setStatus("new")
    setTagsInput("")
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const word = await createWord({
      term,
      translation,
      exampleSentence: exampleSentence || null,
      status,
      tags,
    })

    if (word) {
      resetForm()
      setOpen(false)
      onCreated()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova palavra</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova palavra</DialogTitle>
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
    </Dialog>
  )
}