import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteWord } from "@/hooks/use-delete-word"

interface DeleteWordButtonProps {
  wordId: string
  wordTerm: string
  onDeleted: () => void
}

export function DeleteWordButton({ wordId, wordTerm, onDeleted }: DeleteWordButtonProps) {
  const { deleteWord, isDeleting } = useDeleteWord()

  async function handleConfirm() {
    const success = await deleteWord(wordId)
    if (success) {
      onDeleted()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir "{wordTerm}"?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. A palavra e suas tags associadas serão removidas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}