import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // ensures relative paths for portable deployment (e.g. GitHub Pages)
  plugins: [
    tailwindcss(),
    react()
  ],
})
