import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/resume/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'syntax-highlighter': ['react-syntax-highlighter'],
          'code-data': [
            './src/data/code/list-program.js',
            './src/data/code/canvas-api.js',
            './src/data/code/python-projects.js',
          ],
        },
      },
    },
  },
})
