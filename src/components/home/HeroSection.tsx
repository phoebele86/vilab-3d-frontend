import { Button, ConfigProvider, Grid, Segmented } from 'antd'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { SUBJECT_BY_KEY, SUBJECTS } from '@/data/subjects'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { boardTheme } from '@/theme/antdTheme'
import type { LabView } from '@/types/subject'
import { AppHeader } from '@/components/layout/AppHeader'

// Three.js is heavy, so the scene loads in its own chunk after the text
const LabScene = lazy(() =>
  import('@/components/lab/LabScene').then((module) => ({ default: module.LabScene })),
)

const VIEW_OPTIONS: { label: string; value: LabView }[] = [
  { label: 'Tất cả', value: 'all' },
  ...SUBJECTS.map(({ name, key }) => ({ label: name, value: key })),
]

type HeroSectionProps = {
  activeView: LabView
  onSelect: (view: LabView) => void
}

const SubjectPreview = ({ activeView }: Pick<HeroSectionProps, 'activeView'>) => {
  if (activeView === 'all') {
    const { ly, hoa, sinh } = SUBJECT_BY_KEY
    return (
      <div>
        <p className="m-0 text-lg leading-relaxed text-chalk-dim">
          Bàn bên trái là <span className={`font-semibold ${ly.textChalkClass}`}>con lắc đơn</span> của Vật lý,
          bàn giữa là <span className={`font-semibold ${hoa.textChalkClass}`}>bình tam giác</span> của Hóa học,
          bàn bên phải là <span className={`font-semibold ${sinh.textChalkClass}`}>chuỗi DNA</span> của Sinh học.
        </p>
        <p className="mt-3 mb-0 font-chalk text-xl text-chalk chalk-glow">
          Kéo để xoay phòng thí nghiệm, bấm vào tên một bàn để đến gần.
        </p>
      </div>
    )
  }

  const { name, tagline, simulations, textChalkClass } = SUBJECT_BY_KEY[activeView]
  return (
    <div>
      <h2 className={`m-0 text-2xl font-bold ${textChalkClass}`}>{name}</h2>
      <p className="mt-2 mb-0 text-lg leading-relaxed text-chalk-dim">{tagline}</p>
      <ul className="mt-3 mb-0 space-y-1 pl-0 font-chalk text-xl text-chalk chalk-glow">
        {simulations.slice(0, 3).map((simulation) => (
          <li key={simulation} className="flex gap-2">
            <span aria-hidden="true" className={textChalkClass}>
              ~
            </span>
            {simulation}
          </li>
        ))}
      </ul>
    </div>
  )
}

const ChalkTray = () => (
  <div aria-hidden="true" className="relative h-4 bg-wood shadow-[inset_0_3px_0_rgb(0_0_0/0.25)]">
    <span className="absolute -top-2 left-[14%] h-2 w-12 -rotate-3 rounded-sm bg-chalk" />
    <span className="absolute -top-2 left-[21%] h-2 w-7 rotate-2 rounded-sm bg-chemistry" />
    <span className="absolute -top-2 left-[57%] h-2 w-9 rounded-sm bg-biology" />
    <span className="absolute -top-2 left-[62%] h-2 w-6 -rotate-6 rounded-sm bg-physics" />
    <span className="absolute -top-4 right-[12%] h-4 w-20 rounded-sm bg-[#3a3f4a] shadow-[inset_0_-5px_0_#c9c2b0]" />
  </div>
)

const SceneMessage = ({ text }: { text: string }) => (
  <div className="flex h-full items-center justify-center p-6">
    <p className="max-w-sm text-center font-chalk text-xl leading-snug text-chalk-dim chalk-glow">{text}</p>
  </div>
)

export const HeroSection = ({ activeView, onSelect }: HeroSectionProps) => {
  const reducedMotion = usePrefersReducedMotion()
  const screens = Grid.useBreakpoint()

  return (
    <section id="lab" aria-labelledby="hero-title" className="bg-board relative overflow-hidden text-chalk">
      <ConfigProvider theme={boardTheme}>
        <AppHeader />

        {/* Mobile order is intro → scene → controls so the camera move stays in view */}
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] px-4 pt-8 pb-8 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_auto] lg:gap-x-4 lg:pt-6 lg:pb-12">
          <div className="relative z-10 max-w-xl lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="m-0 inline-block -rotate-2 font-chalk text-xl text-chemistry chalk-glow">
              Bản xem trước, dự án đang phát triển
            </p>
            <h1
              id="hero-title"
              className="mt-3 mb-0 text-[clamp(2.3rem,4.6vw,3.9rem)] leading-[1.06] font-extrabold tracking-[-0.025em] chalk-glow"
            >
              Phòng thí nghiệm 3D cho môn Khoa học tự nhiên
            </h1>
            <p className="mt-5 mb-0 max-w-[34rem] text-lg leading-relaxed text-chalk-dim">
              ViLab 3D đang xây dựng các bài mô phỏng Vật lý, Hóa học và Sinh học theo chương trình KHTN lớp 6
              đến lớp 9, bắt đầu từ ba mô hình trên bàn thí nghiệm này.
            </p>
          </div>

          <div className="relative -mx-4 mt-2 h-[360px] sm:mx-0 sm:h-[480px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mr-8 lg:mt-0 lg:h-[640px] lg:self-center">
            <ErrorBoundary
              fallback={
                <SceneMessage text="Không hiển thị được mô hình 3D vì trình duyệt chưa bật WebGL. Hãy bật tăng tốc phần cứng trong cài đặt trình duyệt rồi tải lại trang." />
              }
            >
              <Suspense fallback={<SceneMessage text="Đang dựng phòng thí nghiệm…" />}>
                <LabScene activeView={activeView} onSelect={onSelect} reducedMotion={reducedMotion} />
              </Suspense>
            </ErrorBoundary>
          </div>

          <div className="relative z-10 max-w-xl lg:col-start-1 lg:row-start-2 lg:self-start">
            <Segmented<LabView>
              className="mt-2 lg:mt-7"
              block
              size={screens.sm ? 'large' : 'middle'}
              value={activeView}
              onChange={onSelect}
              options={VIEW_OPTIONS}
              aria-label="Chọn bàn thí nghiệm để xem"
            />

            <div className="mt-6 lg:min-h-[12.5rem]" aria-live="polite">
              <SubjectPreview activeView={activeView} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="primary" size="large" href="#lo-trinh">
                Xem lộ trình theo lớp
              </Button>
              <Button ghost size="large" href="#mon-hoc">
                Đọc về từng môn
              </Button>
            </div>
          </div>
        </div>

        <ChalkTray />
      </ConfigProvider>
    </section>
  )
}
