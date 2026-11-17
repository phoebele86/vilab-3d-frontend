import { MenuOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

import { Logo } from '@/components/layout/Logo'

const NAV_LINKS = [
  { href: '#mon-hoc', label: 'Môn học' },
  { href: '#lo-trinh', label: 'Lộ trình' },
  { href: '#cach-hoc', label: 'Cách học' },
]

// Rendered on the chalkboard, so it expects to be wrapped in boardTheme
export const AppHeader = () => (
  <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 pt-5 sm:px-8">
    <a href="#lab" className="rounded-md text-chalk hover:text-white" aria-label="ViLab 3D, về đầu trang">
      <Logo />
    </a>

    <nav aria-label="Điều hướng chính" className="hidden sm:block">
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="rounded-md px-3 py-2 font-medium text-chalk-dim transition-colors hover:bg-chalk/10 hover:text-chalk"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{ items: NAV_LINKS.map(({ href, label }) => ({ key: href, label: <a href={href}>{label}</a> })) }}
    >
      <Button ghost className="sm:hidden" icon={<MenuOutlined />} aria-label="Mở menu điều hướng" />
    </Dropdown>
  </header>
)
