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
import { resolve } from 'path'
// Configuración principal de Vite
// Documentación: https://vitejs.dev/config/
export default defineConfig({
  // Plugins de Vite - Vue.js plugin para soporte de SFC (Single File Components)
  plugins: [
    vue(),
  ],
  
  // Resolución de módulos
  resolve: {
    alias: {
      // Alias '@' apunta a la carpeta src/ para imports más limpios
      // Uso: import Component from '@/components/Component.vue'
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,  // Puerto del frontend (debe coincidir con Docker Compose)
    
    // Proxy para redirigir llamadas API al backend Django
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Backend Django
        changeOrigin: true,               // Cambiar el header Origin
        // Ejemplo: http://localhost:3000/api/auth -> http://localhost:8000/api/auth
      },
    },
  },
  
  // Configuración de build para producción
  build: {
    outDir: 'dist',      // Directorio de salida para archivos compilados
    sourcemap: true,     // Generar sourcemaps para debugging en producción
  },
  
  // Configuración para testing con Vitest
  test: {
    globals: true,           // Variables globales de testing (describe, it, expect)
    environment: 'jsdom',    // Simular DOM del navegador para tests
  },
})
