import { randomUUID } from 'node:crypto'
import { and, desc, eq, exists, ilike, inArray, or, sql } from 'drizzle-orm'
import { db } from './db.js'
import { tags, wordTags, words } from './schema.js'
import type { CreateWordInput, ListQuery } from './validators.js'

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&')
}

function hasTagLike(condition: ReturnType<typeof eq>) {
  return exists(
    db
      .select({ one: sql`1` })
      .from(wordTags)
      .innerJoin(tags, eq(tags.id, wordTags.tagId))
      .where(and(eq(wordTags.wordId, words.id), condition)),
  )
}

export async function listWords(userId: string, query: ListQuery) {
  const conditions = [eq(words.userId, userId)]

  if (query.status) {
    conditions.push(eq(words.status, query.status))
  }

  if (query.tag) {
    conditions.push(hasTagLike(eq(tags.name, query.tag)))
  }

  if (query.q) {
    const pattern = `%${escapeLike(query.q)}%`
    const search = or(
      ilike(words.term, pattern),
      ilike(words.translation, pattern),
      hasTagLike(ilike(tags.name, pattern)),
    )
    if (search) {
      conditions.push(search)
    }
  }

  const rows = await db
    .select()
    .from(words)
    .where(and(...conditions))
    .orderBy(desc(words.createdAt))
    .limit(query.limit)
    .offset(query.offset)

  if (rows.length === 0) {
    return []
  }

  const tagRows = await db
    .select({ wordId: wordTags.wordId, name: tags.name })
    .from(wordTags)
    .innerJoin(tags, eq(tags.id, wordTags.tagId))
    .where(
      inArray(
        wordTags.wordId,
        rows.map((row) => row.id),
      ),
    )

  const tagsByWord = new Map<string, string[]>()
  for (const { wordId, name } of tagRows) {
    tagsByWord.set(wordId, [...(tagsByWord.get(wordId) ?? []), name])
  }

  return rows.map((row) => ({ ...row, tags: tagsByWord.get(row.id) ?? [] }))
}

export async function createWord(userId: string, input: CreateWordInput) {
  const tagNames = [...new Set(input.tags)]
  let tagIds: string[] = []

  if (tagNames.length > 0) {
    await db
      .insert(tags)
      .values(tagNames.map((name) => ({ userId, name })))
      .onConflictDoNothing({ target: [tags.userId, tags.name] })

    const tagRows = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.userId, userId), inArray(tags.name, tagNames)))

    tagIds = tagRows.map((row) => row.id)
  }

  const id = randomUUID()

  const insertWord = db
    .insert(words)
    .values({
      id,
      userId,
      term: input.term,
      translation: input.translation,
      exampleSentence: input.exampleSentence,
      status: input.status,
    })
    .returning()

  if (tagIds.length === 0) {
    const [created] = await insertWord
    return { ...created, tags: [] as string[] }
  }

  const [[created]] = await db.batch([
    insertWord,
    db.insert(wordTags).values(tagIds.map((tagId) => ({ wordId: id, tagId }))),
  ])

  return { ...created, tags: tagNames }
}

export async function getWord(userId: string, id: string) {
  const [word] = await db
    .select()
    .from(words)
    .where(and(eq(words.id, id), eq(words.userId, userId)))

  if (!word) {
    return null
  }

  const tagRows = await db
    .select({ name: tags.name })
    .from(wordTags)
    .innerJoin(tags, eq(tags.id, wordTags.tagId))
    .where(eq(wordTags.wordId, id))

  return { ...word, tags: tagRows.map((row) => row.name) }
}

export async function updateWord(userId: string, id: string, input: CreateWordInput) {
  const existing = await getWord(userId, id)

  if (!existing) {
    return null
  }

  const tagNames = [...new Set(input.tags)]
  let tagIds: string[] = []

  if (tagNames.length > 0) {
    await db
      .insert(tags)
      .values(tagNames.map((name) => ({ userId, name })))
      .onConflictDoNothing({ target: [tags.userId, tags.name] })

    const tagRows = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.userId, userId), inArray(tags.name, tagNames)))

    tagIds = tagRows.map((row) => row.id)
  }

  const updateWordQuery = db
    .update(words)
    .set({
      term: input.term,
      translation: input.translation,
      exampleSentence: input.exampleSentence,
      status: input.status,
    })
    .where(and(eq(words.id, id), eq(words.userId, userId)))
    .returning()

  const [[updated]] = await db.batch([
    updateWordQuery,
    db.delete(wordTags).where(eq(wordTags.wordId, id)),
    ...(tagIds.length > 0
      ? [db.insert(wordTags).values(tagIds.map((tagId) => ({ wordId: id, tagId })))]
      : []),
  ])

  return { ...updated, tags: tagNames }
}

export async function deleteWord(userId: string, id: string) {
  const [deleted] = await db
    .delete(words)
    .where(and(eq(words.id, id), eq(words.userId, userId)))
    .returning({ id: words.id })

  return deleted ?? null
}