import { relations } from "drizzle-orm/relations";
import { words, wordTags, tags } from "./schema";

export const wordTagsRelations = relations(wordTags, ({one}) => ({
	word: one(words, {
		fields: [wordTags.wordId],
		references: [words.id]
	}),
	tag: one(tags, {
		fields: [wordTags.tagId],
		references: [tags.id]
	}),
}));

export const wordsRelations = relations(words, ({many}) => ({
	wordTags: many(wordTags),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	wordTags: many(wordTags),
}));