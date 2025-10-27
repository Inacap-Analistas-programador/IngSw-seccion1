/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path' // No usar en ESM

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    // Mockear archivos CSS usando styleMock.js
    moduleNameMapper: {
      '\\.css$': './src/__mocks__/styleMock.js',
    },
    mock: {
      // Ignorar todos los imports de CSS
      '\\.css$': {}
    },
    // ...sin viteConfig, Vitest toma plugins de la raíz
    // Configuración de Vitest para testing del frontend
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    
    // Ignorar archivos CSS en los tests
    testTransformMode: {
      web: ['.vue'],
      ssr: ['.ts']
    },
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        'src/**/*.d.ts',
        '**/*.config.*',
        'dist/',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    
    // Mock configuration
    deps: {
      inline: ['@vue', '@vueuse'],
    },
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter configuration (keep simple to avoid extra deps)
    reporters: ['verbose'],
  },
})