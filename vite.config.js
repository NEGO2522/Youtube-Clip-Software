import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // /api/ai  →  https://api.openai.com/v1/chat/completions
        '/api/ai': {
          target: 'https://api.openai.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, '/v1/chat/completions'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_OPENAI_API_KEY || ''}`)
              proxyReq.setHeader('Content-Type', 'application/json')
            })
          },
        },
      },
    },
  }
})
