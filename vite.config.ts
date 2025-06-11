import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages serves from a subdirectory, so we need to set the base path
  base: process.env.NODE_ENV === 'production' ? '/flyrancher-pro-frontend/' : '/',
  
  // Path resolution for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    // Optimize for production
    minify: 'terser',
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wharfkit: [
            '@wharfkit/session', 
            '@wharfkit/wallet-plugin-anchor', 
            '@wharfkit/web-renderer',
            '@wharfkit/antelope'
          ]
        }
      }
    },
    
    // Increase chunk size warning limit for blockchain libraries
    chunkSizeWarningLimit: 1000
  },
  
  // Development server configuration
  server: {
    host: true,
    port: 3000,
    open: true,
    
    // Proxy API requests to the subscription service in development
    proxy: {
      '/api/subscription': {
        target: 'https://flyrancher-sub.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/subscription/, '/subscription'),
        secure: true
      }
    }
  },
  
  // Preview server configuration
  preview: {
    host: true,
    port: 4173
  },
  
  // Ensure assets are loaded correctly
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimization for blockchain libraries
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@wharfkit/session',
      '@wharfkit/wallet-plugin-anchor',
      '@wharfkit/web-renderer'
    ],
    exclude: ['@wharfkit/antelope']
  },
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true
  }
})
