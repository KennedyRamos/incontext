import { z } from 'zod'

const statusEnum = z.enum(['new', 'learning', 'mastered'])

const tagName = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .transform((value) => value.toLowerCase())

export const createWordSchema = z.object({
  term: z.string().trim().min(1).max(200),
  translation: z.string().trim().min(1).max(500),
  exampleSentence: z
    .string()
    .trim()
    .max(1000)
    .nullish()
    .transform((value) => value || null),
  status: statusEnum.default('new'),
  tags: z.array(tagName).max(10).default([]),
})

export const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: statusEnum.optional(),
  tag: tagName.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

export type CreateWordInput = z.infer<typeof createWordSchema>
export type ListQuery = z.infer<typeof listQuerySchema>

export const idParamSchema = z.string().uuid()