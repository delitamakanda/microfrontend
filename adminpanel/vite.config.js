import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const isProduction = env.VITE_USER_NODE_ENV === 'development' ? 'development' : 'production';
  return {
    resolve: {
      alias: {
        '@': './src',
        '~': './src/components',
        '@assets': './src/assets',
        '@constants': './src/constants',
        '@hooks': './src/hooks',
        '@pages': './src/pages',
      },
    },
    plugins: [
      react(),
      federation({
        name: 'app',
        remotes: {
          storefrontApp: isProduction === 'production' ? 'https://resplendent-strudel-83725d.netlify.app/assets/storefrontEntry.js' : 'http://localhost:3000/assets/storefrontEntry.js'
        },
        shared: ['react', 'react-dom']
      })
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
    optimizeDeps: {
      exclude: ['/node_modules/'],
    }
  }
})
