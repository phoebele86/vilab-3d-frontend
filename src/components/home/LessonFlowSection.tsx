import { useTranslation } from 'react-i18next'

import { SectionHeading } from '@/components/home/SectionHeading'

export const LessonFlowSection = () => {
  const { t } = useTranslation()

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-4 py-20 lg:py-24">
      <SectionHeading id="how-it-works-title" title={t('lessonFlow.title')} />

      <ol className="mt-12 mb-0 grid gap-10 pl-0 md:grid-cols-3">
        {t('lessonFlow.steps', { returnObjects: true }).map(({ title, body }, index) => (
          <li key={title} className="max-w-sm list-none">
            <span aria-hidden="true" className="block font-chalk text-6xl leading-none text-purple-ink">
              {index + 1}.
            </span>
            <h3 className="mt-3 mb-0 text-xl font-bold text-ink">{title}</h3>
            <p className="mt-2 mb-0 leading-relaxed text-ink-soft">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
