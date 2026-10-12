import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Same-origin calls during development: no CORS needed on the API.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
