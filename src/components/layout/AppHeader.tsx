import { MenuOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Logo } from '@/components/layout/Logo'

const NAV_LINKS = [
  { href: '#subjects', labelKey: 'nav.subjects' },
  { href: '#roadmap', labelKey: 'nav.roadmap' },
  { href: '#how-it-works', labelKey: 'nav.howItWorks' },
] as const

// Rendered on the chalkboard, so it expects to be wrapped in boardTheme
export const AppHeader = () => {
  const { t } = useTranslation()

  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pt-5 sm:px-8">
      <a href="#lab" className="rounded-md text-chalk hover:text-white" aria-label={t('nav.home')}>
        <Logo />
      </a>

      <nav aria-label={t('nav.main')} className="ml-auto hidden sm:block">
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, labelKey }) => (
            <li key={href}>
              <a
                href={href}
                className="rounded-md px-3 py-2 font-medium text-chalk-dim transition-colors hover:bg-chalk/10 hover:text-chalk"
              >
                {t(labelKey)}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/lab"
              className="ml-2 rounded-md border border-chalk/40 px-3 py-2 font-semibold text-chalk transition-colors hover:bg-chalk/10"
            >
              {t('common.lab')}
            </Link>
          </li>
        </ul>
      </nav>

      <LanguageSwitcher />

      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: [
            ...NAV_LINKS.map(({ href, labelKey }) => ({ key: href, label: <a href={href}>{t(labelKey)}</a> })),
            { key: '/lab', label: <Link to="/lab">{t('common.lab')}</Link> },
          ],
        }}
      >
        <Button ghost className="sm:hidden" icon={<MenuOutlined />} aria-label={t('nav.openMenu')} />
      </Dropdown>
    </header>
  )
}
