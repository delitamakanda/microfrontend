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
    },
    shared: ['react','react-dom'],
  })],
})
