import type { VercelRequest } from '@vercel/node'
import { verifyToken } from '@clerk/backend'

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export async function requireUserId(req: VercelRequest): Promise<string> {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    throw new UnauthorizedError('Token ausente')
  }

  const secretKey = process.env.CLERK_SECRET_KEY

  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY não está definida')
  }

  try {
    const payload = await verifyToken(token, { secretKey })
    return payload.sub
  } catch {
    throw new UnauthorizedError('Token inválido')
  }
}