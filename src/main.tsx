import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource/be-vietnam-pro/800.css'
import '@fontsource/patrick-hand/400.css'
import '@/index.css'
import '@/i18n'

import { StyleProvider } from '@ant-design/cssinjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import { queryClient } from '@/lib/queryClient'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    {/* Put antd styles in @layer antd so Tailwind utilities can override them */}
    <StyleProvider layer>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StyleProvider>
  </StrictMode>,
)
