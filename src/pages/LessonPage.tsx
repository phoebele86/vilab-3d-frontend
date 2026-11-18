import { Segmented } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { renderLab } from '@/features/labs'
import { useLesson } from '@/hooks/useLessons'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import { getApiFailure } from '@/lib/api'

const BoardMessage = ({ text }: { text: string }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-board flex h-dvh flex-col items-center justify-center gap-4 px-6 text-center text-chalk">
      <p className="m-0 max-w-md font-chalk text-2xl chalk-glow">{text}</p>
      <Link to="/lab" className="font-semibold text-chalk-dim hover:text-chalk">
        {t('common.backToLab')}
      </Link>
    </div>
  )
}

export const LessonPage = () => {
  const { t } = useTranslation()
  const localize = useLocalizedText()
  const { slug = '' } = useParams()
  const { data: lesson, error, isPending } = useLesson(slug)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  if (isPending) return <BoardMessage text={t('common.loadingLesson')} />
  if (error) {
    const isMissing = getApiFailure(error)?.status === 404
    return <BoardMessage text={isMissing ? t('common.lessonNotFound') : t('common.serverUnavailable')} />
  }

  const model = lesson.models.find(({ key }) => key === selectedKey) ?? lesson.models.at(0)
  if (!model) return <BoardMessage text={t('common.noModels')} />

  const toolbar =
    lesson.models.length > 1 ? (
      <Segmented
        value={model.key}
        onChange={setSelectedKey}
        options={lesson.models.map(({ key, name }) => ({ label: localize(name), value: key }))}
      />
    ) : undefined

  const lab = renderLab({
    model,
    lessonLabel: t('common.lessonLabel', {
      grade: lesson.grade,
      lessonNo: lesson.lesson_no,
      title: localize(lesson.title),
    }),
    toolbar,
  })
  return lab ?? <BoardMessage text={t('common.labUnavailable', { name: localize(model.name) })} />
}
