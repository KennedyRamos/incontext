import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireUserId, UnauthorizedError } from './_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const userId = await requireUserId(req)
    res.status(200).json({ userId })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Erro interno' })
  }
}