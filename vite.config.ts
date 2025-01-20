import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'popup.html',
        contentScript:'./src/content/content.ts'
      },
      output: {
        entryFileNames: 'assets/[name].js', // Output files named after entry points
        assetFileNames: 'assets/[name].[ext]',
      },
    }
  }
})
