import type { Subject, SubjectKey } from '@/types/subject'

// Display text lives in the locale files; Tailwind classes are written in full so the scanner finds them.
export const SUBJECTS: Subject[] = [
  {
    key: 'physics',
    chalkColor: '#8cc7f2',
    textChalkClass: 'text-physics',
    textInkClass: 'text-physics-ink',
    borderInkClass: 'border-physics-ink',
  },
  {
    key: 'chemistry',
    chalkColor: '#f5c451',
    textChalkClass: 'text-chemistry',
    textInkClass: 'text-chemistry-ink',
    borderInkClass: 'border-chemistry-ink',
  },
  {
    key: 'biology',
    chalkColor: '#f29bb8',
    textChalkClass: 'text-biology',
    textInkClass: 'text-biology-ink',
    borderInkClass: 'border-biology-ink',
  },
]

export const SUBJECT_BY_KEY = Object.fromEntries(
  SUBJECTS.map((subject) => [subject.key, subject]),
) as Record<SubjectKey, Subject>

export const GRADES = [6, 7, 8, 9] as const
