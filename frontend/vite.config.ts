/**
 * Configuración de Vite para SGICS Frontend
 * 
 * Vite es el bundler y servidor de desarrollo que:
 * - Compila el código Vue.js + TypeScript
 * - Proporciona hot reload en desarrollo
 * - Optimiza el build para producción
 * - Maneja el proxy hacia el backend Django
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path' // No usar en ESM
import tailwindcss from '@tailwindcss/vite'
// Configuración principal de Vite
// Documentación: https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}))
