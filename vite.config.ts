import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from a subdirectory, so we need to set the base path
  base: process.env.NODE_ENV === 'production' ? '/flyrancher-pro-frontend/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimize for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wharfkit: ['@wharfkit/session', '@wharfkit/wallet-plugin-anchor', '@wharfkit/web-renderer']
        }
      }
    }
  },
  // Fix for GitHub Pages routing
  server: {
    host: true,
    port: 3000
  },
  // Ensure assets are loaded correctly
  assetsInclude: ['**/*.svg']
})
