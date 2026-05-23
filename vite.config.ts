import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // Explicit base so all asset URLs are root-relative on Vercel
  base: '/',

  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // No source maps in production — keeps bundle size small and avoids leaking source
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — changes rarely, benefits most from long-term cache
          vendor: ['react', 'react-dom'],
          // i18n logic and locale data — separated so thinker data updates
          // don't bust the translation cache
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
