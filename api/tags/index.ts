import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUserId } from '../_lib/auth.js'
import { handleError } from '../_lib/http.js'
import { listTags } from '../_lib/tags-repo.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = await requireUserId(req)

    if (req.method === 'GET') {
      res.status(200).json(await listTags(userId))
      return
    }

    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    handleError(res, error)
  }
}