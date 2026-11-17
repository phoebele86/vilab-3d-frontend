import { Button } from 'antd'

import { SUBJECTS } from '@/data/subjects'
import type { SubjectKey } from '@/types/subject'
import { SectionHeading } from '@/components/home/SectionHeading'

type SubjectsSectionProps = {
  onPreview: (key: SubjectKey) => void
}

export const SubjectsSection = ({ onPreview }: SubjectsSectionProps) => (
  <section id="mon-hoc" aria-labelledby="mon-hoc-title" className="scroll-mt-4 py-20 lg:py-24">
    <SectionHeading id="mon-hoc-title" title="Ba phân môn, chung một phòng thí nghiệm">
      Theo Chương trình GDPT 2018, Vật lý, Hóa học và Sinh học ở cấp THCS được dạy chung trong môn Khoa học
      tự nhiên. ViLab 3D giữ đúng cách chia đó: mỗi phân môn một bàn thí nghiệm, cùng một cách thao tác.
    </SectionHeading>

    <div className="mt-12 border-y-2 border-grid-strong">
      {SUBJECTS.map((subject) => (
        <article
          key={subject.key}
          aria-labelledby={`subject-${subject.key}`}
          className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-grid-strong py-10 last:border-b-0 md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
        >
          <div>
            <h3 id={`subject-${subject.key}`} className={`m-0 text-3xl font-extrabold ${subject.textInkClass}`}>
              {subject.name}
            </h3>
            <p className="mt-1 mb-0 font-chalk text-xl text-ink-soft">Lớp 6 đến lớp 9</p>
          </div>

          <div className="max-w-prose">
            <p className="m-0 text-lg leading-snug font-semibold text-ink">{subject.tagline}</p>
            <p className="mt-3 mb-0 leading-relaxed text-ink-soft">{subject.description}</p>
            <Button
              type="link"
              className="mt-3 h-auto px-0 py-1 text-left font-semibold whitespace-normal"
              onClick={() => onPreview(subject.key)}
            >
              Xem {subject.modelName} trong mô hình 3D
            </Button>
          </div>

          <div className="md:col-start-2 lg:col-start-auto">
            <h4 className="m-0 text-sm font-semibold text-ink-soft">Bài mô phỏng đang làm</h4>
            <ul className="mt-3 mb-0 space-y-2.5 pl-0">
              {subject.simulations.map((simulation) => (
                <li key={simulation} className="flex items-start gap-3 leading-snug text-ink">
                  <span
                    aria-hidden="true"
                    className={`mt-1 size-3.5 shrink-0 rounded-[3px] border-2 ${subject.borderInkClass}`}
                  />
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
