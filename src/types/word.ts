export type LearningStatus = "new" | "learning" | "mastered"

export interface Word {
  id: string
  userId: string
  term: string
  translation: string
  exampleSentence: string | null
  status: LearningStatus
  createdAt: string
  updatedAt: string
  tags: string[]
}