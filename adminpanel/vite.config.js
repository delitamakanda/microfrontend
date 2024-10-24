import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      federation({
        name: 'admin_app',
        shared: ['react', 'react-dom'],
        remotes: {
          storefrontApp: mode === 'production' ? 'https://resplendent-strudel-83725d.netlify.app/assets/storefrontEntry.js' : 'http://localhost:3000/assets/storefrontEntry.js'
        }
      })
    ],
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      modulePreload: false,

    },
    optimizeDeps: {
      exclude: ['/node_modules/'],
    },
  }
})
