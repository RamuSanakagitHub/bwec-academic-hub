import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isMobile = mode === 'mobile'
  return {
    plugins: [react()],
    // Mobile build: API_BASE is set via env, no proxy needed
    // Web dev build: empty API_BASE, Vite proxy handles /api
    server: {
      proxy: isMobile ? {} : {
        '/api': { target: 'http://localhost:5000', changeOrigin: true }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: { manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom', 'axios'] } }
      }
    }
  }
})
