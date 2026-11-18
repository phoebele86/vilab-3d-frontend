import { Button, ConfigProvider, Grid, Segmented } from 'antd'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Trans, useTranslation } from 'react-i18next'

import { SceneNotice } from '@/components/common/SceneNotice'
import { AppHeader } from '@/components/layout/AppHeader'
import { SUBJECT_BY_KEY, SUBJECTS } from '@/data/subjects'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { boardTheme } from '@/theme/antdTheme'
import type { LabView } from '@/types/subject'

// Three.js is heavy, so the scene loads in its own chunk after the text
const LabScene = lazy(() =>
  import('@/components/lab/LabScene').then((module) => ({ default: module.LabScene })),
)

type HeroSectionProps = {
  activeView: LabView
  onSelect: (view: LabView) => void
}

const SubjectPreview = ({ activeView }: Pick<HeroSectionProps, 'activeView'>) => {
  const { t } = useTranslation()

  if (activeView === 'all') {
    const highlight = (key: keyof typeof SUBJECT_BY_KEY) => (
      <span className={`font-semibold ${SUBJECT_BY_KEY[key].textChalkClass}`} />
    )
    return (
      <div>
        <p className="m-0 text-lg leading-relaxed text-chalk-dim">
          <Trans
            i18nKey="hero.overview"
            components={{
              physics: highlight('physics'),
              chemistry: highlight('chemistry'),
              biology: highlight('biology'),
            }}
          />
        </p>
        <p className="mt-3 mb-0 font-chalk text-xl text-chalk chalk-glow">{t('hero.dragHint')}</p>
      </div>
    )
  }

  const { textChalkClass } = SUBJECT_BY_KEY[activeView]
  const simulations = t(`subjects.${activeView}.simulations`, { returnObjects: true })
  return (
    <div>
      <h2 className={`m-0 text-2xl font-bold ${textChalkClass}`}>{t(`subjects.${activeView}.name`)}</h2>
      <p className="mt-2 mb-0 text-lg leading-relaxed text-chalk-dim">{t(`subjects.${activeView}.tagline`)}</p>
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

export const HeroSection = ({ activeView, onSelect }: HeroSectionProps) => {
  const { t } = useTranslation()
  const reducedMotion = usePrefersReducedMotion()
  const screens = Grid.useBreakpoint()
  const viewOptions: { label: string; value: LabView }[] = [
    { label: t('hero.viewAll'), value: 'all' },
    ...SUBJECTS.map(({ key }) => ({ label: t(`subjects.${key}.name`), value: key })),
  ]

  return (
    <section id="lab" aria-labelledby="hero-title" className="bg-board relative overflow-hidden text-chalk">
      <ConfigProvider theme={boardTheme}>
        <AppHeader />

        {/* Mobile order is intro → scene → controls so the camera move stays in view */}
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] px-4 pt-8 pb-8 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_auto] lg:gap-x-4 lg:pt-6 lg:pb-12">
          <div className="relative z-10 max-w-xl lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="m-0 inline-block -rotate-2 font-chalk text-xl text-chemistry chalk-glow">{t('hero.status')}</p>
            <h1
              id="hero-title"
              className="mt-3 mb-0 text-[clamp(2.3rem,4.6vw,3.9rem)] leading-[1.06] font-extrabold tracking-[-0.025em] chalk-glow"
            >
              {t('hero.title')}
            </h1>
            <p className="mt-5 mb-0 max-w-[34rem] text-lg leading-relaxed text-chalk-dim">{t('hero.intro')}</p>
          </div>

          <div className="relative -mx-4 mt-2 h-[360px] sm:mx-0 sm:h-[480px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mr-8 lg:mt-0 lg:h-[640px] lg:self-center">
            <ErrorBoundary fallback={<SceneNotice text={t('common.webglUnavailable')} />}>
              <Suspense fallback={<SceneNotice text={t('hero.sceneLoading')} />}>
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
              options={viewOptions}
              aria-label={t('hero.chooseStation')}
            />

            <div className="mt-6 lg:min-h-[12.5rem]" aria-live="polite">
              <SubjectPreview activeView={activeView} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="primary" size="large" href="#roadmap">
                {t('hero.ctaRoadmap')}
              </Button>
              <Button ghost size="large" href="#subjects">
                {t('hero.ctaSubjects')}
              </Button>
            </div>
          </div>
        </div>

        <ChalkTray />
      </ConfigProvider>
    </section>
  )
}
