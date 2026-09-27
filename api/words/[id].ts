import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUserId } from '../_lib/auth.js'
import { handleError } from '../_lib/http.js'
import { createWordSchema, idParamSchema } from '../_lib/validators.js'
import { deleteWord, getWord, updateWord } from '../_lib/words-repo.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = await requireUserId(req)
    const id = idParamSchema.parse(req.query.id)

    if (req.method === 'GET') {
      const word = await getWord(userId, id)
      if (!word) {
        res.status(404).json({ error: 'Palavra não encontrada' })
        return
      }
      res.status(200).json(word)
      return
    }

    if (req.method === 'PUT') {
      const input = createWordSchema.parse(req.body)
      const word = await updateWord(userId, id, input)
      if (!word) {
        res.status(404).json({ error: 'Palavra não encontrada' })
        return
      }
      res.status(200).json(word)
      return
    }

    if (req.method === 'DELETE') {
      const deleted = await deleteWord(userId, id)
      if (!deleted) {
        res.status(404).json({ error: 'Palavra não encontrada' })
        return
      }
      res.status(204).end()
      return
    }

    res.setHeader('Allow', 'GET, PUT, DELETE')
    res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    handleError(res, error)
  }
}