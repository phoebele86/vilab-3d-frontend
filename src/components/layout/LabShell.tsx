import { ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { boardTheme } from '@/theme/antdTheme'

type LabShellProps = {
  title: string
  lessonLabel?: string
  toolbar?: ReactNode
  scene: ReactNode
  panel: ReactNode
}

// Full-height lab layout: 3D scene on the chalkboard, controls on notebook paper.
export const LabShell = ({ title, lessonLabel, toolbar, scene, panel }: LabShellProps) => {
  const { t } = useTranslation()

  return (
    <div className="bg-board flex min-h-dvh flex-col text-chalk lg:h-dvh">
      <ConfigProvider theme={boardTheme}>
        <header className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link to="/lab" className="rounded-md font-semibold text-chalk-dim hover:text-chalk">
            {t('common.lab')}
          </Link>
          <div className="min-w-0 flex-1">
            {lessonLabel && <p className="m-0 truncate font-chalk text-lg text-chalk-dim">{lessonLabel}</p>}
            <h1 className="m-0 truncate text-xl font-bold chalk-glow">{title}</h1>
          </div>
          {toolbar}
          <LanguageSwitcher />
        </header>
      </ConfigProvider>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="relative h-[58vh] min-h-[320px] lg:h-auto">{scene}</div>
        <aside className="bg-notebook overflow-y-auto px-5 py-6 text-ink lg:px-6">{panel}</aside>
      </div>
    </div>
  )
}
