import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Polku, jonka alla sivu julkaistaan. Oma domain: '/' (oletus).
  // GitHub Pages -testi: osoite on pennasenkake.github.io/glosstahko-web/, joten
  // buildissa asetetaan VITE_BASE=/glosstahko-web/ (ks. .github/workflows/pages.yml).
  base: process.env.VITE_BASE ?? '/',
})
