import type { VercelResponse } from '@vercel/node'
import { ZodError } from 'zod'
import { UnauthorizedError } from './auth.js'

export function handleError(res: VercelResponse, error: unknown) {
  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Dados inválidos', details: error.issues })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Erro interno' })
}