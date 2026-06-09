import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // Relative base only for the production build, so it works when served from
  // any subdirectory (e.g. GitHub Pages at /slides/visualize-model-pricing/).
  // Dev server stays at '/' so HMR and root serving work normally.
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  build: {
    // Emit the built site into the served parent folder (the GitHub Pages root
    // for this app). The source lives here in app/; the build writes ../.
    outDir: '..',
    emptyOutDir: false, // never wipe the parent (it contains app/ itself)
    rollupOptions: {
      output: {
        // Stable asset dir so stale hashed files can be cleared before each build.
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
  },
}))
