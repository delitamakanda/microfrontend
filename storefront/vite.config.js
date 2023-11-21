import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
    name: 'storefront_app',
    filename:'storefrontEntry.js',
    exposes: {
      './Button': './src/Button',
      './useLocalStorage': './src/hooks/useLocalStorage',
      './localstore': './src/hooks/localstore',
      './store': './src/store',
      './constants': './src/constants',
      './api': './src/lib/api'
    },
    shared: ['react','react-dom', 'jotai'],
  })],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  optimizeDeps: {
    exclude: ['/node_modules/'],
  }
})
