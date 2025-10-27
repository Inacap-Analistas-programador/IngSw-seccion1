import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
// Desactivar DevTools en entorno de pruebas para evitar errores de arranque de Vitest
const isTest = !!process.env.VITEST

export default defineConfig(({ command, mode }) => ({
    plugins: [
        vue(),
        // Solo habilitar DevTools en desarrollo/serve, no en test
        (!isTest && command === 'serve') && vueDevTools(),
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    // Configuración de pruebas (Vitest)
    test: {
        environment: 'jsdom',
        include: [
            'src/**/*.{test,spec}.{js,ts,jsx,tsx}'
        ],
        coverage: {
            reporter: ['text', 'lcov'],
            reportsDirectory: 'coverage'
        }
    }
}))
