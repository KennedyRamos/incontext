import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUserId } from '../_lib/auth.js'
import { handleError } from '../_lib/http.js'
import { idParamSchema } from '../_lib/validators.js'
import { deleteTag } from '../_lib/tags-repo.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = await requireUserId(req)
    const id = idParamSchema.parse(req.query.id)

    if (req.method === 'DELETE') {
      const deleted = await deleteTag(userId, id)
      if (!deleted) {
        res.status(404).json({ error: 'Tag não encontrada' })
        return
      }
      res.status(204).end()
      return
    }

    res.setHeader('Allow', 'DELETE')
    res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    handleError(res, error)
  }
}