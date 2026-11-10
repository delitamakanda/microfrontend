import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { resolveRemoteUrl } from './src/helpers/remote.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  return {
    plugins: [
      react(),
      federation({
        name: 'admin_app',
        shared: ['react', 'react-dom'],
        remotes: {
          storefrontApp: resolveRemoteUrl(mode, env.VITE_STOREFRONT_REMOTE_URL)
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
    }
  }
})
