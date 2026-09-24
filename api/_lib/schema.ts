import {
  foreignKey,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const learningStatus = pgEnum('learning_status', ['new', 'learning', 'mastered'])

export const words = pgTable(
  'words',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: text('user_id').notNull(),
    term: text().notNull(),
    translation: text().notNull(),
    exampleSentence: text('example_sentence'),
    status: learningStatus().default('new').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    index('words_term_trgm_idx').using('gin', table.term.op('gin_trgm_ops')),
    index('words_translation_trgm_idx').using('gin', table.translation.op('gin_trgm_ops')),
    index('words_user_created_idx').using('btree', table.userId, table.createdAt.desc().nullsFirst()),
    index('words_user_status_idx').using('btree', table.userId, table.status),
  ],
)

export const tags = pgTable(
  'tags',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: text('user_id').notNull(),
    name: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique('tags_user_id_name_key').on(table.userId, table.name)],
)

export const wordTags = pgTable(
  'word_tags',
  {
    wordId: uuid('word_id').notNull(),
    tagId: uuid('tag_id').notNull(),
  },
  (table) => [
    index('word_tags_tag_idx').using('btree', table.tagId),
    foreignKey({
      columns: [table.wordId],
      foreignColumns: [words.id],
      name: 'word_tags_word_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.tagId],
      foreignColumns: [tags.id],
      name: 'word_tags_tag_id_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.wordId, table.tagId], name: 'word_tags_pkey' }),
  ],
)