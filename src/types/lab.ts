import type { ReactNode } from 'react'

import type { LessonModel } from '@/types/api'

export type LabProps = {
  model: LessonModel
  lessonLabel: string
  // Lets the lesson page switch between several models of the same lesson
  toolbar?: ReactNode
}
