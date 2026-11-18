import { useQuery } from '@tanstack/react-query'

import { getJson } from '@/lib/api'
import type { LessonDetail, LessonSummary } from '@/types/api'

export const useLessonsWithModels = () =>
  useQuery({
    queryKey: ['lessons', { hasModels: true }],
    queryFn: () => getJson<LessonSummary[]>('/lessons?has_models=true'),
  })

export const useLesson = (slug: string) =>
  useQuery({
    queryKey: ['lesson', slug],
    queryFn: () => getJson<LessonDetail>(`/lessons/${encodeURIComponent(slug)}`),
  })
