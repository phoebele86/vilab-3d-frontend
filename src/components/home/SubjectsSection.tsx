import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { SectionHeading } from '@/components/home/SectionHeading'
import { SUBJECTS } from '@/data/subjects'
import type { SubjectKey } from '@/types/subject'

type SubjectsSectionProps = {
  onPreview: (key: SubjectKey) => void
}

export const SubjectsSection = ({ onPreview }: SubjectsSectionProps) => {
  const { t } = useTranslation()

  return (
    <section id="subjects" aria-labelledby="subjects-title" className="scroll-mt-4 py-20 lg:py-24">
      <SectionHeading id="subjects-title" title={t('subjectsSection.title')}>
        {t('subjectsSection.intro')}
      </SectionHeading>

      <div className="mt-12 border-y-2 border-grid-strong">
        {SUBJECTS.map(({ key, textInkClass, borderInkClass }) => (
          <article
            key={key}
            aria-labelledby={`subject-${key}`}
            className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-grid-strong py-10 last:border-b-0 md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
          >
            <div>
              <h3 id={`subject-${key}`} className={`m-0 text-3xl font-extrabold ${textInkClass}`}>
                {t(`subjects.${key}.name`)}
              </h3>
              <p className="mt-1 mb-0 font-chalk text-xl text-ink-soft">{t('subjectsSection.grades')}</p>
            </div>

            <div className="max-w-prose">
              <p className="m-0 text-lg leading-snug font-semibold text-ink">{t(`subjects.${key}.tagline`)}</p>
              <p className="mt-3 mb-0 leading-relaxed text-ink-soft">{t(`subjects.${key}.description`)}</p>
              <Button
                type="link"
                className="mt-3 h-auto px-0 py-1 text-left font-semibold whitespace-normal"
                onClick={() => onPreview(key)}
              >
                {t('subjectsSection.viewModel', { model: t(`subjects.${key}.modelName`) })}
              </Button>
            </div>

            <div className="md:col-start-2 lg:col-start-auto">
              <h4 className="m-0 text-sm font-semibold text-ink-soft">{t('subjectsSection.inProgress')}</h4>
              <ul className="mt-3 mb-0 space-y-2.5 pl-0">
                {t(`subjects.${key}.simulations`, { returnObjects: true }).map((simulation) => (
                  <li key={simulation} className="flex items-start gap-3 leading-snug text-ink">
                    <span aria-hidden="true" className={`mt-1 size-3.5 shrink-0 rounded-[3px] border-2 ${borderInkClass}`} />
                    {simulation}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
