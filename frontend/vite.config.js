import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Use '/' for Vercel, and '/ordermade/' for GitHub Pages
  base: process.env.VERCEL ? '/' : '/ordermade/', 
  plugins: [react(), tailwindcss()],
})
