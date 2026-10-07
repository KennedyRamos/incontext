import { and, asc, eq } from 'drizzle-orm'
import { db } from './db.js'
import { tags } from './schema.js'


export async function listTags(userId: string) {
  return db
    .select({ id: tags.id, name: tags.name })
    .from(tags)
    .where(eq(tags.userId, userId))
    .orderBy(asc(tags.name))
}

export async function deleteTag(userId: string, id: string) {
  const [deleted] = await db
    .delete(tags)
    .where(and(eq(tags.id, id), eq(tags.userId, userId)))
    .returning({ id: tags.id })

  return deleted ?? null
}