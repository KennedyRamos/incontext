import { useEffect } from "react"

interface Shortcuts {
  onNewWord: () => void
  onFocusSearch: () => void
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
}

function hasOpenOverlay() {
  return Boolean(document.querySelector('[role="dialog"], [role="alertdialog"], [role="listbox"]'))
}

export function useShortcuts({ onNewWord, onFocusSearch }: Shortcuts) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target) || hasOpenOverlay()) return

      const key = event.key.toLowerCase()

      if (key === "n") {
        event.preventDefault()
        onNewWord()
      }

      if (key === "/") {
        event.preventDefault()
        onFocusSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onNewWord, onFocusSearch])
}