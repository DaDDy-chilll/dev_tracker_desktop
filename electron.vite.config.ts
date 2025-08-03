import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [react(), tailwindcss()],
      define: {
        // Expose .env variables to renderer process
        'import.meta.env.DEV_URL': JSON.stringify(env.DEV_URL || 'http://localhost:5001/'),
        'import.meta.env.PROD_URL': JSON.stringify(env.PROD_URL || 'http://dev-track-api.myancare/')
      },
      // Add proper asset handling for fonts
      assetsInclude: ['**/*.otf', '**/*.ttf', '**/*.woff', '**/*.woff2'],
      build: {
        assetsInlineLimit: 0, // Don't inline any assets (keep as separate files)
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name]-[hash][extname]'
          }
        }
      }
    }
  }
})
