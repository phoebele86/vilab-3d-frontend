import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

import { SectionHeading } from '@/components/home/SectionHeading'
import { GRADES, SUBJECTS } from '@/data/subjects'

type Grade = (typeof GRADES)[number]

const GradeTopics = ({ grade }: { grade: Grade }) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-8 pt-4 md:grid-cols-3 md:gap-10">
      {SUBJECTS.map(({ key, textInkClass, borderInkClass }) => (
        <div key={key} className={`border-t-4 pt-4 ${borderInkClass}`}>
          <h3 className={`m-0 text-xl font-bold ${textInkClass}`}>{t(`subjects.${key}.name`)}</h3>
          <ul className="mt-4 mb-0 space-y-2.5 pl-0">
            {t(`roadmap.topics.grade${grade}.${key}`, { returnObjects: true }).map((topic) => (
              <li key={topic} className="leading-snug text-ink">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export const RoadmapSection = () => {
  const { t } = useTranslation()

  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="scroll-mt-4 py-20 lg:py-24">
      <SectionHeading id="roadmap-title" title={t('roadmap.title')}>
        {t('roadmap.intro')}
      </SectionHeading>

      <Tabs
        className="mt-10"
        size="large"
        items={GRADES.map((grade) => ({
          key: String(grade),
          label: t('roadmap.grade', { grade }),
          children: <GradeTopics grade={grade} />,
        }))}
      />
    </section>
  )
}
