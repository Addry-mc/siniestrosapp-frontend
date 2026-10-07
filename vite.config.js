import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/siniestrosapp-frontend/',
  server: {
    proxy: {
      '/siniestros': 'http://localhost:8000',
      '/archivos': 'http://localhost:8000',
      '/facturas': 'http://localhost:8000',
      '/requerimientos': 'http://localhost:8000',
      '/auth': 'http://localhost:8000',
      '/admin': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})