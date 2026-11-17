import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HomePage } from '@/pages/HomePage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/models/*',
    // Load Three.js only when a model page is opened
    lazy: async () => ({ Component: (await import('@/pages/ModelPage')).ModelPage }),
    hydrateFallbackElement: <div className="bg-board h-dvh" />,
  },
])

export const App = () => <RouterProvider router={router} />
