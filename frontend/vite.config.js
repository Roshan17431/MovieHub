import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://moviehub-1-qtjc.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
