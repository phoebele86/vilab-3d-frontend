import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import viVN from 'antd/locale/vi_VN'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HomePage } from '@/pages/HomePage'
import { LabIndexPage } from '@/pages/LabIndexPage'
import { paperTheme } from '@/theme/antdTheme'

const BOARD_FALLBACK = <div className="bg-board h-dvh" />

// Pages with a 3D scene load lazily so Three.js stays out of the home page bundle.
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/lab', element: <LabIndexPage /> },
  {
    path: '/lessons/:slug',
    lazy: async () => ({ Component: (await import('@/pages/LessonPage')).LessonPage }),
    hydrateFallbackElement: BOARD_FALLBACK,
  },
  {
    path: '/models/*',
    lazy: async () => ({ Component: (await import('@/pages/ModelPage')).ModelPage }),
    hydrateFallbackElement: BOARD_FALLBACK,
  },
])

export const App = () => {
  const { i18n } = useTranslation()

  return (
    <ConfigProvider locale={i18n.language === 'en' ? enUS : viVN} theme={paperTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}
