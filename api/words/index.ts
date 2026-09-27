import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUserId } from '../_lib/auth.js'
import { handleError } from '../_lib/http.js'
import { createWordSchema, listQuerySchema } from '../_lib/validators.js'
import { createWord, listWords } from '../_lib/words-repo.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = await requireUserId(req)

    if (req.method === 'GET') {
      const query = listQuerySchema.parse(req.query)
      res.status(200).json(await listWords(userId, query))
      return
    }

    if (req.method === 'POST') {
      const input = createWordSchema.parse(req.body)
      res.status(201).json(await createWord(userId, input))
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    handleError(res, error)
  }
}