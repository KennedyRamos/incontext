import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from 'drizzle-orm'
import { db } from './_lib/db.js'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await db.execute(sql`select 1`)
    res.status(200).json({ status: 'ok' })
  } catch {
    res.status(500).json({ status: 'error' })
  }
}