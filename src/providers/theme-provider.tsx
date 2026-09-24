import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "incontext-theme"
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system",
  )

  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = theme === "dark" || (theme === "system" && prefersDark)
    root.classList.toggle("dark", isDark)
  }, [theme])

  const value: ThemeContextValue = {
    theme,
    setTheme: (next) => {
      localStorage.setItem(STORAGE_KEY, next)
      setTheme(next)
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme deve ser usado dentro de <ThemeProvider>")
  return ctx
}