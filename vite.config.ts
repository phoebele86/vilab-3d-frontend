import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Resolve the @/* alias from tsconfig.json so it is declared in one place
  resolve: { tsconfigPaths: true },
  server: {
    // Forward API and asset requests to the FastAPI backend
    proxy: {
      '/api': 'http://localhost:8000',
    },
    // Allow access through temporary Cloudflare quick tunnels
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    // Three.js lives in a lazily loaded chunk, so a larger chunk is expected
    chunkSizeWarningLimit: 1200,
  },
})
