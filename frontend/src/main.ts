/**
 * SGICS - Sistema de Gestión Integral de Cursos Scout
 * Punto de entrada principal del frontend Vue.js
 * 
 * Este archivo inicializa la aplicación Vue con:
 * - Pinia para gestión de estado global
 * - Vue Router para navegación entre páginas
 * - Estilos CSS globales con Tailwind
 * 
 * La aplicación se monta en el elemento #app del index.html
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Crear instancia principal de la aplicación Vue
const app = createApp(App)

// Configurar gestión de estado con Pinia
// Pinia maneja el estado global de la aplicación (usuario, datos compartidos)
app.use(createPinia())

// Configurar enrutamiento con Vue Router
// El router maneja la navegación entre diferentes páginas/vistas
app.use(router)

// Montar la aplicación en el DOM
// Se conecta al elemento <div id="app"> en index.html
app.mount('#app')