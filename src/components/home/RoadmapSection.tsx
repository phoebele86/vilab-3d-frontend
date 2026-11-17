import { Tabs } from 'antd'

import { ROADMAP, SUBJECTS } from '@/data/subjects'
import type { GradePlan } from '@/types/subject'
import { SectionHeading } from '@/components/home/SectionHeading'

const GradeTopics = ({ topics }: Pick<GradePlan, 'topics'>) => (
  <div className="grid gap-8 pt-4 md:grid-cols-3 md:gap-10">
    {SUBJECTS.map((subject) => (
      <div key={subject.key} className={`border-t-4 pt-4 ${subject.borderInkClass}`}>
        <h3 className={`m-0 text-xl font-bold ${subject.textInkClass}`}>{subject.name}</h3>
        <ul className="mt-4 mb-0 space-y-2.5 pl-0">
          {topics[subject.key].map((topic) => (
            <li key={topic} className="leading-snug text-ink">
              {topic}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)

export const RoadmapSection = () => (
  <section id="lo-trinh" aria-labelledby="lo-trinh-title" className="scroll-mt-4 py-20 lg:py-24">
    <SectionHeading id="lo-trinh-title" title="Lộ trình theo khối lớp">
      Các chủ đề dự kiến làm mô phỏng, bám theo Chương trình GDPT 2018 môn Khoa học tự nhiên. Thứ tự có thể
      thay đổi trong quá trình phát triển.
    </SectionHeading>

    <Tabs
      className="mt-10"
      size="large"
      items={ROADMAP.map(({ grade, topics }) => ({
        key: String(grade),
        label: `Lớp ${grade}`,
        children: <GradeTopics topics={topics} />,
      }))}
    />
  </section>
)
