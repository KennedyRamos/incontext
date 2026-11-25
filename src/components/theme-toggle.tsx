import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/theme-provider"

const order = ["light", "dark", "system"] as const

const labels = {
  light: "Tema claro",
  dark: "Tema escuro",
  system: "Tema do sistema",
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = order[(order.indexOf(theme) + 1) % order.length]
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`${labels[theme]}. Alternar para ${labels[next]}`}
      title={labels[theme]}
    >
      <Icon />
    </Button>
  )
}