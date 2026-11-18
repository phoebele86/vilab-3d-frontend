import { ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SectionHeading } from '@/components/home/SectionHeading'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Logo } from '@/components/layout/Logo'
import { SUBJECTS } from '@/data/subjects'
import { useLessonsWithModels } from '@/hooks/useLessons'
import { useLocalizedText } from '@/hooks/useLocalizedText'
import { boardTheme } from '@/theme/antdTheme'
import type { LessonSummary } from '@/types/api'

// Grade nodes use <details> so each branch folds open and closed without extra state.
const GradeTree = ({ lessons }: { lessons: LessonSummary[] }) => {
  const { t } = useTranslation()
  const localize = useLocalizedText()
  const grades = [...new Set(lessons.map(({ grade }) => grade))].sort((a, b) => a - b)

  return (
    <ul className="mt-4 mb-0 space-y-3 pl-0">
      {grades.map((grade) => {
        const gradeLessons = lessons.filter((lesson) => lesson.grade === grade)
        return (
          <li key={grade}>
            <details open>
              <summary className="cursor-pointer rounded-md py-1 font-bold text-ink marker:text-ink-soft">
                {t('labIndex.grade', { grade })}
                <span className="ml-2 text-sm font-normal text-ink-soft">
                  {t('labIndex.lessonCount', { count: gradeLessons.length })}
                </span>
              </summary>
              <ul className="mt-1 mb-0 ml-1.5 border-l-2 border-ink-soft/45 pl-0">
                {gradeLessons.map((lesson) => (
                  <li
                    key={lesson.slug}
                    className="relative py-1.5 pl-5 before:absolute before:top-[1.15em] before:left-0 before:h-0.5 before:w-3.5 before:bg-ink-soft/45"
                  >
                    <Link
                      to={`/lessons/${lesson.slug}`}
                      className="font-semibold text-ink hover:text-purple-ink hover:underline"
                    >
                      <span className="text-ink-soft">{t('labIndex.lessonNumber', { number: lesson.lesson_no })}</span>{' '}
                      {localize(lesson.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export const LabIndexPage = () => {
  const { t } = useTranslation()
  const { data: lessons, isPending, error } = useLessonsWithModels()

  return (
    <div className="min-h-dvh">
      <header className="bg-board px-4 py-5 text-chalk sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="text-chalk hover:text-white" aria-label={t('common.backToHome')}>
            <Logo />
          </Link>
          <ConfigProvider theme={boardTheme}>
            <LanguageSwitcher />
          </ConfigProvider>
        </div>
      </header>

      <main className="bg-notebook min-h-[calc(100dvh-80px)] px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading id="lab-title" title={t('labIndex.title')}>
            {t('labIndex.intro')}
          </SectionHeading>

          {isPending && <p className="mt-10 font-chalk text-xl text-ink-soft">{t('labIndex.loading')}</p>}
          {error && <p className="mt-10 text-ink">{t('labIndex.serverError')}</p>}

          {lessons && (
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {SUBJECTS.map(({ key, borderInkClass, textInkClass }) => (
                <section key={key} className={`border-t-4 pt-4 ${borderInkClass}`}>
                  <h2 className={`m-0 text-xl font-bold ${textInkClass}`}>{t(`subjects.${key}.name`)}</h2>
                  <GradeTree lessons={lessons.filter((lesson) => lesson.subject === key)} />
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
