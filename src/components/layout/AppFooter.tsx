import { useTranslation } from 'react-i18next'

import { Logo } from '@/components/layout/Logo'

const CURRENT_YEAR = new Date().getFullYear()

export const AppFooter = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-board text-chalk-dim">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo className="text-chalk" />
        <p className="m-0">{t('footer.madeBy')}</p>
        <p className="m-0">© {CURRENT_YEAR} ViLab 3D</p>
      </div>
    </footer>
  )
}
