import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Tag } from "@/types/tag"
import type { LearningStatus } from "@/types/word"

const ALL = "all"

const statusOptions: { value: LearningStatus | undefined; label: string }[] = [
  { value: undefined, label: "Todas" },
  { value: "new", label: "Nova" },
  { value: "learning", label: "Em aprendizado" },
  { value: "mastered", label: "Dominada" },
]

interface WordFiltersProps {
  status: LearningStatus | undefined
  onStatusChange: (status: LearningStatus | undefined) => void
  tag: string | undefined
  onTagChange: (tag: string | undefined) => void
  tags: Tag[]
}

export function WordFilters({
  status,
  onStatusChange,
  tag,
  onTagChange,
  tags,
}: WordFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1">
        {statusOptions.map((option) => (
          <Button
            key={option.label}
            size="sm"
            variant={status === option.value ? "secondary" : "ghost"}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Select
        value={tag ?? ALL}
        onValueChange={(value) => onTagChange(value === ALL ? undefined : value)}
      >
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas as tags</SelectItem>
          {tags.map((item) => (
            <SelectItem key={item.id} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}