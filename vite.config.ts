import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// Hii ndio config sahihi ya VIBRA kwa Vercel
// Tumeondoa vite-tsconfig-paths - ndio ilikuwa inaharibu build
export default defineConfig({
  plugins: [
    tanstackStart(),
    viteReact(),
  ],
})
