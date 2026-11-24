import { Input } from "@/components/ui/input"

interface WordSearchProps {
  value: string
  onChange: (value: string) => void
}

export function WordSearch({ value, onChange }: WordSearchProps) {
  return (
    <Input
      placeholder="Buscar por palavra, tradução ou tag..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}